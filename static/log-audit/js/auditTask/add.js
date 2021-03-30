layui.use(['form', 'isLogin'], function() {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;

    // cron.render({
    //     elem: "#cron-elem", // 绑定元素
    //     url: "https://www.fastmock.site/mock/58329c0ee61b03d6ce3ba0c1e2f13691/world/cron", // 获取最近运行时间的接口
    //     value: $("#cron-elem").val(), // 默认值
    //     done: function(cronStr) {
    //         console.log(cronStr);
    //         $("#cron-elem").val(cronStr);
    //     },
    // });

    var cronRequest = function() {
        var flag = false;
        $.ajax({
            url: '/task/cron?cron=' + $('#cron-elem').val(),
            method: 'get',
            async: false,
            success: res => {
                if (res.code != 200) {
                    layer.msg(res.msg, { icon: 2, time: 1000 });
                    flag = false;
                } else {
                    layer.msg('执行时间为：' + res.msg, { icon: 1 });
                    flag = true;
                }
            }
        })
        return flag;
    };

    $('#cron-elem').on('blur', () => {
        cronRequest();
    });


    form.verify({
        cron: (value, item) => {
            var flag = cronRequest();
            if (!flag) {
                return "cron表达式不正确";
            }
        }
    })


    //监听提交  
    form.on('submit(saveBtn)', function(data) {

        var iframeIndex = parent.layer.getFrameIndex(window.name);

        $.ajax({
            url: '/task/add',
            method: 'POST',
            data: data.field,
            success: res => {
                if (res.code === 200) {
                    layer.msg(res.msg, {
                        icon: 1,
                        time: 1000
                    }, () => {
                        parent.layui.table.reload('currentTableId', {

                        });
                        parent.layer.close(iframeIndex); // miniTab.deleteCurrentByIframe();
                    });
                } else {
                    layer.msg('添加失败', {
                        icon: 2,
                        time: 1000
                    });
                }
            }
        })


        // var index = layer.alert(JSON.stringify(data.field), {
        //     title: '最终的提交信息'
        // }, function() {
        //     layer.close(index);
        //     miniTab.deleteCurrentByIframe();
        // });
        return false;
    });

});