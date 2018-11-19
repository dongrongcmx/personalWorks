
var spring_l = new Image();
spring_l.src = './tantan/img/spring_l.png';

var biubiu_img = new Image();
biubiu_img.src = './tantan/img/biubiu.png';
  

var Map = {
  map:undefined,
  exitNumArr:[false],
  mapArr:[{
    d:8,
    vertical:17,
    nodeW:30,
    nodeH:30,
    width:328,
    height:424,
    img:'./tantan/img/map_1.png',
    removeLeft:[16,23],
    removeRight:[21,27],
    startX:133,
    startY:65,
    maxY:305,
    exitNum:4,
    exitXArr:[31,92,150,212],
    top:'-0.4rem',
    ball_w:12
  },{
    d:9,
    vertical:15,
    nodeW:27,
    nodeH:27,
    width:362,
    height:456,
    img:'./tantan/img/map_2.png',
    removeLeft:[16,30],
    removeRight:[21,35],
    startX:134,
    startY:58,
    maxY:300,
    exitNum:5,
    exitXArr:[11,67,120,180,230],
    top:'-0.65rem',
    ball_w:11
  },{
    d:10,
    vertical:12,
    nodeW:21,
    nodeH:25.5,
    width:359,
    height:468,
    img:'./tantan/img/map_3.png',
    removeLeft:[22,38],
    removeRight:[28,44],
    startX:135,
    startY:58,
    maxY:311,
    exitNum:6,
    exitXArr:[15,60,100,142,183,230],
    top:'-0.7rem',
    ball_w:9
  },{
    d:9,
    vertical:12,
    nodeW:20.5,
    nodeH:24,
    width:375,
    height:436,
    img:'./tantan/img/map_4.png',
    removeLeft:[29],
    removeRight:[36],
    startX:134,
    startY:58,
    maxY:273,
    exitNum:7,
    exitXArr:[2,40,80,120,160,200,240],
    top:'-0.66rem',
    ball_w:10
  }],
  getMap:function(p){
    //获取地图对象，根据选择的概率
    
    if(p<=1 && p > 1/4){
      this.map = this.mapArr[0]
    }else if(p<=1/4 && p > 1/5){
      this.map = this.mapArr[1]
    }else if(p <= 1/5 && p > 1/6){
      this.map = this.mapArr[2]
    }else {
      this.map = this.mapArr[3]
    }

    var oldExitNumArr = this.exitNumArr.concat()
    this.exitNumArr = []

    for(var i = 0;i<this.map.exitNum;i++){
      this.exitNumArr.push(false)   //false表示这个出口没有彩蛋
    }

    if(oldExitNumArr.length >this.map.exitNum){
      //重新排序
      for(var i = 0;i<this.EggImg.length;i++){
        this.exitNumArr[i] = true;
        this.EggImg[i].index = i;
        this.EggImg[i].x = this.map.exitXArr[i]
        
        this.EggImg[i].y = this.map.maxY
      }
    }else{
      //复制之前的顺序
      for(var i = 0;i<oldExitNumArr.length;i++){
        this.exitNumArr[i] = oldExitNumArr[i]
      }
      for(var i = 0;i<this.EggImg.length;i++){
        this.EggImg[i].x = this.map.exitXArr[this.EggImg[i].index]
        this.EggImg[i].y = this.map.maxY
      }
    }

    if(animation){
      animation.MinInit()
    }
  },
  isRemoveLeft:function(index){
    //检查是否拥有左孩子，返回false则没有，不创建左孩子
    if(!this.map){
      return false;
    }
    var removeLeft = this.map.removeLeft;
    for(var i = 0;i< removeLeft.length ;i++){
      if(removeLeft[i] == index){
        return false;
      }
    }

    return true
  },
  isRemoveRight:function(index){
    //检查是否拥有右孩子，返回false则没有，不创建右孩子
    if(!this.map){
      return false;
    }
    var removeRight = this.map.removeRight;
    for(var i = 0;i< removeRight.length ;i++){
      if(removeRight[i] == index){
        return false;
      }
    }
    return true
  },
  //获取随机彩蛋位置
  getEmptyIndex : function(){
    var exitArr = []  //保存可以放彩蛋的索引
    for(var i = 0;i<this.exitNumArr.length;i++){
      if(!this.exitNumArr[i]){
        exitArr.push(i)
      }
    }

    return exitArr[parseInt(Math.random() * exitArr.length)]
  },
  backtrackEmptyIndex:function(imgIndex){
    for(var x in this.EggImg){
      if(this.EggImg[x].imgIndex == imgIndex){
        this.exitNumArr[this.EggImg[x].index] = false;
        this.EggImg.splice(x,1)
        return;
      }
    }

  },
  EggImg :[],
  pushEggImg:function(img,imgIndex){
    var index = this.getEmptyIndex()
    this.EggImg.push({
      img:img,
      imgIndex:imgIndex,
      index:index,
      x:this.map.exitXArr[index],
      y:this.map.maxY,
      w:37,
      h:46
    })
    
    this.exitNumArr[index] = true
    return index;
    
    
  }
}

