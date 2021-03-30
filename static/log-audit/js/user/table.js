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
        url: '/user/users',
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
                field: 'username',
                width: 130,
                title: '用户名'
            }, {
                field: 'nickname',
                width: 90,
                title: '昵称',
                sort: true
            }, {
                field: 'roles',
                width: 210,
                templet: roles => {
                    return roles.roles.map(role => role.name).join(',');
                },
                title: '所属角色'
            }, {
                field: 'mail',
                width: 150,
                title: '邮箱'
            }, {
                field: 'mobile',
                width: 150,
                title: '手机号'
            }, {
                field: 'loginAddress',
                width: 150,
                title: '上次登录地址'
            }, {
                field: 'remark',
                title: '备注信息',
                minWidth: 50
            }, {
                title: '操作',
                width: 130,
                toolbar: '#currentTableBar',
                align: "center"
            }]
        ],
        page: false
    });






    var deleteHost = function(ids) {
        $.ajax({
            url: '/user/delete',
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
                content: './add.html',
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
                content: '../../page/user/edit.html',
                success: (layero, index) => {
                    var body = layer.getChildFrame('body', index);
                    body.find('input[name="id"]').val(data.id);
                    body.find('input[name="username"]').val(data.username);
                    // body.find('input[name="password"]').val(data.password);
                    body.find('input[name="nickname"]').val(data.nickname);
                    body.find('input[name="mobile"]').val(data.mobile);
                    body.find('input[name="mail"]').val(data.mail);
                    body.find('textarea[name="remark"]').val(data.remark);

                    var node = body.find('input[name="isAdmin"]');
                    var roles = data.roles.map(role => role.name);
                    if (roles.indexOf('ROLE_ADMIN') != -1) {
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