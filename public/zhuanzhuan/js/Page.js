var DEBUG = true;
var orders = undefined;
//5个商品默认位置
var proPosition = [[7,11],[1,8],[4,12],[3,10],[5]];
//宫格数组
var GridItemArr = []


//宫格对象
var GridItem = function(){
	this.index = 0;
	this.id = undefined;
	this.card = true;
	this.node = undefined;
	this.img = undefined;
	this.price = undefined;
	this.active = false;
}

//宫格数组排布
var gridItemInit = function(){
	GridItemArr = []
	for(var i = 1;i<=ITEMCOUNT;i++){
		var gridItem = new GridItem();
		gridItem.node = $('.item'+i)
		gridItem.index = i-1;
		GridItemArr.push(gridItem);
	}
}

//所有商品
var Merchandise = function(mainId) {
	this.activeMerArr = [];
	this.merchandiseArr = [];
	this.products = [];
	this.imags = [];
	this.mainId = MquJS.getParaFromUrl('opId');
	this.mainMerch = {};
	this.multiple =0;
	this.needPay = 0;
	this.totalPrice = 0;
	this.miniPrice = undefined;
	if(DEBUG){
		this.mainId = 85147
	}
}

Merchandise.prototype.showMerchList = function() {
	var that = this;
	var products = that.products;
	$('.pro-check-box').empty();

	for(var i = 0; i < products.length; i++) {
		if(that.mainId == products[i].id) {
			var merchandiseItem = new MerchandiseItem(products[i]);
			that.merchandiseArr.push(merchandiseItem);
			that.totalPrice = merchandiseItem.price;
			$('.pro-check-box').append(merchandiseItem.Elem_node);
			if(!products[i].sold_out){
				merchandiseItem.addActive();
				that.activeMerArr.push(merchandiseItem);
			}
		}
	}

	for(var i = 0; i < products.length; i++) {
		if(that.mainId != products[i].id) {
			var merchandiseItem = new MerchandiseItem(products[i]);
			that.merchandiseArr.push(merchandiseItem);
			$('.pro-check-box').append(merchandiseItem.Elem_node);
		}
	}

	gridItemInit();
	//分布

	that.distributed();
	that.refreshShowMul();
}

//刷新倍数显示
Merchandise.prototype.refreshShowMul = function(){
	$('.multiple-item').show();
	var that = this;
	var activeMerArr = that.activeMerArr;
	if(activeMerArr.length<=0){
		that.miniPrice = undefined;
		multipleClick = false;
		that.multiple = 1
		$('.multiple-item').removeClass('active');
		$('.multiple-box .multiple1 img').attr('src','zhuanzhuan/img/mul1.png')
		$('.multiple-box .multiple2 img').attr('src','zhuanzhuan/img/multiplex2.png')
		$('.multiple-box .multiple3 img').attr('src','zhuanzhuan/img/multiplex3.png')
		$('.multiple-box').css('opacity',"0.5")
		return
	}
	multipleClick = true;
	$('.multiple-box').css('opacity',"1")
	if(that.multiple == 1){
		$('.multiple-box .multiple1').addClass('active')
		$('.multiple-box .multiple1 img').attr('src','zhuanzhuan/img/mul' + activeMerArr.length + '_ac.png')
	}else {
		$('.multiple-box .multiple1 img').attr('src','zhuanzhuan/img/mul' + activeMerArr.length + '.png')
	}

	function sortPrice(a,b){
			if(!a || !b || !a.price || !b.price){
				return
			}
      return a.price-b.price
    }
  activeMerArr.sort(sortPrice);
	that.miniPrice = activeMerArr[0].price;
	//隐藏3倍和5倍
	if(activeMerArr.length*3>that.miniPrice){
		$('.multiple2').hide()
		$('.multiple3').hide()
		multipleImgInit();
		return;
	}
	//隐藏5倍
	if(activeMerArr.length*5>that.miniPrice){
		$('.multiple3').hide()
		multipleImgInit();
		return;
	}
}
//选中商品刷新
Merchandise.prototype.refreshActive = function() {
	var that = this;
	if(!that.merchandiseArr) {
		return;
	}
	var activeMerArr = []
	var totalPrice = 0;
	var merchandiseArr = that.merchandiseArr;
	//获取激活状态的商品
	for(var i = 0; i < merchandiseArr.length; i++) {
		if(merchandiseArr[i].check) {
			activeMerArr.push(merchandiseArr[i]);
			totalPrice += merchandiseArr[i].price;
		}
	}

	that.activeMerArr = activeMerArr;
	that.totalPrice = totalPrice;


	//超过3个商品禁止点击
	for(var i = 0; i < merchandiseArr.length; i++) {
		if(activeMerArr.length>=3){
			if(!merchandiseArr[i].check){
				merchandiseArr[i].forbid = true;
				merchandiseArr[i].Elem_node.addClass('none')
				merchandiseArr[i].Elem_node.find('.pro-check-boder img').hide()
			}
		}else{
			if(!merchandiseArr[i].check && !merchandiseArr[i].is_sold_out){
				merchandiseArr[i].forbid = false;
				merchandiseArr[i].Elem_node.removeClass('none')
				merchandiseArr[i].Elem_node.find('.pro-check-boder img').show();
			}
		}
	}

	that.refreshShowMul();
	that.reNeedPay();
}

