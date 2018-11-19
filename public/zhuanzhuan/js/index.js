var textSwiper;    //文字滚屏

var READYTIME = 400;    //动画准备时间
var READYSOUND = 400;

var LIGNT_FAST_TIME = 100     //背景灯闪烁速度FAST
var LIGNT_SLOW_TIME = 200    //背景灯闪烁速度SLOWING
var LIGNT_INIT_TIME = 300   //背景灯闪烁速度INIT

var ZZ_STATUS1_TIME = 40;   //第1阶段动效速度
var ZZ_STATUS2_TIME = 70;   //第2阶段动效速度
var ZZ_STATUS3_TIME = 300;  //第3阶段动效速度
var ZZ_STATUS4_TIME = 500;  //第4阶段动效速度

var STAUS3_COUNT = 5;    //第3阶段动效距离停止位个数
var STAUS4_COUNT = 3;   //第4阶段动效距离停止位个数

var RANDOM_TIME = 700  //转转等待状态跳跃时间间隔

var ITEMCOUNT = 12;  //转一转个数

var is_add_ad = false;

var pageversion = versionControl.timeversion();

//屏幕宽度自适应
(function(designWidth, maxWidth) {
	var doc = document,
		win = window;
	var docEl = doc.documentElement;
	var metaEl,
		metaElCon;
	var styleText,
		remStyle = document.createElement("style");
	var tid;

	function refreshRem() {
		// var width = parseInt(window.screen.width); // uc有bug
		var width = docEl.getBoundingClientRect().width;
		if(!maxWidth) {
			maxWidth = 540;
		};
		if(width > maxWidth) { // 淘宝做法：限制在540的屏幕下，这样100%就跟10rem不一样了
			width = maxWidth;
		}
		var rem = width * 16 / designWidth;
		console.log(rem)
		// var rem = width / 10; // 如果要兼容vw的话分成10份 淘宝做法
		//docEl.style.fontSize = rem + "px"; //旧的做法，在uc浏览器下面会有切换横竖屏时定义了font-size的标签不起作用的bug
		remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
	}

	// 设置 viewport ，有的话修改 没有的话设置
	metaEl = doc.querySelector('meta[name="viewport"]');
	// 20171219修改：增加 viewport-fit=cover ，用于适配iphoneX
	metaElCon = "width=device-width,initial-scale=1,maximum-scale=1.0,user-scalable=no,viewport-fit=cover";
	if(metaEl) {
		metaEl.setAttribute("content", metaElCon);
	} else {
		metaEl = doc.createElement("meta");
		metaEl.setAttribute("name", "viewport");
		metaEl.setAttribute("content", metaElCon);
		if(docEl.firstElementChild) {
			docEl.firstElementChild.appendChild(metaEl);
		} else {
			var wrap = doc.createElement("div");
			wrap.appendChild(metaEl);
			doc.write(wrap.innerHTML);
			wrap = null;
		}
	}

	//要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
	refreshRem();

	if(docEl.firstElementChild) {
		docEl.firstElementChild.appendChild(remStyle);
	} else {
		var wrap = doc.createElement("div");
		wrap.appendChild(remStyle);
		doc.write(wrap.innerHTML);
		wrap = null;
	}

	win.addEventListener("resize", function() {
		clearTimeout(tid); //防止执行两次
		tid = setTimeout(refreshRem, 300);
	}, false);

	win.addEventListener("pageshow", function(e) {
		if(e.persisted) { // 浏览器后退的时候重新计算
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 300);
		}
	}, false);

	if(doc.readyState === "complete") {
		doc.body.style.fontSize = "16px";
	} else {
		doc.addEventListener("DOMContentLoaded", function(e) {
			doc.body.style.fontSize = "16px";
		}, false);
	}
})(375, 750);



var animation; //动效
var lightBlinking; //背景灯
var winCanvas; //中奖保存画布

var merchandise; //商品列表

var mainMerchId; //参数传递过来的商品ID
var vmId; //机器ID
var page; //页面显示
var sound;

