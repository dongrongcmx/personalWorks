var randomLightUpArr = [[1,7],[4,10],[12,5],[11,6],[2,9],[3,8],[12,6],[11,5],[2,8],[3,9]]

var masterImg = new Image();
masterImg.src = 'zhuanzhuan/img/productbg_normal@2x-1.png';

var Animation = function(canvas,ctx){
	this.position = [];  //每个元素的定位、大小
	this.count = ITEMCOUNT;  //总个数
	this.intervalTime = ZZ_STATUS1_TIME;  //转速
	this.animationInterval = undefined;  //定时器
	this.reviseX = -1;   //X轴修正值
	this.reviseY = -1;   //Y轴修正值
	this.reviseW = 1;  //宽修正值
	this.reviseH = 1;  //高修正值
	this.canvas = canvas;
	this.ctx = ctx;
	this.randomInterval = undefined;
	this.randomTime = RANDOM_TIME;
	this.status = 0;
	this.stopIndexs = undefined;
	this.winIndex = undefined;
}


//动画初始化
Animation.prototype.init = function(){
	clearInterval(this.animationInterval)
	clearInterval(this.randomInterval)
	this.animationInterval = undefined;  //定时器
	this.randomInterval = undefined;
	this.randomLightUp()
	this.intervalTime = ZZ_STATUS1_TIME;  //转速
	this.stopIndexs = undefined;
	this.winIndex = undefined;
	if(DEBUG){
		this.stopIndexs = 2;
		this.winIndex = 4;
	}
}

//获取每个元素的定位
Animation.prototype.getPosition = function(){
	var that = this;
	for(var i = 1;i<=this.count;i++){
		var left = $('.item'+i)[0].offsetLeft+that.reviseX;
		var top = $('.item'+i).parent()[0].offsetTop - $('.item'+1).parent()[0].offsetTop +that.reviseY;
		var width = $('.item'+i).width()+that.reviseW;
		var height = $('.item'+i).height()+that.reviseH;
		this.position.push({'left':left,'top':top,'width':width,'height':height});
	}
}

//canvas绘制
Animation.prototype.drawElementsRect = function(index,tail,stop){
	var that = this;
	if(!that.position){
		console.log('position未初始化完成')
		return;
	}

	if(!that.canvas || !that.ctx){
		console.log('画布未初始化完成')
		return;
	}
	var position = that.position;
	var ctx = that.ctx;
	//var img = new Image();
	//img.onload = function(){
		ctx.globalAlpha = 1;
		ctx.drawImage(masterImg,position[index].left,position[index].top,position[index].width,position[index].height);
		$('.item'+parseInt(index+1)+' .img-box').addClass('active')
		if(stop == true){
			clearInterval(that.animationInterval)
			sound.stop()
			setTimeout(function(){
			that.stop();
		  },400)
		}
		if(tail != undefined && tail>0 && stop == false){
			for (var i =1;i<=tail;i++) {
				var tailIndex = that.initTailIndex(index,i);
				ctx.globalAlpha = 1/(tail+1)+0.4;
				ctx.drawImage(masterImg,position[tailIndex].left,position[tailIndex].top,position[tailIndex].width,position[tailIndex].height);
			}
		}
}

//返回需要绘制的尾巴的位置
Animation.prototype.initTailIndex = function(index,tail){
	if(index-tail <0){
		return this.count+(index-tail);
	}
	return index-tail;
}

//随机点亮
Animation.prototype.randomLightUp = function(){
	var that = this;
	if(!that.canvas || !that.ctx){
		console.log('画布未初始化完成')
		return;
	}
	var ctx = that.ctx;
	var canvas = that.canvas;
	var randomIndex;
	that.randomInterval = setInterval(function(){
		var randomIndexnew = parseInt(randomLightUpArr.length*Math.random());
		//保证每次随机值不相同
		if(randomIndexnew == randomIndex){
			if (randomIndexnew == 0) {
				randomIndexnew ++;
			} else{
				randomIndexnew --;
			}
		}
		randomIndex = randomIndexnew;
		var randomVal = randomLightUpArr[randomIndex];
		ctx.clearRect(0,0,canvas.width,canvas.height);
		$('.grid-item .img-box').removeClass('active');
		for (var i = 0 ;i<randomVal.length;i++) {
			that.drawElementsRect(randomVal[i]-1)
		}
	},that.randomTime);
	zhuanzhuanBtn.status_waiting()
}