Merchandise.prototype.reNeedPay = function(){
	var that = this;
	that.needPay = that.multiple * that.activeMerArr.length;
	$('.need-pay p').text('￥'+that.needPay);
	var probability = (that.needPay * that.activeMerArr.length/that.totalPrice)*100;
	var probabilityText = 0;
	if(!probability){
		probabilityText = 0;
	}else {
		probabilityText = probability.toFixed(1) + '%'
	}
	$('.probability p').text(probabilityText);
}


//选中商品随机分布
Merchandise.prototype.distributed = function(){
	var that = this;
	var merchandiseArr = that.merchandiseArr;
	if(!merchandiseArr){
		return;
	}

	//商品展示
	for(var i = 0;i<merchandiseArr.length;i++){
		var positionArr = proPosition[i];
		for(var j = 0;j<positionArr.length;j++){
			var proIndex = positionArr[j];
			GridItemArr[proIndex-1].id = merchandiseArr[i].id;
			GridItemArr[proIndex-1].card = false;
			GridItemArr[proIndex-1].img = merchandiseArr[i].src;
			GridItemArr[proIndex-1].price = merchandiseArr[i].price;
			$('.item'+proIndex + ' .img-box img').attr('src',merchandiseArr[i].src);
		}
	}


	//卡图展示
	var imags = that.imags
	if(!imags){
		imags = [{'minImageUrl':'zhuanzhuan/img/cardlogo1.png','maxImageUrl':'zhuanzhuan/img/cardtest1.png'}]
	}
	var  count = 0;
	for(var i = 0;i<GridItemArr.length;i++){
		if(GridItemArr[i].card){
			count++
			var imgeIndex = count%imags.length;
			GridItemArr[i].node.addClass('card');
			GridItemArr[i].img = imags[imgeIndex];
			// GridItemArr[i].node.find('.img-box img').attr('src',imags[imgeIndex].minImageUrl);
			GridItemArr[i].node.find('.img-box img').attr('src','zhuanzhuan/img/cardlogo3.png');
		}
	}

	console.log('商品展示：',GridItemArr);
	PageInit();

}

//初始化商品列表
merchandise = new Merchandise();


//单个商品
var MerchandiseItem = function(product) {
	this.product = product;
	this.price = product.discount_price;
	this.src = product.url+'@120w_1e_1c.png';
	this.id = product.id;
	this.is_sold_out = product.sold_out;
	this.Elem_node = undefined;
	this.check = false;
	this.forbid = false;
	this.init();
}

