var oder = MquJS.getParaFromUrl('order')
var pay_money = MquJS.getParaFromUrl('price')
var openId = MquJS.getParaFromUrl('openId')
console.log(oder);
// oder='123456'
// pay_money=200

if(!openId){
	openId = 'o_2wiflsdspw32132392103293'
}
var params = {"isv_code":"1028",
"order_no":decodeURI(oder),
"pay_time":formatDateTime(),
"pay_money":decodeURI(pay_money),
"pay_channel":"wxpay",
"appid":"wx21341234qwsdf3123",
"openid":openId,
"mchid":"232312312",
};
var signKey = "sUhV0GB2GeQWB2BjNjllyNr8mTZfOaxN"
console.log(params);
console.log(md5Sign(params, signKey));

postKFM(params,signKey,'container')

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