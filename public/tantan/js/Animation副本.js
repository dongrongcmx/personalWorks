var biubiuImg = new Image();
biubiuImg.src = './newZhuanZhuan/img/biubiu.png';
  
var boxImgS = new Image();
boxImgS.src = './newZhuanZhuan/img/box_s.png'

var boxImgM = new Image();
boxImgM.src = './newZhuanZhuan/img/box_m.png'

var boxImgL = new Image();
boxImgL.src = './newZhuanZhuan/img/box_l.png'


var BoxImgArr = function(){
  this.arr = [{
    w : 55,
    h : 59,
    img:boxImgS
  },{
    w : 68,
    h : 60,
    img:boxImgM
  },{
    w : 81,
    h : 60,
    img:boxImgL
  }]

  this.defultInfo = this.arr[0]

  this.getBoxInfo = function(index){
    return this.arr[index]
  }

  this.setBoxInfo = function(index){
    this.defultInfo = this.arr[index]
  }

}

var boxImgArr = new BoxImgArr()

var UPDATA_TIME = 30; //动画刷新时长
var INIT_VX = 0;    //小球默认初始速度


//墙，坐标
var WALL_INDEX = [
  // [0,0],
  [0,2],
  [0,3],[1,3],[5,3],[12,3],
  [0,4],[5,4],[6,4],[7,4],[8,4],[12,4],
  [0,5],[2,5],[3,5],[4,5],[6,5],[11,5],[12,5],
  [0,6],[4,6],[6,6],[12,6],
  [0,7],[1,7],[4,7],[8,7],
  [4,8],[5,8],[7,8],[8,8],[9,8],[12,8],
  [2,9],[5,9],[7,9],[11,9],[12,9],
  [2,10],[3,10],[5,10],[7,10],[8,10],[10,10],[11,10],[12,10],
  [0,11],[8,11],
  [0,12],[3,12],[4,12],[6,12],[7,12],[8,12],[10,12],[11,12],[12,12],
  [0,13],[1,13],[3,13],[7,13],[12,13],
  [0,14],[3,14],[5,14],[7,14],[9,14],[12,14],
  [3,15],[7,15],[9,15],[11,15],[12,15]
]

//出口，坐标
var cleanVXCell = [
  [2,13],
  [4,14],[6,14],[8,14],[10,15]
]

//随机方向坐标
var changeDirectionCell = [
  // [9,7],[10,7],
  [2,9],
  [5,14],[9,14]
]




//我是一个小球球
var Ball = function(scale,img){
    this.x = 260 * scale; //这是我的圆心x
    this.y = 28 * scale;//这是我的圆心y
    this.lastX  = null//这是我上个位置的圆心x
    this.lastY = null//这是我上个位置的圆心Y
    this.w = 20 * scale;
    this.h = 20 * scale;
    this.r = 9 * scale//这是我的半径
    this.g = 2 * scale//这是我的加速度，咻咻咻
    this.vx = INIT_VX * scale//这是我的水平初速度
    this.vy = 10 * scale//这是我的垂直初速度
    this.run = true
    this.scale = scale
    if(img){
      this.img = img
    }else{
      this.img = ballDefualtImg
    }
}

var BiuBiu = function(scale){
  this.x = 260 * scale;
  this.y = 20 * scale;
  this.w = 57 * scale;
  this.h = 29 * scale;
  this.img = biubiuImg
}

//我是一个小怪兽
var Box = function(scale){

  var defultInfo = boxImgArr.defultInfo;
  this.x = 37 * scale//这是我的经度
  this.y = 456 * scale//这是我的纬度
  this.w = defultInfo.w * scale//这是我的长
  this.h = defultInfo.h * scale//这是我的宽
  this.vx = 5 * scale//这是我的速度
  this.a = 2 * scale//这是我的加速度
  this.get = false
  this.img = defultInfo.img
}

//搬砖的砖
var Wall = function(startX,startY,cxt,cell_w){
  this.startX = startX;
  this.startY = startY + cell_w/2 ;
  this.nodeIndex = undefined;
  this.after = null;
  this.cell_w = cell_w;
  this.cxt = cxt

  this.cxt.fillStyle="#A0522D";
  this.cxt.fillRect(this.startX,this.startY,this.cell_w,this.cell_w);
}

