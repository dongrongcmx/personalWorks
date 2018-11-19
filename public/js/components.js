var MquJS = {
  toYuanStr: function(cents) {
    return cents * 0.01;
  },
  isBlank: function(value) {
    if (value && value != '') {
      return false;
    }
    return true;
  },
  getParaFromUrl: function(key) {
    var search = location.search;
    if (search && search[0] == '?') {
      search = search.substr(1);
      var arr = search.split('&');
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        var kvs = arr[i].split('=');
        if (kvs.length != 2) {
          continue;
        }
        if (kvs[0] == key) {
          return kvs[1];
        }
      }
    }
    return null;
  },
  formatDateHandleZero: function(formatTime) {
    if (formatTime < 10) {
      return '0' + formatTime;
    } else {
      return formatTime;
    }
  },
  getCookie: function(name) {
    var arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },
  setCookie: function(name, value, seconds) {
    seconds = seconds || 0;
    var expires = '';
    if (seconds != 0) {
      var date = new Date();
      date.setTime(date.getTime() + seconds * 1000);
      expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + escape(value) + expires + '; path=/';
  },
  back: function() {
    var flag = false;
    if (
      navigator.userAgent.indexOf('MSIE') >= 0 &&
      navigator.userAgent.indexOf('Opera') < 0
    ) {
      // IE
      if (history.length > 0) {
        flag = true;
      }
    } else {
      //非IE浏览器
      if (
        navigator.userAgent.indexOf('Firefox') >= 0 ||
        navigator.userAgent.indexOf('Opera') >= 0 ||
        navigator.userAgent.indexOf('Safari') >= 0 ||
        navigator.userAgent.indexOf('Chrome') >= 0 ||
        navigator.userAgent.indexOf('WebKit') >= 0
      ) {
        if (window.history.length > 1) {
          flag = true;
        }
      } else {
        //未知的浏览器
        flag = true;
      }
    }
    return flag;
  },
  showIndicator: function() {
    var str =
      '<div class="mq-indicator-overlay"></div><div class="mq-indicator-modal"></div>';
    $('body').append(str);
    $('.mq-indicator-overlay').css('visibility', 'visible');
    $('.mq-indicator-modal').show();
  },
  hideIndicator: function() {
    $('.mq-indicator-overlay').remove();
    $('.mq-indicator-modal').remove();
  },
  /******最完美解决 图片在图片框内按宽高比例自动缩放！！！***/
  //Img:要放图片的img元素，onload时传参可用this

  //maxHeight  :img元素的高度，像素（图片框 最大高度）

  //maxWidth:img元素的宽度，像素（图片框 最大宽度）
  AutoSize: function(Img, maxWidth, maxHeight) {
    var image = new Image();
    //原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
    image.src = Img.src;
    image.onload = function() {
      // 当图片比图片框小时不做任何改变
      if (image.width < maxWidth && image.height < maxHeight) {
        $(Img).width(image.width);
        $(Img).height(image.height);
      } else {
        //原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
        if (maxWidth / maxHeight <= image.width / image.height) {
          //原图片宽高比例 大于 图片框宽高比例
          $(Img).width(maxWidth); //以框的宽度为标准
          $(Img).height(maxWidth * (image.height / image.width));
        } else {
          //原图片宽高比例 小于 图片框宽高比例
          $(Img).width(maxHeight * (image.width / image.height));
          $(Img).height(maxHeight); //以框的高度为标准
        }
      }
    };
  },
  /*****获取接口调用的域名地址******/
  getDomain: function() {
    var url = location.href;
    if (url.indexOf('http://mob.mianqu.me/wechattest/VMMobileWeb') > -1) {
      //预发域名地址http
      return 'http://prem.mianqu.me';
    } else if (
      url.indexOf('https://mob.mianqu.me/wechattest/VMMobileWeb') > -1
    ) {
      //预发域名地址https
      return 'https://prem.mianqu.me';
    } else if (
      url.indexOf('https://mob.mianqu.me/VMMobileWeb') > -1
    ) {
      //正式环境接口域名地址https
      return 'https://m.mianqu.me';
    }else if (
      url.indexOf('http://mob.mianqu.me/VMMobileWeb') > -1
    ) {
      //正式环境接口域名地址http
      return 'http://m.mianqu.me';
    } else if (url.indexOf('http://mob.mianqu.me/test/VMMobileWeb') > -1) {
      //测试环境域名地址http
      return 'http://testm.mianqu.me';
    } else if (url.indexOf('https://mob.mianqu.me/test/VMMobileWeb') > -1) {
      //测试环境域名地址https
      return 'https://testm.mianqu.me';
    } else if (
      url.indexOf('http://mob.mianqu.me/wechattest/VMMobileWeb/mqtest') > -1
    ) {
      //开发环境域名地址
      return 'http://testm.mianqu.me';
    } else {
      //return 'http://192.168.8.118:8080';
      return 'http://testm.mianqu.me';
    }
  },
  /***获取一个随机的uuid****/
  guid: function() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  }
};

