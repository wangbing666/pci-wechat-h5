  var $searchBar = $('#searchBar');
  var $searchText = $('#searchText');
  var $searchInput = $('#searchInput');
  var $searchClear = $('#searchClear');
  var $searchCancel = $('#searchCancel');

  function hideSearchResult(){
      $searchInput.val('');
  };
  function cancelSearch(){
      hideSearchResult();
      $searchBar.removeClass('weui-search-bar_focusing');
      $searchText.show();
  };
   //点击搜索
  $searchText.on('click', function(){
      $searchBar.addClass('weui-search-bar_focusing');
      $searchInput.focus();
  });
  //搜索框失去光标
  $searchInput.on('blur', function () {
        if(!this.value.length) cancelSearch();
      });
  //清空搜索框
  $searchClear.on('click', function(){
      hideSearchResult();
      $searchInput.focus();
      $($(".info-container")).show();
  });
  //取消搜索
  $searchCancel.on('click', function(){
      cancelSearch();
      $searchInput.blur();
      $($(".info-container")).show();
  });
  function getConfirms(id){
     var $cancel = $(".right"+id);
     $('#iosDialog'+id).fadeIn(0);
      $('#dialogs'+id).on('click', '.weui-dialog__btn', function(){
        $(this).parents('.js_dialog').fadeOut(0);
      });
      $("#confirm"+id).on('click',function(){
         $.get(window.location.pathname + "/getCancel?id=" + id, function(result) { 
          var result = JSON.parse(result);
              if (result.code === 0) {
                  $cancel.css({
                    'display':"none",
                 });
                $("#apply-name"+id).html("报名取消");
                $('#message').text("取消报名成功");
                $('#modal').css('display', 'block');
              } else {
                $('#message').text("操作失败");
                $('#modal').css('display', 'block');
              };
            });
      });
 };
            


    //搜索讲座关键字
    jQuery.expr[':'].Contains = function(a,i,m){
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
    };
  function filterList(list) { 
    $($searchInput)
        .change(function () {
          var filter = $(this).val();
          if(filter) {
            $matches = $(list).find('h4:Contains(' + filter + ')').parents();
            $(list).not($matches).hide();
            $matches.show();
          } else {
            $(list).show();
          };
          return false;
        })
      .keyup( function () {
          $(this).change();
      });
    };
    $(function () {
      filterList($(".info-container"));
    });

  $('#close').on('click', function() {
    $('#modal').css('display', 'none');
    $.get(window.location.pathname);
  });
  $('#closeerr').on('click', function() {
    $('#modalerr').css('display', 'none');
  });

