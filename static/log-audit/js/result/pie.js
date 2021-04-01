layui.use(['layer', 'echarts', 'form', 'laydate', 'isLogin'], () => {
    var $ = layui.jquery,
        layer = layui.layer,
        echarts = layui.echarts,
        form = layui.form,
        laydate = layui.laydate;



    /**
     * 日期选择。
     */

    var start = laydate.render({
        elem: '#startTime',
        type: 'month',
        value: new Date(),
        showBottom: true,
        theme: 'default',
        calendar: true,
        btns: ['confirm'], // clear, now, confirm            

    });




    $.ajax({
        url: '/user/getUsers',
        method: 'get',
        headers: {
            "Authorization": localStorage.access_token
        },
        async: false,
        success: res => {
            if (res.code === 200) {
                if (res.data.length == 0) {
                    layer.msg('违规用户为空', {
                        icon: 2,
                        time: 1000
                    })
                    return;
                }
                let str = '';
                // of o 返回的是 索引
                for (let o in res.data) {
                    str += `<option value="` + res.data[o] + `">` + res.data[o] + `</option>`
                }
                $('#add-option').html(str);
                form.render();

            } else {
                layer.msg(res.msg, {
                    icon: 2,
                    time: 1000
                })
            }
        }
    })


    /**
     * 报表功能
     */
    var echartsRecords = echarts.init(document.getElementById('echarts-records'), 'walden');

    var optionRecords = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            top: '6%',
            left: 'left'
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 7,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                position: 'center',
                normal: {
                    position: 'outside',
                    formatter: '{b}\n{c} ({d}%)'
                }
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '25',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: true
            },
            data: []
        }]
    };

    echartsRecords.setOption(optionRecords)

    /* 
    根据地区分组
        name: 地区 
        value: 登录次数
     */

    /*  
        刷新图表
    */
    var refreshChart = function(data) {
        if (data.data.length == 0) {
            layer.msg('暂无数据', {
                icon: 2,
                time: 1000
            });
        }
        var option = echartsRecords.getOption();
        option.title[0].text = data.name
        option.series[0].data = data.data;
        echartsRecords.setOption(option);
        return;

    }


    var requestEchartData = function(field) {
        $.ajax({
            url: '/log/pieData',
            method: 'POST',
            data: JSON.stringify(field),
            headers: {
                "Authorization": localStorage.access_token
            },
            dataType: 'json',
            contentType: 'application/json',
            async: false,
            success: res => {
                if (res.code == 200) {
                    refreshChart(res.data);

                } else {
                    layer.msg(res.msg, {
                        icon: 2
                    });
                }
            }
        });
    };

    var echartDataInit = function() {
        $('#pie-submit').click();
    };

    form.on('submit(echart-btn-submit)', data => {
        var field = data.field;
        requestEchartData(field);
        return false;
    });
    // echarts 窗口缩放自适应
    window.onresize = function() {
        echartsRecords.resize();
    }

    // 自动获取表单字段数据
    // var d = {};
    // var t = $('#chartForm [name]').serializeArray();
    // $.each(t, function() {
    //     d[this.name] = this.value;
    // });
    // var field = JSON.stringify(d);
    echartDataInit()


});