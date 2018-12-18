
var count = 60;
var t;

function getCode(tel) {
  timedCount();
  $.get(window.location.pathname + "/getVerifyCode?tel=" + tel, function(result) {
    if (result.code === 0) {
      $('#message').text(result.data);
      $('#modal').css('display', 'block');
    } else {
      var errormsg = JSON.parse(result) && JSON.parse(result).msg || '获取验证码失败';
      $('#message').text(errormsg);
      $('#modal').css('display', 'block');
    }
  });
}

function timedCount() {
  $('#getcode').attr('disabled', 'true');
  $('#getcode').text(count + '秒后重新获取');
  count--;
  t = setTimeout("timedCount()", 1000);
  if (count < 0) {
    count = 60;
    $('#getcode').text('获取验证码');
    $('#getcode').removeAttr('disabled');
    clearTimeout(t);
  }
}
