function share(pathName){
  $.ajax({
      type: "get",
      url: pathName+"/signature",
      data: {url:location.href},
      success: function(msg){
        //配置微信JS-SDK
          wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: msg.appId, // 必填，公众号的唯一标识
              timestamp:msg.timestamp , // 必填，生成签名的时间戳
              nonceStr: msg.nonceStr, // 必填，生成签名的随机串
              signature: msg.signature,// 必填，签名，见附录1
              jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','chooseImage', 'uploadImage', 'downloadImage', 'getLocalImgData', 'previewImage', 'getNetworkType'],// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
      },
      error:function(err){
        console.log(err);
      }
  });
  wx.ready(function() {
    // 在这里调用 API
    // 分享给朋友
      wx.onMenuShareAppMessage({
          title: '全程心管家', // 分享标题
          desc: "携手全程心管家，共享健康心生活", // 分享描述
          link: pathName + "/share", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: pathName + "/image/assessment/331506325982_.pic_hd.jpg", // 分享图标
          success: function () { 
              // 用户确认分享后执行的回调函数
          },
          cancel: function () { 
              // 用户取消分享后执行的回调函数
          },
      });
      // 分享到朋友圈
      wx.onMenuShareTimeline({
          title: '全程心管家', // 分享标题
          link: pathName + "/share", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: pathName + "/image/assessment/331506325982_.pic_hd.jpg", // 分享图
          success: function () { 
              // 用户确认分享后执行的回调函数
          },
          cancel: function () { 
              // 用户取消分享后执行的回调函数
          }
      });  
  });
}