var MquJS_AliPay = {
  isAliPay: function() {
    var ua = navigator.userAgent;
    if (ua.indexOf('AlipayClient') != -1) {
      return true;
    }
    return false;
  },
  authorize: function(targetUrl, scope, isplatform) {
    var host = MquJS.getDomain();
    //正式环境接口域名地址
    $.ajax({
      type: 'get',
      url: host + '/m/consumer/getConfig',
      data: {
        vm_id: MquJS.getCookie('vmId'),
        pay_type: 2
      },
      jsonp: 'callback',
      dataType: 'jsonp',
      success: function(response) {
        var appId = '';
        if (response.code == 0) {
          appId = response.result.appid;
        } else {
          //如果是平台，
          if (isplatform) {
            appId = '2016103102439473';
          } else {
            //configuration 为0 没有配置信息
            var url = '';
            var callback = '';
            if (targetUrl && targetUrl != '') {
              url = targetUrl;
            } else {
              url = location.href;
            }
            if (url.indexOf('?') != -1) {
              callback = '&configuration=0';
            } else {
              callback = '?configuration=0';
            }
            var target = '';
            if (url.indexOf('#') != -1) {
              target = url.split('#')[0] + callback + '#' + url.split('#')[1];
            } else {
              target = url + callback;
            }
            window.location.href = target;
            return;
          }
        }
        MquJS.setCookie('AOprAId', appId, 24 * 3600);
        var url = '';
        var callback = '';
        if (targetUrl && targetUrl != '') {
          url = targetUrl;
        } else {
          url = location.href;
        }
        if (url.indexOf('?') != -1) {
          callback = '&callback=callback';
        } else {
          callback = '?callback=callback';
        }
        var target = '';
        if (url.indexOf('#') != -1) {
          target = encodeURIComponent(
            url.split('#')[0] + callback + '#' + url.split('#')[1]
          );
        } else {
          target = encodeURIComponent(url + callback);
        }
        location.href =
          'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' +
          appId +
          '&scope=' +
          scope +
          '&redirect_uri=' +
          target +
          '&state=mq';
      }
    });
  },
  auth_AliPay_Code: function(authData) {
    var host = MquJS.getDomain();
    $.ajax({
      type: 'GET',
      url: host + '/m/consumer/ali_authorize.jsonp',
      jsonp: 'callback',
      dataType: 'jsonp',
      data: authData.data,
      success: function(response) {
        var result = {
          code: 0,
          data: '',
          msg: ''
        };
        if (response.code == 0) {
          MquJS.setCookie(
            authData.oprAId,
            response.result.customerId,
            30 * 24 * 3600
          );
          MquJS.setCookie('userid', response.result.customerId, 30 * 24 * 3600);
          result.code = 0;
          result.data = response.result.customerId;
          authData.success(result);
          return;
        }
        result.msg = response.message;
        result.code = response.code;
        authData.success(result);
      },
      error: function(e) {
        authData.error();
      }
    });
  }
};

var MquJS_WX = {
  isWeiXin: function() {
    var nowUa = navigator.userAgent.toLowerCase();
    if (nowUa.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    } else {
      return false;
    }
  },
  getWXVersion: function() {
    var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
    if (wechatInfo) {
      return wechatInfo[1];
    }
  },
  authorize: function(targetUrl, wxAType, isplatform) {
    var host = MquJS.getDomain();
    $.ajax({
      type: 'get',
      url: host + '/m/consumer/getConfig',
      data: {
        vm_id: MquJS.getCookie('vmId'),
        pay_type: 1
      },
      jsonp: 'callback',
      dataType: 'jsonp',
      success: function(response) {
        var appId = '';
        if (response.code == 0) {
          appId = response.result.appid;
          //如果是平台
        } else {
          if (isplatform) {
            appId = 'wxe7debbba0cc6a28a';
          } else {
            //configuration 为0 没有配置信息
            var url = '';
            var callback = '';
            if (targetUrl && targetUrl != '') {
              url = targetUrl;
            } else {
              url = location.href;
            }
            if (url.indexOf('?') != -1) {
              callback = '&configuration=0';
            } else {
              callback = '?configuration=0';
            }
            var target = '';
            if (url.indexOf('#') != -1) {
              target = url.split('#')[0] + callback + '#' + url.split('#')[1];
            } else {
              target = url + callback;
            }
            window.location.href = target;
            return;
          }
        }
        MquJS.setCookie('WOprAId', appId, 24 * 3600);
        var url = '';
        var callback = '';
        if (targetUrl && targetUrl != '') {
          url = targetUrl;
        } else {
          url = location.href;
        }
        if (url.indexOf('?') != -1) {
          callback = '&callback=callback';
        } else {
          callback = '?callback=callback';
        }
        var target = '';
        if (url.indexOf('#') != -1) {
          target = encodeURIComponent(
            url.split('#')[0] + callback + '#' + url.split('#')[1]
          );
        } else {
          target = encodeURIComponent(url + callback);
        }
        location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
          appId +
          '&redirect_uri=' +
          target +
          '&response_type=code&scope=' +
          wxAType +
          '&state=mq#wechat_redirect';
      }
    });
  },
  auth_WX_Code: function(authData) {
    MquJS.showIndicator();
    var host = MquJS.getDomain();
    $.ajax({
      type: 'GET',
      url: host + '/m/consumer/authorize.jsonp',
      jsonp: 'callback',
      dataType: 'jsonp',
      data: authData.data,
      success: function(response) {
        MquJS.hideIndicator();
        var result = {
          code: 0,
          data: '',
          msg: ''
        };
        if (response.code == 0) {
          MquJS.setCookie(
            authData.oprAId,
            response.result.customerId,
            30 * 24 * 3600
          );
          MquJS.setCookie('openid', response.result.customerId, 30 * 24 * 3600);
          result.code = 0;
          result.data = response.result.customerId;
          authData.success(result);
          return;
        }
        result.msg = response.message;
        result.code = response.code;
        authData.success(result);
      },
      error: function(e) {
        MquJS.hideIndicator();
        authData.error();
      }
    });
  }
};