$(document).ready(function() {

	var brand_name =  MquJS.getCookie('brandName')
	document.title = brand_name;

	//初始化画布及动画
	var canvas = document.getElementById('canvas');
	canvas.width = $('.grid-box').width()
	canvas.height = $('.grid-box').height()
	var ctx = canvas.getContext('2d');
	animation = new Animation(canvas, ctx)
	animation.getPosition();

	if(is_add_ad){
		$('#not_win_ad').addClass('ad_box')
		$('.alert-not-win .iframe').show();
	}else{
		$('#not_win_ad').removeClass('ad_box')
		$('.alert-not-win .iframe').hide();
		$('.not-win-box .hide-btn').html('<img src="zhuanzhuan/img/btn_closed@2x.png" />')
		$('.hide-btn').show();
	}

	//字幕滚动
	textSwiperFun();

	//元素绑定事件
	elementClickEventBind();

	//游戏规则
	ruleInit();

	//协议
	protocolInit()
	$('.protocol-content textarea').val(protocolText);

	//获奖背景图预加载
	winImageLoading();

	//图片预加载
	imageLoading();


	sound = new Sound();

	document.getElementById('audio').play();
	//必须在微信Weixin JSAPI的WeixinJSBridgeReady才能生效
	document.addEventListener("WeixinJSBridgeReady", function() {
		document.getElementById('audio').play();
	})

});

var PageInit = function() {
	multipleImgInit();
	//背景灯闪烁
	lightBlinking = new LightBlinking();
	lightBlinking.start();

	//动画启动
	animation.init();
}

var multipleImgInit = function() {
	$('.multiple-item img').each(function(index) {
		var nowIndex = parseInt(index) + 1;
		$(this).attr('src', 'zhuanzhuan/img/multiplex' + nowIndex + '.png')
	})
	$('.multiple-item').removeClass('active')
	$('.multiple1').addClass('active');
	var activeLeng = merchandise.activeMerArr.length;
	if(!activeLeng){
		activeLeng = 1;
	}
	$('.multiple1 img').attr('src', 'zhuanzhuan/img/mul'+activeLeng+'_ac.png')

	merchandise.multiple = 1;
	merchandise.reNeedPay();
}

var winBgImage = undefined;
var winProBgImg = undefined;
var winZhongImg = undefined;
var winImageLoading = function(){
	winBgImage = new Image();
	winBgImage.src = 'zhuanzhuan/img/win-canvas-bg.png'

	winProBgImg = new Image();
	winProBgImg.src = 'zhuanzhuan/img/pro-bg.png'

	winZhongImg = new Image();
	winZhongImg.src = 'zhuanzhuan/img/zhongle.png'
}

//中奖canvas
var WinCanvas = function(pay,originalPrice) {
	this.winCanvas = undefined;
	this.winCtx = undefined;
	this.pay = pay;
	this.originalPrice = originalPrice;
	this.count = 20;
	this.drawImg()
}

//中奖画布生成
WinCanvas.prototype.drawImg = function() {
	var that = this;

	var winCanvas = document.createElement('canvas');
	var winCtx = winCanvas.getContext('2d');

	var width = $('.win_canvas').width();
	var height = $('.win_canvas').height();

	winCanvas.width = width*3;
	winCanvas.height = height*3;

	var scale = document.body.clientWidth/375;

	winCtx.scale(3,3);

	winCtx.drawImage(winBgImage,0,52*scale,width,243*scale)
	winCtx.drawImage(winProBgImg,(288-161)/2*scale,0,161*scale,140*scale)
	winCtx.drawImage(winZhongImg,75*scale,120*scale,150*scale,63*scale)

	that.winCanvas = winCanvas;
	that.winCtx = winCtx;
	that.drawPro()

}