//单个商品初始化
MerchandiseItem.prototype.init = function() {
	var that = this;
	var _html = '<div class="pro-img-box">' +
		'<img src=' + that.src + ' />' +
		'</div>' +
		'<div class="pro-check-boder">' +
		'<img src="zhuanzhuan/img/item-boder.png" />' +
		'</div>' +
		'<div class="pro-price">￥' + that.price.toFixed(2) + '</div>' +
		'<div class="pro-sold-out" hidden="hidden">售罄</div>'

	var divElem = document.createElement('div');
	var $divElem = $(divElem);
	$divElem.addClass('pro-check-item')
	$divElem.html(_html);
	$divElem.on({
		touchend: function() {
			that.clickEvent();
		}
	});
	that.Elem_node = $divElem;
	if(that.is_sold_out){
		that.soldOut();
	}
}
//售罄状态
MerchandiseItem.prototype.soldOut = function(){
	var that = this;
	that.removeActive();
	this.is_sold_out = true;
	that.forbid = true;
	that.Elem_node.find('.pro-check-boder img').hide()
	that.Elem_node.addClass('sold-out')
	that.Elem_node.find('.pro-sold-out').attr('hidden',false)
	merchandise.refreshActive()
}
//激活状态
MerchandiseItem.prototype.addActive = function() {
	var that = this;
	that.Elem_node.addClass('active');
	that.Elem_node.find('.pro-check-boder img').attr('src', 'zhuanzhuan/img/item-boder-ac.png');
	that.check = true;
}

//移去激活状态
MerchandiseItem.prototype.removeActive = function() {
	var that = this;
	that.Elem_node.removeClass('active');
	that.Elem_node.find('.pro-check-boder img').attr('src', 'zhuanzhuan/img/item-boder.png')
	that.check = false;
}

//商品点击事件
MerchandiseItem.prototype.clickEvent = function() {
	var that = this;
	//禁止点击，退出
	if(that.forbid) {
		return;
	}

	sound.btnStart()
	//更改选中状态
	that.check = !that.check;
	if(that.check) {
		that.addActive();
	} else {
		that.removeActive();
	}
	//选中商品数组刷新
	merchandise.refreshActive();
}

var AppId = function(){
	this.oprAId = undefined;
	this.vm_id = MquJS.getParaFromUrl('vm_id');
	this.payType = 1;
	this.hostname = MquJS.getDomain();
	if(DEBUG){
		this.vm_id = 184
	}
}

AppId.prototype.getAppId = function(){
	var that = this;
	$('#loading').show();
	$.ajax({
			type:'get',
			url:that.hostname + '/m/consumer/getAppId.jsonp?vmId=' + that.vm_id + '&payType=' + that.payType,
			jsonp: 'callback',
			dataType: 'jsonp',
			success:function(response){
					if(response.code == 0){
							//运营商id
							that.oprAId = response.result.appId;

							orders = new Orders();
							orders.getUserInfo();
							orders.getVmAndProductById();
							orders.questProductList();
					}else {
						$('#loading').hide();
						toast(response.message);
					}
			},
			error:function(){
				$('#loading').hide();
				toast('网络故障请重试');
			}
	});
}

var appId = new AppId();
appId.getAppId();

var Orders = function(){
	this.hostname = MquJS.getDomain();
	this.orderId = undefined;
	this.pay = undefined;
	this.ope_product_id = MquJS.getParaFromUrl('opId');
	this.source_flag = 2;
	if(!DEBUG){
		this.customerId = MquJS.getCookie(appId.oprAId);
	}
  this.vm_id = MquJS.getParaFromUrl('vm_id');
	this.quantity = 1;  //商品数量
	this.order_type = 3;
	this.duang_money = undefined;  //转一转金额
	this.productList = [];  //转一转选择的商品列表
	this.winningFlag = undefined;  //是否中奖
	this.duangProductVo = undefined;  //中奖商品
	this.winImg = undefined;
	//支付方式
	this.payType = localStorage.getItem('appType');
	this.timeCount = 12;
	this.checkWinningCount = 50;
	if(this.payType == null || this.payType == 'null' || this.payType == undefined || this.payType == 'undefined'){
	    if(MquJS_WX.isWeiXin()){
	        this.payType = 1
	    }else if(MquJS_AliPay.isAliPay()){
	        this.payType = 2
	    }
	    localStorage.setItem('appType',this.payType)
	}

	//调试模式
	if(DEBUG){
		this.customerId = 631254;
		this.vm_id = 184;
		this.payType = 1;
		this.ope_product_id = 85147
	}

}

