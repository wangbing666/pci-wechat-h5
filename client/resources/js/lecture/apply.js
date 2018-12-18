  var pickerEl = $('#showPicker');
  var lectureEl = $("#showPickerlecture");
  var nameEl = document.getElementById("showPicker");
  var lectureEL = document.getElementById("showPickerlecture");
  var sex = document.getElementById('sex');
  var lectureInput = document.getElementById('lecture');
  var lecture = [];
  var json = JSON.parse(jsondata);
  for (var i = 0; i < json.length; i++) {
    var data = {};
    data.text = json[i].name;
    data.value = json[i].id;
    lecture.push(data);
  };

  var data = [{
    text: '男',
    value: 1
  }, {
    text: '女',
    value: 2
  }];

 var lecturePicker = new Picker({
    data:[lecture],
    selectedIndex:[0],
    title:'您的选择'
 });

  var picker = new Picker({
    data: [data],
    selectedIndex: [0],
    title: '您的选择'
  });

  picker.on('picker.select', function(selectedVal, selectedIndex) {
    nameEl.innerText = data[selectedIndex[0]].text;
    sex.value = data[selectedIndex[0]].text;
  });

  lecturePicker.on('picker.select', function(selectedVal, selectedIndex) {
    lectureEL.innerText = lecture[selectedIndex[0]].text;
    lectureInput.value = lecture[selectedIndex[0]].value;
  });

  pickerEl.on('click', function() {
    picker.show(function(){
      picker.refillColumn(0, data);
    });
  });

  lectureEl.on('click', function() {
      $(".space").text("");
      lecturePicker.show(function(){
        lecturePicker.refillColumn(0, lecture);
      });

  });


  /*方法调用*/
  name();
  age();
  //验证姓名
  function name(){
    $(".name").bind('keyup blur',function(){
          var val = $(this).val();
          if(val === ""){
             $(this).next('p').html("请填写姓名");
             $(this).siblings('label').children().css({'color':'red'});
             $("button").removeClass("submit");
           }else{
              if(!(/^[\u4e00-\u9fa5a-zA-Z]([\s\u4e00-\u9fa5a-zA-Z])+$/).test(val)){ 
                $(".name").next('p').html("姓名只能填写中文或英文");
                $("button").removeClass("submit"); 
              }else{
                $(this).next('p').html("");
                $(this).siblings('label').children().css({'color':'#000'});
                button();
              }    
           };
          
      });
  }
  //验证年龄
  function age(){
    $(".age").bind('keyup blur',function(){
          var val = $(this).val();
          if(val == ""){
             $(this).next('p').html("请填写年龄");
             $(this).siblings('label').children().css({'color':'red'});
             $("button").removeClass("submit");
           }else{
              $(this).next('p').html("");
              $(this).siblings('label').children().css({'color':'#000'});
              button();
           };
          if(!(/^([1-9]|[0-9]{2}|[1][0-9][0-9])$/).test(val) && val !== ""){
            $(".age").next('p').html("请输入正确的年龄");
            $("button").removeClass("submit");
          };
      });
  }
  //按钮变色
  function button(){
    if($(".full").text() === "" && $(".name").val() && $(".age").val()){
      $("button").addClass("submit");
    }
  }
      
  //提交表单
  $("#button").click(function(){
    if($(".name").val() && $(".age").val() && $(".full").text() === ""){
         var name = $(".name").val();
         var age = $(".age").val();
         var sex = $("#sex").val();
         var lectureId = $("#lecture").val();
         $.ajax({
          url:window.location.pathname+"/verify",
          data:{name:name, age:age, sex:sex, lectureId:lectureId},
          type:'get',
          success:function(data){
            if(data.code == 0){
              location.href = "success?img="+data._data;
            }else if(data.code == 1){
              $(".space").text(data.err);
            }
          }
         })
    }
  });
  //底部提交按钮顶上去
  var oHeight = $(document).height(); //浏览器当前的高度

   $(window).resize(function(){
 
        if($(document).height() < oHeight){
         
        $("#button").css("display","none");
    }else{
         
        $("#button").css("display","block");
    }
        
   });
   //关闭模态框
   $('#closeerr').on('click', function() {
      $('#modalerr').css('display', 'none');
    });
