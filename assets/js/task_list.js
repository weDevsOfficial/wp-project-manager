
    ;(function($) {
        var fetchingData = false;
        var CPM_Tasklist = {

            init: function () {
                // Load more
                $('body').on('click', 'a#load_more_task', this.loadMoreTaskList);
            },

            loadMoreTaskList: function (){
                var totoltodos = $("#load_more_task").attr('data-totaltodo') ;
                var offset = $("#load_more_task").attr('data-offset') ;
                var project_id = $("#load_more_task").attr('data-project-id') ;
                var privacy = $("#load_more_task").attr('data-privacy') ;
                if( offset < totoltodos) {
                    var data = {
                        offset :offset,
                        project_id  : project_id ,
                        privacy  : privacy ,
                        action: 'cpm_get_task_list',
                        is_admin : CPM_Vars.is_admin,
                    };

                    $(".loadmoreanimation").show() ;
                    var startfrom = (parseInt($("#load_more_task").attr('data-offset'))-1);
                    $.post(CPM_Vars.ajaxurl, data, function (res) {
                       res = JSON.parse(res);
                       if (res.success){
                            $(".cpm-todolists").append(res.response);
                            $("#load_more_task").attr('data-offset', res.offset);
                            loadalltodos(startfrom) ;

                        } else {
                            $("#load_more_task").hide() ;
                        }

                        $(".loadmoreanimation").hide();
                        showloadmorebtn() ;
                        fetchingData = false;
                    });
                    showloadmorebtn() ;
                }
            }
        }

        $(function() {
            CPM_Tasklist.init();
            showloadmorebtn() ;
            todolist_show = CPM_Vars.todolist_show ;
            $(window).scroll(function(){
                if(todolist_show == 'lazy_load') {
                    if ($(window).scrollTop() == ($(document).height() - $(window).height())){
                        if (!fetchingData) {
                            CPM_Tasklist.loadMoreTaskList();
                            fetchingData = true;
                        }
                    }
                }
            });
        });

        function  showloadmorebtn() {
            var totoltodos = parseInt($("#load_more_task").attr('data-totaltodo')) ;
            var offset = parseInt($("#load_more_task").attr('data-offset')) ;
            if( totoltodos > offset) {
                if(CPM_Vars.todolist_show === 'lazy_load'){
                    if ($("body").hasScrollBar()) {
                        $("#load_more_task").hide() ;
                       }else {
                            $("#load_more_task").show() ;
                       }
                }else if(CPM_Vars.todolist_show === 'pagination') {
                   $("#load_more_task").hide() ;
                }else {
                     $("#load_more_task").show() ;
                }
            }else {
                $("#load_more_task").hide() ;
            }
        }


    function loadalltodos( fromli, complete ){
        var $ = jQuery ;
        $(".cpm-todolist-content").each(function(index, val){
            if(!$(this).hasClass("loadcomplete") || !$(this).hasClass("loadonprocess") ) {
                $(this).addClass("loadonprocess");
                var list_id = $(this).attr('data-listid');
                var project_id = $(this).attr('data-project-id');
                var single = $(this).attr('data-status');
                var data = {
                       project_id  : project_id,
                       list_id  : list_id,
                       single : single,
                       action: 'cpm_get_todo_list',
                       is_admin : CPM_Vars.is_admin,
                    };
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    $(val).html(res) ;
                });

                $(this).addClass("loadcomplete");
                $(this).removeClass('loadonprocess');
            }
        });

    }

        $.fn.hasScrollBar = function() {
            return this.get(0).scrollHeight > this.height();
        }

    })(jQuery);