//获取用户信息
Orders.prototype.getUserInfo = function(){
	var that = this;
	if(!this.customerId){
		console.log('无效的用户ID');
		return;
	}
	var questUrl = this.hostname + '/m/consumer/getUserInfo.jsonp?customerId='+this.customerId;

	$.ajax({
			type: 'get',
			url: questUrl,
			contentType: "application/json;charset=utf-8",
			dataType: 'jsonp',
			success: function(arg){
				console.log(arg);
				if(arg.code == 0){
					var headImg = new Image();
					headImg.crossOrigin = "Anonymous"
					headImg.src = arg.result.headImgUrl+'?'+new Date().getTime();
					that.headImg = headImg;
				}else {
					that.headImg = undefined;
					that.headBase64  = undefined;
				}
			},
			error:function(err){
				that.headImg = undefined;
				that.headBase64  = undefined;
				console.log(err);
			}
		});
}

//获取运营商信息
Orders.prototype.getVmAndProductById =function(){
	var that = this;
	$.ajax({
			type: 'get',
			url: that.hostname + '/m/consumer/findOperatorPropertyByVmId.jsonp',
			data: {
					'vmId': that.vm_id
			},
			jsonp: 'callback',
			dataType: 'jsonp',
			success: function (response) {
				if(response.code == 0){
					that.telPhone = response.result.aft_sell_cont_way
				}else {
					$('.telPhone').hide();
				}
			},
			error: function () {
				$('.telPhone').hide();
					//toast('网络异常请重试')
			}

	});
}

//获取商品信息
Orders.prototype.questProductList = function(){
	var questUrl =  this.hostname + '/m/consumer/getDuangProduct'

	var questData = {
		'vm_id':this.vm_id,
		'operator_product_id':this.ope_product_id,
		'pay_type':this.payType
	}
	console.log(questData);
	$.ajax({
			type: 'post',
			url: questUrl,
			data: JSON.stringify(questData),
			contentType: "application/json;charset=utf-8",
			dataType: 'json',
			success: function(arg){
				console.log(arg);
				$('#loading').hide();
				if(arg.code == 0){
					merchandise.products = arg.result.products;
					merchandise.imags = arg.result.images;
				  merchandise.showMerchList();
				}
			},
			error:function(err){
				$('#loading').hide();
				toast('网络故障请重试');
			}
		});
}

//预下订单
Orders.prototype.purchaseUnifiedOrder = function(){
	var that=this;
	var questUrl =  this.hostname + '/m/consumer/purchaseUnifiedOrder.jsonp'

	if(merchandise.activeMerArr.length<1){
		toast('请选择至少一个商品转一转')
		return;
	}

	if(MquJS_AliPay.isAliPay()){
		toast('主人，转一转暂不支持支付宝，可使用微信继续转～')
		return;
	}

	that.orderId = undefined;
	that.proImg = undefined;
	that.imageBase64 = undefined;
	that.winningFlag = undefined;
	that.duangProductVo = undefined;
	that.hiHasBuyNum = undefined;
	that.winImg = undefined;
	that.timeCount = 12;
	that.checkWinningCount = 50;

	that.productList = [];
	for (var i = 0; i < merchandise.activeMerArr.length; i++) {
		that.productList.push(merchandise.activeMerArr[i].product)
		delete that.productList[i].sold_out
		delete that.productList[i].url
		delete that.productList[i].winning_index
		delete that.productList[i].short_name
		delete that.productList[i].product_name
		delete that.productList[i].box_id
		delete that.productList[i].price
	}
	var questData = {
		'customerId': that.customerId,
		'vm_id': that.vm_id,
		'productList': that.productList,
		'source_flag': that.source_flag,
		'payType':that.payType,
		'quantity':that.quantity,
		'order_type':that.order_type,
		'duang_money':merchandise.needPay
	}
	console.log(questData)

	$('#loading').show();
	$.ajax({
			type: 'post',
			url: questUrl,
			data: JSON.stringify(questData),
			contentType: "application/json;charset=utf-8",
			dataType: 'json',
			success: function(response) {
				$('#loading').hide();
				console.log('预下订单response',response);
					if(response.code == 0) {
							var info = response.result;
							that.orderId = info.orderId;

							that.hiHasBuyNum = info.hiHasBuyNum;

							MquJS.setCookie('orderId', decodeURI(info.orderId), 24 * 3600);
							WeixinJSBridge.invoke(
									'getBrandWCPayRequest', {
											"appId": info.appId, //公众号名称，由商户传入
											"timeStamp": info.timestamp, //时间戳，自1970年以来的秒数
											"nonceStr": info.nonce, //随机串
											"package": info.packageName,
											"signType": "MD5", //微信签名方式：
											"paySign": info.signature //微信签名
									},
									function(res) {
											setTimeout(function () {
												if(DEBUG){
													//支付成功,动画开始
													animation.ready();
													//查询中奖信息
													
													that.zhuanResultHandel();
													return;
												}
													if(res.err_msg == "get_brand_wcpay_request:ok") {
															//支付成功,动画开始
															animation.ready();
															//查询中奖信息
															that.checkWinningInfo();
													}
											},0);
									}
							);
					} else if(response.code == -2){
						//售罄
						that.soldOutProHandle(response.result);
						toast('所选商品已售罄');
					} else if(response.code == -16){
						//超过限制次数
						xianzhi.render()
						
					}else {
						toast(response.message)
					}
			},
			error: function() {
				$('#loading').hide();
				toast('网络故障请重试')
				console.log('网络故障');
			}
			})
}