WinCanvas.prototype.drawPro = function(){
	var that = this;
	if(that.winCanvas == undefined || that.winCtx == undefined){
		console.log('winCanvas or winCtx undefined');
		return;
	}

	var pay = that.pay;
	var originalPrice = that.originalPrice;

	var headImg = orders.headImg;
	var proImg = orders.proImg;

	if(headImg == undefined || proImg ==undefined && that.count >0){
		that.count --;
		console.log(that.count);
		setTimeout(function(){
			that.drawPro();
		},100)
		return;
	}


	sound.winStart()

	var scale = document.body.clientWidth/375;

	var cloneCavas = that.winCanvas
	var cloneCtx = that.winCtx;

	if(proImg){
		var imgWidth;
		var imgHeight;
		if(proImg.width>=proImg.height){
			imgWidth = 80 * scale;
			imgHeight = proImg.height * imgWidth/proImg.width;
		}else {
			imgHeight = 80 * scale;
			imgWidth = proImg.width * imgHeight/proImg.height;
		}

		cloneCtx.drawImage(proImg,(288*scale-imgWidth)/2,(100*scale-imgHeight)/2+10,imgWidth,imgHeight)
	}

	if(headImg){
		cloneCtx.save();
		var width = 60 * scale;
		var height = 60 * scale;

		cloneCtx.arc(40*scale+width/2, 194*scale+width/2, width/2, 0, 2 * Math.PI);
		cloneCtx.clip();
		cloneCtx.shadowOffsetX = 0;
		cloneCtx.shadowOffsetY = 18*scale;
		cloneCtx.shadowBlur = 14*scale;
		cloneCtx.shadowColor = '#5313C8'
		cloneCtx.drawImage(headImg,40*scale,194*scale,width,height)
		cloneCtx.restore();
		cloneCtx.strokeStyle = 'rgba(235, 208, 255, 0.5)'
		cloneCtx.shadowOffsetX = 0;
		cloneCtx.shadowOffsetY = 6*scale;
		cloneCtx.shadowBlur = 11*scale;
		cloneCtx.shadowColor = '#5313C8'
		cloneCtx.arc(40*scale+width/2, 194*scale+width/2, width/2, 0, 2 * Math.PI);
		cloneCtx.stroke();
	}

	cloneCtx.shadowOffsetY = 0;
	cloneCtx.shadowBlur = 0;
	cloneCtx.font = "normal "+15*scale+"px Arial";
	cloneCtx.fillStyle = '#fff'
	cloneCtx.fillText('😊 我花了'+pay+'元抽中',115*scale,220*scale)
	cloneCtx.fillText('这件'+originalPrice+'元商品',115*scale,245*scale)

	var Img = cloneCavas.toDataURL();
	$('.draw-box').html('<img src="'+Img+'"/>')

	$(cloneCavas).remove();

	$('#win_box').show();
	slideIn($('#win_box .alert-container'));
	animation.init();
}

//游戏规则相关
var ruleInit = function() {
	$('.rule').on({
		touchend: function() {
			$('#alert-rule').show();
		}
	});

	$('#rule_certain').on({
		touchend: function() {
			$('#alert-rule').hide();
		}
	});

}


var Sound = function(){
	var that = this;
	this.open = true;

	if(localStorage.open == false || localStorage.open == 'false'){
		this.open = false;
		document.getElementById('audio').muted = true;
		document.addEventListener("WeixinJSBridgeReady", function() {
		document.getElementById('audio').muted = true;
		}, false);
		$('.sound img').attr('src','zhuanzhuan/img/btn_sound_off@3x.png')
	}else {
		document.getElementById('audio').muted = false;
		document.addEventListener("WeixinJSBridgeReady", function() {
			document.getElementById('audio').muted = false;
		}, false);
		$('#audio').attr('autoplay','autoplay')
		$('.sound img').attr('src','zhuanzhuan/img/btn_sound@2x.png')
	}


	this.btnStart = function(){
		if(!this.open){
			return;
		}
		document.getElementById('btn_audio').play();
		document.addEventListener("WeixinJSBridgeReady", function() {
			document.getElementById('btn_audio').play();
		}, false);
	}

	this.bgStart = function(){
		$('#audio').attr('src','zhuanzhuan/mp3/bg.mp3')
	  $('#audio').attr('loop',true)
		document.getElementById('audio').play();
		document.addEventListener("WeixinJSBridgeReady", function() {
			document.getElementById('audio').play();
		}, false);

	}
	this.goStart = function(){
		$('#audio').attr('src','zhuanzhuan/mp3/go3.mp3')
		$('#audio').attr('loop',true)
		document.getElementById('audio').play();
		document.addEventListener("WeixinJSBridgeReady", function() {
			document.getElementById('audio').play();
		}, false);
	}

	this.lose = function(){
	  $('#audio').attr('src','zhuanzhuan/mp3/lose2.mp3')
	  $('#audio').attr('loop',false)
		document.getElementById('audio').play();
		document.addEventListener("WeixinJSBridgeReady", function() {
			document.getElementById('audio').play();
		}, false);
	}

	this.winStart = function(){
	  $('#audio').attr('src','zhuanzhuan/mp3/win2.mp3')
	  $('#audio').attr('loop',false)
		document.getElementById('audio').play();
		document.addEventListener("WeixinJSBridgeReady", function() {
			document.getElementById('audio').play();
		}, false);

	}

	this.stop = function(){
		$('#audio').attr('src','')
	}

	$('.sound').on({
		touchend:function(){
			that.open = !that.open;
			localStorage.open = that.open;
			if(that.open){
				document.getElementById('audio').muted = false;
				document.addEventListener("WeixinJSBridgeReady", function() {
					document.getElementById('audio').muted = false;
				}, false);
				$('.sound img').attr('src','zhuanzhuan/img/btn_sound@2x.png')
			}else {
			  document.getElementById('audio').muted = true;
				document.addEventListener("WeixinJSBridgeReady", function() {
					document.getElementById('audio').muted = true;
				}, false);
				$('.sound img').attr('src','zhuanzhuan/img/btn_sound_off@3x.png')
			}
		}
	});
}