//墙体碰撞检测
Wall.prototype.ballDetection = function(ball){

  var x = ball.x + ball.r
  var y = ball.y + ball.r

  if(x > this.startX - ball.r/2 && x < this.startX + this.cell_w  + ball.r/2
   && y > this.startY - ball.r && y < this.startY + this.cell_w + ball.r ){

    // this.cxt.fillStyle="#A0522D";
    // this.cxt.fillRect(this.startX,this.startY,this.cell_w,this.cell_w);
     if(ball.vy >0 && y - ball.r<= this.startY ){
       //上侧
        ball.vy = -ball.vy* (1/4); 
        ball.y = this.startY -ball.h;

        if(ball.vx <0 && ball.vx > -4 * ball.scale){
          ball.vx = -4 * ball.scale
        }

        if(ball.vx > 0 && ball.vx > 4 * ball.scale){
          ball.vx = 4 * ball.scale
        }

        return; 
     }

     if(ball.vy <0 && y + ball.r >= this.startY + this.cell_w){
       //下侧
       if(ball.vx > 0 && ball.vx < 2.5 * ball.scale){
        ball.vx = 2.5 * ball.scale
        }

        ball.vy = -ball.vy* (1/4); 
        ball.y = this.startY + this.cell_w;
        return; 
     }

     if(ball.vx > 0 && x -ball.r <= this.startX){
       //左侧
       ball.vx = -ball.vx*(2/6)
        if(ball.vx > -4 * ball.scale){
          ball.vx = -4 * ball.scale
        }
        ball.x = this.startX - ball.w
        return;
     }

     if(ball.vx < 0 && x + ball.r >= this.startX + this.cell_w){
       //右侧
       ball.vx = -ball.vx*(2/6)
      if(ball.vx < 4 * ball.scale){
        ball.vx = 4 * ball.scale
      }
      ball.x = this.startX + this.cell_w;
      return
    }

    //小球已经完全进入障碍物里，检测上一次位置
    console.log('小球已经完全进入障碍物里');
    
    ball.vx = - ball.vx* (2/4);
    ball.vy = - ball.vy* (2/5);

    ball.x = ball.lastX + ball.vx
    ball.y = ball.lastY + ball.vy
    return;

   }

   if(this.after){
     //递归检测子节点
    this.after.ballDetection(ball)
  }
}

/**
 * 动画Animation
 * {minInit}  缩小版动画
 * {MaxInit}  放大版动画
 */
var Animation = function(){
  this.canvas = document.getElementById("canvas");
  this.cxt = this.canvas.getContext("2d");
  this.scale = undefined;

  this.wall = [];
  this.cell_w = undefined;
  this.ball = undefined;
  this.box = undefined;
  this.biubiu = undefined;

  this.stateInterval = undefined;
  this.state2Interval = undefined;
  this.state1Interval = undefined;
  this.endStatedInterval = undefined;
  this.autoAniInterval = undefined;

  this.winner = true;

}

Animation.prototype.minInit = function(){

  var _height = $('.canvas-box').height() * 0.945
  console.log($('.canvas-box').height());
  
  console.log(_height/522);
  
  $('.canvas').css({
    'transform': 'scale('+220/325+')',
    'margin-top':'0'
  })

  console.log( $('.canvas').height());
  

  $('.btn-biubiu-box').hide();
  this.init(MerchColor.getRandomBall())
  this.auto = true;
  this.autoAni();
  $('.btn_go').show();
  $('.select-merch-multiple').show()
}

Animation.prototype.MaxInit = function(){

  this.winner = false
  $('.canvas').css({
    'transform': 'scale(1)',
    'margin-top':'1.7rem'
  })

  this.auto = false;

  $('.btn_go').hide();
  $('.select-merch-multiple').hide()
  $('.btn-biubiu-box').show();
  $('.canvas-mask .blood').css('width','0')
  this.init()

  clickEvent()

  var that=this;
  this.state = undefined;

  setTimeout(function(){
    console.log(that.state);
    if(that.state == undefined){
      that.state1()
    }
    
  },3000)
  
}

Animation.prototype.init = function(img){

  clearInterval(this.endStatedInterval)
  clearInterval(this.state1Interval)
  clearInterval(this.state2Interval)
  clearInterval(this.stateInterval)
  clearInterval(this.autoAniInterval)

  this.canvas.width = parseInt($('#canvas').css('width')) *2;
  this.canvas.height = parseInt($('#canvas').css('height'))*2; 

  console.log(this.canvas.height);
  
  this.scale = this.canvas.width/325;

  this.cell_w = this.canvas.width /13;

  this.ball = new Ball(this.scale,img);
  this.box = new Box(this.scale);
  this.biubiu = new BiuBiu(this.scale)
  this.creactWall();
  

  this.changeDirectionCell = changeDirectionCell.concat();

  this.render();
  
}


