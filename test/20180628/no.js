/*
* @Author: sh-liqq
* @Date:   2018-06-28 17:21:26
* @Last Modified by:   sh-liqq
* @Last Modified time: 2018-07-10 10:55:02
*/
;(function(){
	var all=document.querySelectorAll(".jd_checkbox");
	all.forEach(function(v,i){
		v.addEventListener("click", function(){
			this.classList.toggle("checked");
		});
	});
	var title=document.querySelector(".good_title .jd_checkbox");
	var contents=document.querySelectorAll(".goods_content .jd_checkbox");
	title.addEventListener("click",function(){
		content.forEach(function(v){
			if(title.classList.contains("checked")){
				v.classList.add("checked");
			}else{
				v.classList.remove("checked");
			}
		});
	});
})()

;(function(){
	var cancel=document.querySelector(".cancel");
	var confirm=document.querySelector(".confirm");
	var boxs=document.querySelectorAll(".delete_box");
	var modal=document.querySelector(".jd_modal");
	var title;
	var id;
	boxs.forEach(function(v){
		v.addEventListener("click",function(){
			modal.style.display="block";
			title=this.children[0];
			id=this.dataset.id;
			title.style.transition="all 0.5s";
			title.style.transformOrigin="right bottom";
			title.style.transform="rotate(30deg)";
		})
	})
})()

;(function(){
	var nav=document.querySelector(".jd_content .nav");
	var ul=document.querySelector(".jd_content .nav ul");
	var startY;
	var currentY=0;
	var maxY=nav.offsetHeight-ul.offsetHeight;
	ul.addEventLister("touchstart",function(e){
		startY=e.touches[0].clientY;
	});
	ul.addEventLister("touchmove",function(e){
		var distance=e.touches[0].clientY-startY;
		removeTransition();
		setTranslateY(currentY+distance);
	});
	ul.addEventLister("touchend",function(e){
		var distance=e.changeTouches[0].clientY-startY;
		currentY+=distance;
		if(currentY>0){
			currentY=0;
		}
		if(currentY<maxY){
			currentY=maxY;
		}
		addTransition();
		setTranslateY(currentY);
	})
	function addTransition(){
		ul.style.transition="all .2s";
		ul.style.transition="all .2s";
	}
	function removeTransition(){
		ul.style.transition="none";
		ul.style.webkitTransition="none";
	}
	function setTranslateY(value){
		ul.style.transform="translateY("+value+"px)";
		ul.style.webkitTransform="translateY("+value+"px)";
	}
})()

;(function(){
	var header=document.querySelector(".jd_header");
	window.addEventListener("scroll",function(){
		var opacity=0;
		var scrollTop=window.pageYOffset;
		if(scrollTop<=600){
			opacity=scrollTop/600*0.9;
		}else{
			opacity=0.9;
		}
		header.style.backgroundColor="rgba(222,24,27,"+opacity+")";
	});
})()

;(function(){
	var ul=document.querySelector(".seckill_content ul");
	var lis=ul.querySelectorAll("li");
	var liWidth=lis[0].offsetWidth;
	ul.style.width=lis.length*liWidth+"px";
})()

;(function(){
	var spans=document.querySelectorAll(".seckill_title .time span:nth-child(odd)");
	setTime();
	var timer=setInterval(setTime,1000);
	function setTime(){
		var nowTime=new Date();
		var seckillTime=new Date(2018,5,30,12,0,0);
		var time=parseInt((seckillTime-nowTime)/1000);
		if(time<=0){
			time=0;
			clearInterval(timer);
		}
		var hours=parseInt(time/3600);
		var minutes=parseInt(time/60)%60;
		var seconds=time%60;
		spans[0].innerText=addZero(hours);
		spans[1].innerText=addZero(minutes);
		spans[2].innerText=addZero(seconds);
	}
	function addZero(n){
		return n<10?"0"+n:n;
	}
})()

;(function(){
	var ul=document.querySelector(".jd_news .info ul");
	var lis=ul.children;
	var liHeight=lis[0].offsetHeight;
	var index=0;
	setTnterval(function(){
		if(index>=lis.length-1){
			index=0;
			ul.style.transition="none";
			ul.style.webkitTransition="none";
			ul.style.transform="translateY(0px)";
			ul.style.webkitTransform="translateY(0px)";
		}
		ul.offsetLeft;
		index++;
		ul.style.transition="all .5s";
		ul.style.webkitTransition="all .5s";
		ul.style.transform="translateY(-"+liHeight*index+"px)";
		ul.style.webkitTransform="translateY(-"+liHeight*index+"px)";
	},2000);
	
})()