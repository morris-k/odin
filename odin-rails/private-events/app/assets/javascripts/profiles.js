// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

var ready, tabActive = "#my-events";

ready = function() {
	$('.profile-link').click(function() {
		tabActive = $(this).data('tab-active');
	});
	$('.prof-tab').click(function() {
		tabActive = $(this).attr('href');
	})
	$('li').removeClass('active');
	$('a[href= ' + tabActive + ']').parent('li').addClass('active');
	$('.tab-pane').removeClass('active');
	$(tabActive).addClass('active');

};

$(document).ready(ready);
$(document).on('page:load', ready);