/*
 *二叉树的节点对象
 */
function Node() {
  this.text = '';           //节点的文本
  this.leftChild = null;    //节点的左孩子引用
  this.rightChild = null;   //节点右孩子引用
  this.parentNode = null;   //节点父节点
}

var BallNode = function(i,d,Dep){
  this.x = undefined;
  this.y = undefined;
  this.w = 13;
  this.index = i;

  this.left = i+d;
  this.right = i+d+1;

  if(d == Dep){
    this.left = undefined;
    this.right = undefined;
  }

  this.draw = function(cxt){
    cxt.drawImage(animation.ball.img,this.x,this.y,animation.ball.w,animation.ball.w)
  }
}


var Ball = function(scale){
  this.x = 134*scale;
  this.y = 48*scale;
  this.w = Map.map.ball_w*scale;
  this.img = merchAndMultiple.active_ball;
  this.vy = 2;
  this.g = 0.2;
}

var Spring = function(scale){
  this.x = 133*scale;
  this.y = 5 *scale;
  this.w = 17*scale;
  this.h = 35*scale;
  this.img = spring_l;
  this.maxH = 35*scale;
  this.minH = 15*scale;
}

var Biubiu = function(scale){
  this.x = 118*scale;
  this.y = 35 *scale;
  this.w = 45*scale;
  this.h = 14*scale;
  this.img = biubiu_img;
}

var Animation = function(){
  this.canvas = document.getElementById("canvas");
  this.cxt = this.canvas.getContext("2d");

  this.exitNodeArr = [] //出口节点数组
  this.map = Map.map  //地图对象
  this.ballNode = []      //地图节点
  this.pathNode = undefined  //路径节点
  this.winnerIndex = undefined;
  this.winner = undefined;
}

Animation.prototype.MinInit = function(){
  this.map = Map.map
  $('.canvas').css({
    'width': this.map.width/100+'rem',
    'height': this.map.height/100+'rem',
    'background': 'url("'+this.map.img+'") no-repeat',
    'background-size': '100% auto'
  })

  $('.canvas').css({
    'transform': 'scale('+250/this.map.width+')',
    'top':this.map.top
  })

  $('body').css({
    'background':' url("'+'tantan/img/main_bg.png'+'") no-repeat',
    'background-size': '100% auto'
  })

  $('.biubiu-box').hide();
  $('.btn_go').show()
  $('.select-merch-multiple').show()
  this.auto = true;
  this.autoAni()
}
Animation.prototype.autoAni = function(){
  this.init();
  this.processSqueeze()
  //自动播放，随机出口出来
  this.winnerIndex = parseInt(Math.random()*this.map.exitNum);
  this.getPath(this.winnerIndex)
}
Animation.prototype.MaxInit = function(){
  var that = this
  this.map = Map.map
  $('.canvas').css({
    'width': this.map.width/100+'rem',
    'height': this.map.height/100+'rem',
    'background': 'url("'+this.map.img+'") no-repeat',
    'background-size': '100% auto'
  })

  $('.canvas').css({
    'transform': 'scale(1)',
    'top':'0.38rem'
  })

  $('body').css({
    'background':' url("'+'tantan/img/BG.png'+'") no-repeat center center',
    'background-size': '100% auto'
  })

  $('.biubiu-box').show();
  $('.blood').width('0')
  $('.btn_go').hide()
  $('.select-merch-multiple').hide()
  clickEvent()
  this.auto = false
  that.state = undefined

  this.init()
  setTimeout(function(){
    if(that.state == undefined){
      that.processSqueeze()
    }
    
  },3000)

  this.getPath(this.winnerIndex)
}


