layui.use(['form', 'isLogin'], function(data) {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.$;

    // var pRoles = [];
    // // 复选框监听
    // form.on('checkbox(role)', data => {
    //     if (data.elem.checked === true) {
    //         pRoles.push(data.value);
    //     } else {
    //         // 删除 为false 的元素  删除指定元素
    //         if (pRoles.indexOf(data.value) != -1) {
    //             pRoles.splice(pRoles.indexOf(data.value), 1);
    //         }
    //     }
    // });

    //监听提交
    form.on('submit(saveBtn)', function(data) {
        var iframeIndex = parent.layer.getFrameIndex(window.name);
        var pRoles = [];
        var checkbox = $('input[name="pRoles"][type="checkbox"]:checked');
        $.each(checkbox, (index, item) => {
            pRoles.push(item.value)
        });
        data.field.pRoles = pRoles;
        data.field.pRoles = pRoles;
        $.ajax({
            url: '/permission/add',
            headers: {
                "Authorization": localStorage.access_token
            },
            method: 'POST',
            data: JSON.stringify(data.field),
            dataType: 'json',
            contentType: 'application/json',
            success: res => {
                if (res.code === 200) {
                    layer.msg('添加成功', {
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

        return false;
    });

});