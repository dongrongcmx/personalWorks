var orders;

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
	loading.render()
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
							orders.getVmAndProductById();
							orders.questProductList();
					}else {
						loading.remove()
						toast.set(response.message);
					}
			},
			error:function(){
				loading.remove()
				toast.set('网络故障请重试');
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
	this.productList = [];  //弹一弹选择的商品列表
	this.winningFlag = undefined;  //是否中奖
	this.duangProductVo = undefined;  //中奖商品
	this.redPrice = undefined;

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
		this.ope_product_id = 85147;
	}

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
					return;
				}

				that.telPhone = undefined;
			},
			error: function () {
				that.telPhone = undefined;
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

	$.ajax({
			type: 'post',
			url: questUrl,
			data: JSON.stringify(questData),
			contentType: "application/json;charset=utf-8",
			dataType: 'json',
			success: function(arg){
				loading.remove();
				if(arg.code == 0){
					
					merchAndMultiple.set(productsHandle(arg.result.products))

					page.init(arg.result.products)
				}else{
					toast.set(arg.message);
				}
				
			},
			error:function(err){
				loading.remove();
				toast.set('网络故障请重试');
			}
		});
}

//预下订单
Orders.prototype.purchaseUnifiedOrder = function(){


	if(localStorage.newZhuanZhuanXieYi != true && localStorage.newZhuanZhuanXieYi != 'true'){
		var xieYi = new XieYi()
		xieYi.render();
		return;
	}
	var that=this;
	var questUrl =  this.hostname + '/m/consumer/purchaseUnifiedOrder.jsonp'

	if(MquJS_AliPay.isAliPay()){
		toast.set('主人，弹一弹暂不支持支付宝，可使用微信继续转～')
		return;
	}

	that.orderId = undefined;
	that.winningFlag = undefined;
	that.duangProductVo = undefined;
	that.hiHasBuyNum = undefined;

	that.timeCount = 12;
	that.checkWinningCount = 50;

	that.productList = []
	for (var i = 0; i < merchAndMultiple.productList.length; i++) {
		var ele = merchAndMultiple.productList[i]
		var item = {}
		item.id = ele.id
		item.discount_price = ele.discount_price
		item.purchase_price = ele.purchase_price
		item.box_number = ele.box_number

		that.productList.push(item)
	}
	var questData = {
		'customerId': that.customerId,
		'vm_id': that.vm_id,
		'productList': that.productList,
		'source_flag': that.source_flag,
		'payType':that.payType,
		'quantity':that.quantity,
		'order_type':that.order_type,
		'duang_money':merchAndMultiple.price
	}

	loading.render()

	$.ajax({
			type: 'post',
			url: questUrl,
			data: JSON.stringify(questData),
			contentType: "application/json;charset=utf-8",
			dataType: 'json',
			success: function(response) {
				loading.remove()
				console.log('预下订单response',response);
					if(response.code == 0) {
							var info = response.result;
							that.orderId = info.orderId;

							that.hiHasBuyNum = info.hiHasBuyNum;
							that.openId = info.openid;

							MquJS.setCookie('orderId', decodeURI(info.orderId), 24 * 3600);

							var limitNum = 200;
							if (info.limitNum) {
								limitNum = info.limitNum;
							}

							var limitCallback = function () {
								WeixinJSBridge.invoke(
									'getBrandWCPayRequest', {
										"appId": info.appId, //公众号名称，由商户传入
										"timeStamp": info.timestamp, //时间戳，自1970年以来的秒数
										"nonceStr": info.nonce, //随机串
										"package": info.packageName,
										"signType": "MD5", //微信签名方式：
										"paySign": info.signature //微信签名
									},
									function (res) {
										setTimeout(function () {
											if (DEBUG) {
												//支付成功,动画开始
												animation.winner = false;

												animation.MaxInit();
												//查询中奖信息
												// that.checkWinningInfo();
												return;
											}
											if (res.err_msg == "get_brand_wcpay_request:ok") {
												//支付成功,动画开始
												animation.winner = false;

												animation.MaxInit();
												//查询中奖信息
												that.checkWinningInfo();
											}
										}, 0);
									}
								);
							}

							xianzhiFive.render(limitNum, limitCallback)
					} else if(response.code == -2){
						//售罄
						that.soldOutProHandle(response.result);
						toast.set('所选商品已售罄');
					} else if(response.code == -16){
						//超过限制次数
						xianzhi.render()
						
					}else {
						toast.set(response.message)
					}
			},
			error: function() {
				loading.remove();
				toast.set('网络故障请重试')
				console.log('网络故障');
			}
			})
}

