layui.use(['layer', 'echarts', 'isLogin'], () => {

    var $ = layui.jquery,
        echarts = layui.echarts,
        layer = layui.layer;

    var echartsRecords = echarts.init(document.getElementById('echarts-records'), 'walden');

    option = {
        title: {
            text: '最近7天的违规日志'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: { readOnly: true },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {},
        yAxis: {
            type: 'value'
        },
        series: []
    };

    $.ajax({
        url: '/log/lineChartData',
        method: 'GET',
        async: false,
        success: res => {
            if (res.code != 200) {
                layer.msg('查询失败', { icon: 2 })
            } else {
                var data = res.data;
                option.legend = data.legend;
                option.xAxis = data.xaxis;
                option.series = data.series;
                echartsRecords.setOption(option);
            }
        }
    })

});