var protocolStatus = false;

//底部转一转按钮
var ZhuanzhuanBtn = function() {
	this.status_init = function(){
		$('#zhuanzhuan_btn img').attr('src','zhuanzhuan/img/zhuanzhuan@2x.png')
		$('#zhuanzhuan_btn').css('opacity','0.5');
	}
	this.status_waiting = function() {
		$('#zhuanzhuan_btn img').attr('src','zhuanzhuan/img/zhuanzhuan@2x.png')
		$('#zhuanzhuan_btn').css('opacity','1');

		$('.probability-box').show();
		$('.zhuli-box').hide();

		$('#zhuanzhuan_btn').unbind()
		$('#zhuanzhuan_btn').on({
			touchend: function() {
				//检测协议
				if(localStorage.protocolStatus == false || localStorage.protocolStatus == undefined || localStorage.protocolStatus == 'false') {
					$('#alert-protocol').show();
					$('.protocol-check-box img').show();
					protocolStatus = true
					$('#protocol_certain').unbind();
					$('#protocol_certain').on({
						touchend: function() {
							$('#alert-protocol').hide();
							$('.protocol-content').hide();
							localStorage.protocolStatus = protocolStatus;
							if(protocolStatus){
								if(DEBUG){
									animation.ready()
									orders.purchaseUnifiedOrder();
									return;
								}
								orders.purchaseUnifiedOrder();
							}
							protocolInit()
						}
					})
					return;
				}

				if(DEBUG){
					animation.ready()
					
					orders.purchaseUnifiedOrder();
					return;
				}
				orders.purchaseUnifiedOrder();
			}
		});
	}
	this.status_working = function(){
		$('#zhuanzhuan_btn img').attr('src','zhuanzhuan/img/chujianging.png')
		$('#zhuanzhuan_btn').css('opacity','0.5');

		$('.probability-box').hide();
		$('.zhuli-box').show();

		$('#zhuanzhuan_btn').unbind()
	}
}

var zhuanzhuanBtn = new ZhuanzhuanBtn();
zhuanzhuanBtn.status_init();

