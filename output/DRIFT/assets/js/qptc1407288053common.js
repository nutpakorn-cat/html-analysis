$(window).load(function() {
	$.headerScroll.fixed();
});
$(document).ready(function() {

	//	if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {
	//		alert('IE8'); 
	//	} else {
	//		alert('Non IE8');
	//	}
	
	$.tooltip.simple();
	
        $.searchbox.suggest(); /*กล่อง search*/
	
	$.message.openLightbox();
	$.message.previewMessage();
	$.message.editMessage();
	$.message.createMessage();
	$.message.closeLightbox();
	$.message.youtube_thumbnail();/* Load เล่น youtube */

	$('.icon-media-tool-lightbox').lightboxMedia();
	// tong edit
	$(document).on('click','.msg-lightbox',function(){
		var el_textarea = $(this).parents('.surround-box-light').next();
		$.image_gallery.defaults.inputUploaded = el_textarea;
		$.image_gallery.init();
	});

	/* Spoil */
	$(document).on('click', '.spoil-btn',function(){
		$(this).html('[Spoil] คลิกเพื่อดูข้อความที่ซ่อนไว้').toggleClass('spoil_hide').next().toggle();
		$('.spoil_hide').html('[Spoil] คลิกเพื่อซ่อนข้อความ');
	});

	
	$('.profile-menu').click(function(e){
		e.stopPropagation();
		$(this).toggleClass('has-submenu');
		$('.menu-bar').toggle();
		$('#menu-main-bar').removeClass('has-submenu');
		//$('#menu-brand-bar').css('display','none');
		//$('#menu-msg').css('display','none');
		//console.log('121212');
		$("#panel1").hide();
		$("#panel2").hide();
		
	});

	$('#menu-main-bar').click(function(e){
		e.stopPropagation();
		$(this).toggleClass('current has-submenu');
		$(this).toggleClass('has-submenu');
		$('#menu-brand-bar').toggle();
		$('.profile-menu').removeClass('has-submenu');
		$('.menu-bar').css('display','none');
	//$('#menu-msg').css('display','none');
	});

	$('body').click(function(e){

		$('.profile-menu').removeClass('has-submenu');
		$('.menu-bar').css('display','none');
		$('#menu-msg').css('display','none');
		$('#menu-main-bar').removeClass('has-submenu current');
		$('#menu-brand-bar').css('display','none');
	});
	
	$("#flip-room").click(function(){
		$("#panel1").slideToggle("fast");
		$("#panel2").hide();
	});
	$("#flip-about-pantip").click(function(){
		$("#panel2").slideToggle("fast");
		$("#panel1").hide();
	});

	// เพื่อใช้ทำ page-redirect เพื่อเก็บข้อมูลต่อไป
	// เช็คเฉพาะ tag <a> ที่มี rel="nofollow" และใส่ก่อนที่จะ redirect ให้ encode-url ก่อน
	//	$('a[rel="nofollow"]').each(function(){
	//		alert('URL');
	//		var link = $(this).attr('href');
	//		var redi_href= window.location.protocol+'//'+window.location.hostname+'/l/'+link; // encodeURIComponent  คือการ endoce(url)
	//		$(this).attr('href', redi_href);
	//	});
	$(document).on('click', 'a[rel="nofollow"]', function(){
		var url = window.location.protocol+'//'+window.location.host+'/l/';
		var link = $(this).attr('href');
		
		//if(link.search(window.location.protocol+'//'))
		if(link.search(/^(http|https|ftp):\/\//))
		{
			link = window.location.protocol+'//'+link;
		}
		link = link.replace(url, '');
		link = link.replace(/\/+$/, '');
		link = link.replace(/(\/+)\?/, '?');
		link = link.replace(/facebook\.com\/#!\/pages/, 'facebook.com/pages');
		var redi_href= url+link; // encodeURIComponent  คือการ endoce(url) 
		$(this).attr('href', redi_href);
	});
	$(document).on('mouseover, mouseout', 'a[rel="nofollow"]', function() {
		var url = window.location.protocol+'//'+window.location.host+'/l/';
		var link = $(this).attr('href');
		//  if(link.search(window.location.protocol+'//'))
		if(link.search(/^(http|https|ftp):\/\//))
		{
			link = window.location.protocol+'//'+link;
		}
		link = link.replace(url, '');
		$(this).attr('href', link);
	});


	// redirect กลับมาหน้าเดิมทุกครั้งหลังจากทำการ Login/Logout เสร็จ
	$('#login-btn,#login-btn-fixed').on('click',$.login.beforeDo);
	$('#logout-btn').on('click',$.logout.afterDo);
	


});
	

	


/*facebook share topic count func*/
function processFacebookShareCount (share_url) {
		
	// Get Number of Facebook Shares
	$.getJSON('http://graph.facebook.com/fql?q=SELECT total_count FROM link_stat WHERE url="'+share_url+'"' ,
		function(result) {
			fb_share_count = 0;
			if (result.data[0].total_count != undefined) {
				fb_share_count = result.data[0].total_count;
			}
			setFacebookShareCount(fb_share_count);
		});


	return true;
}
	
function setFacebookShareCount (num) {
	$('#fb-count').html(num);
}

/* 
	 * แจ้งข้อความเตือน สำหรับ กรณีที่ login อยู่ในระบบแล้ว โดน เก็บ !!
	 * last update ???????
	 **/
function validation_error(rs)
{
	if(rs.reload == true)
	{
		window.location.reload();
		return false;
	}	
	
	if(rs.error == true)
	{
		$('.lightbox-hide.remove.ui-dialog-content').remove();
		$('.ui-widget-overlay').remove();
		//หากเป็นต้องการ trust user
		if(rs.need_trust_user == '1')
		{
			var otp_div	=	'<div id="otp_dialog">'
			+ '<p class="">' + rs.error_message + '</p>'
			//				+ '<div class="button-container">'
			//				+ '<a href="javascript:void(0);" class="button normal-butt otp-submit">'
			//				+ '<span><em>ตกลง</em></span></a>'
			//				+ '</div>'
			+ '</div>';
			$('div:last').after(otp_div);
			$( "#otp_dialog" ).dialog({
				title : 'แจ้งเตือน',
				resizable: false,
				width: 500,
				modal: true,
				close: function()
				{
					$('#otp_dialog').dialog('destroy').remove();	
				}
			});
			return false;
		}
			
		/* case แจ้งเตือนข้อหา */
		if(rs.member_notify == 1)
		{
			$.errorNotice.dialog(rs.error_message,{
				title : 'แจ้งเตือน',
				btn_close:'รับทราบ',
				action : 'member_notify',
				url : '/login/l_acknowledge',
				validation_user : true,
				param_id :rs.id,
				width : 'auto'

			});
			return false;
		}

		$.errorNotice.dialog(rs.error_message,{
			title : 'แจ้งเตือน',
			width : 'auto'
		});
		return false;
	}	
}
/*
 * Create By KonG
 * last update ???????
 **/
function ui_authen($obj)
{
	$('.pt-form-comment').bbcode();
	$('.pt-form-sub-comment').bbcode();

	/* prepend ปุ่ม preview ที่ commentหลัก หลัง oauth เสร็จแล้ว */

	//if($('.button-container.main-comment').find('#btn_comment_preview').hasClass('normal-butt') == false)
	if($('#btn_edit_comment').length <=0&& $('#btn_comment_preview').length <=0)
	{
		$('.button-container.main-comment').prepend('<a id="btn_comment_preview" href="javascript:void(0);"class="button normal-butt"><span><em>Preview</em></span></a>&nbsp;');
	}
	/* prepend ปุ่ม preview ที่ commentตอบกลับ หลัง oauth เสร็จแล้ว */

	//if($('.button-container.sub-comment').find('#btn_reply_preview').hasClass('normal-butt') == false)
	if($('#btn_edit_reply').length <=0 && $('#btn_reply_preview').length <=0)
	{
		$('.button-container.sub-comment').prepend('<a id="btn_reply_preview" href="javascript:void(0);"class="button normal-butt"><span><em>Preview</em></span></a>&nbsp;');
	}
}
	
/*
 * Create By KonG
 * last update ???????
 **/
function display_avatar($obj)
{
	//console.log($obj);
	if($('#btn_comment_preview').length <= 0 && $('#btn_edit_comment').length <=0)
	{
		$('.display-post-action.main-comment').find('.button-container.main-comment').prepend('<a class="button normal-butt" href="javascript:void(0);" id="btn_comment_preview"><span><em>Preview</em></span></a>');
	}
		
	$('.pt-display-avatar').html(
		'<a href="'+$obj.link+'" class="avatarlink"  target="_blank" >'
		+'<img src="'+$obj.avatar.medium+'" />'
		+'</a>'
		+'<div class="display-post-avatar-inner pt-avatar-inner no-timestamp">'
		+'<a  target="_blank" class="display-post-name" href="'+$obj.link+'">'+$obj.name+'</a>\n'
		+'</div>'
		);
	var user_meta = $obj.user_meta;
	if(user_meta != undefined)
	{
		if(user_meta.icon.type == 'smile')
		{
			$('.pt-avatar-inner').append('<a title="สมาชิกอย่างเป็นทางการ" target="_blank" class="icon-memberbadge-mini icon-memberbadge-smile" href="'+$obj.link+'"></a>\n');
		}
		else if(user_meta.icon.type == 'mobile')
		{
			$('.pt-avatar-inner').append('<a title="สมาชิกแบบมือถือ" target="_blank" class="icon-memberbadge-mini icon-memberbadge-mobile" href="'+$obj.link+'"></a>\n');
		}
		else if(user_meta.icon.type =='scientist')
		{
			$('.pt-avatar-inner').append('<a title="สมาชิกแบบ..." target="_blank" class="icon-memberbadge-mini icon-memberbadge-aisbrand" href="'+$obj.link+'"></a>\n');
		}
		else if(user_meta.icon.type =='organization')
		{
			$('.pt-avatar-inner').append('<a title="สมาชิกแบบองค์กร" target="_blank" class="icon-memberbadge-mini icon-memberbadge-organization" href="'+$obj.link+'"></a>\n');
		}
		if(user_meta.bloggang!= undefined)
		{
			$('.pt-avatar-inner').append('<a title="BlogGang" class="icon-memberbadge-mini icon-memberbadge-bloggang" href="'+user_meta.bloggang.link+'"></a>\n');
		}
		//console.log(user_meta.facebok);
		if(user_meta.facebook != undefined)
		{
			$('.pt-avatar-inner').append('<a class="icon-3rdparty-mini icon-3rdparty-fb" href="javascript:void(0);"></a>\n');
		}
	}


}


/* tong edit */


(function($){
	$.logout = {};
	$.logout.afterDo = function(event)
	{
		event.preventDefault();
		var cur_url = window.location.href;	
		window.location = '/logout?redirect=' + Base64.encode(cur_url);
	}
	
	$.login = {};
	$.login.beforeDo	=	function(event)
	{
		event.preventDefault();
		// get current url
		var cur_url = window.location.pathname;
		if(cur_url != '/login')
		{
			window.location = '/login?redirect=' + Base64.encode(cur_url);
		}
		
	}
})(jQuery);


// Controll Ajax Queue
var ajaxSending = false;
$.ajaxSetup({
	beforeSend: function(){
		ajaxSending	=	true;
	},
	complete: function(){
		// Handle the complete event
		ajaxSending	=	false;
	}
});
/* End: tong edit */
(function($){
	
	$.fn.authentication = function(options,callback){
		var $this = $(this);
		var settings = $.extend({},$.fn.authentication.defaults,options);
	
		//		callback = 'undefined' != typeof(callback) ? callback : function() {
		//			return false;
		//		};

		$this.openLogin(settings);
		$this.submitLogin(settings,callback);
		
	/*
 * ex.
 *
$(this).authentication({
			elSubmit:'#user_login_btn',
			urlSubmit : '/login/l_authen'
		},function(param){
			alert('zzzzzzzzzzzzzzz');
			console.log(param);

});
 **/
		
	};
	$.fn.submitLogin = function (options,callback)
	{
		
		$(document).on('click',options.elSubmit,function(){
			$.ajax({
				dataType : 'json',
				url : options.urlSubmit,
				type : 'POST',
				data : $('#login_lb_form').serialize(),
				success : function(rs){
					//					console.log(rs);
					if(rs != null &&rs.success == 1)
					{
						if(typeof callback == 'function'){
							callback.call(this, rs);
						}
					}
				}
			});
		});
	}
	
	$.fn.openLogin = function (options){
		
		
		/* create div */
		$('.footer').after('<div class="lightbox-hide ' + options.elClass + '"></div>');
		$.ajax({
			//			dataType : 'json',
			type: "POST",
			url : '/login/l_login',
			data: {
				
			},
			success : function(rs){
				$('.'+options.elClass).dialog({
					width: 500,
					title: options.elTitle,
					modal: true,
					resizable: false,
					draggable: false,
					close: function()
					{
						$('.'+options.elClass).dialog('destroy').remove();
						
					}
				}).append(rs);
			}
		});
		

		
	}

	/* Defaults Function */
	$.fn.authentication.defaults = {
		elClass : 'login_lb_process',
		elTitle : 'ใส่ด้วย',
		elSubmit : '',
		urlSubmit : 'ZzzZzzZzz'
	};
	
	$.headerScroll ={};
	
	$.headerScroll.fixed = function(){
		var timeout = null;
		if ($.browser.msie  && parseInt($.browser.version, 10) == 7) {
			return false;
		}
		
		//		console.log(parseInt($.browser.version));
		
		
		//fluid-width
		//console.log(window.location.pathname.split("/"));
		var fixedWidth = window.location.pathname.split("/");
		
		if(fixedWidth[1] != '' && (fixedWidth[1] == 'forum' || fixedWidth[1] == 'club' || fixedWidth[1] == 'tag' ) )
		{
			$('.fluid-width').addClass('max');
			if(fixedWidth[2] != '' && fixedWidth[2] == 'new_topic')
			{
				$('.fluid-width').removeClass('max');
			}
		}
		
		
		//console.log( window.location.pathname);
		
		//$(document).on('scroll',function(e){
		//$(window).on("scroll", function(e) {
		$(window).scroll(function(e) {
			//console.log('12121212');
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				$("#panel1").hide();
				$("#panel2").hide();
			
				$('.profile-menu').removeClass('has-submenu');
				$('.menu-bar').hide();
			
				var hh = Math.round($('.header-outer').offset().top);
			
				if($('.expand-submenu.menu-one').is(':visible'))
				{
					hh = Math.round($('.end-menu-one').offset().top)-1;		
				}
			
				if($('.expand-submenu.menu-two').is(':visible'))
				{
					hh = Math.round($('.end-menu-two').offset().top)-1;		
				}
			
			
			
				var st = $(this).scrollTop();	
				//console.log(st+":"+hh);
				if (st >= hh && $('.fixed-header').hasClass('s-down') == false )
				{
					//console.log('down');
			
					$('.fixed-header').slideDown()
					.addClass('s-down')
					.removeClass('s-up');
			
					$('#main-body-content').removeClass('up').addClass('down');
		
					return false;
				}
		
				if(st < hh && $('.fixed-header').hasClass('s-down') == true )
				{
					//console.log('up');
			
					$('.fixed-header').hide()
					.addClass('s-up')
					.removeClass('s-down');
			
					$('#main-body-content').removeClass('down').addClass('up');
			
					return false;
			
				}
			}, 200);
			
				
		});
	}

	$.notification = {};
	$.notification.menuMsg = function (mid)
	{
		//		console.log(mid);
		if(mid != ''){
			var pm_url = window.location.pathname;
			if(pm_url != '/message')
			{ 
				get_notification_pm(mid); 
			}
			else
			{ 
				setTimeout(function() {
					get_notification_pm(mid);
				},5000);
			}
		}
		
	//		if(mid != ''){
	//			setTimeout(function() {
	//			
	//				$.ajax({
	//					type: "GET",
	//					url: "/message/private_message/get_notification?mid="+mid,
	//					dataType : 'json',
	//					//				data: {
	//					//					mid:mid
	//					//				},
	//					cache: false,
	//					success: function(rs){
	//						//console.log(rs);
	//						if(rs.msg != null && rs.msg != 0){
	//							$('.total-msg').find('.icon.icon-email').addClass('new').html('<em>'+rs.msg+'</em>');
	//						}
	//					}
	//				});
	//
	//
	//				$('.total-msg').click(function(e){			
	//					e.stopPropagation();
	//
	//					//				$('#menu-msg').toggle();
	//					//				$('#menu-bar').css('display','none');
	//					//				$('#menu-brand-bar').css('display','none');
	//					//				//alert($(this).attr('id'));
	//					//				if($(this).find('.icon.icon-email').hasClass('new') == true)
	//					//				{
	//					$('.total-msg').find('.icon.icon-email').removeClass('new');
	//					$.ajax({
	//						type: "POST",
	//						url: "/message/private_message/update_notification",
	//						dataType : 'json',
	//						data: {
	//							mid:mid
	//						},
	//						success: function(rs){
	//							//console.log(rs);
	//							if(rs.status == 'ok'){
	//								$('.total-msg').find('.icon.icon-email').html('');
	//								window.location.href = '/message';
	//							}
	//
	//						}
	//					});
	//				//				}
	//				});
	//			},5000);
	//		}
	}
	$.notification.defaults = {
		
	}
	
	
	$.message = {};
	
	$.message.defaults = {
		sending : false
	}
	
	$.message.youtube_thumbnail = function()
	{
		/*
		 * ------------------------------------------------------------------------------
		 *	Start: Youtube Thumbnail Render after click. [By Kiang @21/05/2556 12:00]
		 * ------------------------------------------------------------------------------
		 */
		$(document).on('click','.youtube-thumbnail a',function(){
			// set parrent.
			var par = $(this).parent('.youtube-thumbnail');
			// get "video_id".
			var video_id = par.find('.video_id').data('video-id');
			// get video resolution.
			var vdo = par.find('.video_preview');
			var vdo_height = vdo.attr('height');
			var vdo_width = vdo.attr('width');
			// remove "play_btn".
			par.find('.play_btn').remove();
			// render youtube iframe.
			var oldIE = ( navigator.userAgent.match(/msie [567]/i) );
			if( oldIE )
			{
				par.html('<object width="'+vdo_width+'" height="'+vdo_height+'" >'
					+'<param name="movie" value="http://www.youtube.com/v/'+video_id+'?autoplay=1&amp;version=3" >'
					+'</param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param>'
					+'<embed src="http://www.youtube.com/v/'+video_id+'?autoplay=1&amp;version=3" type="application/x-shockwave-flash" '
					+'width="'+vdo_width+'" height="'+vdo_height+'" allowscriptaccess="always" allowfullscreen="true"></embed>'
					+'</object>');
			}
			else
			{
				par.html('<iframe type="text/html" width="'+vdo_width+'" height="'+vdo_height+'"'
					+'src="http://www.youtube.com/embed/'+video_id+'?autoplay=1"'
					+'frameborder="0">'
					+'</iframe>');
			}
			return false;
		});
	/*
		 * ------------------------------------------------------------------------------
		 *		End: Youtube Thumbnail Render after click. [By Kiang @21/05/2556 12:00]
		 * ------------------------------------------------------------------------------
		 */
	}
	
	$.message.openLightbox = function(){		
		
		$(document).on('click','.send_message',function(){ 
			//			alert('zz');
			if($.message.defaults.sending == false)
			{ 
				$.message.defaults.sending = true;
				$(document.body).data('obj',
				{
					'objSend': $(this)
				});

				$(this).force_login({
					callback : open_form_message,
					auto_click : false
				});		
			}
		});
		
	//		$(document).on('click','.send_message',function(){
	//			alert('zz');
	//			$(document.body).data('obj',
	//			{
	//				'objSend': $(this)
	//			});
	//
	//			$(this).force_login({
	//				callback : open_form_message,
	//				auto_click : false
	//			});
	//
	//
	//
	//		});
	}
	
	function previewClicked()
	{
		//		console.log('preview clicked !');
		//			alert('preview');
		set_json($(this));
		var parents = $(this).parents('#div_message');
		var action = parents.find('#form_msg');
		var textarea_msg = parents.find('#textarea_msg');
		var preview = parents.find('#preview_msg');

		$('.loading-inline').remove();
		//		action.append('<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
		parents.find('#cancel_create_msg').after('<span class="loading-inline focus-txt">&nbsp;&nbsp;กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
		//button.hide();
		$.ajax({
			type: "POST",
			url: "/message/private_message/render_bbcode_ajax",
			dataType : 'json',
			data: {
				msg: $.data(document.body).msg
			},
			success: function(rs){ 
				//					console.log(rs);
				textarea_msg.hide();
				preview.show();
				$('.loading-inline').remove();
				if(rs.detail == '')
				{
					rs.detail = '-';
				}
				preview.find('#preview_detail .plain-value').html(rs.detail);


			//				$(document).on('click', '.spoil-btn',function(){
			//					$(this).html('[Spoil] คลิกเพื่อดูข้อความที่ซ่อนไว้').toggleClass('spoil_hide').next().toggle();
			//					$('.spoil_hide').html('[Spoil] คลิกเพื่อซ่อนข้อความ');
			//				});
			}
		});
	}
	
	
	$.message.previewMessage = function(){			
		//		console.log('PreviewMessage working');
		$('#btn_msg_preview').on('click',previewClicked);
	}
	
	$.message.editMessage = function(){
		$(document).on('click','#btn_edit_msg',function(){
			//			alert('edit');
			//			set_json($(this));
			var parents = $(this).parents('#div_message');
			var action = parents.find('#form_msg');
			var textarea_msg = parents.find('#textarea_msg');
			var preview = parents.find('#preview_msg');
			//var button = parents.find('#btn_preview_section');
			
			//			action.append('<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
			parents.find('#create_msg').after('<span class="loading-inline focus-txt">&nbsp;&nbsp;กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
			//var loading = parents.find('.loading-inline');
			//			return false;
					
			textarea_msg.show();
			//button.show();
			parents.find('#error_subject').html('');
			parents.find('#error_detail').html('');
			$('.loading-inline').remove();
			preview.hide();
			//			parents.find('.jqEasyCounterMsg').hide();
			parents.find('.error-txt').html('');
		//			$.message.previewMessage();
		});
	}
	
	$.message.createMessage = function(){
		$(document).on('click','#create_msg',function(){
			//			alert('create');
			set_json($(this));
			var cnt_error = 0;
			var parent_msg = $(this).parents('#div_message');
			//console.log($.data(document.body)); return false;
			var json = $.data(document.body).msg;
			//					console.log(json.subject_raw);
			//			$('.jqEasyCounterMsg').css('display', 'none');
			
			if($.data(document.body).reciever.mid.length == 0 && $('#recievers').val() != '')
			{
				cnt_error = cnt_error+1;
				parent_msg.find('#error_reciever').html('กรุณากรอกชื่อผู้รับ ให้ถูกต้อง');
			}
			else if($.data(document.body).reciever.mid.length == 0)
			{
				cnt_error = cnt_error+1;
				parent_msg.find('#error_reciever').html('กรุณากรอกชื่อผู้รับ');
			}
			else
			{
				cnt_error = cnt_error;
				parent_msg.find('#error_reciever').html('');
			}
			
			if(json.subject_raw == '')
			{
				//console.log('ss');
				cnt_error = cnt_error+1;
				parent_msg.find('#error_subject').html('กรุณากรอกชื่อเรื่อง');
			}
			else
			{
				cnt_error = cnt_error;
				parent_msg.find('#error_subject').html('');
			}
			
			if(json.detail_raw == '')
			{
				cnt_error = cnt_error+1;
				parent_msg.find('#error_detail').html('กรุณากรอกข้อความ');
			}
			else
			{
				cnt_error = cnt_error;
				parent_msg.find('#error_detail').html('');
			}
			
			if(cnt_error == 0)
			{
				parent_msg.find('.error-txt').html('');
				$.ajax({
					type: "POST",
					url: "/message/private_message/create_message",
					dataType : 'json',
					data: {
						msg: $.data(document.body).msg,
						reciever: $.data(document.body).reciever
					},
					success: function(rs){
						//console.log(rs);
						//alert(result);
						//						if(rs.error == true)
						//						{
						//							$.errorNotice.dialog(rs.error_message,{
						//								title : 'แจ้งเตือน',
						//								//width : 'auto',
						//								btn_close:'ตกลง'
						//							});
						//							return false;
						//						}
						validation_error(rs);
						
						if(rs.result == "true")
						{
							//						$('#message').dialog("destroy");
							$('#div_message').removeClass('callback-status error-txt').html('ส่งข้อความเรียบร้อยแล้ว<div class="button-container"><a href="javascript:void(0);" id="cancel_create_msg" class="button normal-butt"><span><em>ปิดหน้าต่างนี้</em></span></a></div>');
						}
					//						else
					//						{
					//							$('#div_message').addClass('callback-status error-txt').html('กรุณาทำการล็อกอินก่อน<div class="button-container"><a href="javascript:void(0);" id="cancel_create_msg" class="button notgo-butt"><span><em>ปิดหน้าต่างนี้</em></span></a></div>');
					//						}
					} // endif success function
				});
			}
		//alert('create_msg');
		});
	}
	
	$.message.closeLightbox = function(){
		$(document).on('click', '#cancel_create_msg', function(){
			$('#message').dialog('destory');
			$('#message').remove();
			$('#links_lb_process').remove();
		});
	}
        
    // search box is under testing
    
    $.searchbox = {};
    $.searchbox.suggest = function(){
       
    // begin auto cmpl
    var term = "";
        
    $("#search-box").autocomplete({
        minLength: 0,
            source: function(request, response){
            if(request.term.length  !== 0)
            {
            $.ajax({
                type: "POST",
                dataType : 'json',
                url : '/search/es/search_tag',
                data : {
                q:$.trim(request.term)
                },
                success:function(rs) {
                    response(rs);
                }
                });
            term = request.term;
            }
            },
            focus: function (event, ui) {
            if(ui.item !== undefined)
            {
                $("#search-box").val(ui.item.label); 
            }
            return false;
            },
        select: function (event, ui) {
            var url = "";
            if(ui.item !== undefined)
            {
                url = "http://pantip.com/tag/"+ui.item.label;    
            }
            else
            {
                url = "http://search.pantip.com/ss?s=a&nms=1&q="+term+"&sa=Smart+Search";
            }
            
            $(location).attr('href',url);
            return false;
        }
    })
        .data("autocomplete")._renderMenu = function(ul, item)
        {
            var sig1 = '<div class="remark-txt" style="display: block; line-height: 1.45; padding: 0.2em 0.4em;">ค้นหากระทู้ที่มีคำว่า...</div><li><a class="ui-corner-all" style="border-bottom: 1px solid #262441;">'+term+'</a></li><li class="ui-menu-item remark-txt" style="display: block; line-height: 1.45; padding: 0.2em 0.4em;">ค้นหาแท็ก</li>';
            var sig2 = '<div class="remark-txt" style="display: block; line-height: 1.45; padding: 0.2em 0.4em;">ค้นหากระทู้ที่มีคำว่า...</div><li><a class="ui-corner-all" style="border-bottom: 1px solid #262441;">'+term+'</a></li>';
            if(item[0].value != false)
                {
                    $( ul ).append(sig1);
                }
            else
                {
                    $( ul ).append(sig2);
                }

            $.each( item, function( index, item ) {
                if(item.value != false)
                {
                    return $("<li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
                }
            });
        };
        
    $("#search-box-float").autocomplete({
        minLength: 0,
            source: function(request, response){
            if(request.term.length  !== 0)
            {
            $.ajax({
                type: "POST",
                dataType : 'json',
                url : '/search/es/search_tag',
                data : {
                q:$.trim(request.term)
                },
                success:function(rs) {
                response(rs);
                }
                });
            term = request.term;
            }
            },
            focus: function (event, ui) {
            if(ui.item !== undefined)
            {
                $("#search-box-float").val(ui.item.label); 
            }
            return false;
            },
        select: function (event, ui) {
            var url = "";
            if(ui.item !== undefined)
            {
                url = "http://pantip.com/tag/"+ui.item.label;    
            }
            else
            {
                url = "http://search.pantip.com/ss?s=a&nms=1&q="+term+"&sa=Smart+Search";
            }
            
            $(location).attr('href',url);
            return false;
        }
    })
        .data("autocomplete")._renderMenu = function(ul, item)
        {
            var sig1 = '<div class="remark-txt" style="display: block; line-height: 1.45; padding: 0.2em 0.4em;">ค้นหากระทู้ที่มีคำว่า...</div><li><a class="ui-corner-all" style="border-bottom: 1px solid #262441;">'+term+'</a></li><li class="ui-menu-item remark-txt" style="display: block; line-height: 1.45; padding: 0.2em 0.4em;">ค้นหาแท็ก</li>';
            var sig2 = '<div class="remark-txt" style="display: block; line-height: 1.45; padding: 0.2em 0.4em;">ค้นหากระทู้ที่มีคำว่า...</div><li><a class="ui-corner-all" style="border-bottom: 1px solid #262441;">'+term+'</a></li>';
            if(item[0].value != false)
                {
                    $( ul ).append(sig1);
                }
            else
                {
                    $( ul ).append(sig2);
                }
            $.each( item, function( index, item ) {
                if(item.value != false)
                {
                    return $("<li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
                }
            });
        };
    }
    // end search box
        
	function removeLable(mid)
	{
		$('#div_message').on('click','.remove-label',function(){
			$(this).parent().remove();
			var obj_json= {};
			var data  =$(document.body).data('reciever').mid;
			
			var id = $(this).attr('id').split('-');
			var removeArr = $.grep(data, function(value) {
				return value != id[1];
			});
			

			obj_json['mid'] =  removeArr;
			var before = $(document.body).data('reciever');
			var after = $.extend({},before,obj_json);
			$(document.body).data('reciever',after);
		//console.log($(document.body).data('reciever'));
		});
	}
	
	function setJsonMid($obj)
	{	
		var obj_json= {};
		var data = $(document.body).data('reciever').mid;
		
		var arr = $.makeArray(parseInt($obj.id));
		//console.log(arr);
		if(data.length == 0 )
		{
			//alert('x1');
			obj_json['mid'] = arr;
		}
		else
		{//alert('x2');
			obj_json['mid'] = $.merge(data, arr);
		}
		/* div label */
		var span = $("<span>").text($obj.name);
		var a = $("<a>").addClass("remove-label").attr({
			href: "javascript:void(0);",
			title: "Remove " + $obj.name,
			id : 'm-'+$obj.id
		}).text("x").appendTo(span);
		
		/* add follow to div*/
		span.insertBefore("#recievers");
		$("#recievers").delay(1).queue(function(){
			$(this).val('');
			$(this).dequeue();
		});
		
		var before = $(document.body).data('reciever');
		var after = $.extend({},before,obj_json);
		$(document.body).data('reciever',after);
	//console.log($(document.body).data('reciever'));
	}
	
	function msgAutocomplete(mid)
	{
		/* click focus input */
		$(document).on('click','#friends',function(){
			$('#recievers').focus();
		//alert('x1x1');
		});
		/* click outfocus input */
		$(document).on('focusout','#recievers',function(){
			$('#recievers').val('');
		});
		/* keypress input */
		var sizInput =1;

		var oneLetterWidth = 10;

		var minCharacters = 1;

		$(document).on('keyup','#recievers',function(){
			var v = $.trim($(this).val());
			var len  = v.length;
			
			if (len > minCharacters) {
				// increase width
				$(this).width(len * oneLetterWidth);
			} else {
				// restore minimal width;
				$(this).width(10);
			}
		});

		 
		var xhr;
		/* remove lable ด้วย mid */
		var removeId = removeLable(mid);
		$(document.body).data('reciever',{
			'mid':[]
		});
		if($('#hidden_mid').val() != 0 && $('#hidden_mid').length == 1)
		{
			
			
			/* set json */
			setJsonMid({
				'id':mid,
				'name':$('#hidden_name').val()
			});
		}
		if($("#recievers").length == 1)
		{
			$("#recievers").autocomplete({
				minLength: 0,
				delay : 500,
				source: function(request, response){
				
				if($.trim(request.term) != '')
				{
				//pass request to server
				xhr = $.ajax({
					type: "POST",
					dataType : 'json',
					url : '/message/private_message/get_autocomplete?t='+new Date().getTime(),
					data : {
					str:$.trim(request.term),
					//str:request.term,
					arr: $.data(document.body).reciever
					},
					success:function(rs) {
					response(rs);
					}
					});
				}else{
				//alert('xxx');
				$('.ui-autocomplete').hide();
				//ui-autocomplete ui-menu ui-widget ui-widget-content ui-corner-all
				}
				},
				select : function (e, ui) {
				//alert(ui.item.mid);
				/* set json label */

				setJsonMid({
					'id':ui.item.mid,
					'name':ui.item.value
					});
				/* set size input กลับเป็น 1 เมื่อมีการเลือก label*/
				$('#recievers').attr('size',sizInput);
				}
				})
			.data( "autocomplete" )._renderItem = function( ul, item )
			{
				return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append( "<a><img width='38' height='38' class='avatar' src='"+item.avatar+"' /><span class='avatar-name'>" + item.label + "</span></a>" )
				.appendTo( ul )
			};
			
		}
	}
	
	function set_json(obj)
	{
		var parent_msg = obj.parents('#form_msg');
		
		//alert('xx');
		if(parent_msg.length == 1)
		{
			var subject_raw = parent_msg.find('#subject').val();
			var detail_raw = parent_msg.find('#textarea_subject').val();
			if(parent_msg.find('#send_to').length == 1)
			{
				$(document.body).data('reciever',{
					'mid':[]
				});
				var id = $.makeArray(parent_msg.find('#send_to').val());
				$(document.body).data('reciever',
				{
					'mid': id
				});
			}
			$(document.body).data('msg',
			{
				//'reciever':parent_msg.find('#send_to').val(),
				'subject_raw': subject_raw,
				'detail_raw': detail_raw
			});
		}
		
	//console.log($(document.body).data('msg'));
	}
	
	function open_form_message()
	{
		
		//		console.log($(document.body).data('obj'));return false;
		
		var obj = $(document.body).data('obj').objSend;
		//console.log(obj);return false;
		
		var val = obj.attr('class'); /* mid */
		//		console.log(val.match(/\d+/).length);return false;
		val = val.match(/\d+/);
		if(val != null)
		{
			val = parseInt(val);
		}
		else
		{
			val = 0;
		}
		
		//console.log(val);return false;
		var msg_div = '<div id="message" class="lightbox-hide"></div>';
		//		console.log($('body div:last'));
		obj.append(msg_div);
		//return false;
		$.ajax({
			type: "POST",
			url: "/message/private_message/send_message",
			data: {
				send_to:val
			},
			//				data: "send_to="+val,
			success: function(result){
				//console.log(result);
				$('#message')
				.dialog({
					width: 800,
					title: 'ส่งข้อความ',
					modal: true,
					resizable: false,
					draggable: false,
					close: function()
					{
						$('#message').dialog('destory');
						$('#message').remove();
						$('#links_lb_process').remove();
					}
				})
				.html(result);
				$.message.previewMessage();
				$('#message').dialog('option','position','center');

				$('#preview_msg').hide();

				$('#textarea_subject').bbcode();
				//				$('.msg-lightbox').on('click',function(){
				//					var el_textarea = $(this).parents('.surround-box-light').next();
				//					console.log(el_textarea);
				//
				//					$.image_gallery.defaults.inputUploaded = el_textarea;
				//					$.image_gallery.init();
				//				});
				$('#subject').jqEasyCounter({
					'maxChars': 120,
					'maxCharsWarning': 120,
					'msgFontSize': '12px',
					'msgFontColor': '#A09DD5',
					'msgFontFamily': 'Arial',
					'msgTextAlign': 'left',
					'msgWarningColor': '#A09DD5',
					'msgAppendMethod': 'insertAfter'
				});
				
				$('#textarea_subject').jqEasyCounter({
					'maxChars': 10000,
					'maxCharsWarning': 10000,
					'msgFontSize': '12px',
					'msgFontColor': '#A09DD5',
					'msgFontFamily': 'Arial',
					'msgTextAlign': 'left',
					'msgWarningColor': '#A09DD5',
					'msgAppendMethod': 'insertAfter'
				});
			
				//				$('.jqEasyCounterMsg').each(function(index)
				//				{
				//					//console.log($(this).parent());
				//					$(this).appendTo($(this).parent());
				//				});
				
				/*  autocomplete  */
				msgAutocomplete(val);
				$.message.defaults.sending = false;
			}
		});		
	}
	
	function get_notification_pm(mid)
	{
		$.ajax({
			type: "GET",
			url: "/message/private_message/get_notification?mid="+mid,
			dataType : 'json',
			//				data: {
			//					mid:mid
			//				},
			cache: false,
			success: function(rs){
				//console.log(rs);
				if(rs.msg != null && rs.msg != 0){
					$('.total-msg').find('.icon.icon-email').addClass('new').html('<em>'+rs.msg+'</em>');
					$('#cnt_new_msg').html('('+rs.msg+')');
				}
			}
		});


		$('.total-msg').click(function(e){			
			e.stopPropagation();

			//				$('#menu-msg').toggle();
			//				$('#menu-bar').css('display','none');
			//				$('#menu-brand-bar').css('display','none');
			//				//alert($(this).attr('id'));
			//				if($(this).find('.icon.icon-email').hasClass('new') == true)
			//				{
			$('.total-msg').find('.icon.icon-email').removeClass('new');
			$.ajax({
				type: "POST",
				url: "/message/private_message/update_notification",
				dataType : 'json',
				data: {
					mid:mid
				},
				success: function(rs){
					//console.log(rs);
					if(rs.status == 'ok'){
						$('.total-msg').find('.icon.icon-email').html('');
						window.location.href = '/message';
					}

				}
			});
		//				}
		});
	}
	
})(jQuery);



/* jQuery jqEasyCharCounter plugin
 * Examples and documentation at: http://www.jqeasy.com/
 * Version: 1.0 (05/07/2010)
 * No license. Use it however you want. Just keep this notice included.
 * Requires: jQuery v1.3+
 */
(function($){
	$.fn.extend({
		jqEasyCounter:function(b){ 
			return this.each(function(){

				var f=$(this),e=$.extend({
					maxChars:100,
					maxCharsWarning:80,
					msgFontSize:"12px",
					msgFontColor:"#000000",
					msgFontFamily:"Arial",
					msgTextAlign:"right",
					msgWarningColor:"#F00",
					msgAppendMethod:"insertAfter"
				},b);
				if(e.maxChars<=0){
					return
				}
				var d=$('<span class="jqEasyCounterMsg">&nbsp;</span>');
				var c={
					//					"display" : "none",
					"font-size":e.msgFontSize,
					//"font-family":e.msgFontFamily,
					color:e.msgFontColor,
					"text-align":e.msgTextAlign,
					//width:f.width(),
					opacity:0
				};

				d.css(c);
				d[e.msgAppendMethod](f);
				f.bind("keydown keyup keypress",g).bind("focus paste",function(){					
					setTimeout(g,10)
				}).bind("focusout",function(){
					d
					.stop()
					.fadeTo("fast",0)
					//					.css('display','none');
					return false
				});
				function g(){
					var i=f.val(),h=i.length;
					if(h>=e.maxChars){
						i=i.substring(0,e.maxChars)
					}
					if(h>e.maxChars){
						var j=f.scrollTop();
						f.val(i.substring(0,e.maxChars));
						f.scrollTop(j)
					}
					if(h>=e.maxCharsWarning){
						d.css({
							color:e.msgWarningColor
						})
					}else{
						d.css({
							color:e.msgFontColor
						})
					}
					d.html("&nbsp;&nbsp;*พิมพ์ข้อความได้ไม่เกิน "+e.maxChars+' ตัวอักษร ('+f.val().length+"/"+e.maxChars+')');
					d.stop().fadeTo("fast",1)
				}

			})
		}
	})
})(jQuery);

/*
 *-----------------------------------------------------------------
 * Begin : Plugin Confirm Lightbox
 *-----------------------------------------------------------------
 * @author : Tong
 * @version : 0.5 beta
 * @file-request : lastest_jquery_ui.js, style.css, lastest_jquery.js
 * @return : void
 * @description : this plugin use for create a lightbox for a element's selector
 * @param {String} : confirm_title ( the title's text on the top lightbox )
 * @param {String} : confirm_desc ( the text description in lightbox )
 * @param {function} : success_callback ( when user clicked on OK button and then call the function and return element)
 * @param {int} : witdh ( The lightbox's width )
 * @warning :  *** this plugin CANNOT changing method ***
 * @example :
 */
(function($){
	var $this;

	var function_callback;
	// OK button
	$('#confirm_submit').live('click',function(){
		//console.log('confirm_submit click !!');


		$('#confirm_lb').dialog( "destroy" );
		//console.log('b');
		$('#confirm_lb').confirm_lightbox('destroy');

		$('#confirm_lb').remove();
		//console.log('c');
		finish = 1;

		var callback = $.Callbacks();
		callback.add(function_callback);
		callback.fire($this);

	//console.log('d');
	})
	var methods = {
		init : function ( options ) {
			//console.log('init confirm_ligthbox');
			var settings = $.extend( {
				ok_btn_txt : 'ตกลง',
				cancel_btn_txt : 'ยกเลิก',
				confirm_title : 'ยืนยันการตัดสินใจ',
				confirm_desc : 'คุณแน่ใจว่าจะลบ ?',
				beforeConfirmDesc : '',
				ok_btn_class : 'normal-butt',
				success_callback : function(element) {
				//console.log ('confirm submit');
				},
				bubble_event : false,
				get_confirm_desc : false,
				selector_confirm_desc : '',
				width: 220
			} , options);
			//return this.each(function(){
			this.live('click keydown',function(e){
				//console.log('element click !');
				if(e.type == 'click' || (e.type == 'keydown' && e.which == 13))
				{
					//console.log('plugin working');
					if(settings.bubble_event == false)
					{
						e.preventDefault();
						e.stopPropagation();
					}
					$this = $(this);
					var confirm_box_html = '<div id="confirm_lb" class="lightbox-hide">'
					+ '<p class="desc">'
					+ '</p>'
					+ '<div class="button-container">'
					+ '<a href="javascript:void(0);" id="confirm_submit" class="button '+settings.ok_btn_class+'"><span><em>' + settings.ok_btn_txt + '</em></span></a> '
					+ '<a href="javascript:void(0);" id="confirm_cancel" class="close_lightbox button notgo-butt"><span><em>' + settings.cancel_btn_txt + '</em></span></a>'
					+ '</div>'
					+ '</div>';
					$('div:last').after(confirm_box_html);

					var selector_return = $(this);
					var selector_confirm = $('#confirm_lb');
					function_callback = settings.success_callback;

					if(settings.beforeConfirmDesc != '')
					{
						settings.confirm_desc = settings.beforeConfirmDesc;
					}
					
					if(settings.get_confirm_desc == true)
					{
						var title = $(this).data('title-desc');
						var format_replace = settings.replace_confirm_desc.replace("{replace}",title);
						
						settings.confirm_desc = format_replace;
					}

					selector_confirm
					.dialog({
						width: settings.width,
						title: settings.confirm_title,
						modal: true,
						resizable: false,
						draggable: false,
						close: function()
						{
							selector_confirm.dialog( "destroy" ).confirm_lightbox('destroy');
							selector_confirm.remove();
						}
					})
					.find('p.desc')
					.html(settings.confirm_desc);


					// Cancel
					$('#confirm_cancel').live('click',function(){
						////console.log('cancel');
						selector_confirm.dialog( "destroy" ).confirm_lightbox('destroy');
						selector_confirm.remove();
					});
				} // end if click or keydown
			}); // End thie live click
			return this;
		//			})


		} // End init
		,
		destroy : function() {
			this.unbind('.confirm_lightbox');
		}
	};


	$.fn.confirm_lightbox = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
	};



})(jQuery);


/* jQuery bbcode plugin
 *
 */
(function($){
	$.fn.bbcode	=	function() {
		/*
		 * chk สำหรับเมื่อคลิกที่ textarea แล้วเช็คว่า แอด bbcode tab เข้าไปหรือยัง
		 */

		var el		=	this;
		var id_el	=	this.attr('id');
		var chk		=	this.prev().hasClass('bb-toolbar');
		if(chk == false)
		{
			var btn	=   {
				'<span  id="upload_image" class="icon-toolbar icon-photo msg-lightbox" title="ใส่รูปประกอบ"></span>' : 'image'
				,
				'<span class="icon-toolbar icon-video media-detail icon-media-tool-lightbox" title="ใส่คลิปวิดีโอ สไลด์ หรือเอกสาร"></span>' : 'media'
				,
				'<span class="icon-toolbar icon-map map-detail icon-media-tool-lightbox" title="ใส่แผนที่"></span>' : 'map'
				,
				'<span id="emo" class="icon-toolbar icon-emoticon icon-media-tool-lightbox" title="Pantip Toy"></span>' : 'emoticon'
				,
				'space1' : '<div class="toolbar-blank"></div>'
				,
				'<span class="icon-toolbar icon-bold" title="ตัวหนา"></span>' : 'bold'
				,
				'<span class="icon-toolbar icon-italic" title="ตัวเอียง"></span>' : 'italics'
				,
				'<span class="icon-toolbar icon-underline" title="ขีดเส้นใต้"></span>' : 'underline'
				,
				'<span class="icon-toolbar icon-strike" title="ขีดฆ่า"></span>' : 'strike-through'
				,
				'space2' : '<div class="toolbar-blank"></div>'
				,
				'<span class="icon-toolbar icon-alignleft" title="ชิดซ้าย"></span>' : 'left'
				,
				'<span class="icon-toolbar icon-aligncenter" title="กึ่งกลาง"></span>' : 'center'
				,
				'<span class="icon-toolbar icon-alignright" title="ชิดขวา"></span>' : 'right'
				,
				'space3' : '<div class="toolbar-blank"></div>'
				,
				'<span class="icon-toolbar icon-hyperlink" title="ลิงก์"></span>' : 'link'
				,
				'<span class="icon-toolbar icon-hr" title="เส้นคั่น"></span>' : 'hr'
				,
				'<span class="icon-toolbar icon-superscript" title="ตัวยก"></span>' : 'sup'
				,
				'<span class="icon-toolbar icon-subscript" title="ตัวห้อย"></span>' : 'sub'
				,
				'space4' : '<div class="toolbar-blank"></div>'
				,
				'<span class="icon-toolbar icon-code" title="ใส่โค้ด"></span>' : 'code'
				,
				'<span class="icon-toolbar icon-spoil" title="สปอยล์"></span>' : 'spoil'
			};
			var tag_insert	=	{
				'0' : ''
				,
				'1' : ''
				,
				'2' : ''
				,
				'3' : ''
				,
				'4' : ''
				,
				'5' : '[b],[/b]'
				,
				'6' : '[i],[/i]'
				,
				'7' : '[u],[/u]'
				,
				'8' : '[s],[/s]'
				,
				'9' : ''
				,
				'10' : '[left],[/left]'
				,
				'11' : '[center],[/center]'
				,
				'12' : '[right],[/right]'
				,
				'13' : ''
				,
				'14' : '[url],[/url]'
				,
				'15' : '[hr],'
				,
				'16' : '[sup],[/sup]'
				,
				'17' : '[sub],[/sub]'
				,
				'18' : ''
				,
				'19' : '[code],[/code]'
				,
				'20' : '[spoil],[/spoil]'
			};
			var div_bbcode_btn_open	=	'<div class="surround-box-light bb-toolbar overflowhidden ' + id_el + '">';
			var div_bbcode_btn_close = '</div>';
			var div_bbcode = '';
			var implode_btn	=	'';
			$.each(btn, function(index, value){
				if(index.search('space') != -1)
				{
					implode_btn +=  value;
				}
				else
				{
					implode_btn += '<a href="javascript:void(0);" class="toolbar-icon bbcode ' + value + '-txt">' + index + '</a>';
				}
			});
			/* implode all div */
			div_bbcode += div_bbcode_btn_open + implode_btn + div_bbcode_btn_close;

			/* create btn bbcode */
			$(div_bbcode).insertBefore(el);

			/* when user click btn bbcode , then insert bbcode tag */
			$('.bbcode').live('click',function(){
				/* check สำหรับว่าถ้ามีการใช้ ฟังก์ชั่นมากกว่า 1 input,textarea ให้ทำงานที่ใดที่เดียว */
				if($(this).parent().next().attr('id') == id_el)
				{
					var index = $(this).index();
					var tag = tag_insert[index].split(',');
					var open_tag = tag[0];
					var close_tag = tag[1];
					if(!close_tag)
					{
						close_tag = '';
					}
					var selection = {};
					if(!el.data("lastSelection"))
					{
						selection.start = 0;
						selection.end = 0;
					}
					else
					{
						selection = el.data("lastSelection");
					}
					el.focus();
					el.setSelection(selection.start, selection.end);
					el.surroundSelectedText(open_tag, close_tag, true);
					el.focus();
				}
			}); // click on icon
			
			// debug IE when user focus out ref -> http://stackoverflow.com/questions/5889127/insert-value-into-textarea-where-cursor-was
			el.bind("beforedeactivate", function() {
				saveSelection();
				el.unbind("focusout");
			});
			
			function saveSelection(){
				var test  = el.getSelection();
				el.data("lastSelection", el.getSelection());
			}

			el.focusout(saveSelection);
		// end : debug
		}
		else
		{
			el.prev().show();
		}
	}
})(jQuery);
/*
 * function disallowThai
 * ------------------------------------------------------------
 * description : สำหรับให้พิมพ์ได้เฉพาะ ตัวเลข ตัวอักษรภาษอังกฤษใหญ่เล็กและ _ เท่านั้น
 * ------------------------------------------------------------
 */
(function($){
	$.fn.disallowThai	=	function() {
		var is_ie	=	false;
		this.on('keypress',function(e){
			jQuery.each(jQuery.browser, function(i, val) {
				if(i == 'msie' && val == true)
				{
					is_ie	=	true;
				}
			});
			if(is_ie == true)
			{
				var allow_keycode	=	[9,8];
				if($.inArray(e.keyCode,allow_keycode) != -1)
				{
					return true;
				}
				else if(
					((e.which >= 97) && (e.which <= 122))
					||
					((e.which >= 65) && (e.which <= 90))
					||
					((e.which >= 48) && (e.which <= 57))
					||
					( e.which == 95)
					)
					{
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				var allow_keycode	=	[9,8,35,36,46,95];
				if($.inArray(e.keyCode,allow_keycode) != -1)
				{
					return true;
				}
				else if(
					((e.which >= 97) && (e.which <= 122))
					||
					((e.which >= 65) && (e.which <= 90))
					||
					((e.which >= 48) && (e.which <= 57))
					||
					( e.which == 95)
					)
					{
					return true;
				}
				else
				{
					return false;
				}
			}
		});
	}
})(jQuery);
/*
 Rangy Text Inputs, a cross-browser textarea and text input library plug-in for jQuery.

 Part of Rangy, a cross-browser JavaScript range and selection library
 http://code.google.com/p/rangy/

 Depends on jQuery 1.0 or later.

 Copyright 2010, Tim Down
 Licensed under the MIT license.
 Version: 0.1.205
 Build date: 5 November 2010
 */
(function($){
	function o(e,g){
		var a=typeof e[g];
		return a==="function"||!!(a=="object"&&e[g])||a=="unknown"
	}
	function p(e,g,a){
		if(g<0)g+=e.value.length;
		if(typeof a=="undefined")a=g;
		if(a<0)a+=e.value.length;
		return{
			start:g,
			end:a
		}
	}
	function k(){
		return typeof document.body=="object"&&document.body?document.body:document.getElementsByTagName("body")[0]
	}
	var i,h,q,l,r,s,t,u,m;
	$(document).ready(function(){
		function e(a,b){
			return function(){
				var c=this.jquery?this[0]:this,d=c.nodeName.toLowerCase();
				if(c.nodeType==
					1&&(d=="textarea"||d=="input"&&c.type=="text")){
					c=[c].concat(Array.prototype.slice.call(arguments));
					c=a.apply(this,c);
					if(!b)return c
				}
				if(b)return this
			}
		}
		var g=document.createElement("textarea");
		k().appendChild(g);
		if(typeof g.selectionStart!="undefined"&&typeof g.selectionEnd!="undefined"){
			i=function(a){
				return{
					start:a.selectionStart,
					end:a.selectionEnd,
					length:a.selectionEnd-a.selectionStart,
					text:a.value.slice(a.selectionStart,a.selectionEnd)
				}
			};

			h=function(a,b,c){
				b=p(a,b,c);
				a.selectionStart=b.start;
				a.selectionEnd=
				b.end
			};

			m=function(a,b){
				if(b)a.selectionEnd=a.selectionStart;else a.selectionStart=a.selectionEnd
			}
		}else if(o(g,"createTextRange")&&typeof document.selection=="object"&&document.selection&&o(document.selection,"createRange")){
			i=function(a){
				var b=0,c=0,d,f,j;
				if((j=document.selection.createRange())&&j.parentElement()==a){
					f=a.value.length;
					d=a.value.replace(/\r\n/g,"\n");
					c=a.createTextRange();
					c.moveToBookmark(j.getBookmark());
					j=a.createTextRange();
					j.collapse(false);
					if(c.compareEndPoints("StartToEnd",j)>
						-1)b=c=f;
					else{
						b=-c.moveStart("character",-f);
						b+=d.slice(0,b).split("\n").length-1;
						if(c.compareEndPoints("EndToEnd",j)>-1)c=f;
						else{
							c=-c.moveEnd("character",-f);
							c+=d.slice(0,c).split("\n").length-1
						}
					}
				}
				return{
					start:b,
					end:c,
					length:c-b,
					text:a.value.slice(b,c)
				}
			};

			h=function(a,b,c){
				b=p(a,b,c);
				c=a.createTextRange();
				var d=b.start-(a.value.slice(0,b.start).split("\r\n").length-1);
				c.collapse(true);
				if(b.start==b.end)c.move("character",d);
				else{
					c.moveEnd("character",b.end-(a.value.slice(0,b.end).split("\r\n").length-
						1));
					c.moveStart("character",d)
				}
				c.select()
			};

			m=function(a,b){
				var c=document.selection.createRange();
				c.collapse(b);
				c.select()
			}
		}else{
			k().removeChild(g);
			window.console&&window.console.log&&window.console.log("TextInputs module for Rangy not supported in your browser. Reason: No means of finding text input caret position");
			return
		}
		k().removeChild(g);
		l=function(a,b,c,d){
			var f;
			if(b!=c){
				f=a.value;
				a.value=f.slice(0,b)+f.slice(c)
			}
			d&&h(a,b,b)
		};

		q=function(a){
			var b=i(a);
			l(a,b.start,b.end,true)
		};

		u=function(a){
			var b=
			i(a),c;
			if(b.start!=b.end){
				c=a.value;
				a.value=c.slice(0,b.start)+c.slice(b.end)
			}
			h(a,b.start,b.start);
			return b.text
		};

		r=function(a,b,c,d){
			var f=a.value;
			a.value=f.slice(0,c)+b+f.slice(c);
			if(d){
				b=c+b.length;
				h(a,b,b)
			}
		};

		s=function(a,b){
			var c=i(a),d=a.value;
			a.value=d.slice(0,c.start)+b+d.slice(c.end);
			c=c.start+b.length;
			h(a,c,c)
		};

		t=function(a,b,c){
			var d=i(a),f=a.value;
			a.value=f.slice(0,d.start)+b+d.text+c+f.slice(d.end);
			b=d.start+b.length;
			h(a,b,b+d.length)
		};

		$.fn.extend({
			getSelection:e(i,false),
			setSelection:e(h,
				true),
			collapseSelection:e(m,true),
			deleteSelectedText:e(q,true),
			deleteText:e(l,true),
			extractSelectedText:e(u,false),
			insertText:e(r,true),
			replaceSelectedText:e(s,true),
			surroundSelectedText:e(t,true)
		})
	})
})(jQuery);

(function($){
	
	$.tooltip = {};
	
	$.tooltip.simple = function()
	{
		
		var delay = (function()
		{
			var timer = 0;
			return function(callback, ms)
			{
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
		})();
		delay(function(){
			/* for tooltip filterType*/
			var e_1 = $('.b-block-subtabbar-wrap.b-block-subtabbar-filter2');
			if(e_1.length>0)
			{
		
				var filterType = e_1.offset();
				$('#filter-type').css({ 
					top: filterType.top + 50, 
					left: filterType.left + 20
				}).show();
				/* for event click tooltip  */
				$(document).on('click','#close_filter_type_type',function(){
					$.get('/tooltip/filter_type', function(data) {
						$('#filter-type').remove();
					});
				});
			}
		
		
		
		
			/* for tooltip filterTags*/
			var e_2 = $('.b-block-tabbar.altcolor02');
			if(e_2.length>0)
			{
		
				var filterTags = e_2.offset();
				$('#filter-tags').css({ 
					top: filterTags.top-150 , 
					left: filterTags.left-100
				}).show();
		
				/* for event click tooltip  */
				$(document).on('click','#close_filter_type_tags',function(){
					$.get('/tooltip/filter_tags', function(data) {
						$('#filter-tags').remove();
					});
				});
			}
		
		
			var e_3 = $('.sidebar-content.section-club');
			if(e_3.length>0)
			{	
				var club = e_3.offset();
				
				$('#club-ccb').css({
					"top": club.top,
					"left": club.left-300
				}).show();
		
				/* for event click tooltip  */
				$(document).on('click','#close_club',function(){
					$.get('/tooltip/club', function(data) {
						$('#club-ccb').remove();
					});
				});
			}
		
		
			var e_4 = $('#noti-msg-menu');
			if(e_4.length>0)
			{
				var pm = e_4.offset();
				$('#message-pm').css({ 
					"top": pm.top+40 , 
					"left": pm.left-305
				}).show();
		
			
				/* for event click tooltip  */
				$(document).on('click','#close_pm',function(){
					$.get('/tooltip/message', function(data) {
						$('#message-pm').remove();
					});
				});
			}
		}, 3000 );
	}
	
	
	
	$.errorNotice	=	{};
	$.errorNotice.test = function ()
	{
		console.log('abc');
	}
	$.errorNotice.dialog = function (error_msg,opt)
	{
		
		error_msg = decodeURI(error_msg);
		error_msg = error_msg.replace(/%2F/g, "/");

		var btn_close = 'ปิดหน้าต่างนี้';
		var title = 'เกิดข้อผิดพลาด';
		var url = '';
		var unix = Math.round((new Date()).getTime() / 1000);
		
		if(opt != undefined && opt.btn_close )
		{
			btn_close = opt.btn_close;
		}

		if(opt != undefined && opt.title )
		{
			title = opt.title;
		}
		
		if(opt != undefined && opt.width )
		{
			$.errorNotice.defaults.width = opt.width;
		}
		
		

		// check has model or not ?
		if($('.ui-widget-overlay').length > 0)
		{
			$('.lightbox-hide.remove.ui-dialog-content').remove();
			$('.ui-widget-overlay').remove();
		}

		if(error_msg == '')
		{
			error_msg = 'มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง';
		}
		
		$('#error_notice').remove();
		var error_div = '';
		error_div	=	'<div id="error_notice">'
		+ '<p class="error_msg">' + error_msg + '</p>'
		+ '<div class="button-container">'
		+ '<a href="javascript:void(0);" class="button normal-butt close_lightbox">'
		+ '<span><em>'+btn_close+'</em></span></a>'
		+ '</div>'
		+ '</div>';
		//		console.log($.errorNotice.defaults.width);
		$('div:last').after(error_div);
		$('#error_notice').dialog({
			width : $.errorNotice.defaults.width ,			
			title: title,
			modal: true,
			resizable: false,
			draggable: false,
			close: function()
			{
				$('#error_notice').dialog('destroy').remove();							
				if($.errorNotice.defaults.refresh_page == true)
				{					
					window.location.reload();
				}
			}
		});
		
		$('#error_notice').on('click','.close_lightbox',function(){
			if($.errorNotice.defaults.refresh_page == true)
			{				
				window.location.reload();
			}
			$('#error_notice').dialog('destroy').remove();
			$('#error_notice .lightbox-hide.ui-dialog-content').remove();
			$('.ui-widget-overlay').remove();
			
			
			/* ยอมรับแจ้งข้อหา ในทุกๆกิจกรรม ที่กระทำในระบบ เช่น ตอบความเห็น emo vote setprofile */
			if(opt != undefined && opt.action == 'member_notify' && opt.validation_user == true)
			{
				$.ajax({
					type : 'POST',
					dataType : 'json',
					url : opt.url+'?t='+unix,
					data : {
						param : opt.param_id
					},
					success : function(rs){}
				});	
				return false;
			}
			
			/*  ยอมรับแจ้งข้อหา ส่วนของ login ธรรมดา */
			if(opt != undefined && opt.action == 'member_notify' && opt.authen_type == 'normal')
			{	
				$.ajax({
					type : 'POST',
					dataType : 'json',
					url : opt.url+'?t='+unix,
					data : {
						param : opt.param_id
					},
					success : function(rs){		
	
						/* reload หลังกดยอมรับ */
						if(opt.reload != undefined && opt.reload == true)
						{
							window.location.reload();	
						}		
					}
				});
				return false;
			}
			
			/*  ยอมรับแจ้งข้อหา ส่วนของ login lightbox + oauth */
			if(opt != undefined && opt.action == 'member_notify' && opt.authen_type != 'normal')
			{	
				$.ajax({
					type : 'POST',
					dataType : 'json',
					url : opt.url+'?t='+unix,
					data : {
						authen_type:opt.authen_type,
						param : opt.param_id
					},
					success : function(rs){		
						/* แสดง bar bbcode และ ปุ่ม preview */
						ui_authen();
						/* แสดงรูป avatar */
						display_avatar(rs.display_avatar);	
						$('.login_lb_process').dialog('close').remove();
						
					}
				});	
				return false;
			}
			
			
			
		
		})
		
		
		
		setDefaults_param($.errorNotice.defaults);
	}
	/************************************* Private Function *******************************/
	function setDefaults_param(obj)
	{
		$.extend($.errorNotice.defaults = {
			width : 300			
		},obj);
	}
	
	function login_acknowledge($obj){
		
	}
	/************************************* Defaults Param ********************************/
	$.errorNotice.defaults = {
		width : 300,
		refresh_page : false,
		url : ''
	//u : 'mu.pantip.com'
	//u : 'javascript:(function(){document.open();document.domain="' + document.domain + '";var ed = window.parent.CodeMirror_boilerplate;document.write(ed);document.close();})()'

	};
})(jQuery);


(function($){
	
	$.pantipNotice	=	{};
	$.pantipNotice.test = function ()
	{
		console.log('abc');
	}
	$.pantipNotice.dialog = function (msg)
	{		
		var notice_div = '';
		notice_div	=	'<div class="callback-status modal-callback" style="display:none;top:30px;left:0px;">'
		+	'<div class="callback-status-inner">'
		+	'<a title="ปิด" class="callback-status-close" href="javascript:void(0);">x</a>'
		+	msg
		//						+	'&nbsp;<a href="javascript:void(0);">เลื่อนไปดูข้อความของคุณ</a>&nbsp;'
		+	'</div>'
		+	'</div>';
		
		if($('.callback-status').length != 0)
		{			
			$('.callback-status').remove();
		}
		$('div:last').after(notice_div);
		
		var winW = 630
		if (document.body && document.body.offsetWidth) {
			winW = document.body.offsetWidth;
			winH = document.body.offsetHeight;
		}
		if (document.compatMode=='CSS1Compat' &&
			document.documentElement &&
			document.documentElement.offsetWidth ) {
			winW = document.documentElement.offsetWidth;
		}
		if (window.innerWidth && window.innerHeight) {
			winW = window.innerWidth;
		}

		var select	=	$('.callback-status');		
		var left_width	=	select.width();		
		var left_position	=	(winW - left_width)/2;			
		//		var lheight = ($(window).scrollTop() - ($(window).height() - $('.samgee').outerHeight()) - 30);
		
		var lheight = $(window).scrollTop() + 10;

		
		//		console.log($(window).height() , $(window).scrollTop());
		select.css({
			left: left_position,
			display: '',
			top:0
		}).delay(5000).fadeOut('slow',function(){
			if(typeof($.pantipNotice.defaults.callbackAfterRemove) === 'function')
			{
				$.pantipNotice.defaults.callbackAfterRemove();
			}
			$('.callback-status').remove();
			setDefaults_param();
			
		});
		
		
		$(document).on('click','.callback-status-close',function(){			
			if(typeof($.pantipNotice.defaults.callbackAfterRemove) == 'function')
			{		
				$.pantipNotice.defaults.callbackAfterRemove();
			}
			$('.callback-status').remove();
			setDefaults_param();
		})
		
		
	}
	/************************************* Private Function *******************************/
	function setDefaults_param()
	{
		$.pantipNotice.defaults = {
			width : 300,
			callbackAfterRemove : ''
		};
	}
	/************************************* Defaults Param ********************************/
	$.pantipNotice.defaults = {
		width : 300,
		callbackAfterRemove : ''
	};
})(jQuery);
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){
	(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))
})(navigator.userAgent||navigator.vendor||window.opera);

function windowSize()
{
	var myWidth = 0, myHeight = 0;
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}
	return myHeight;
}
	
/* Thai sort algorithm [Natee3G] */
//	function thaiSortComparator(a, b)
//	{
//		var i = 0; var j = 0; var l = 0; var m = 0;
//		var aSum = 0; var bSum = 0; var aSom = 0; var bSom = 0;
//		
//		while( l == m )
//		{
//			/* Start a calc */
//			while ( a.charCodeAt(i) >= 3648 && a.charCodeAt(i) <= 3652 )
//			{
//				aSum += a.charCodeAt(i); i++;
//			}
//			
//			while ( a.charCodeAt(i) >= 3655 && a.charCodeAt(i) <= 3659 )
//			{
//				aSom += a.charCodeAt(i)/Math.pow(2,i); i++;
//			}
//
//			if ( ! ( a.charCodeAt(i) >= 3655 && a.charCodeAt(i) <= 3659 ) )
//			{
//				l = a.charCodeAt(i);
//			}
//			
//			if( isNaN(l) )
//			{
//				l = 0;
//			}
//			/* End a calc */
//			/************************************/
//			/* Start b calc */
//			while ( b.charCodeAt(j) >= 3648 && b.charCodeAt(j) <= 3652 )
//			{
//				bSum += b.charCodeAt(j);
//				j++;
//			}
//			
//			while ( b.charCodeAt(j) >= 3655 && b.charCodeAt(j) <= 3659 )
//			{
//				bSom += b.charCodeAt(j)/Math.pow(2,j);
//				j++;
//			}
//
//			if ( ! ( b.charCodeAt(j) >= 3655 && b.charCodeAt(j) <= 3659 ) )
//			{
//				m = b.charCodeAt(j);
//			}
//			
//			if( isNaN(m) )
//			{
//				m = 0;
//			}
//			/* End b calc */
//			/************************************/
//			/* Start sorting */
//			if( l < m ) { return -1; }
//			if( l > m ) { return 1; }
//			if( l == m )
//			{
//				l += aSum;
//				m += bSum;
//				if( l < m ) { return -1; }
//				if( l > m ) { return 1; }
//				if( l == m )
//				{
//					var aLim = a.length;
//					var bLim = b.length;
//					
//					if( j == bLim && i == aLim )
//					{
//						l += aSom;
//						m += bSom;
//					}
//					if( l < m ) { return -1; }
//					if( l > m ) { return 1; }
//					if( i == aLim && ( j == bLim )&&(i==j) )
//					{
//						return 0;
//					}
//					if(l==m)
//					{
//						i++; j++;
//					}
//				}
//			} // if l == m
//			/* end sorting */
//		} // while l == m
//	} // function Thai Sort
//
//	//pads left
//	String.prototype.lpad = function(padString, length) {
//		var str = this;
//		while (str.length < length)
//			str = padString + str;
//		return str;
//	}
//	
//	// Thai Sort trigger [Natee3G]
//	Array.prototype.thaiSort = function() {
//		this.sort(thaiSortComparator);
//	}
	
	
	
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

