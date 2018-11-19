

var signKey = "BG2Q2BQ3C8QDUeI9bnidGH8nmQByGmF6"

function getRandomText(){
	var textArr = [
		'每日福利，优惠升级',
		'获得新福利',
		'请笑纳这份福利',
		'即刻获得赏金',
		'冰爽一夏，福利畅享',
		'高温福利，100%有奖',
		'百万惊喜红包点击瓜分',
		'今日特惠，最高返50元',
		'100万优惠券免费抢',
	]
	var index = parseInt(Math.random()*textArr.length)
	return textArr[index]
}

function showAd(oder,pay_money,openId){
	var _openId = openId;
	if(!_openId){
		_openId = 'o_2wiflsdspw32132392103293'
	}
	var params = {"isv_code":"1022",
	"order_no":decodeURI(oder),
	"pay_time":formatDateTime(),
	"pay_money":decodeURI(pay_money),
	"pay_channel":"wxpay",
	"appid":"wx21341234qwsdf3123",
	"openid":_openId,
	"mchid":"232312312",
	};
	postKFM(params,signKey,'container')
}


function formatDateTime() {
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + m + d + h + minute + second;
}
