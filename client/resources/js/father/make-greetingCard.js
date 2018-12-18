 //获取可视窗口高度
    var elHeight = document.documentElement.clientHeight;
    $(".content").css({'height':elHeight});
    if($("html").width() >= 640 ){
      $(".modal-content").css({
        'left':'50%',
        'margin-left':"-318px"
      })
    };

    //轮播图
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: false, //可选选项，自动滑动
        loop: true,
        pagination: '.swiper-pagination',
    });

    //点击编辑模板
    $(".edit1").on("click",function(){
      $(".modal").fadeIn("slow");
      $(".modal-content").animate({ 
        bottom:'0rem' 
      }, 400 );
      edit(1);
    });
    $("#edit2").on("click",function(){
      $(".modal").fadeIn("slow");
      $(".modal-content").animate({ 
        bottom:'0rem' 
      }, 400 );
      edit(2);
    });
    $(".edit3").on("click",function(){
      $(".modal").fadeIn("slow");
      $(".modal-content").animate({ 
        bottom:'0rem' 
      }, 400 );
      edit(3);
    });

    //点击生成贺卡
    $(".create1").on("click",function(){
      create(1)
    });
    $(".create2").on("click",function(){
      create(2)
    });
    $(".create3").on("click",function(){
      create(3)
    });

    //取消
    $(".cancel").on("click",function(){
      $(".modal").fadeOut("slow");
      $(".modal-content").animate({ 
        bottom:'-8rem' 
      }, 400);
    });

    //保存
    $(".confirm").on("click",function(){
      if($(".edit-appellation").val() == "" || $("textarea").val() == "" || $(".edit-signature").val() == ""){
        $(".hint").css({
          "display":'block'
        })
        setTimeout("hint()",1000)
      }else{
        $(".modal").fadeOut("slow");
        $(".modal-content").animate({ 
          bottom:'-8rem' 
        }, 400 );
        update();
      }
    })
    
    //提示信息
    function hint(){
      $(".hint").css({
          "display":'none'
      })
    }

    //弹出模板
    function edit(id){
      var appellation = $("#template"+id+" .appellation h5").html();
      var content = $("#template"+id+" .details p").html();
      var signature = $("#template"+id+" .signature h5").html();
      $(".edit-appellation").val(appellation);
      $("textarea").val(content);
      $(".edit-signature").val(signature);
      $("#modalId").val(id);
    };
    //更新保存
    function update(){
      var appellation = $(".edit-appellation").val();
      var content = $("textarea").val();
      var signature = $(".edit-signature").val();
      var modalId = $("#modalId").val();
      $("#template"+modalId+" .appellation h5").html(appellation);
      $("#template"+modalId+" .details p").html(content);
      $("#template"+modalId+" .signature h5").html(signature);
    };
    //生成贺卡
    function create(id){
      var templateId = id;
      var appellation = $("#template"+id+" .appellation h5").html();
      var content = $("#template"+id+" .details p").html();
      var signature = $("#template"+id+" .signature h5").html();
      window.location.href = pathName+'/Share-page?appellation='+appellation+'&content='+content+'&signature='+signature+'&id='+templateId;
    };