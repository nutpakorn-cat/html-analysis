
(function($){
	var req_obj;
	$.fn.force_login	=	function( options ) {
		var opts = $.extend({}, $.fn.force_login.defaults, options);
		
		//console.log(opts);return false;
		this.each(function(){			
			if(opts.auto_click)
			{
				$(this).on('click',function(){
					ajax_chk_login(opts);
					return false;
				});
			}
			else
			{				
				ajax_chk_login(opts);			
			}
			return false;
		});
		return this;
	}
	
	function ajax_chk_login(opts)
	{
		//console.log(ajaxSending);
		//chk login
		var chk_sending = $.fn.force_login.defaults.sending;
		if(chk_sending == false)
		{
			chk_sending = true;
			req_obj = $.ajax({
				url : '/login/is_login?time='+Math.random(),
				dataType : 'html',
				cache : false,
				success : function(result)
				{	
					
					//console.log(typeof(result));
					chk_sending = false;
					if(result != 'true' )
					{
						display_login_lb(result,opts);
						return false;
					}
					
					if(typeof(opts.params.logged_in) == 'function')
					{
						opts.params.logged_in();
						return false;
					}
					
					if(typeof(opts.callback) == 'function')
					{
						opts.callback();
						return false;
					}
					
					return false;
					
					// call login page if false					
					/*if(result != 'true')
					{							
						display_login_lb(result,opts);
						chk_sending = false;
						return false;
					}
							
					if(typeof(opts.params.logged_in) == 'function')
					{
						//						console.log(opts.params);
						opts.params.logged_in();
						return false;
					}
					//console.log(typeof(opts.callback),opts.callback);
					//opts['callback'] = add_comment
					if(typeof(opts.callback) == 'function')
					{
						opts.callback();
					}
					chk_sending = false;
					return false;
					*/
											
				}
			});
		}
		else
		{
			chk_sending = false;
			req_obj.abort();
		}
		
		return false;
	}
	
	
	
	function display_login_lb (login_html,opts) {
		var div_id		=	opts.login_lightbox_class;
		var div_login_lb = '<div class="lightbox-hide ' + div_id + '"></div>';
		
		if($('.' + div_id).length > 0)
		{
			$('.' + div_id).unbind('.force_login').remove();
			$('#login_lb_form').unbind('click');
		}
		
		$('div:last').append(div_login_lb);

		$('.' + opts.login_lightbox_class)
		.html(login_html)
		.dialog({
			width: 500,				
			title: opts.title,
			modal: true,
			resizable: false,
			draggable: false,
			close: function()
			{					
				if(typeof(opts.cancel_callback) == 'function')
				{							
					opts.cancel_callback();													
				}
				$('.'+ div_id).dialog('destroy').remove();
				return false;
			}
		}); // end #login_lb_process.dialog
		
		
		login_send_data(opts);
		return false;
	}	
	//var login_check_send_1_time = false;	
	function login_send_data(opts)
	{			
		//		$('.'+opts.login_lightbox_class).on('keydown','#login_lb_form',function(e){
		//			
		//			var chk_sending = $.fn.force_login.defaults.sending;
		//			//console.log(e.which);
		//			if(e.which == '13')
		//			{
		//				if(chk_sending == false)
		//				{
		//					$('#user_login_btn').triggerHandler('click');
		//					chk_sending = true;
		//				}
		//				chk_sending = false;
		//				return false;
		//			}			
		//		});

		$('.'+opts.login_lightbox_class).on('keypress','#member_username,#member_password,#captcha_word',function(event){
			var chk_sending = $.fn.force_login.defaults.sending;
			if (event.which == '13') {
				if(chk_sending == false)
				{
					$('#user_login_btn').trigger('click');
					chk_sending = true;
				}
				chk_sending = false;
				return false;
			}
		});
		
		$('.'+opts.login_lightbox_class).on('click', '#user_login_btn', function(event){
			var chk_sending = $.fn.force_login.defaults.sending;
			$('.loading-txt').remove();
			$(this).after(' <span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');
			if(chk_sending == false)
			{
				$('#username_error').html('');
				$('#login_error').html('');
				$('#captcha_error').html('');
				chk_sending = true;
				if($('#member_username').val().length > 0 && $('#member_password').val().length > 0)
				{
					$.ajax({
						url : '/login/ajax_authen',
						type : 'POST',
						data : $('#login_lb_form').serialize(),
						dataType: 'json',
						timeout : 15000,
						error : function(jqXHR,exception,err){

							$.errorNotice.dialog(err,{
								title : 'แจ้งเตือน'
							});
						},
						success : function(result){			
							//					console.log('ajax send success !');
							chk_sending = false;
							$('.loading-txt').remove();				
						
							/* case แจ้งเตือนข้อหา */
							if(result.member_notify != undefined && result.member_notify == 1)
							{
								$.errorNotice.dialog(result.error_message,{
									title : 'แจ้งเตือน',
									btn_close:'รับทราบ',
									action : 'member_notify',
									url : '/login/l_acknowledge',
									param_id :result.id,
									authen_type : 'lightbox'

								});
								return false;
							}
							
							if(result.chk == 'true')
							{						
								if(typeof(opts.callback) == 'function')
								{							
									opts.callback(result);								
									$('.'+ opts.login_lightbox_class).dialog('destroy').remove();
									return false;
								}
								else
								{
									window.location = opts.url;							
								}
							}
							else
							{
								if(result.error == true)
								{
									$.errorNotice.dialog(result.error_message,{
										title : 'แจ้งเตือน'
									});
									return false;
								}	
								
								$('.loading-txt').remove();
								if(result.error_msg_captcha)
								{
									$.ajax({
										type: "POST",
										url: '/login/captcha_form',
										cache: false,
										success: function(rs){
											$('#form_captcha').html(rs);
										}
									});

									//$('#reload').trigger('click');
									$('#captcha_word').val('');
									$('#captcha_error').html(result.error_msg_captcha);
									$('#login_error').html(result.error_msg);
									$('#member_password').val('');
									$('#member_password').focus();
								}
								else
								{
									$('#login_error').html(result.error_msg);
									$('#member_password').val('');
									$('#member_username').focus();
								}
							}					
							chk_sending = false;
							return false;
						}			
					});
				}
				else
				{
					var msg_username = 'กรุณากรอกข้อมูลผู้ใช้ระบบ';
					var msg_password = 'กรุณากรอกข้อมูลรหัสผ่าน';
					$('#form_captcha').html('');
					$('.loading-txt').remove();
					if($('#member_username').val().length == 0)
					{
						$('#username_error').html(msg_username);
						$('#member_username').focus();
					}
					if($('#member_password').val().length == 0)
					{				
						$('#login_error').html(msg_password);
						
					}
					$('#member_password').val('');
				}
			}
			return false;
		});
		return false; // return function
	}	
	
	$.fn.force_login.defaults = {
		url : window.location.pathname,
		callback : '',
		cancel_callback : '',
		auto_click : true,
		login_lightbox_class : 'login_lb_process',
		title : 'เข้าสู่ระบบ',
		params : {
			'logged_in' : ''
		},
		sending : false
		
	}	
})(jQuery);