layui.use(['form', 'isLogin'], function() {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.$;

    //监听提交
    form.on('submit(saveBtn)', function(data) {
        $.ajax({
            url: '/menu/update',
            method: 'POST',
            headers: {
                "Authorization": localStorage.access_token
            },
            data: data.field,
            dataType: 'json',
            success: res => {
                var iframeIndex = parent.layer.getFrameIndex(window.name);

                if (res.code === 200) {
                    layer.msg(res.msg, {
                        icon: 6,
                        time: 1000
                    }, () => {
                        // 重新加载 父 页面的 tree table
                        parent.renderTable();
                        parent.layer.close(iframeIndex);

                    });
                } else {
                    layer.msg(res.msg, {
                        icon: 5,
                        time: 1000
                    }, () => {
                        // window.reload();
                        parent.layer.close(iframeIndex);
                    })
                }


            }
        })

        // var index = layer.alert(JSON.stringify(data.field), {
        //     title: '最终的提交信息'
        // }, function() {
        //     // 关闭弹出层
        //     layer.close(index);
        //     var iframeIndex = parent.layer.getFrameIndex(window.name);
        //     parent.layer.close(iframeIndex);

        // });

        return false;
    });

});