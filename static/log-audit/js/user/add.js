layui.use(['form', 'isLogin'], function() {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    $('#uname').on('blur', () => {
        var username = $('#uname').val();
        $.ajax({
            url: '/user/exist?username=' + username,
            method: 'GET',
            success: res => {
                if (res.code !== 200) {
                    layer.msg(res.msg, {
                        icon: 2,
                        time: 1000
                    }, () => {
                        $('#uname').val('');
                    });
                }
            }
        })
    });

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
            url: '/user/add',
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