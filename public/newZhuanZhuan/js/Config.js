var UPDATA_TIME = 30; //动画刷新时长
var INIT_VX = 0;    //小球默认初始速度



/**
 * 获取盒子图片boxImgArr.getBoxInfo();
 * {w}   宽
 * {h}   高
 * {img} 图片
 */
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

/**
 * 随机地图获取RandomMap.getRandomMap();
 * {mapImg}   地图路径
 * {wallIndex} wall 坐标
 * {cleanVXCell}  出口坐标
 * {changeDirectionCell}  随机方向坐标
 */
var WALL_INDEX_1 = [
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

var WALL_INDEX_2 = [
  [0,1],
  [0,2],
  [0,3],[2,3],[10,3],[11,3],[12,3],
  [0,4],[2,4],[5,4],[6,4],[7,4],[12,4],
  [0,5],[7,5],[8,5],[11,5],[12,5],
  [0,6],[2,6],[3,6],[4,6],[7,6],[8,6],[10,6],[11,67],
  [2,7],[3,7],[4,7],[5,7],[8,7],
  [0,8],[2,8],[5,8],[8,8],[11,8],[12,8],
  [0,9],[5,9],[6,9],[8,9],[12,9],
  [0,10],[1,10],[4,10],[8,10],[9,10],[10,10],[12,10],
  [7,11],[8,11],[9,11],
  [0,12],[1,12],[2,12],[4,12],[8,12],[9,12],[11,12],[12,12],
  [0,13],[1,13],[4,13],[5,13],[7,13],[8,13],[12,13],
  [0,14],[5,14],[7,14],[10,14],[12,14],
  [0,15],[2,15],[3,15],[5,15],[7,15],[8,15],[10,15],[12,15]
]

var mapInfo1 = {
  mapImg:'./newZhuanZhuan/img/map_1.png',
  wallIndex:WALL_INDEX_1,
  cleanVXCell:[
    [2,13],
    [4,14],[6,14],[8,14],[10,15]
  ],
  changeDirectionCell:[
    [2,9],
    [5,14],[9,14]
  ]
}

var mapInfo2 = {
  mapImg:'./newZhuanZhuan/img/map_2.png',
  wallIndex:WALL_INDEX_2,
  cleanVXCell:[
    [6,13],
    [1,14],[4,14],[9,14],[11,15]
  ],
  changeDirectionCell:[
    [10,13],[3,14]
  ]
}

var RandomMap = {
  mapArr:[mapInfo1,mapInfo2],
  getRandomMap:function(){
    var index = parseInt(this.mapArr.length * Math.random())
    return this.mapArr[index]
  }
}
