layui.use(['form', 'isLogin'], function() {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    form.verify({
        account: (value, item) => {
            var min = item.getAttribute('lay-min');
            if (value.length < min) {
                return "账号不能小于" + min + "个字符长度。";
            }
        }
    });


    //监听提交  
    form.on('submit(saveBtn)', function(data) {

        var iframeIndex = parent.layer.getFrameIndex(window.name);

        $.ajax({
            url: '/user/updateDetail',
            method: 'POST',
            data: data.field,
            success: res => {
                if (res.code === 200) {
                    layer.msg('修改成功', {
                        icon: 1,
                        time: 1000
                    }, () => {
                        parent.layui.table.reload('currentTableId', {

                        });
                        parent.layer.close(iframeIndex); // miniTab.deleteCurrentByIframe();
                    });
                } else {
                    layer.msg('修改失败', {
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