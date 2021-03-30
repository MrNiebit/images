;
layui.define([
    'jquery'
], function(exports) {
    'use strict';

    var $ = layui.jquery;
    var baseUrl = 'http://127.0.0.1:8989/api'
    // var baseUrl = 'http://aynu.lacknb.cn/api'

    ! function() {
        // var userinfo = layui.data('user_info');

        /**
         * 
         * if (a) {...}
         * 
         * 以下情况会被认为返回false
         *      - '' 空的字符串
         *      - 为0的数字
         *      - 为null的对象
         *      - 为undefined的对象
         *      - 布尔值 false
         * 
         */

        // var token = null;
        // 如果 localSotrage token为空
        // if (!localStorage.access_token) {

        // }
        // if (userinfo && JSON.stringify(userinfo) != '{}') {
        //     token = 'Bearer ' + userinfo.user_info.jwtToken;
        //     window.localStorage.setItem("access_token", 'Bearer ' + token);
        // }



        $.ajaxSetup({
            dataType: 'json',
            cache: false,
            global: true,
            // type: 'GET',
            headers: {
                "Authorization": localStorage.access_token
            },
            beforeSend: (xhr, settings) => {
                settings.url = baseUrl + settings.url;
            },
            xhrFields: {
                withCredentials: true
            },
            complete: function(xhr) {
                if (xhr.responseJSON.code == 1009 || xhr.responseJSON.code == 10401) {
                    layer.msg(
                        '登录过期，请重新登录', { icon: 5, time: 2000 },
                        function() {
                            layui.data('user_info', null)
                            localStorage.clear();
                            top.location.href = '/page/login.html';
                        }
                    );
                }
                // else {
                //     layer.msg(xhr.responseJSON.msg, { icon: 6, time: 1000 })
                // }
            }
        });
    }(); {}
    var obj = {};
    obj.say = function() {
        console.log('isLogin module is loaded...')
    }
    exports('isLogin', obj)
});