Animation.prototype.autoAni = function(){
  var that = this;

  this.autoAniInterval = setInterval(function(){
    that.biubiu.x += 2 * that.scale
    that.ball.x += 2 * that.scale
    that.ball.vx = -50 * that.scale * Math.random();

    if(that.biubiu.x >= 290 * that.scale){
      that.biubiu.x = 290 * that.scale
      that.ball.x = 290 * that.scale
      clearInterval(that.autoAniInterval)
      that.state2();
    }

    that.render();
  },100)
}

//砌墙
Animation.prototype.creactWall = function(node,index){
  var that = this;
  if (!node) {
    var that = this;
    this.wall = new Wall(WALL_INDEX[0][0] * that.cell_w, WALL_INDEX[0][1] * that.cell_w , that.cxt , that.cell_w)
    this.wall.nodeIndex = 0;
    this.creactWall(this.wall, 0);
    return;
  }

  index ++;

  if(index < WALL_INDEX.length){
  var item = new Wall(WALL_INDEX[index][0]*that.cell_w,WALL_INDEX[index][1]*that.cell_w,that.cxt, that.cell_w)
    item.nodeIndex = index;
    node.after = item;
    this.creactWall(item,index)
  }

}

//绘制球球与盒子
Animation.prototype.render = function(){
  var that = this;
  var cxt = this.cxt;
  cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
  cxt.drawImage(biubiuImg,that.biubiu.x,that.biubiu.y,that.biubiu.w,that.biubiu.h)
  cxt.drawImage(that.box.img,that.box.x,that.box.y,that.box.w,that.box.h)

  if(this.ball.run){
    cxt.drawImage(that.ball.img,that.ball.x,that.ball.y,that.ball.w,that.ball.h)
  }
}

//预备备，go！
Animation.prototype.start = function(){
  this.state = 'start'
  var that = this;
  this.stateInterval = setInterval(
    function(){

      that.render();
      that.updateRun();

    },UPDATA_TIME);
}

Animation.prototype.state1 = function(){

  var count = 0;


  yinDao.remove();

  this.state = 'state1'
  $('.canvas-mask .blood').css('width','0')
  var that = this;
  this.state1Interval = setInterval(function(){
    that.biubiu.x += 2 * that.scale
    that.ball.x += 2 * that.scale
    that.ball.vx += -2 * that.scale
    $('.canvas-mask .blood').css('width',parseInt($('.canvas-mask .blood').width() + 8 * that.scale/2)+'px')
    if(that.biubiu.x >= 290 * that.scale){
      count++;
      that.biubiu.x = 290 * that.scale
      that.ball.x = 290 * that.scale
      $('.canvas-mask .blood').css('width','0.81rem')
      if(count>=5){

        clearInterval(that.state1Interval)
        that.state2();
      }
    }
    that.render();
  },100)
}

Animation.prototype.state2 = function(){
  var that = this;
  this.state = 'state2'

  $('.canvas-mask .btn-biubiu-box').hide();
  clearInterval(that.state1Interval)
  this.state2Interval = setInterval(function(){
    that.biubiu.x -= 4 * that.scale
    that.ball.x -= 4 * that.scale
    if(that.biubiu.x <= 260 * that.scale){
      that.biubiu.x = 260 * that.scale
      that.ball.x = 260 * that.scale
      clearInterval(that.state2Interval)
      that.start()
    }
    that.render();
  },10)
}

Animation.prototype.endStated = function(){
  clearInterval(this.stateInterval)
  var that = this;

  var count = 0;
  this.endStatedInterval = setInterval(function(){
    count ++;

    that.render();
    that.updateEnd(count);

    if(count >=70 ){

      if(!that.auto){
        showResult(that.winner)
      }
      clearInterval(that.endStatedInterval)
      that.minInit()
    }
  },UPDATA_TIME)

}

//随机方向检测
Animation.prototype.changeDirection = function(){
  var ball = this.ball;

  var cel = this.changeDirectionCell

  for(var i = 0;i<cel.length;i++){
    if(ball.x >= cel[i][0]*this.cell_w && ball.x <= cel[i][0]*this.cell_w + this.cell_w + ball.w 
      && ball.y >= cel[i][1]*this.cell_w - ball.h && ball.y <= cel[i][1]*this.cell_w + this.cell_w){
        var random = [-1,1,-1,-1,-1,1,-1,1,-1,1,-1,1]

        ball.vx = random[parseInt(Math.random()*random.length)] * ball.vx;
        
        cel.splice(i,1)
        return;
      }
    }
}