var multipleClick = true;
//页面点击事件
var protocolInit = function(){
	//协议确定
	$('#protocol_certain').unbind();
	$('#protocol_certain').on({
		touchend: function() {
			$('#alert-protocol').hide();
			$('.protocol-content').hide();
			localStorage.protocolStatus = protocolStatus;
		}
	})
}
var elementClickEventBind = function() {
	//隐藏按钮
	$('.alert-no-zoom .hide-btn').on({
		touchend: function() {
			$('.alert-no-zoom').hide();
			$('.protocol-content').hide()
		}
	});

	$('.alert-zoom .hide-btn').on({
		touchend: function() {
			slideOut($(this).parent())
		}
	});

	$('.alert-not-win .hide-btn').on({
		touchend: function() {
			slideOut($('.alert-not-win .not-win-box'))
		}
	});

	$('.alert-not-win-iframe .btn_closed').on({
		touchend: function() {
			slideOut($('.alert-not-win-iframe .not-win-box-iframe'))
		}
	});

	$('.show-ad-btn').on({
		touchend:function() {
			showAd(orders.orderId,merchandise.totalPrice*100)
		}
	})

	$('.iframe').on({
		touchend: function() {
			showAd(orders.orderId,merchandise.totalPrice*100)
		}
	})

	//协议
	$('.protocol').on({
		touchend: function() {

      protocolInit()
			$('.alert-protocol').css('top','10rem')
			$('#alert-protocol').show();
			$('.protocol-check-box img').show();
			protocolStatus = true

		}
	});


	//协议选择
	$('.protocol-check-box').on({
		touchend: function() {
			protocolStatus = !protocolStatus
			if(protocolStatus) {
				$('.protocol-check-box img').show();
			} else {
				$('.protocol-check-box img').hide();
			}
		}
	});

	$('#protocol_text').on({
		touchend:function(event){
			$('.alert-protocol').css('top','5rem')
			$('.protocol-content').show();
			event.stopPropagation();
		}
	})

	//倍数按钮
	$('.multiple-item').on({
		touchend: function() {
			if(!multipleClick){
				return;
			}
			sound.btnStart();
			merchandise.multiple = $(this).attr('val');
			merchandise.reNeedPay();
			var clickIndex = parseInt($(this).index()) + 1;
			var proActiveLength = merchandise.activeMerArr.length;
			if(!proActiveLength){
				proActiveLength = 1;
			}
			$('.multiple-item img').each(function(index) {
				var nowIndex = parseInt(index) + 1;
				if(nowIndex == 1){
					$(this).attr('src', 'zhuanzhuan/img/mul' + proActiveLength + '.png');
				}else {
					$(this).attr('src', 'zhuanzhuan/img/multiplex' + nowIndex + '.png');
				}
			})
			$('.multiple-item').removeClass('active')
			$(this).addClass('active');
			if(clickIndex == 1){
				$('.multiple' + clickIndex + ' img').attr('src', 'zhuanzhuan/img/mul' + proActiveLength + '_ac.png')
			}else {
				$('.multiple' + clickIndex + ' img').attr('src', 'zhuanzhuan/img/multiplex' + clickIndex + '_ac.png')
			}
		}
	});

	$('.again-btn').on({
		touchend:function(){
			$('.alert').hide();
			orders.purchaseUnifiedOrder();
		}
	});

	var telClickTime = 1;
	$('.telPhone').on({
		touchend:function(){
			var tel = "tel:" + orders.telPhone;
			if(orders.telPhone == undefined){
				return;
			}
			setTimeout(function () {
					telClickTime = 1 ;
			},3000);
			telClickTime = 0
			window.location.href = tel;
		}
	})

	$('.after-use').on({
		touchend:function(){
			$('.alert').hide();
			$('.con-box-item').hide();
		}
	})

	$('#tuikuan').on({
		touchend:function(){
			window.location.href = 'refundProcess.html?orderId=' + orders.orderId + '&v=' + pageversion ;
		}
	});

	$('#shiyong').on({
		touchend:function(){
			window.location.href = 'toPay.html?vmId=' + orders.vm_id + '&opId=' + orders.duangProductVo.id  + '&sourceFlag=2&v=' + pageversion;
		}
	});

	$('#back').on({
		touchend:function(){
			window.location.href = 'index.html'
		}
	});
}


//toast提示
var toast = function(str) {
	$('.toast p').text(str)
	$('.toast').show();
	setTimeout(function() {
		$('.toast').hide();
	}, 2000);
}

//背景灯
var LightBlinking = function() {
	this.lightBlinkInterval = undefined;
	this.intervalTime = LIGNT_INIT_TIME;
	this.light1 = 'zhuanzhuan/img/light@2x.png';
	this.light2 = 'zhuanzhuan/img/light2@2x.png';
	this.switching = true;
	this.start = function() {
		var that = this;
		that.lightBlinkInterval = setInterval(function() {
			if(that.switching) {
				$('.light img').attr('src', that.light1);
			} else {
				$('.light img').attr('src', that.light2);
			}
			that.switching = !that.switching;
		}, that.intervalTime)
	}
	this.stop = function() {
		if(this.lightBlinkInterval != undefined) {
			clearInterval(this.lightBlinkInterval);
			this.lightBlinkInterval = undefined
		}
	}
	this.init = function() {
		this.stop()
		this.intervalTime = LIGNT_INIT_TIME;
		this.start();
	}
}

