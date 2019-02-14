/*
* @Author: sh-liqq
* @Date:   2018-07-19 13:40:00
* @Last Modified by:   sh-liqq
* @Last Modified time: 2018-07-19 16:58:16
*/
let Lock = require('../../_js/lock')
let card_index='';
let card_type='';
let card_id='';
let card_couponId='';
let card_couponRate='';
let card_couponRightSeqId='';
let card_flag=0;
rootVM=new Vue({
	el:"#root",
	data:{
		zhekoutext:'优惠加载中',
		favourable:false,
	},
	ready:function(){},
	computed:{},
	methods:{
		choiceCouponV3:function(){
			if(!(card_flag==0||card_flag==1)){
				return;
			}
			card_flag=2;
			$(".nochoose .imgs").attr('src','../images/1.png');
			this.choiceCoupon(card_id,card_couponId,card_couponRate,card_couponRightSeId);
			$(".zhekoucard .imgs").attr('src','../images/2.png');
			$(".zhekouquan .imgs").attr('src','../images/2.png');
			$(".giftcard .imgs").attr('src','../images/2.png');
			let card_index='';
			let card_type='';
			let card_id='';
			let card_couponId='';
			let card_couponRate='';
			let card_couponRightSeqId='';
			this.zhekoutext="不使用";
			this.favourable=false;
		},
		choiceCouponV2:function(id,couponId,couponRate,couponRightSeqId,index,type){
			this.favourable=false;
			if(card_flag==1&&card_index&&card_type==type){
				return;
			}
			if(type=='zhekoucard'){
				$(".zhekoucard .imgs").each(function(ind,element){
					if(ind==index){
						$(element).attr('src','../images/1.png');
					}else{
						$(element).attr('src','../images/2.png');
					}
				});
				$(".giftcard .imgs").attr('src','../images/2.png');
				$(".zhekouquan .imgs").attr('src','../images/2.png');
				$(".onchoose imgs").attr('src','../images/2.png');
			}
			if(type=='giftcard'){
				$(".giftcard .imgs").each(function(ind,element){
					if(ind==index){
						$(element).attr('src','../images/1.png');
					}else{
						$(element).attr('src','../images/2.png');
					}
				});
				$(".giftcard .imgs").attr('src','../images/2.png');
				$(".zhekouquan .imgs").attr('src','../images/2.png');
				$(".onchoose imgs").attr('src','../images/2.png');
			}
			if(type=='zhekouquan'){
				$(".zhekouquan .imgs").each(function(ind,element){
					if(ind==index){
						$(element).attr('src','../images/1.png');
					}else{
						$(element).attr('src','../images/2.png');
					}
				});
				$(".zhekoucard .img").attr('src','../images/2.png');
				$(".giftcard .imgs").attr('src','../images/2.png');
				$(".nochoose .imgs").attr('src','../images/2.png');
			}
			card_index=index;
			card_type=type;
			if(card_id==id){
				return;
			}
			card_flag=1;
			card_id=id;
			card_couponId=couponId;
			card_couponRate=couponRate;
			card_couponRightSeqId=couponRightSeqId;
			this.choiceCoupon(id,couponId,couponRate,couponRightSeqId);
			this.zhekoutext="<span style='color:red'>"+couponRate*10+"折优惠</span>"
		},
	}
})
let loadCoupon=Lock(function(phoneNumber){
	let lock=this;
	return Net.httpPost("/flow/getAccountCoupon",{"phoneNumber":phoneNumber}).then(function(response){
		
	})
})