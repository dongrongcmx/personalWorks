
/**
 * 选择商品面板
 * @param {Array} groups 分组内容
 * @param {Array} products 商品内容
 * @module.exports = selectPanel;
 */

var item_html = '<div class="merch-item"><div class="merch-img"></div><p class="price"></p></div>'

var Item = function(){
  this.dom = $(item_html);
  this.data = undefined;
  this.set = function(data){
    this.data = data;
    this.refresh();
  }

  this.refresh = function(){
    var data = this.data;
    var that = this;

    if(!data){
      return
    }

    this.dom.find('.price').html('￥'+data.discountPrice.toFixed(2));

    var Img = new Image();
    Img.onload = function(){
      that.dom.find('.merch-img').html(Img);
      Img.width > Img.height && that.dom.find('.merch-img img').css({'width':'0.6rem','height':'auto'})
    }
    Img.onerror = function(){
      Img.src = './img/default_btn_uploadpic.png'
    }
    Img.src = data.imageUrl + '@100w_1e_1c.png'
  }

  this.render = function(parent){
    parent.append(this.dom)
    this.bindClick()
  }
  this.bindClick = function(){
    var that = this;
    this.dom.on({
      click:function(){
        if(merch.activeClickItem == 'left'){
          merch.leftItem = that.data
        }else{
          merch.rightItem = that.data
        }
        $('.pk-btn').removeClass('sold')
        merch.showPkInfo();
        selectPanel.remove()
      }
    })
  }
}

var Nav = function(){
  this.dom = $('<ul></ul>');
  this.data = undefined;

  this.set = function(data){
    this.data = data;
    this.refresh();
  }

  this.refresh = function(){
    var data = this.data;
    var that = this;
    if(!data){
      return;
    }
    this.dom.empty();
    this.dom.append('<li class="active" id="all">全部</li>')
    for (var i = 0; i < data.length; i++) {
      var navItem = '<li id="'+data[i].groupId+'">'+data[i].groupName+'</li>'
      this.dom.append(navItem)
    }
  }

  this.render = function(parent){
    parent.append(this.dom)
    this.bindClick();
  }

  this.bindClick = function(){
    var that = this;
    this.dom.find('li').unbind()
    this.dom.find('li').on({
      click:function(){
        that.dom.find('li').removeClass('active')
        $(this).addClass('active')
        selectPanel.selectGroup($(this).attr('id'))
      }
    })
  }
}

var nav = new Nav();


var Container = function(){
  this.dom = $('<div class="merch-right"></div>');
  this.data = undefined;

  this.set = function(data){
    this.data = data;
    this.refresh();
  }

  this.refresh = function(){
    var data = this.data;
    var that = this;
    if(!data){
      return;
    }

    this.dom.empty();
    for (var i = 0; i < data.length; i++) {
      var item = new Item();
      item.set(data[i])
      item.render(this.dom)
    }

  }

  this.render = function(parent){
    parent.append(this.dom)
  }

}

var container = new Container();

var html = '<div class="select-container opacityShow">'+
  '<div class="btn_closed">'+
    '<img src="./pk/img/icon_closed@3x.png" alt="">'+
  '</div>'+
  '<div class="merch-box scrollTop">'+
    '<div class="nav-left"></div>'+
  '</div>'+
'</div>'



var SelectPanel = function(){
  this.dom = $(html);
  this.data = undefined;
  this.set = function(data){
    this.data = data;
    this.refresh();
  }

  this.refresh = function(){
    var data = this.data;
    var that = this;
    if(!data){
      return;
    }

    var groups = data.groups

    if(!groups || groups.length<1){
      this.dom.find('.nav-left').remove()
      this.dom.find('.merch-box').css('justify-content','center');
    }else{
      nav.set(groups);
      nav.render(this.dom.find('.nav-left'));
    }

    var products = data.products;
    container.set(products);
    container.render(this.dom.find('.merch-box'));
  }

  this.render = function(){
    $('body').append(this.dom)
    this.bindClick();
  }

  this.bindClick = function(){
    var that = this;
    this.dom.find('.btn_closed').on({
      click:function(){
        that.remove();
      }
    })
  }

  this.remove = function(){
    var that = this;
    that.dom.find('.merch-box').addClass('scrollDown');
    that.dom.addClass('opacityHide');
    setTimeout(function () {
      that.dom.find('.merch-box').removeClass('scrollDown');
      that.dom.removeClass('opacityHide');
      that.dom.remove();
    }, 400);
  }

  this.selectGroup = function(groupId){
    if(!groupId){
      return;
    }

    if(groupId == 'all'){
      container.set(this.data.products);
    }else{
      var _products = [];
      var products = this.data.products;
      for (var x in products) {
        if (products[x].groupId == groupId) {
          _products.push(products[x])
        }
      }
      container.set(_products);
    }
  }
}

var selectPanel = new SelectPanel()