/*授权入口方法：微信授权、支付宝授权**/
var MquJS_Common = {
  prepare: function(preData) {
    if (MquJS_WX.isWeiXin()) {
      //var openId = MquJS.getCookie('openid');
      var openId = MquJS.getCookie(preData.oprAId);
      if (openId == null || openId == 'undefined' || openId == '') {
        if (MquJS.getParaFromUrl('callback') == null) {
          MquJS_WX.authorize(
            preData.targetUrl,
            preData.scope,
            preData.isplatform
          );
        } else {
          var code = MquJS.getParaFromUrl('code');
          var vmId = '';
          if (preData.isplatform) {
            vmId = -1;
          } else {
            vmId = MquJS.getCookie('vmId');
          }
          var authData = {
            code: code,
            scope: preData.scope,
            vm_id: vmId
          };
          MquJS_WX.auth_WX_Code({
            data: authData,
            oprAId: preData.oprAId,
            success: function(response) {
              preData.success(response);
            },
            error: function() {
              preData.error();
            }
          });
        }
      } else {
        var response = {
          code: 0,
          data: openId
        };
        preData.success(response);
      }
    } else if (MquJS_AliPay.isAliPay()) {
      //var userId = MquJS.getCookie('userid');
      var userId = MquJS.getCookie(preData.oprAId);
      if (userId == null || userId == 'undefined' || userId == '') {
        if (MquJS.getParaFromUrl('callback') == null) {
          MquJS_AliPay.authorize(
            preData.targetUrl,
            preData.scope,
            preData.isplatform
          );
        } else {
          var code = MquJS.getParaFromUrl('auth_code');
          var vmId = '';
          if (preData.isplatform) {
            vmId = -1;
          } else {
            vmId = MquJS.getCookie('vmId');
          }
          var authData = {
            auth_code: code,
            vm_id: vmId
          };
          MquJS_AliPay.auth_AliPay_Code({
            data: authData,
            oprAId: preData.oprAId,
            success: function(response) {
              preData.success(response);
            },
            error: function() {
              preData.error();
            }
          });
        }
      } else {
        var response = {
          code: 0,
          data: userId
        };
        preData.success(response);
      }
    }
  }
};

var MquJS_Check = {
  authCode: function(code) {
    var reg = /(^\d{4}$)|(^888$)/;
    return reg.test(code);
  },
  phoneNumber: function(phoneNumber) {
    var reg = /^(1[0-9]{10})$/;
    return reg.test(phoneNumber);
  },
  carNo: function(no) {
    if (no.length != 7) {
      return '请输入正确的车牌号';
    }

    var firstReg = /^[\u4E00-\u9FA5]+$/;
    if (!firstReg.test(no.substring(0, 1))) {
      return '请输入正确的车牌号';
    }

    var secondReg = /^[a-zA-Z]+$/;
    if (!secondReg.test(no.substring(1, 2))) {
      return '请输入正确的车牌号';
    }

    var thirdReg = /^[a-zA-Z0-9]+$/;
    if (!thirdReg.test(no.substring(2, no.length))) {
      return '请输入正确的车牌号';
    }

    return '';
  },
  email: function(email) {
    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    return reg.test(email);
  },
  cardNo: function(cardId) {
    var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
    return reg.test(cardId);
  }
};