Animation.prototype.init = function(){
  clearInterval(this.squeezeInterval)
  clearInterval(this.popUpInterval)
  clearInterval(this.fallInterval)
  clearInterval(this.poundInterval)

  this.canvas.width = parseInt($('#canvas').css('width')) *2;
  this.canvas.height = parseInt($('#canvas').css('height'))*2; 

  this.scale = this.canvas.width/280;

  this.ball = new Ball(this.scale)
  this.spring = new Spring(this.scale)
  this.biubiu = new Biubiu(this.scale)
  // console.log(this.scale);
  
  this.initBallNode();
  this.initPath()

  this.render()
}

Animation.prototype.initBallNode = function(){
  this.ballNode = []
  var Dep = this.map.d;

  var nodeH = this.map.nodeH
  var nodeW = this.map.nodeW

  var scale = this.scale;

  var count = 0;

  for(var i = 1;i<= Dep; i++){
    for(var j = 1;j <= i; j++){
      count++;
      var item = new BallNode(count,i,Dep);
      this.ballNode.push(item);
    }
  }
  
  this.ballNode[0].x = this.map.startX * scale;
  this.ballNode[0].y = this.map.startY * scale;

  for(var i = 0;i<this.ballNode.length;i++){
    this.ballNode[i].draw(this.cxt)

    if(this.ballNode[i].left == undefined){
      continue;
    }
    var left = this.ballNode[i].left - 1;
    var right = this.ballNode[i].right - 1;

    this.ballNode[left].x = this.ballNode[i].x - nodeW*scale;
    this.ballNode[left].y = this.ballNode[i].y + nodeH*scale;

    this.ballNode[right].x = this.ballNode[i].x + nodeW*scale;
    this.ballNode[right].y = this.ballNode[i].y + nodeH*scale;
  }

}

//生成地图路线
Animation.prototype.initPath = function () {
  var that = this;
  //确定出口节点数组
  that.exitNodeArr = [];
  
  var MaxNum = Math.pow(2, that.map.d) - 1;
  var buildTree = function (node, i, d) {
    var leftIndex = 2 * i + 1, //左孩子节点的索引
      rightIndex = 2 * i + 2; //右孩子节点的索引
    if (leftIndex < MaxNum) { //判断索引的长度是否超过了charecters数组的大小
      if(Map.isRemoveLeft(node.text + d)){
        var childNode = new Node(); //创建一个新的节点对象
        childNode.text = node.text + d;
        childNode.parentNode = node;
        node.leftChild = childNode; //给当前节点node加入左孩子节点
        buildTree(childNode, leftIndex, d + 1); //递归创建左孩子
      }
    }
    if (rightIndex < MaxNum ) { //下面注释参照上面的构建左孩子的节点
      if (Map.isRemoveRight(node.text + d + 1)) {
        var childNode = new Node();
        childNode.text = node.text + d + 1;
        childNode.parentNode = node;
        node.rightChild = childNode;
        buildTree(childNode, rightIndex, d + 1);
      }
    }


    if (d == that.map.d) {
      that.exitNodeArr.push(node)
    }
  }

  //下面构造二叉树
  var node = new Node();
  node.text = 1;
  node.Dep = 1;
  buildTree(node, 0, 1); //索引i是从0开始构建

  this.pathNode = node


  this.groupExitIndex = groupByExitIndex(this.exitNodeArr)

  // console.log('出口索引',this.groupExitIndex);
  
}

Animation.prototype.getPath = function(num){
  this.path = [];
  var pathArr = this.groupExitIndex[num].number
  var _nodeIndex = pathArr[parseInt(Math.random()*pathArr.length)]
  var _node = this.exitNodeArr[_nodeIndex]
  var that = this;
  // 递归遍历节点，找到它所有的父节点
  function findParent(node){
    that.path.push(node.text)
    if(node.parentNode){
      findParent(node.parentNode)
    }
  }
  findParent(_node)
  this.path.sort(compare)
  // console.log('路径',this.path);
}

Animation.prototype.render = function(){
  var that = this;
  var cxt = this.cxt;
  cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
  cxt.drawImage(that.spring.img,that.spring.x,that.spring.y,that.spring.w,that.spring.h)
  cxt.drawImage(that.biubiu.img,that.biubiu.x,that.biubiu.y,that.biubiu.w,that.biubiu.h)

  cxt.drawImage(that.ball.img,that.ball.x,that.ball.y,that.ball.w,that.ball.w)  

  for(var i = 0;i< Map.EggImg.length;i++){
    cxt.drawImage(Map.EggImg[i].img, Map.EggImg[i].x * that.scale,Map.EggImg[i].y * that.scale,Map.EggImg[i].w* that.scale,Map.EggImg[i].h *  that.scale)  
  }
  
}
//压缩过程
Animation.prototype.processSqueeze = function(){
  var that = this;
  this.state = 'Squeeze'
  this.squeezeInterval = setInterval(function(){
    if(that.spring.h <= that.spring.minH){
      clearInterval(that.squeezeInterval)
      that.processPopUp()
    }
    var baifenbi = (that.spring.h-that.spring.minH)/(that.spring.maxH-that.spring.minH) * 100
    if(baifenbi<0){
      baifenbi = 0;
    }
    $('.blood').width(100 - baifenbi + '%')
    that.render()
    squeezeUpdate()
  },100)

  var squeezeUpdate = function(){
    that.spring.h -= 2 * that.scale
    that.biubiu.y -= 2 * that.scale
    that.ball.y = that.biubiu.h + that.biubiu.y;
  }
}

