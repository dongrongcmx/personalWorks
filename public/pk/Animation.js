
var chui_left = new Image();
chui_left.src = './pk/img/chui_left.png'

var jian_left = new Image();
jian_left.src = './pk/img/jian_left.png'

var bao_left = new Image();
bao_left.src = './pk/img/bao_left.png'

var chui_right = new Image();
chui_right.src = './pk/img/chui_right.png'

var jian_right = new Image();
jian_right.src = './pk/img/jian_right.png'

var bao_right = new Image();
bao_right.src = './pk/img/bao_right.png'

var left_arr = [chui_left,jian_left,bao_left,chui_left,jian_left,bao_left,chui_left,jian_left,bao_left,chui_left,jian_left,bao_left]
var right_arr = [chui_right,jian_right,bao_right,chui_right,jian_right,bao_right,chui_right,jian_right,bao_right]

var left_win_arr = [{left:chui_left,right:jian_right},{left:jian_left,right:bao_right},{left:bao_left,right:chui_right}]
var right_win_arr = [{left:chui_left,right:bao_right},{left:jian_left,right:chui_right},{left:bao_left,right:jian_right}]


var IMGWIDTH = 120*2;
var IMGHEIGHT = 97*2;
var TOP = 153*2;
var X1 = 48*2;
var X2 = 188*2;

var Animation = function(){
  this.dom = $('<div class="alert-animation animationShow">'+
  '<div class="master1 master rotate"></div>'+
  '<div class="master2 master rotate"></div>'+
    '<div class="animation-box ">'+
      '<canvas id="animation"></canvas>'+
    '</div>'+
  '</div>')

  this.winner = 0;
  this.canvas = undefined;
  this.ctx = undefined;
  this.scale =  document.body.clientWidth/375;
}

Animation.prototype.start = function(){
  var that = this;
  $('body').append(this.dom)
  this.canvas = document.getElementById('animation');
  this.canvas.width = document.body.clientWidth*2;
  this.canvas.height = 420*this.scale*2;

  var canvas = this.canvas;
  var ctx = canvas.getContext('2d');
  this.ctx = ctx;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.drawImage(chui_left,X1*this.scale,TOP*this.scale,IMGWIDTH*this.scale,IMGHEIGHT*this.scale);

  ctx.drawImage(chui_right,X2*this.scale,TOP*this.scale,IMGWIDTH*this.scale,IMGHEIGHT*this.scale);

  setTimeout(function () {
    that.state1();
  }, 500);
}

Animation.prototype.state1 = function(){
  var that = this;
  var count = 0;
  this.dom.find('.master').addClass('rotate')
  this.state1Interval = setInterval(function () {
    if(merch.winningFlag == undefined){
      that.change()
    }else{
      clearInterval(that.state1Interval)
      that.state1Interval = undefined;
      that.state2()
    }
  }, 60);
}

Animation.prototype.state2 = function(){
  console.log('state2');
  var that = this;
  var count = 0;
  this.state2Interval = setInterval(function () {
    count++
    that.change()
    if(count >= 5){
      clearInterval(that.state2Interval)
      that.state2Interval =undefined;
      that.state3()
    }
  }, 150);
}

Animation.prototype.state3 = function(){
  console.log('state3');
  var count = 0;
  var that = this;
  this.state3Interval = setInterval(function () {
    count++
    that.change()
    if(count >= 3){
      clearInterval(that.state3Interval)
      that.state3Interval = undefined;
      that.stop()
    }
  }, 300);
}

Animation.prototype.stop = function(){
  var that = this;
  var winnerItme = undefined;


  this.winner = merch.winningFlag;

  if(this.winner == 0){
    winnerItme = left_win_arr[parseInt(Math.random()*left_win_arr.length)]
  }else if(this.winner == 1){
    winnerItme = right_win_arr[parseInt(Math.random()*right_win_arr.length)]
  }else{
    this.remove()
  }

  var ctx = this.ctx;
  var canvas = this.canvas;

  console.log(winnerItme.right);

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.drawImage(winnerItme.left,X1*this.scale,TOP*this.scale,IMGWIDTH*this.scale,IMGHEIGHT*this.scale);
  ctx.drawImage(winnerItme.right,X2*this.scale,TOP*this.scale,IMGWIDTH*this.scale,IMGHEIGHT*this.scale);

  this.win(winnerItme,this.winner)
}

Animation.prototype.win = function(winnerItme,winner){
  var ctx = this.ctx;
  var canvas = this.canvas;
  var scale = this.scale;

  var that = this;

  var flag = true;
  var count = 0;

  this.dom.find('.master').removeClass('rotate')
  // this.dom.find('.master2').addClass('scale')

  var Interval = setInterval(function () {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(flag){
      ctx.drawImage(winnerItme.left,X1*scale,TOP*scale,IMGWIDTH*scale,IMGHEIGHT*scale);
      ctx.drawImage(winnerItme.right,X2*scale,TOP*scale,IMGWIDTH*scale,IMGHEIGHT*scale);
      that.dom.find('.master2').css({'transform':'scale(1)'})
    }else{
      that.dom.find('.master2').css({'transform':'scale(1.1)'})
      if(winner == 0){
        ctx.drawImage(winnerItme.left,10*scale,TOP*scale*4/5,IMGWIDTH*1.5*scale,IMGHEIGHT*1.5*scale);
        ctx.drawImage(winnerItme.right,X2*scale,TOP*scale,IMGWIDTH*scale,IMGHEIGHT*scale);
      }else{
        ctx.drawImage(winnerItme.left,X1*scale,TOP*scale,IMGWIDTH*scale,IMGHEIGHT*scale);
        ctx.drawImage(winnerItme.right,X2*scale-(18*2),TOP*scale*4/5,IMGWIDTH*1.5*scale,IMGHEIGHT*1.5*scale);
      }
    }
    flag = !flag;
    count++;
    if(count >=8){
      clearInterval(Interval);
      that.dom.find('.master2').css({'transform':'scale(1)'})
      that.dom.remove();
      merch.showWin();
    }
  }, 300);
}

Animation.prototype.change =function(){
  var that = this;
  var ctx = this.ctx;
  var canvas = this.canvas;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  var leftItem = left_arr[parseInt(Math.random()*left_arr.length)]
  var rightItem = right_arr[parseInt(Math.random()*right_arr.length)]

  ctx.drawImage(leftItem,X1*this.scale,TOP*this.scale,IMGWIDTH*this.scale,IMGHEIGHT*this.scale);
  ctx.drawImage(rightItem,X2*this.scale,TOP*this.scale,IMGWIDTH*this.scale,IMGHEIGHT*this.scale);
}

Animation.prototype.remove = function(){
  var that = this;
  clearInterval(that.state3Interval)
  clearInterval(that.state2Interval)
  clearInterval(that.state1Interval)
  that.state3Interval = undefined;
  that.state2Interval = undefined;
  that.state1Interval = undefined;
  this.dom.remove();
  this.winner = undefined;
}

var animation = new Animation();
