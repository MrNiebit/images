layui.use(['table', 'isLogin'], function() {
    var $ = layui.jquery,
        table = layui.table;

    table.set({
        headers: {
            "Authorization": localStorage.access_token
        }
    });

    table.render({
        elem: '#currentTableId',
        url: '/task/tasks',
        title: '用户列表',
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter']
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
                field: 'jobName',
                width: 200,
                title: '任务名字'
            }, {
                field: 'className',
                wdth: 400,
                title: '全限定类名',
            }, {
                field: 'method',
                width: 100,
                title: '方法名'
            }, {
                field: 'cron',
                width: 130,
                title: 'cron表达式'
            }, {
                field: 'status',
                width: 100,
                title: '状态',
                templet: data => {
                    return data.status == 1 ? '开启' : '关闭';
                }
            }, {
                title: '操作',
                minWidth: 40,
                toolbar: '#currentTableBar',
                align: "center"
            }]
        ],
        page: false
    });






    var deleteHost = function(ids) {
        $.ajax({
            url: '/task/delete',
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
                        table.reload('currentTableId', {});
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
                content: '../../page/auditTask/add.html',
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
            table.reload('currentTableId', {});
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
                title: '编辑用户',
                type: 2,
                shade: 0.2,
                maxmin: true,
                shadeClose: true,
                area: ['100%', '100%'],
                content: '../../page/auditTask/edit.html',
                success: (layero, index) => {
                    var body = layer.getChildFrame('body', index);
                    body.find('input[name="id"]').val(data.id);
                    body.find('input[name="jobName"]').val(data.jobName);
                    // body.find('input[name="password"]').val(data.password);
                    body.find('input[name="className"]').val(data.className);
                    body.find('input[name="method"]').val(data.method);
                    body.find('input[name="cron"]').val(data.cron);
                    var node = body.find('input[name="status"]');

                    if (data.status === 1) {
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