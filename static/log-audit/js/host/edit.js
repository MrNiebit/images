layui.use(['form', 'isLogin'], function(data) {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.$;

    // 开关
    form.on('switch(switchTest)', function() {
        var flag = this.checked ? 1 : 0;
        if (flag === 1) {
            $('.rsa-use').removeAttr('disabled');
        } else {
            $('.rsa-use').attr('disabled', 'disabled');
        }
    });

    //监听提交
    form.on('submit(saveBtn)', function(data) {
        data.field.isUseRsa = data.field.isUseRsa == 'on' ? 1 : 0;
        var iframeIndex = parent.layer.getFrameIndex(window.name);
        $.ajax({
            url: '/host/update',
            headers: {
                "Authorization": localStorage.access_token
            },
            method: 'POST',
            data: JSON.stringify(data.field),
            dataType: 'json',
            contentType: 'application/json',
            success: res => {
                if (res.code === 200) {
                    layer.msg('更新成功', {
                        icon: 6,
                        time: 1000
                    }, () => {
                        parent.layui.table.reload('currentTableId', {

                        });
                        parent.layer.close(iframeIndex);
                    });
                } else {
                    layer.msg(res.msg, {
                        icon: 5,
                        time: 1000
                    }, () => {
                        parent.layer.close(iframeIndex);
                    })
                }
            }
        });
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