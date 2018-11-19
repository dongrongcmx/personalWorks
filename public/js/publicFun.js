/**
 * Created by wangxiaoyu on 17/7/28.
 */
var versionControl = {
    /*timeversion: function () {
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /!****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****!/
        var timeversion = '';
        for (i = 0; i < 5; i++) {
            timeversion += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        timeversion += Date.parse(new Date());
        return timeversion;
    },*/
    timeversion:function () {
        return '2.7.0.23'
    },
    loadScript: function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if(typeof(callback) != "undefined"){
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = function () {
                    callback();
                };
            }
        }
        script.src = url;
        document.body.appendChild(script);
    }
};

var mqRedFun = {
    /**
     * 红包使用状态标识  0:未使用 1:已使用 2:已失效 3:已过期
     */
    redPacketStatus: function(status) {
        switch (status) {
            case 1:
                return '已使用';
            case 2:
                return '已失效';
            case 3:
                return '已过期';
        }
    },
    /**
     * 红包列表项渲染
     */
    redListItemLayout: function(redItem) {
        var redMoneyLimit = '',redDateLimit = '',redIconImg = '';
        if(redItem.usedFlag == 0) {
            if (redItem.packetType == 1 || redItem.useMoneyScope == null || redItem.useMoneyScope == 'null') {
                redMoneyLimit = '无门槛';
            } else {
                redMoneyLimit = '满￥' + redItem.useMoneyScope + '可用';
            }
        }else {
            redMoneyLimit = mqRedFun.redPacketStatus(redItem.usedFlag);
        }
        if(redItem.packetType == 1 || redItem.endTime == null || redItem.endTime == 'null'){
            redDateLimit = '永久有效'
        }else {
            redDateLimit = redItem.startTime.substr(0, 10).replace(/-/g, '.') +
                '-'+ redItem.endTime.substr(0, 10).replace(/-/g, '.');
        }
        if(redItem.packetType == 2 && redItem.imageUrl && redItem.imageUrl != 'null'){
            redIconImg = '<img src="'+ redItem.imageUrl +'"/>';
        }
        var packetReson =
            redItem.packetType == 1
                ? '由于出货失败，将退赔一个等额红包，指定运营商使用'
                : '';
        var redItemHtml = '<li class="clearfix">' +
            '<div class="red-packet-info '+
            (redItem.usedFlag == 0 ? '' : 'abnormal') +
            '">' +
            '<div class="red-bag-detail-content">' +
            '<h2>'+ redIconImg + redItem.packetName +'</h2>' +
            '<p>'+ redDateLimit +'</p>' +
            '</div>' +
            '<div class="red-bag-detail-amount">' +
            '<span>'+ redItem.amount +'</span>' +
            '<p>'+ redMoneyLimit +'</p>' +
            '</div>' +
            '</div>' +
            '<div class="red-packet-reason">'+ packetReson +'</div></li>';
        return redItemHtml;
    },
};
var mxfFun = {
    getEnvironment: function () {
        var url = location.href;
        if (
            url.indexOf('http://mob.mianqu.me/VMMobileWeb') > -1 ||
            url.indexOf('https://mob.mianqu.me/VMMobileWeb') > -1

        ) {//正式环境
            return 'prod';
        } else if (
            url.indexOf('http://mob.mianqu.me/wechattest/VMMobileWeb') > -1 ||
            url.indexOf('https://mob.mianqu.me/wechattest/VMMobileWeb') > -1
        ) {//预发布环境
            return 'prep';
        } else if (
            url.indexOf('http://mob.mianqu.me/test/VMMobileWeb') > -1 ||
            url.indexOf('https://mob.mianqu.me/test/VMMobileWeb') > -1
        ) {//测试环境
            return 'test';
        }
    },
    bankAppAuthorize: function (preData) {
        var customerKey = this.getEnvironment()+preData.appType+'ID';
        var customerVal = localStorage.getItem(customerKey);
        if(!customerVal || customerVal == 'undefined' || customerVal == 'null'){
            var appUserId = this.getBankUserId(preData.appType);
            localStorage.setItem(mxfFun.getEnvironment()+preData.appType+'Guid', appUserId);
            var key = '';
            if(preData.appType == 'ABC'){
                key = 'abc';
            }else if(preData.appType == 'CCB'){
                key = 'ccb';
            }
            $.ajax({
                type: 'get',
                url: hostname + '/m/consumer/'+key+'_authorize?'+key+'id=' + appUserId,
                dataType: 'json',
                success: function(response) {
                    if (response.code == 0) {
                        localStorage.setItem(customerKey, response.result.customerId);
                        preData.success(response.result);
                    }
                }
            });
        }else {
            var result = {customerId: customerVal};
            preData.success(result);
        }
    },
    //农行/建行用户唯一标识
    getBankUserId: function(bankType) {
    var idH = '';
        if (bankType == 'CCB') {
            idH = bankType + '-';
        }else if(bankType == 'ABC'){
            idH = bankType + '-';
        }
        return (
            idH +
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            })
        );
    }
};