//商品售罄处理
Orders.prototype.soldOutProHandle = function(soldOutProList){
	if(!soldOutProList){
		return;
	}

	//商品售罄
	for (var i = 0; i < soldOutProList.length; i++) {
		for (var j = 0; j < merchandise.merchandiseArr.length; j++) {
			if(merchandise.merchandiseArr[j].id == soldOutProList[i].id){
				merchandise.merchandiseArr[j].soldOut();
			}
		}
	}

}

//获取订单中奖信息
Orders.prototype.checkWinningInfo = function(){
	var that=this;
	that.checkWinningCount --;
	if(DEBUG){
		that.orderId='MQ18220180523182653690750577'
	}
	var questUrl =  this.hostname + '/m/consumer/checkWinningInfo.jsonp?orderId='+that.orderId;
	$.ajax({
			type: 'get',
			url: questUrl,
			contentType: "application/json;charset=utf-8",
			dataType: 'json',
			success: function(response) {
				console.log('获取订单中奖信息',response);
				if(response.code == -4 && that.checkWinningCount >= 0){
					setTimeout(function(){
						that.checkWinningInfo();
					},300);
					return;
				}

				if(response.code == 0){
					that.winningFlag = response.result.winningFlag;
					that.duangProductVo = response.result.duangProductVo;
				}else{
					that.winningFlag = false;
				}


				that.zhuanResultHandel();
			},
			error:function(error){
				toast('网络故障请重试')
				console.log('获取订单中奖信息err',error);
			}
		});
}


//中奖结果处理
Orders.prototype.zhuanResultHandel = function(){
	var that = this;

	if(DEBUG){
		let testArr = [true,false]
		that.winningFlag = testArr[parseInt(testArr.length*Math.random())]
		that.duangProductVo = merchandise.activeMerArr[parseInt(merchandise.activeMerArr.length*Math.random())]
	}
	
	if(that.winningFlag){
		console.log('中奖了');
		for (var i = 0; i < GridItemArr.length; i++) {
			if(that.duangProductVo.id == GridItemArr[i].id){
				var proImg = new Image();
				proImg.crossOrigin = '*';
				proImg.src = GridItemArr[i].img+'?'+new Date().getTime();
				that.proImg = proImg;
				animation.winIndex = GridItemArr[i].index;
				animation.stopIndexs = GridItemArr[i].index;
			}
		}
	}else {
		console.log('未中奖');
		animation.winIndex = undefined;
		//没有中奖，随机停在没有被选择的商品或者卡牌上
		for (var i = 0; i < GridItemArr.length; i++) {
			for (var j = 0; j < merchandise.activeMerArr.length; j++) {
				if(GridItemArr[i].id == merchandise.activeMerArr[j].id){
					GridItemArr[i].active = true;
				}
			}
		}
		var notActiveItemArr = []
		for (var i = 0; i < GridItemArr.length; i++) {
			if(!GridItemArr[i].active){
				notActiveItemArr.push(GridItemArr[i].index);
			}
		}
		var randomIndex = parseInt(Math.random()*notActiveItemArr.length);
		animation.stopIndexs = notActiveItemArr[randomIndex];
		console.log(animation.stopIndexs);
	}
}

