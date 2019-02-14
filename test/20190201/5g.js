let Event = require('../../_js/protocol/event');
let Net = require('../../_js/protocol/net');
let Helper = require('../../_js/helper');
let WebView = require('../../_js/protocol/webview');
let Lock = require('../../_js/lock');
let Validation = require('../../_js/validation');
let Session = require('../../_js/protocol/session');
let Vue = require('vue');
Vue.use(require('../../_js/vue/directive/tap'));
let _ = require('lodash');
let Dimmer = require('../../_component/message/dimmer/dimmer');
let Popup = require('../../_component/message/pop-up/pop-up');
let returnURL;
Vue.component('pop-up', Popup.component);
Vue.component('pop-up-confirm', Popup.confirmComponent);
Vue.component('dimmer', Dimmer.component);
var Payutils = require('../../_js/payutils');
Payutils.ready();
var rootVM;
let ajaxOptions = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
}

let queryParams = Helper.toParams(location.search);
let channelid = queryParams&&queryParams.channelid?queryParams.channelid:'';
let openId = queryParams.open_id;//获取openId
var isWeixin = isWeixin();
if (isWeixin && (openId == undefined || openId == null || openId == '')) {
    var backUrl = encodeURIComponent(location.href);
    var start = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxedc17f7b2e83c9a2&redirect_uri=';
    var end = '&response_type=code&scope=snsapi_base#wechat_redirect';
    var bksurl = 'https://api.10010sh.cn/v2/third/wechat/code?delegate_code=8000012&back_url=' + backUrl;
    var redurl = start + encodeURIComponent(bksurl) + end;
    window.location.href = redurl;
}
function isWeixin() {
    var a = navigator.userAgent.toLowerCase();
    return "micromessenger" == a.match(/MicroMessenger/i) ? !0 : !1
}

Event.ready(function (env) {

    rootVM = new Vue({
        el: "#root",
        data: {
            phoneNu:'',
            msgConfirmTitle:"温馨提示",
            ifShowMsgConfirmDiv:false,
            msgConfirmDivContent:"",
            msgConfirmDivBtn1:"",
            msgConfirmDivBtn2:"",
            ifShowMsgDiv:false,
            msgDivContent:"",
            istccshowsev:false,
            orderDesc:'',
            dimmerShowMsg:'',
            actname:'',
            bstShowDiv:false,
            sendcontainer: "获取验证码",
            btn1Msg: "",
            secs: 300,//验证码倒计时
            rootVM.actId:1000000000117012,
        },
        computed: {},
        ready:function(){

        },
        methods: {
            clickMsgConfirmDivCloseBtn:function () {
                rootVM.ifShowMsgConfirmDiv = false;
            },
            clickToQuanIndex:function(){
                WebView.open("../card/card_list.html");
            },
            clickMsgDivCloseBtn:function () {
                rootVM.ifShowMsgDiv = false;
            },

            //点击验证码弹窗
            clickToGetFree:function(){
                getGoods();
                rootVM.bstShowDiv=true;
            },
            bstPayWayDiv:function(){
                rootVM.bstShowDiv=false;
            },
            toPayConfirm:function(){
                if (this.smsCode != "" || coupon.cost == 0) {

                    rootVM.istccshowsev=true;
                    buildOrder().then(jumpToPayway).catch(loadErrorMsg);
                } 

            },
            // 发送验证码
            send: function () {
                sendSMS();
            },
        },
        watch:{

        },
    });
    iflogin();
});

//发送验证码
let sendSMS = Lock(function () {
    let lock = this;
    var params = {actId: 'rootVM.actId'};
    Net.httpGet('/pay/sendkey', params)
        .then(function (response) {
            if (response == 1) {
                countdowns(response);
            } else {
                response.toString();
                //{"msg":"成功","errorCode":0,"userId":"1231","info":{"phone":"13127712627","starLevel":"普通用户"}}
                //{"responseResult":"0","errorMsg":"短信发送太频繁，请五分钟后再试~"}
                alert(response.errorMsg);

            }
        }).catch(function (e) {
        // rootVM.refreshKaptcha();
        alert("发送短信验证码失败");
    }).finally(function () {
        lock.release();
    });
});
// 验证码倒计时
let countdowns = function (answer) {

        $("#btn5").hide();
        $("#btn15").show();

    if (--rootVM.secs > 0) {
        rootVM.btn1Msg = "已发送(" + rootVM.secs + "s)";
        setTimeout(countdowns, 1000);
    }else {

            $("#btn5").show();
            $("#btn15").hide();

        rootVM.sendcontainer = "重新发送";
        rootVM.secs = 300;
    }
};


