
;(function($) {

    var CPM_Tasklist = {

        init: function () {
            // Load more
            $('body').on('click', 'a#load_more_task', this.loadMoreTaskList);
        },

        loadMoreTaskList: function (e){
            var data = {
                offset : $("#load_more_task").attr('data-offset'),
                project_id  : $("#load_more_task").attr('data-project-id'),
                privacy  : $("#load_more_task").attr('data-privacy'),
                action: 'cpm_get_task_list',
            };
             $(".loadmoreanimation").show() ;
            var startfrom = (parseInt($("#load_more_task").attr('data-offset'))-1);

           $.post(CPM_Vars.ajaxurl, data, function (res) {
               res = JSON.parse(res);
               if (res.success){
                    $(".cpm-todolists").append(res.response);
                    $("#load_more_task").attr('data-offset', res.offset);
                    loadtodos(startfrom) ;
                } else {
                    $("#load_more_task").hide() ;
                }
                //showloadmorebtn() ;
                $(".loadmoreanimation").hide() ;
           });
        }
    }

    $(function() {
        CPM_Tasklist.init();
        showloadmorebtn() ;

        $(window).scroll(function(){
             if ($(window).scrollTop() == $(document).height() - $(window).height()){
                CPM_Tasklist.loadMoreTaskList();
            }
        });

    });

    function  showloadmorebtn() {

         if ($("body").hasScrollBar()) {
             $("#load_more_task").hide() ;
        }else {
             $("#load_more_task").show() ;
        }

    }


function loadtodos(fromli, complete){
var $ = jQuery ;
    $(".cpm-todolist-content").each(function(index, val){
        if(index => fromli) {
          var list_id = $(this).attr('data-listid');
          var project_id = $(this).attr('data-project-id');
          var single = $(this).attr('data-status');
           var data = {
                 project_id  : project_id,
                 list_id  : list_id,
                 single : single,
                 action: 'cpm_get_todo_list',
               };
           $.post(CPM_Vars.ajaxurl, data, function (res) {
                $(val).html(res) ;
                // $(this).append(res) ;
           });
        }
    });
}



    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }

})(jQuery);

