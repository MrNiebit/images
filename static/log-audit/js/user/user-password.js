layui.use(['form', 'miniTab', 'isLogin'], function() {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    miniTab = layui.miniTab;

    //监听提交
    form.on('submit(saveBtn)', function(data) {
        var new_password = $('input[name="newPassword"]').val();
        var again_password = $('input[name="again_password"]').val();
        if (new_password != again_password) {
            layer.msg('两次输入的密码不一致', {
                icon: 2,
                time: 1000
            })
            return false;
        }

        $.ajax({
            url: '/user/updatePassword',
            method: 'POST',
            data: data.field,
            success: res => {
                if (res.code === 200) {
                    layer.msg('修改成功, 请使用新密码重新登录', {
                        icon: 1,
                        time: 1000
                    }, () => {
                        localStorage.clear();
                        parent.location.href = '/page/login.html';
                    });
                } else {
                    layer.msg(res.msg, {
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