//弹出过程
Animation.prototype.processPopUp = function(){
  var that = this;
  this.state = 'PopUp'
  $('.biubiu-box').hide();
  clearInterval(this.squeezeInterval)
  clearInterval(this.popUpInterval)
  this.popUpInterval = setInterval(function(){
    if(that.spring.h >= that.spring.maxH){
      clearInterval(that.popUpInterval)
      that.fallStart()
    }
    var baifenbi = (that.spring.h-that.spring.minH)/(that.spring.maxH-that.spring.minH) * 100
    if(baifenbi<0){
      baifenbi = 0;
    }
    
    $('.blood').width(100 - baifenbi + '%')

    that.render()
    popUpUpdate()
  },20)

  var popUpUpdate = function(){
    that.spring.h += 2 * that.scale
    that.biubiu.y += 2 * that.scale
    that.ball.y = that.biubiu.h + that.biubiu.y;
  }
}



//下落过程
Animation.prototype.processFall = function(start,last,callback,num){

  clearInterval(this.fallInterval);
  var that = this;
  
  that.ball.x = start.x
  that.ball.y = start.y
  that.ball.k = (last.y - start.y - that.map.vertical * that.scale) / (last.x - start.x);
  
  that.ball.vy = 0;
  that.ball.g = 2;
    
  this.fallInterval = setInterval(function(){
    if (that.ball.y > last.y) {
      that.ball.y = last.y
      that.ball.x = last.x
      callback(num)
    }
    
    that.render()
    
    fallUpdate()
    
  },20)
  var count = 3
  var randomVX = 3;
  var fallUpdate = function(){
    that.ball.y += that.ball.vy;
    that.ball.x += that.ball.vy/that.ball.k;
    that.ball.vy += that.ball.g;

    if(that.ball.y < (start.y + that.map.vertical * that.scale)+1){
      that.ball.x = start.x;
    }else{
      that.ball.vy = 2;
      if(count > 0){
        that.ball.y = start.y + that.map.vertical * that.scale + randomVX;
        that.ball.x =  start.x + randomVX ;
        randomVX = -randomVX;
        count --
      }
    }
  }
}



Animation.prototype.fallStart = function(){
  var path = this.path;

  var that = this;

  var ballNode = this.ballNode

  var ani = function(num){
    if(num >= path.length - 1){
      clearInterval(that.fallInterval);
      that.processPound()
      return
    }
    ballNode[path[num]-1].x;
    that.processFall({
      x:ballNode[path[num]-1].x,
      y:ballNode[path[num]-1].y,
    },{
      x:ballNode[path[num + 1]-1].x,
      y:ballNode[path[num + 1]-1].y,
    },ani,num+1)
  }
  ani(0)
}

Animation.prototype.processPound = function(){
  var that = this;
  this.poundInterval = setInterval(function(){
    if(that.ball.w + that.ball.y >= (that.map.maxY + 46)* that.scale){
      clearInterval(that.poundInterval)
      if(that.auto){
        that.autoAni();
      }else{
        showResult(that.winner)
        that.MinInit();
      }
    }
    that.render()
    poundUpdate()
  },20)

  var poundUpdate = function(){
    that.ball.y += that.ball.vy;
    that.ball.vy += that.ball.g;
  }
}

function compare(val1,val2){
  return val1-val2;
}


function groupByExitIndex(info){
  let newArr = [];
  info.forEach((exit, i) => {
      let index = -1;
      let alreadyExists = newArr.some((newExit, j) => {
          if (exit.text === newExit.text) {
              index = j;
              return true;
          }
      });
      if (!alreadyExists) {
          exit.number = []
          exit.number.push(i)
          newArr.push(exit);
      } else {
          newArr[index].number.push(i)
      }
  });
  
  return newArr;
}

