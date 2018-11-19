var DEBUG = true;
var is_add_ad = false;

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
		var rem = width * 100 / designWidth;
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

var animation;
$(function() {
	FastClick.attach(document.body);
	imageLoading();
});

var clickEvent = function(){
	var time = undefined
	$('.canvas-mask .btn_biubiu ').unbind();

	if(localStorage.biubiuToast != true && localStorage.biubiuToast != 'true'){
		setTimeout(function(){
			yinDao.render();
		},1000)
	}

	$('.canvas-mask .btn_biubiu ').on({
		touchstart:function(){
			localStorage.biubiuToast = true;

			time = new Date().getTime();
			$('.canvas-mask .btn_biubiu img').attr('src','./newZhuanZhuan/img/btn_biubiu_pre.png')
			
			if(animation.state){
				return;
			}
			animation.state1()
		},
		touchend:function(){
			$('.canvas-mask .btn_biubiu img').attr('src','./newZhuanZhuan/img/btn_biubiu_default.png')
			if(new Date().getTime()-time<200){
				clearInterval(animation.state1Interval)
				return;
			}

			if(animation.state == 'state2' || animation.state == 'start' ){
				return;
			}
			animation.state2()
		}
	})
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

	this.set = function (data) {

		if (!data) {
			return;
		}

		this.data = data;

		return false
	}

}

var adEnforce = new AdEnforce();

/**
 * 抽奖次数限制提醒
 */
var Xianzhi = function(){
	this.dom = $('<div class="alert-xianzhi alert-box"><div class="alert-contaier"><img src="./img/icon-cs-xianzhi.png" />'+
        '<p class="prompt">陛下，今日您游戏次数已达上限</p><p class="prompt2">明天再来吧</p><div class="btn">朕知道了</div></div></div>')

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

var XianzhiFive = function(){
	this.dom = $('<div class="alert-xianzhi-prompt"><div class="alert-contaier"><img src="./img/king-seats.png" alt="" srcset="">'+
			'<p>陛下，您好像有点疲惫了哦</p><p>今天还能玩<span>5</span>次</p><div class="btn-jixu">继续弹一弹</div><div class="btn-xiuxi">休息一下</div></div></div>')

	this.render = function(xianzhiCount,callback){
		var xianzhiNum = orders.hiHasBuyNum;

		if(!xianzhiNum){
			callback()
			return;
		}
		
		if(xianzhiCount - xianzhiNum != 5){
			callback()
			return;
		}

		this.dom.find('.alert-contaier').addClass('slideIn')
		$('body').append(this.dom)

		var that = this;

		this.dom.find('.btn-xiuxi').unbind();
		this.dom.find('.btn-xiuxi').on({
			click:function(){
				that.dom.find('.alert-contaier').removeClass('slideIn')
				that.dom.find('.alert-contaier').addClass('slideOut')
				setTimeout(function () {
					that.dom.find('.alert-contaier').removeClass('slideOut')
					that.dom.remove()
				}, 200);
			}
		})

		this.dom.find('.btn-jixu').unbind();
		this.dom.find('.btn-jixu').on({
			click:function(){
				that.dom.remove();
				callback();
			}
		})

	}
}

var xianzhiFive = new XianzhiFive()

var imageLoading = function(){
	var imgArr = [
		'newZhuanZhuan/img/banner@3x.png',
		'newZhuanZhuan/img/bg@3x.png',
		'newZhuanZhuan/img/boder_pre_a.png',
		'newZhuanZhuan/img/boder_pre_b.png',
		'newZhuanZhuan/img/boder_pre_c.png',
		'newZhuanZhuan/img/boder_bg_img.png',
		'newZhuanZhuan/img/box_bg_l.png',
		'newZhuanZhuan/img/box_bg_m.png',
		'newZhuanZhuan/img/box_bg_s.png',
		'newZhuanZhuan/img/select_box_l_pre.png',
		'newZhuanZhuan/img/select_box_m_pre.png',
		'newZhuanZhuan/img/select_box_s_pre.png',
		'newZhuanZhuan/img/select_box_l.png',
		'newZhuanZhuan/img/select_box_m.png',
		'newZhuanZhuan/img/select_box_s.png',
		'newZhuanZhuan/img/btn_biubiu_default.png',
		'newZhuanZhuan/img/btn_biubiu_pre.png',
		'newZhuanZhuan/img/btn_biubiu.png',
		'newZhuanZhuan/img/chuhuo_err_hongbao.png',
		'newZhuanZhuan/img/chuhuo_err_tuikuan.png',
		'newZhuanZhuan/img/chuhuo_ing.png',
		'newZhuanZhuan/img/chuohuo_suc.png',
		'newZhuanZhuan/img/map_1.png',
		'newZhuanZhuan/img/winner_bg.png',
		'newZhuanZhuan/img/biubiu_toast.png',
		'newZhuanZhuan/img/xieyi_bg_max.png',
		'newZhuanZhuan/img/xieyi_bg_min.png',
		'newZhuanZhuan/img/gonglve.png',
	]

	for (var i = 0; i < imgArr.length; i++) {
		var img = new Image();
		img.src = imgArr[i]
	}
}

var tiaotiaoInterval = undefined;
var changeColorTiao = function(prame){

	clearInterval(tiaotiaoInterval)
	$('.change-color_canvas').remove();


	var _canvas = document.createElement('canvas');
	var _cxt = _canvas.getContext("2d");


	$(_canvas).addClass('change-color_canvas')

	$('body').append($(_canvas));

	var _top = $('.select-merch li:eq(' + prame.index + ')').offset().top - $(_canvas).height();
	var _left = $('.select-merch li:eq(' + prame.index + ')').offset().left;
	
	$(_canvas).css({
		'top':_top ,
		'left':_left
	})

	_canvas.width = $(_canvas).width()
	_canvas.height = $(_canvas).height()

	var scal = document.documentElement.getBoundingClientRect().width/375;
	

	var _ball = {
		x:_canvas.width/2 - 10,
		y:0,
		w:20*scal,
		h:20*scal,
		vy:5,
		g:2,
		img:prame.img
	}
	

	var count = 0;

	var tiaotiaoInterval = setInterval(function(){
		_cxt.clearRect(0, 0, _cxt.canvas.width, _cxt.canvas.height);
		_cxt.drawImage(_ball.img,_ball.x,_ball.y,_ball.w,_ball.h);

		if(count >=50){
			clearInterval(tiaotiaoInterval)
			$(_canvas).remove();
		}

		_ball.y += _ball.vy;
		_ball.vy += _ball.g;

		if (_ball.y <= 0 + _ball.h) {
			_ball.y = 0 + _ball.h;
			_ball.vy = -_ball.vy * (3 / 6);
		}

		if (_ball.y >= _canvas.height + _ball.h) {
			_ball.vy = -_ball.vy * (3 / 6);
			_ball.y = _canvas.height - _ball.h
		}

		count++

	},25)
	
}

var changeColorXiuXiu = function(prame){

	var dom = $('<div class="change-color"><img src="'+ prame.img + '"></div>')
	dom.css({
		'top':(prame.top-30)+'px',
		'left':(prame.left-30)+'px'
	})
	$('body').append(dom)
	
	
	
	setTimeout(function(){
		$('.change-color').css({
			'width':'0.1rem',
			'height':'0.1rem',
			'opacity':'0.2',
			'top':'0.28rem',
			'left':'2.53rem'
		})
	},3)

	setTimeout(function(){
		dom.remove()
		animation.minInit()
	},510)
	
}