//商品售罄处理
Orders.prototype.soldOutProHandle = function(soldOutProList){
	if(!soldOutProList){
		return;
	}

	var checkArr = merchAndMultiple.data.products

	//商品售罄
	for (var i = 0; i < soldOutProList.length; i++) {
		for (var j = 0; j < checkArr.length; j++) {
			if(checkArr[j].id == soldOutProList[i].id){
				checkArr[j].sold_out = true;
				merchAndMultiple.productsRefresh()
			}
		}
	}

}

//获取订单中奖信息
Orders.prototype.checkWinningInfo = function(){
	var that=this;
	that.checkWinningCount --;
	if(DEBUG){
		that.orderId='MQ14020180810192130588312061'
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
				toast.set('网络故障请重试')
				console.log('获取订单中奖信息err',error);
			}
		});
}

//中奖结果处理
Orders.prototype.zhuanResultHandel = function(){
	var that = this;

	animation.winner = that.winningFlag;

	if(that.winningFlag){
		console.log('中奖了');
		var GridItemArr = merchAndMultiple.productList

		for (var i = 0; i < GridItemArr.length; i++) {
			if(that.duangProductVo.id == GridItemArr[i].id){
				//确定小球颜色
				animation.ballWinImg = GridItemArr[i].bgImgSrc.ball;
				that.resultInfo = {url:GridItemArr[i].url,redPrice:undefined}
			}
		}
	}else {
		console.log('未中奖');
		//确定小球颜色
		animation.ballWinImg = MerchColor.getRandomBall();
	}
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
					alertBox.dom.remove()
					alertBox.render(3)
					alertBox.refresh()
				}else {
					if(response.result.isAlreadySendRedPacket){
						//红包
						alertBox.dom.remove()
						alertBox.render(4)
						alertBox.data.redPrice = that.duangProductVo.price
						alertBox.refresh()
						return;
					}
					alertBox.dom.remove()
					alertBox.render(5)
					alertBox.refresh()
				}
			},
			error:function(error){
				toast.set('网络故障请重试')
				console.log('获取订单详情信息err',error);
			}
		});
}



//结果展示
var showResult = function(winner){
	var products = merchAndMultiple.productList
	if(winner){
		alertBox.render(1)
		var renderInfo = {
			url:orders.resultInfo.url,
			redPrice:orders.redPrice
		}

		if(DEBUG){
			renderInfo = {
				url:products[0].url,
				redPrice:products[0].price
			}
		}

		alertBox.set(renderInfo)
	}else{
		notWin.render()
	}
}

//商品信息数据处理
var productsHandle = function(products){
	var activeIndex = undefined;
	for (let index = 0; index < products.length; index++) {
		products[index].isClick = true;
		products[index].isSelect = false;
		if(products[index].id == orders.ope_product_id){
			products[index].isSelect = true;
			activeIndex = index
		}
	}

	change(products,activeIndex,0)

	var result = {}
	result.price = null;
	result.products = products;
	result.productList = []
	result.productDomList = []

	return result
}

function change(arr,k,j) {
	var c = arr[k];

	arr[k] = arr[j];
	arr[j] = c;
}