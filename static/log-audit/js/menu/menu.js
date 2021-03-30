layui.use(['table', 'treetable', 'isLogin'], function() {
    var $ = layui.jquery;
    var table = layui.table;
    var treetable = layui.treetable;

    window.renderTable = function() {
        // 渲染表格
        layer.load(2);
        treetable.render({
            treeColIndex: 1,
            treeSpid: '-1', // 为该值，则为 顶级 节点
            treeIdName: 'menuId',
            treePidName: 'menuPid',
            elem: '#munu-table',
            url: '/menu/menus',
            page: false,
            cols: [
                [{
                    field: 'rank',
                    title: '序号',
                    width: 80,
                    sort: true,
                    fixed: 'left',
                    templet: '#rank'
                }, {
                    field: 'title',
                    minWidth: 200,
                    title: '菜单名称'
                }, {
                    field: 'role',
                    title: '所属角色'
                }, {
                    field: 'href',
                    title: '菜单url'
                }, {
                    templet: '#auth-state',
                    width: 120,
                    align: 'center',
                    title: '操作'
                }]
            ],
            done: function() {
                layer.closeAll('loading');
            }
        });

    };
    window.renderTable();
    $('#btn-expand').click(function() {
        treetable.expandAll('#munu-table');
    });

    $('#btn-fold').click(function() {
        treetable.foldAll('#munu-table');
    });

    //监听工具条
    table.on('tool(munu-table)', function(obj) {
        var data = obj.data;
        var layEvent = obj.event;

        if (layEvent === 'del') {
            layer.msg('删除' + data.id);
        } else if (layEvent === 'edit') {
            var index = layer.open({
                title: '编辑菜单',
                type: 2,
                shade: 0.2,
                maxmin: true,
                shadeClose: true,
                area: ['100%', '100%'],
                content: '  ../../page/menu/edit.html',
                success: function(layero, index) {
                    var body = layer.getChildFrame('body', index);
                    body.find('input[name="title"]').val(data.title);
                    body.find('input[name="menuId"]').val(data.menuId);
                    var node = body.find('input[name="role"][value=' + data.role + ']');
                    node.prop('checked', 'checked');
                    body.find('input[name="href"]').val(data.href);
                    body.find('select[name="target"] option[value=' + data.target + ']').prop('selected', 'selected')
                        // 重新渲染表单
                        // 获取新窗口对象
                    var iframeWindow = layero.find('iframe')[0].contentWindow;
                    // 重新渲染。
                    iframeWindow.layui.form.render();
                }

            });
            $(window).on('resize', function() {
                layer.full(index);
            });
            return false;
        }
    });
});