//出口检测
Animation.prototype.cleanVXDetection = function(){
  var ball = this.ball;
  var box = this.box;

  var that = this

  for(var i = 0;i<cleanVXCell.length;i++){
    if(ball.x > cleanVXCell[i][0]*this.cell_w && ball.x < cleanVXCell[i][0]*this.cell_w + this.cell_w + ball.w 
      && ball.y > cleanVXCell[i][1]*this.cell_w && ball.y < cleanVXCell[i][1]*this.cell_w + this.cell_w + ball.h ){
        //球球到出口啦，乖一点，不能再乱蹦
        ball.vx = 0;
        var h = box.y - ball.y - ball.h;
        var s = h/(ball.vy+ball.g)
        // var s = (h-this.ball.vy)/this.ball.g 
        if(this.winner){
          //中奖啦
          var w = box.x  + box.w/2 - ball.x - 2
          box.vx = - w / (s)
        }

        this.endStated();
      }
  }
}


//位置更新，每一步都有新的风景，加油！小球球~
Animation.prototype.updateRun = function(){
  var ball = this.ball;

  ball.lastX = ball.x;
  ball.lastY = ball.y;

  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vy += ball.g;

  this.box.x += this.box.vx;


  var h = this.box.y - this.ball.y - this.ball.h;
  // var s = (h-this.ball.vy)/this.ball.g 
  var s = h/(ball.vy+ball.g)

  var w = this.box.x + this.box.w / 2 - this.ball.x - 2

  this.box.a = this.box.vx - w / (s)
  
  this.box.vx += this.box.a/3
  

  if (this.box.vx > 10) {
    this.box.vx = 10
  } else if (this.box.vx < -10) {
    this.box.vx = -10
  }

  //碰撞检测
  this.wall.ballDetection(ball)
  //出口检测
  this.cleanVXDetection();
  //边缘检测
  this.edgeDetection();
  //随机方向检测
  this.changeDirection();
}

//位置更新，每一步都有新的风景，加油！小球球~
Animation.prototype.updateEnd = function(count){
  var ball = this.ball;

  ball.lastX = ball.x;
  ball.lastY = ball.y;

  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vy += ball.g;

  //颜色改变
  if(this.ball.y >= 410 * this.scale && !this.auto && !this.ball.chang){
    if(this.winner){
      this.ball.img = this.ballWinImg;
    }else{
      this.ball.img = MerchColor.getRandomBall()
    }
   
    this.ball.chang = true
  }

  this.box.x += this.box.vx;

  this.edgeDetection();
  this.boxDetection(count)

}


Animation.prototype.boxDetection = function(count){
  var that = this;
  var x = this.ball.x + this.ball.r
  var y =this. ball.y + this.ball.r



  if(x > this.box.x - this.ball.r/2 && x < this.box.x + this.box.w + this.ball.r /2
   && that.ball.y  > that.box.y + that.ball.r ){
    this.ball.get  = true;
    this.ball.vy = -this.ball.vy* (2/4); 
    this.ball.y = this.box.y + that.ball.r;

    if(that.box.vx>0){
      that.box.vx = 5 * that.scale;
    }else{
      that.box.vx = -5 * that.scale;
    }

    if(that.winner){
      if(that.winner){
        this.ball.x = this.box.x + this.box.w/2 - this.ball.r;
      }
    }
   }

   if(this.ball.get){
    this.ball.vx = this.box.vx
   }
  

  if(!that.winner && this.ball.get){
    this.ball.vx = -this.box.vx
  }

}

//边缘检测
Animation.prototype.edgeDetection = function(){
  var ball = this.ball;
  var cxt = this.cxt;
  //盒子边缘检测
  if(this.box.x <= 0){
    this.box.x = 0
    this.box.vx = -this.box.vx;
  }

  if(this.box.x + this.box.w >= cxt.canvas.width){
    this.box.x = cxt.canvas.width - this.box.w;
    this.box.vx = -this.box.vx;
  }

  //球球边缘检测
  if(ball.y <= 0 +ball.h){
    ball.y = 0 +ball.h;
    ball.vy = -ball.vy* (5/6);
  }
  if(ball.x <= 0 +ball.w){
    ball.x = 0 +ball.w;
    ball.vx = -ball.vx* (5/6);
  }
  if(ball.x >= cxt.canvas.width -ball.w){
    ball.x = cxt.canvas.width-ball.w;
    ball.vx = -ball.vx* (5/6);
  }

  if(ball.y >= cxt.canvas.height + ball.h){
    ball.run = false
    ball.y  = cxt.canvas.height + ball.h * 2
  }
}