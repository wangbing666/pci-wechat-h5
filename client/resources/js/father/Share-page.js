//获取可视窗口高度
    var elHeight = document.documentElement.clientHeight;
    $("body").css({'height':elHeight});
    $(".img").css({
    	'background':"url("+imagepathName+image+")",
    	'background-size':"100% 100%"
    });

    //禁止触摸拖动网页
    // $('body').on('touchmove', function (event) {
    //   event.preventDefault();
    // });

    //计算页面转发次数和人数
    function share(){
    	$.ajax({
    		type:"get",
    		url: pathName+"/transpond",
    		success:function(msg){
    			console.log(msg);
    		}
    	})
    }

	wx.ready(function () {
    // 在这里调用 API
    	wx.onMenuShareAppMessage({
		    title: '定制贺卡|给父亲的节日礼物', // 分享标题
		    desc: '送给自己永远的盖世英雄！', // 分享描述
		    link: 'http://pci.qcxin.com/pci-wechat/father/father?share=share', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: 'http://pci.qcxin.com/pci-wechat/image/father/share.png', // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		        share()
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    },
		});
		wx.onMenuShareTimeline({
		    title: '定制贺卡|给父亲的节日礼物', // 分享标题
		    link: 'http://pci.qcxin.com/pci-wechat/father/father?share=share', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: 'http://pci.qcxin.com/pci-wechat/image/father/share.png', // 分享图
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		        share()
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});	 
  	});
//将网页保存为图片
window.onload = function(){
    var w = document.body.scrollWidth;
    var h = document.body.scrollHeight;
    //要将 canvas 的宽高设置成容器宽高的 2 倍
    var canvas = document.createElement("canvas");  
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    var context = canvas.getContext("2d");
    //然后将画布缩放，将图像放大两倍画到画布上
    context.scale(2,2);
    $(".content").css({
        'display':'block'
    });
    html2canvas(document.body, {
        canvas:canvas,
        onrendered: function(canvas) {
            document.body.innerHTML='';
            $("body").append("<div class='test'><div class='save'>长按保存下面图片给你的父亲吧</div><div class='arrows'><span></span></div></div>");
            var dataUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  
            var newImg = document.createElement("img");
            newImg.src =  dataUrl;
            newImg.width = w;
            newImg.height = h;
            document.body.appendChild(newImg);
        }
    });
}
	  
