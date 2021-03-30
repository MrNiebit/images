layui.use(['form', 'table', 'isLogin'], function() {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table;

    table.set({
        headers: {
            "Authorization": localStorage.access_token
        }
    });

    table.render({
        elem: '#currentTableId',
        url: '/permission/permissions',
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
                hide: true
            }, {
                field: 'name',
                width: 140,
                title: '权限名称'
            }, {
                field: 'description',
                width: 240,
                title: '权限描述',
                sort: true
            }, {
                field: 'roles',
                width: 210,
                title: '所属角色',
                templet: roles => {
                    return roles.roles.map(role => role.name).join(',');
                },
            }, {
                field: 'url',
                width: 190,
                title: '权限路径'
            }, {
                title: '操作',
                minWidth: 50,
                toolbar: '#currentTableBar',
                align: "center"
            }]
        ],
        limits: [10, 15, 20, 25, 50, 100],
        limit: 10,
        page: false,
        skin: 'line'
    });

    // 监听搜索操作
    form.on('submit(data-search-btn)', function(data) {

        // layer.alert(result, {
        //     title: '最终的搜索信息'
        // });

        //执行搜索重载
        table.reload('currentTableId', {}, 'data');

        return false;
    });

    var deleteHost = function(ids) {
        $.ajax({
            url: '/permission/delete',
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
                content: '../../page/authority/add.html',
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
                title: '编辑主机',
                type: 2,
                shade: 0.2,
                maxmin: true,
                shadeClose: true,
                area: ['100%', '100%'],
                content: '../../page/authority/edit.html',
                success: (layero, index) => {
                    var body = layer.getChildFrame('body', index);
                    body.find('input[name="id"]').val(data.id);
                    body.find('input[name="name"]').val(data.name);
                    body.find('textarea[name="description"]').val(data.description);
                    body.find('input[name="url"]').val(data.url);
                    var roles = data.roles.map(role => role.name);
                    roles.forEach(elem => {
                        if (elem === 'ROLE_ADMIN') {
                            body.find('input[name="pRoles"][value="1"]').prop('checked', true);
                        } else {
                            body.find('input[name="pRoles"][value="2"]').prop('checked', true);
                        }
                    });


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