layui.use(['form', 'isLogin'], function() {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    // miniTab = layui.miniTab;

    var userInfo = layui.data('user_info').user_info;
    // 加载用户信息
    $('input[name="username"]').val(userInfo.username);
    $('input[name="nickname"]').val(userInfo.nickname);
    $('input[name="mobile"]').val(userInfo.mobile);
    $('input[name="mail"]').val(userInfo.mail);
    $('textarea[name="remark"]').val(userInfo.remark);
    form.render();
    // $.ajax({
    //     url: '/user/findByUsername?username=' + userInfo.username,
    //     method: 'get',
    //     success: res => {
    //         userInfo = res.data;
    //         $('input[name="username"]').val(userInfo.username);
    //         $('input[name="nickname"]').val(userInfo.nickname);
    //         $('input[name="mobile"]').val(userInfo.mobile);
    //         $('input[name="mail"]').val(userInfo.mail);
    //         $('textarea[name="remark"]').val(userInfo.remark);
    //     }
    // })


    //监听提交  
    form.on('submit(saveBtn)', function(data) {

        $.ajax({
            url: '/user/update',
            method: 'POST',
            data: data.field,
            success: res => {
                if (res.code === 200) {
                    layer.msg('修改成功', {
                        icon: 1,
                        time: 1000
                    }, () => {
                        res.data.jwtToken = localStorage.access_token;
                        layui.data('user_info', {
                            key: 'user_info',
                            value: res.data
                        })

                        window.parent.location.reload();
                        // miniTab.deleteCurrentByIframe();
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