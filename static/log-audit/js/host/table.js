layui.use(['form', 'table', 'upload', 'isLogin'], function() {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        upload = layui.upload;

    table.set({
        headers: {
            "Authorization": localStorage.access_token
        }
    });

    table.render({
        elem: '#currentTableId',
        url: '/host/hosts',
        title: '主机列表',
        toolbar: '#toolbarDemo',
        defaultToolbar: []
            // ['filter', 'exports', 'print',
            // {
            //     title: '提示',
            //     layEvent: 'LAYTABLE_TIPS',
            //     icon: 'layui-icon-tips'
            // }
            // ]
            ,

        cols: [
            [{
                type: "checkbox",
                width: 50
            }, {
                field: 'id',
                width: 100,
                title: 'ID',
                sort: true
            }, {
                field: 'host',
                width: 140,
                title: '主机IP'
            }, {
                field: 'port',
                width: 80,
                title: '端口',
                sort: true
            }, {
                field: 'username',
                width: 80,
                title: '用户名'
            }, {
                field: 'password',
                width: 100,
                title: '登录密码'
            }, {
                field: 'rsaKeyPath',
                title: '公钥路径',
                minWidth: 100
            }, {
                field: 'rsaPassword',
                width: 110,
                title: '公钥密码',
                sort: true
            }, {
                title: '操作',
                minWidth: 50,
                toolbar: '#currentTableBar',
                align: "center"
            }]
        ],
        limits: [10, 15, 20, 25, 50, 100],
        limit: 10,
        page: true,
        skin: 'line'
    });

    // 监听搜索操作
    form.on('submit(data-search-btn)', function(data) {

        // layer.alert(result, {
        //     title: '最终的搜索信息'
        // });

        //执行搜索重载
        table.reload('currentTableId', {
            page: {
                curr: 1,
                limit: 10,
            },
            where: data.field,

        }, 'data');

        return false;
    });


    upload.uploadInst = upload.render({
        elem: '#btnUpload',
        url: '/host/import',
        headers: {
            "Authorization": localStorage.access_token
        },
        bindAction: '#uploadBtn', // 指向一个按钮触发上传
        multiple: true,
        auto: false, // 选择文件后，不自动上传
        size: '4096', //4m
        exts: 'xls|xlsx|csv',
        before: obj => {
            layer.load()
        },
        done: res => {
            // var index = parent.layer.getFrameIndex(window.name); //获取窗口索引

            layer.closeAll('loading')
            layer.closeAll();
            if (res.code === 200) {
                layer.msg(res.msg, {
                    icon: 1,
                    time: 1000
                }, () => {
                    table.reload('currentTableId', {
                        page: {
                            curr: 1,
                            limit: 10,
                        },
                    });
                });
            } else {
                layer.msg('导入失败', {
                    icon: 2
                })
            }

        },
        error: () => {
            layer.closeAll('loading')

        }
    })

    var deleteHost = function(ids) {
        $.ajax({
            url: '/host/delete',
            method: 'POST',
            headers: {
                "Authorization": localStorage.access_token

            },
            data: JSON.stringify(ids),
            dataType: 'json',
            contentType: 'application/json',
            success: res => {
                if (res.code == 200) {
                    layer.msg('删除成功', {
                        icon: 1,
                        time: 1000
                    }, () => {
                        table.reload('currentTableId', {
                            page: {
                                curr: 1,
                                limit: 10,
                            },
                        });
                    });
                } else {
                    layer.msg(res.msg, {
                        icon: 2
                    })
                }
            }
        })
    }

    /**
     * toolbar监听事件
     */
    table.on('toolbar(currentTableFilter)', function(obj) {
        if (obj.event === 'add') { // 监听添加操作
            var index = layer.open({
                title: '添加用户',
                type: 2,
                shade: 0.2,
                maxmin: true,
                shadeClose: true,
                area: ['100%', '100%'],
                content: '../../page/host/add.html',
            });
            $(window).on("resize", function() {
                layer.full(index);
            });
        } else if (obj.event === 'delete') { // 监听删除操作
            var checkStatus = table.checkStatus('currentTableId'),
                data = checkStatus.data;

            if (data.length == 0) {
                layer.msg('未选中数据', {
                    icon: 2
                });
            } else {
                var ids = [];
                ids = data.map(node => node.id);
                deleteHost(ids);
            }
        } else if (obj.event === 'refresh') {
            // 刷新表格
            table.reload('currentTableId', {
                page: {
                    curr: 1,
                    limit: 10,
                },
            });
        } else if (obj.event === 'export') {
            // 自定义导出数据
            var count = obj.config.page.count;
            // 这里有个bug，用的浅复制
            // var condition = obj.config.where;
            // 这里使用深度复制
            var condition = Object.create(obj.config.where);
            condition.limit = count;
            var load = layer.load(0);
            $.ajax({
                url: '/host/hosts',
                method: 'GET',
                data: condition,
                headers: {
                    "Authorization": localStorage.access_token
                },
                async: false,
                success: res => {
                    console.log(res.data)
                    if (res.code === 0) {
                        table.exportFile('currentTableId', res.data, 'xls');
                    } else {
                        layer.msg('导出失败', {
                            icon: 2
                        })
                    }
                }

            });
            layer.close(load);
        } else if (obj.event === 'import') {
            var importPage = layer.open({
                type: 1,
                content: $('#import'),
            })
        }
    });

    //监听表格复选框选择
    table.on('checkbox(currentTableFilter)', function(obj) {
        console.log(obj)
    });

    table.on('tool(currentTableFilter)', function(obj) {
        var data = obj.data;
        if (obj.event === 'edit') {

            var index = layer.open({
                title: '编辑主机',
                type: 2,
                shade: 0.2,
                maxmin: true,
                shadeClose: true,
                area: ['100%', '100%'],
                content: '../../page/host/edit.html',
                success: (layero, index) => {
                    var body = layer.getChildFrame('body', index);
                    body.find('input[name="id"]').val(data.id);
                    body.find('input[name="host"]').val(data.host);
                    body.find('input[name="port"]').val(data.port);
                    body.find('input[name="username"]').val(data.username);
                    body.find('input[name="password"]').val(data.password);
                    body.find('input[name="rsaKeyPath"]').val(data.rsaKeyPath);
                    body.find('input[name="rsaPassword"]').val(data.rsaPassword);
                    var node = body.find('input[name="isUseRsa"]');
                    if (data.isUseRsa == 1) {
                        node.attr('checked', 'checked');
                    } else {
                        node.removeAttr('checked');
                    }
                    // 重新渲染表单
                    // 获取新窗口对象
                    var iframeWindow = layero.find('iframe')[0].contentWindow;
                    // 重新渲染。
                    iframeWindow.layui.form.render();

                }
            });
            $(window).on("resize", function() {
                layer.full(index);
            });
            return false;
        } else if (obj.event === 'delete') {
            layer.confirm('确定删除吗', function(index) {
                var ids = [];
                ids.push(obj.data.id);
                deleteHost(ids);
                // console.log(obj)
                // obj.del();
                layer.close(index);
            });
        }
    });

});