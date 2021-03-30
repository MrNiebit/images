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
        url: '/user/loginedUser',
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
                field: 'id',
                hide: 'true'
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
                width: 200,
                title: '登录地址'
            }, {
                field: 'remark',
                title: '备注信息',
                minWidth: 50
            }, {
                title: '操作',
                minWidth: 50,
                toolbar: '#currentTableBar',
                align: "center"
            }]
        ],
        page: false
    });




    /**
     * toolbar监听事件
     */
    table.on('toolbar(currentTableFilter)', function(obj) {
        if (obj.event === 'refresh') {
            // 刷新表格
            table.reload('currentTableId', {});
        }
    });

    table.on('tool(currentTableFilter)', obj => {
        if (obj.event === 'logout') {
            $.ajax({
                url: '/user/logoutByKey',
                method: 'POST',
                data: {
                    key: obj.data.id
                },
                headers: {
                    "Authorization": localStorage.access_token
                },
                success: res => {
                    if (res.code === 200) {
                        layer.msg('下线成功', {
                            icon: 1,
                            time: 1000
                        }, () => {
                            table.reload('currentTableId', {});

                        })
                    } else {
                        layer.msg('下线失败', {
                            icon: 2,
                            time: 1000
                        })
                    }
                }
            })
        }
    });

    // //监听表格复选框选择
    // table.on('checkbox(currentTableFilter)', function(obj) {
    //     console.log(obj)
    // });

});