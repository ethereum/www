$(function(){

    
    $("ul#navi li ul li:has(ul)").find("a:first").append(" &raquo; ");


	$('ul#navi li').on('mouseenter', function(){
								$(this).children('ul.dropDown').stop(true,true).slideDown(200);
							}).on('mouseleave', function(){
								$(this).children('ul.dropDown').stop(true,true).slideUp(200);
							});

});