var textSwiperFun = function() {
	textSwiper = new Swiper('.swiper-text', {
		direction: 'vertical',
		autoplay: 1500,
		speed: 500,
		slidesPerView: 1,
		loop: true
	});
}

//出货中loading
var Loading = function() {
	this.interval = undefined;
	this.start = function() {
		var that = this;
		var deg = 0;
		that.interval = setInterval(function() {
			deg += 60
			$('.loding img').css('transform', 'rotate(' + deg + 'deg)')
			if(deg >= 360) {
				deg = 0;
			}
		}, 150);
	}
	this.stop = function() {
		clearInterval(this.interval);
		this.interval = undefined;
	}
}
var loading = new Loading()
loading.start();



var imageLoading = function(){
	var imgArr = [
		'zhuanzhuan/img/btn_jixu copy@3x.png',
		'zhuanzhuan/img/btn_jixu.png',
		'zhuanzhuan/img/chuhuo-err.png',
		'zhuanzhuan/img/chuhuo-suc.png',
		'zhuanzhuan/img/chuhuoing-bg.png',
		'zhuanzhuan/img/Group9@2x.png',
		'zhuanzhuan/img/know.png',
		'zhuanzhuan/img/mul1.png',
		'zhuanzhuan/img/mul2_ac.png',
		'zhuanzhuan/img/mul2.png',
		'zhuanzhuan/img/mul3_ac.png',
		'zhuanzhuan/img/mul3.png',
		'zhuanzhuan/img/multiplex2_ac.png',
		'zhuanzhuan/img/multiplex3_ac.png',
		'zhuanzhuan/img/popupbg@2x.png',
		'zhuanzhuan/img/pro-show-bg.png',
		'zhuanzhuan/img/queding.png',
		'zhuanzhuan/img/shiyong.png',
		'zhuanzhuan/img/tuikuan.png',
		'zhuanzhuan/img/weizhongjiang.png'
	]

	for (var i = 0; i < imgArr.length; i++) {
		var img = new Image();
		img.src = imgArr[i]
	}
}





//弹出广告的次数
var adEnforceArr = [5,10,15,20,25,30,35,40,45,50]
//大于maxAdEnforce每次弹出广告
var maxAdEnforce = 50


//弹出广告的基数
var adRate  = 3;


/**
 * 强制弹出广告
 * @param {string} num 抽奖次数
 * @param {string} orderId 订单号
 * @param {string} price 订单单价
 */
var AdEnforce = function(){
	this.dom = $('<div class="alert-ad alert"><div class="ad-contaier slideIn"><img src="./img/kai_icon_sorry.png" />'+
		'<p class="prompt">竟然没有中奖，一定是姿势不对~</p><div class="ad-box" ><img src="./img/ad-xiuxi-img.png" alt=""><p><span>3</span>s后跳转至广告页</p></div></div></div>')
	
	this.data = undefined;

	this.set = function(data){
		
		if(!data){
			return;
		}

		this.data = data;

		if(data.num % adRate == 0 || data.num % 8 == 0)
        {
			return true;
        }


		return false
	}

}

var adEnforce = new AdEnforce();

/**
 * 抽奖次数限制提醒
 */
var Xianzhi = function(){
	this.dom = $('<div class="alert-xianzhi alert"><div class="alert-contaier"><img src="./img/icon-cs-xianzhi.png" />'+
        '<p class="prompt">陛下，今日您游戏次数已达上限</p><div class="btn">朕知道了</div></div></div>')

	this.render = function(){
		console.log('hncdsk');
		
		this.dom.find('.alert-contaier').addClass('slideIn')
		this.dom.find('.alert-contaier').removeClass('slideOut')

		$('body').append(this.dom)

		var that = this;

		this.dom.find('.btn').unbind();
		this.dom.find('.btn').on({
			click:function(){
				
				that.dom.find('.alert-contaier').removeClass('slideIn')
				that.dom.find('.alert-contaier').addClass('slideOut')
				setTimeout(function () {
					that.dom.find('.alert-contaier').removeClass('slideOut')
					that.dom.remove()
				}, 200);

			}
		})

	}
}

var xianzhi = new Xianzhi()