(function($) {

	$(document).on('cpm.markDone.after', function( event, res, self ) {

	    var wrap = $('.my-tasks'),
	    header = self.closest('ul.cpm-uncomplete-mytask');

	    if( $('.cpm-uncomplete-mytask').children('li').length <= 1 ) {
	        $('.cpm-no-task').fadeIn(1500);
	    }
	    if( header.children('li').length <= 1 ) {
	        header.closest('li').remove();
	    }
	    wrap.find('.cpm-mytas-current').text( res.current_task );
	    wrap.find('.cpm-mytas-outstanding').text( res.outstanding);
	    wrap.find('.cpm-mytas-complete').text(res.complete);             
	});

	$(document).on('cpm.markUnDone.after', function(e, res, self) {

	    var wrap = $('.my-tasks'),
	    header = $('.cpm-my-todolists').children('li');
	    $.map( header, function( value, key ) {
	    	var li = $(value),
	    		length = li.find('.cpm-todo-completed').find('li').length;
	    	if( length == 0) {
	    		li.remove();
	    	}
	    });
	    if( $('.cpm-todo-completed').children('li').length <= 0 ) {
	        $('.cpm-no-task').fadeIn(1500);
	    }
	    wrap.find('.cpm-mytas-current').text( res.current_task );
	    wrap.find('.cpm-mytas-outstanding').text( res.outstanding);
	    wrap.find('.cpm-mytas-complete').text(res.complete ); 
	});
 
})(jQuery);