Orders.prototype.orderInfoHandle = function(){
	var that = this;
	$('.checkOrder').on({
		touchend:function(){

			$('.alert').hide();

			$('#pro_show_box .pro-box img').attr('src',that.winImg)
			$('#chuhuo_ing').show();
			$('#pro_show_box').show();
			that.getOrderInfoByOrderId();
			$('.checkOrder').unbind();
		}
	});
}
//获取订单详情信息
Orders.prototype.getOrderInfoByOrderId = function(){
	var that=this;
	that.timeCount --;
	var questUrl =  this.hostname + '/m/consumer/notifyPayStatus.jsonp?orderId='+that.orderId+'&vm_id='+that.vm_id;
	console.log('getOrderInfoByOrderId questUrl:',questUrl);
	$.ajax({
			type: 'get',
			url: questUrl,
			contentType: "application/json;charset=utf-8",
			dataType: 'jsonp',
			success: function(response) {
				if(response.code == -4 && that.timeCount >= 0){
					setTimeout(function(){
						that.getOrderInfoByOrderId();
					},3*1000);
					return;
				}

				if(response.code == 0){
					//出货成功
					$('.con-box-item').hide();
					$('#chuhuo_suc').show()
				}else {
					if(response.result.isAlreadySendRedPacket){
						//红包
						$('.con-box-item').hide();
						$('#chuhuo_shiyong').show()
						$('#chuhuo_shiyong .prompt').text('已领取￥'+that.duangProductVo.price+'红包')
						return;
					}
					$('.con-box-item').hide();
					$('#chuhuo_err').show()
				}
			},
			error:function(error){
				toast('网络故障请重试')
				console.log('获取订单详情信息err',error);
			}
		});
}


//中奖结果展示
var winBoxShow = function(item){

	winCanvas = new WinCanvas(merchandise.needPay,item.price);
	orders.winImg = item.img;
	orders.orderInfoHandle();
}

//未中奖结果展示
var notWinBoxShow = function(item){
	
	if(is_add_ad){
		if(orders.hiHasBuyNum != undefined && navigator.userAgent.indexOf('Android')>0){
			orders.hiHasBuyNum++;
			var adEnforceReturn = adEnforce.set({num:orders.hiHasBuyNum})
			if(adEnforceReturn){
				$('.alert-not-win-iframe iframe').attr('src','ad.html?order='+orders.orderId+'&price='+merchandise.totalPrice*100)
				$("#iframe")[0].onload = function () {
					var scall = document.documentElement.clientHeight/document.documentElement.clientWidth;
					$('.alert-not-win-iframe .iframe').height(document.documentElement.clientWidth*scall)
				}
				$('.alert-not-win-iframe').show();
				slideIn($('.alert-not-win-iframe .not-win-box-iframe '))
				return;
			}
			$('.alert-not-win .iframe p').text(getRandomText())
			
		}else{
			$('.alert-not-win .iframe p').text(getRandomText())
		}
		
	}else{
		$('.iframe').remove()
		$('.not-win-box').removeClass('ad_box')
		$('.btn-box').remove();
		$('.again-btn').show();
	}
	$('.alert-not-win').show();
	slideIn($('.alert-not-win .not-win-box'))
}


var slideIn = function($node){
	$node.show()
	$node.removeClass('slideOut')
	$node.addClass('slideIn')
}

var slideOut = function($node){
	console.log('slideOut');
	$node.removeClass('slideIn')
	$node.addClass('slideOut')
	setTimeout(function(){
		$node.removeClass('slideOut')
		$('.alert').hide()
		$('.con-box-item').hide();
		sound.bgStart();
	},200);
}
