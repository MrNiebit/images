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
        url: '/cas/casLog4a',
        cellMinWidth: 80,
        title: 'casLog4A日志',
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
                field: 'resourceKind',
                width: 50,
                title: '资源类型'
            }, {
                field: 'idrCreationTime',
                width: 100,
                title: '创建时间',
                sort: true
            }, {
                field: 'resourceCode',
                width: 100,
                title: '资源码',
            }, {
                field: 'mainAccountName',
                width: 100,
                title: '主账号'
            }, {
                field: 'subAccountName',
                width: 100,
                title: '从账号',
            }, {
                field: 'operateTime',
                title: '操作时间',
                minWidth: 100,
                align: 'center',
                sort: true
            }, {
                field: 'opTypeName',
                width: 100,
                title: '操作类型名称',
            }, {
                field: 'opLevelId',
                width: 40,
                title: '操作等级ID',
            }, {
                field: 'operateResult',
                width: 50,
                title: '操作结果',
            }, {
                field: 'operateContent',
                width: 190,
                title: '操作内容',
            }, {
                field: 'objectName',
                width: 100,
                title: '对象名称',
            }, {
                field: 'clientAddress',
                width: 100,
                title: '客户端IP',
            }, {
                field: 'serverAddress',
                width: 100,
                title: '服务端IP',
            }, {
                field: 'clientCpuSerial',
                width: 100,
                title: '客户端CPU序列号',
            }, {
                field: 'clientPort',
                width: 100,
                title: '客户端端口',
            }, {
                field: 'clientMac',
                width: 100,
                title: '客户端mac地址',
            }, {
                field: 'serverPort',
                width: 100,
                title: '服务端端口',
            }, {
                field: 'serverMac',
                width: 100,
                title: '服务端mac地址',
            }, {
                field: 'dbInfoCode',
                width: 100,
                title: '数据库信息',
            }, {
                field: 'sqlTables',
                width: 100,
                title: 'SQL查询表',
            }, {
                field: 'sqlWhereConditions',
                width: 100,
                title: 'sql的查询条件',
            }, {
                field: 'taskCode',
                width: 100,
                title: '任务代码',
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
        elem: '#startTime',
        type: 'datetime',
        value: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        showBottom: true,
        theme: 'default',
        calendar: true,
        btns: ['confirm'], // clear, now, confirm            
        min: '1900-1-1 00:00:00',
        done: (value, date, endDate) => {
            end.config.min = {
                year: date.year,
                month: date.month - 1,
                date: date.date,
                hours: date.hours,
                minutes: date.minutes,
                seconds: date.seconds
            }; //开始日选好后，重置结束日的最小日期
            end.config.value = {
                year: date.year,
                month: date.month - 1,
                date: date.date,
                hours: date.hours,
                minutes: date.minutes,
                seconds: date.seconds
            }; //将结束日的初始值设定为开始日

        }

    });


    var end = laydate.render({
        elem: '#endTime',
        type: 'datetime',
        value: new Date(),
        showBottom: true,
        theme: 'default',
        calendar: true,
        btns: ['now', 'confirm'],
        min: $('#startTime').val(),
        max: new Date() + 1,
        done: (value, date, endDate) => {
            start.config.max = {
                year: date.year,
                month: date.month - 1,
                date: date.date,
                hours: date.hours,
                minutes: date.minutes,
                seconds: date.seconds
            }; //结束日选好后，重置开始日的最大日期
        }
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