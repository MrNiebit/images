layui.use(['form', 'isLogin'], function(data) {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.$;

    // var pRoles = [];

    // var roleInit = function() {
    //     $.each(checkbox, (index, item) => {
    //         pRoles.push(item.value)
    //     });
    //     form.render('checkbox');
    // }


    // 复选框监听
    // form.on('checkbox(role)', data => {
    //     if (data.elem.checked === true) {
    //         pRoles.push(data.value);
    //     } else {
    //         // 删除 为false 的元素  删除指定元素
    //         if (pRoles.indexOf(data.value) != -1) {
    //             pRoles.splice(pRoles.indexOf(data.value), 1);
    //         }
    //     }
    //     console.log('current role list => ' + pRoles);
    // });


    //监听提交
    form.on('submit(saveBtn)', function(data) {
        var pRoles = [];
        var checkbox = $('input[name="pRoles"][type="checkbox"]:checked');
        $.each(checkbox, (index, item) => {
            pRoles.push(item.value)
        });
        data.field.pRoles = pRoles;
        var iframeIndex = parent.layer.getFrameIndex(window.name);
        $.ajax({
            url: '/permission/update',
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
    // roleInit();

});