let showMessage = function(msg){
    rootVM.dimmerShowMsg = msg;
    rootVM.dimmerShowFlag = true;
    setTimeout(function () {
        rootVM.dimmerShowFlag = false;
    }, Dimmer.defaultDuration);
};
// 登录
function iflogin(){
    Net.httpGet('queryAccountInfo').then(res => {
        if(res!=null&&res!=''){
            rootVM.phoneNu=res.account.phoneNumber;
            console.log("已登录");
        }
        else{
            console.log("未登录");
        }
    });
}

//商品查询
function getGoods() {
    let params = { actId : rootVM.actId  };//获取产品信息
    Net.httpGet('/activity/info/'+actId, params).then(function (res) {
        if (res) {
            rootVM.actname = res.actTitle;

        }else {
            rootVM.actname = '免费领流量包';
        }


    });
}

let buildOrder = Lock(function () {
    var lock = this;
    var backurl = "https://qy.chinaunicom.cn/mobile-h5/pay/showpayresult-vip.html";
    let requrl = openId&&openId!=undefined&&openId!=''?("/pay/buildOrderNewV2?" + "&openId=" + openId + "&backUrl=" + backurl +"&orderDesc="+rootVM.actname+"&smsCode="+rootVM.smsCode):("/pay/buildOrderNewV2?" + "&backUrl=" + backurl +"&orderDesc="+rootVM.actname+"&smsCode="+rootVM.smsCode);
    rootVM.goodsList=[];
    rootVM.goodsList.push({goodsId: 1000000000090409});
    return Net.httpPost(requrl
        , JSON.stringify({
            actId: rootVM.actId,
            goodsList:rootVM.goodsList,
            smsCode:rootVM.smsCode,
        }), ajaxOptions
    ).then(function (response) {
        return response;
    }).finally(function () {
        lock.release();
    });
});
let jumpToPayway = function (data) {
    rootVM.istccshowsev=false;
    console.log(data);
    if (data.responseResult == '0') {
        rootVM.ifShowMsgDiv=true;
        if(data.errorMsg!=null&&data.errorMsg.indexOf('您已参加过本活动了')>=0){
            rootVM.msgDivContent="小主，您本月已经领取过了，不要贪心，下个月还可以再来领取一次哦。";
        }
        else{
            rootVM.msgDivContent=data.errorMsg;
        }
    } else if (data.responseResult == "1") {

        if (data.isNeedPay === '1') {
            //将订单数据传给支付公司
            $("#payRequestForm").remove();
            $("body").append(data.form);
            // return;
            document.forms['payRequestForm'].submit();
        } else {
            rootVM.ifShowMsgConfirmDiv = true;
            rootVM.msgConfirmDivContent = "领取成功";
            rootVM.msgConfirmDivBtn1 = "朕知道了";
            rootVM.msgConfirmDivBtn2 = "立即查看";
        }
    }
};

let loadErrorMsg = function () {
    showdimmer("网络异常", null, null);
}
/**
 * 显示dimmer信息
 *
 * @param msg
 *            dimmer信息
 * @param callback
 *            消失后执行的方法
 * @param time
 *            展示时间，即xx毫秒后显示
 */
let showdimmer = function (msg, callback, time) {
    rootVM.dimmerMsg = msg;
    rootVM.dimmerFlag = true;
    if (time == undefined || $.trim(time) == "" || time == null) {
        setTimeout(function () {
            rootVM.dimmerFlag = false;
            if (callback != undefined && callback != "" && callback != null) {
                callback();
            }
        }, Dimmer.defaultDuration);
    } else {
        setTimeout(function () {
            rootVM.dimmerFlag = false;
            if (callback != undefined && callback != "" && callback != null) {
                callback();
            }
        }, time);
    }
}

