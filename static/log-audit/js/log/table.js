layui.use(['form', 'table', 'laydate', 'isLogin'], function() {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate;

    table.set({
        headers: {
            "Authorization": localStorage.access_token
        }
    });

    table.render({
        elem: '#currentTableId',
        url: '/log/logs',
        title: '当前web日志',
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
                hide: true
            }, {
                field: 'name',
                width: 100,
                title: '操作名称'
            }, {
                field: 'requestUrl',
                width: 150,
                title: '请求路径'
            }, {
                field: 'targetClass',
                width: 100,
                title: '调用方法',
            }, {
                field: 'requestParam',
                width: 150,
                title: '请求参数'
            }, {
                field: 'username',
                width: 100,
                title: '请求用户',
            }, {
                field: 'ip',
                title: '客户端ip',
                minWidth: 100,
                align: 'center',
                sort: true
            }, {
                field: 'errorMsg',
                width: 100,
                title: '报错信息',
            }, {
                field: 'costTime',
                width: 130,
                title: '花费时间[ms]',
                sort: true
            }, {
                field: 'createTime',
                width: 190,
                title: '创建时间',
                sort: true
            }]
        ],
        limits: [10, 15, 20, 25, 50, 100],
        limit: 10,
        autoSort: false,
        page: true,
        request: {
            pageName: 'page',
            limitName: 'pageSize'
        },
        skin: 'line'
    });
    /**
     * 日期选择。
     */

    var start = laydate.render({
        elem: '#date',
        type: 'month',
        value: new Date(),
        showBottom: true,
        theme: 'default',
        calendar: true,
        btns: ['confirm'], // clear, now, confirm            
        // max: $('#endTime').val(),

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


    /**
     * toolbar监听事件
     */
    table.on('toolbar(currentTableFilter)', function(obj) {
        if (obj.event === 'refresh') {
            // 刷新表格
            table.reload('currentTableId', {
                page: {
                    curr: 1,
                    limit: 10,
                },
            });
        }
        // else if (obj.event === 'export') {
        //     // 自定义导出数据
        //     var count = obj.config.page.count;
        //     // 这里有个bug，用的浅复制
        //     // var condition = obj.config.where;
        //     // 这里使用深度复制
        //     var condition = Object.create(obj.config.where);
        //     condition.limit = count;
        //     var load = layer.load(0);
        //     $.ajax({
        //         url: '/round-audit/getRoundAuditData',
        //         method: 'GET',
        //         data: condition,
        //         headers: {
        //             "Authorization": localStorage.access_token
        //         },
        //         async: false,
        //         success: res => {
        //             console.log(res.data)
        //             if (res.code === 0) {
        //                 table.exportFile('currentTableId', res.data, 'xls');
        //             } else {
        //                 layer.msg('导出失败', {
        //                     icon: 2
        //                 })
        //             }
        //         }

        //     });
        //     layer.close(load);
        // }
    });



    /**
     * 监听 sort，向后台发起请求。
     * table.render() 基础参数中设置 autoSort: false 禁止前端排序。
     * */
    table.on('sort(currentTableFilter)', obj => {
        table.reload('currentTableId', {
            page: {
                cur: 1,
                limit: 10
            },
            initSort: obj, // 记录初始排序，如果不设定了话，将无法记录表头的排序状态
            where: {
                field: obj.field,
                order: obj.type
            }
        })
    });


});