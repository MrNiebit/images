layui.use(['jquery', 'isLogin', 'layer'], function() {

    var $ = layui.jquery,
        layer = layui.layer;

    /**
     * 
     * @param {-1 就是i昨天} num 
     * @param { 日期的 连接符 } str 
     * @returns 
     */
    var getDay = function(num, str) {
        var today = new Date();
        var nowTime = today.getTime();
        var ms = 24 * 3600 * 1000 * num;
        today.setTime(parseInt(nowTime + ms));
        var oYear = today.getFullYear();
        var oMoth = (today.getMonth() + 1).toString();
        if (oMoth.length <= 1) oMoth = '0' + oMoth;
        var oDay = today.getDate().toString();
        if (oDay.length <= 1) oDay = '0' + oDay;
        return oYear + str + oMoth + str + oDay;
    };
    var fields = {};
    fields.startTime = getDay(-1, '-') + ' 00:00:00';
    fields.endTime = getDay(-1, '-') + ' 23:59:59';
    fields.type = 0;
    // 请求数据
    $.ajax({
        url: '/log/auditLogs',
        method: 'POST',
        data: fields,
        async: false,
        success: res => {
            $('#box').html('');
            if (res.code != 0) {
                layer.msg('查询日志记录失败', { icon: 2 })
            } else {
                var datas = res.data;
                $('#log-count').text(res.count);
                $.each(datas, (index, item) => {
                    $('#box').append(`
                    <div class="layuimini-notice">
                        <div class="layuimini-notice-title">用户：` + item.username + ` ` + item.name + `</div>
                        <div class="layuimini-notice-extra">` + item.createTime + `</div>
                        <div class="layuimini-notice-content layui-hide">

                            <!-- content -->
                        </div>
                    </div>
                    `)
                });
            }
        }
    })



    var nodes = $('.layuimini-notice');

    if (nodes.length > 4) {
        textRoll = function() {
            $('#box').animate({
                marginTop: "-30px"
            }, 500, function() {
                // 将当前首个元素 插入末尾
                $(this).css({ marginTop: "0px" }).find(".layuimini-notice:first").appendTo(this);
            });
        }
        var roll = setInterval('textRoll()', 3000);
        nodes.mouseenter(function() {
            clearInterval(roll);
        }).mouseout(function() {
            clearInterval(roll);
            roll = setInterval('textRoll()', 3000);
        });
    }




});