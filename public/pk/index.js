var pageversion = versionControl.timeversion();

var DEBUG = true;

var is_add_ad = false;

var vmId = MquJS.getParaFromUrl('vm_id')
var opId = MquJS.getParaFromUrl('opId');
var payType = localStorage.getItem('appType');


if(payType == null || payType == 'null' || payType == undefined || payType == 'undefined'){
	if(MquJS_WX.isWeiXin()){
			payType = 1
	}else if(MquJS_AliPay.isAliPay()){
			payType = 2
	}
	localStorage.setItem('appType',payType)
}




if(DEBUG){
	// vmId = 182;
	// opId = 32821;
	vmId = 184;
	opId = 85147;
	payType = 1;
}

var brand_name =  MquJS.getCookie('brandName')
document.title = brand_name;

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


$(function() {
  FastClick.attach(document.body);

});


//调用微信js API的步棸
if (MquJS_WX.isWeiXin()) {
    var info;
		var questData = {
			url: location.href,
			vm_id:MquJS.getCookie('vmId')
		}
    $.ajax({
        type: 'post',
        url: MquJS.getDomain() + '/m/consumer/checkJSSDK',
				data:JSON.stringify(questData),
	      contentType: "application/json;charset=utf-8",
				dataType: 'json',
        success: function (data) {
            if (!data) {
                return;
            }
            if (data.code == 0 && data.result) {
                info = data.result;
            }
        }
    });
    var inter = function () {
        try {
            if (!info) {
                setTimeout(inter, 200);
                return;
            }
            wx.config({
                debug: false,
                appId: info.appId,
                timestamp: info.timestamp,
                nonceStr: info.nonceStr,
                signature: info.signature,
                jsApiList: ['hideMenuItems']
            });
        } catch (e) {

        }
    };
    inter();

    wx.ready(function () {
        wx.hideMenuItems({
            menuList: [
                'menuItem:share:appMessage', //发送给朋友
                'menuItem:share:timeline', //分享给朋友圈
                'menuItem:share:qq', //分享到QQ
                'menuItem:share:weiboApp', // 分享到Weibo
                'menuItem:favorite', // 收藏
                'menuItem:share:QZone', // 分享到 QQ 空间
                'menuItem:copyUrl', // 复制链接
                'menuItem:openWithQQBrowser', // 在QQ浏览器中打开
                'menuItem:openWithSafari', // 在Safari中打开
                'menuItem:share:email', // 邮件
                'menuItem:readMode', // 阅读模式
                'menuItem:originPage' // 原网页
            ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
    });
}