//动画准备
Animation.prototype.ready = function(){
	var that = this;
	if(!that.canvas || !that.ctx){
		console.log('画布未初始化完成')
		return;
	}
	var ctx = that.ctx;
	var canvas = that.canvas;
	clearInterval(that.randomInterval)
	clearInterval(that.animationInterval)
	ctx.clearRect(0,0,canvas.width,canvas.height);
	$('.grid-item .img-box').removeClass('active');
	for(var i = 0;i<that.count;i++){
		that.drawElementsRect(i)
	}

	lightBlinking.stop()

	setTimeout(function(){
		sound.goStart()
	},READYSOUND)

	setTimeout(function(){
		that.status_1();
		lightBlinking.intervalTime = LIGNT_FAST_TIME;
		lightBlinking.start()
	},READYTIME)

	zhuanzhuanBtn.status_working()
}

//动画开始阶段1
Animation.prototype.status_1 = function(){
	var that = this;
	var ctx = that.ctx;
	var canvas = that.canvas;

	clearInterval(that.animationInterval)
	var count = 0;
	var tail = 0;
	that.intervalTime = ZZ_STATUS1_TIME;
	that.status = 1;
	var miniCount = 2*that.count;
	that.animationInterval = setInterval(function(){
		if(count >= that.count){
			count = 0
		}
		if(tail >= 2){
			tail = 2
		}
		miniCount --;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		$('.grid-item .img-box').removeClass('active');
		that.drawElementsRect(count,tail,false)
		count ++;
		tail ++;

		//当停止位明确的时候进入第二阶段
		if(that.stopIndexs != undefined && miniCount<0){
			that.status_2(count);
			lightBlinking.stop()
			lightBlinking.intervalTime = LIGNT_SLOW_TIME
			lightBlinking.start()
		}

	},that.intervalTime)
}

//动画阶段2
Animation.prototype.status_2 = function(count){
	var that = this;
	var ctx = that.ctx;
	var canvas = that.canvas;

	clearInterval(that.animationInterval)
	that.intervalTime = ZZ_STATUS2_TIME;

	var intervalCount = 0  //至少转1圈
	that.animationInterval = setInterval(function(){
		if(count >= that.count){
			count = 0
		}

		ctx.clearRect(0,0,canvas.width,canvas.height);
		$('.grid-item .img-box').removeClass('active');
		that.drawElementsRect(count,2,false)
		count ++;
		intervalCount++;
	//	if(parseInt(intervalCount/that.count) == 1){
			var monitorIndexVal = that.monitorIndex(count,6);
			if(monitorIndexVal == true){
				that.status_3(count)
			}
	//	}

	},that.intervalTime);

}

//动画阶段3
Animation.prototype.status_3 = function(count){
	var that = this
	lightBlinking.stop()
	lightBlinking.intervalTime = LIGNT_INIT_TIME;
	lightBlinking.start()

	clearInterval(that.animationInterval)

	that.intervalTime = ZZ_STATUS3_TIME;
	that.animationInterval = setInterval(function(){
		if(count >= that.count){
			count = 0
		}

		that.ctx.clearRect(0,0,that.canvas.width,that.canvas.height);
		$('.grid-item .img-box').removeClass('active');
		that.drawElementsRect(count,2,false)

		count ++;
		var monitorIndexVal = that.monitorIndex(count,1);
			if(monitorIndexVal == true){
				that.status_4(count)
			}



	},that.intervalTime);

}

//动画阶段4
Animation.prototype.status_4 = function(count){
	var that = this

	that.intervalTime = ZZ_STATUS4_TIME;
	clearInterval(that.animationInterval)
	var stop = false;
	that.animationInterval = setInterval(function(){
		if(count >= that.count){
			count = 0
		}
		that.ctx.clearRect(0,0,that.canvas.width,that.canvas.height);
		$('.grid-item .img-box').removeClass('active');
		that.drawElementsRect(count,1,stop)

		count ++;
		if(count%12 == that.stopIndexs){
			stop = true;
		}


	},that.intervalTime);

}

//转一转结束
Animation.prototype.stop = function(){
	var that = this;
	$('#card_box .img-box img').attr('src','');
	if(that.stopIndexs == that.winIndex){
		winBoxShow(GridItemArr[that.stopIndexs]);
	}else{
		sound.lose()
		notWinBoxShow(GridItemArr[that.stopIndexs]);
		that.init();
	}
}


//监控转一转位置
Animation.prototype.monitorIndex = function(index,space){

	var nowSpace = this.stopIndexs - index;
	if(nowSpace<0){
		nowSpace = nowSpace + this.count
	}
	if(nowSpace == space){
		return true
	}

	return false;
}
