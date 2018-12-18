$(document).ready(function() {
  $(".account-container").Validform({
    tiptype: 3,
    postonce: true,
    datatype: {
      "phone": /^1[3|4|5|7|8][0-9]\d{8}$/
    }
  });

  $('#closeerr').on('click', function() {
    $('#modalerr').css('display', 'none');
  });
});
var target = 0;

function canClick() {
  if ($('#tel').val() && $('#title').val() && target) {
    $('#button').removeAttr('disabled');
  } else {
    $('#button').attr('disabled', 'true');
  }
}

function errorHandle(msg) {
  $('#avatar').attr('src', 'http://7xp6gb.com2.z0.glb.clouddn.com/pci/picture/pic2@2x.png');
  $('#name').text('');
  $('#toastMessage').text(msg);
  $('#toast').css('display', 'block');
  $('#toast').css('opacity', '1');
  setTimeout("closeToast()", 3000);
  $('#button').attr('disabled', 'true');
}

function inputChange() {
  target = 0;
  canClick();
  var tel = $('#tel').val();
  if (!isNaN(tel) && tel.length === 11) {
    $.get(window.location.pathname + "/search?tel=" + tel, function(result) {
      if (JSON.parse(result).code === 0) {
        $('#avatar').attr('src', JSON.parse(result).data.avatarUrl);
        $('#name').text(JSON.parse(result).data.name);
        target = 1;
        canClick();
      } else if (JSON.parse(result).code === 1000) {
        var errormsg = "此账号未注册”全程心管家“，请您的家人注册后进行绑定";
        errorHandle(errormsg);
      } else {
        var errormsg = JSON.parse(result).msg || '请求错误';
        errorHandle(errormsg);
      }
    });
  }
}

function titleChange() {
  canClick();
}

function closeToast() {
  $('#toast').css('display', 'none');
  $('#toast').css('opacity', '0');
}

var pickerEl = $('#showPicker');

var data = [{
  text: '爸爸',
  value: 1
}, {
  text: '妈妈',
  value: 2
}, {
  text: '爷爷',
  value: 3
}, {
  text: '奶奶',
  value: 4
}, {
  text: '外公',
  value: 5
}, {
  text: '外婆',
  value: 6
}, {
  text: '爱人',
  value: 7
}, {
  text: '其他',
  value: 8
}];

var picker = new Picker({
  data: [data],
  selectedIndex: [0],
  title: '您的选择'
});

picker.on('picker.select', function(selectedVal, selectedIndex) {
  $('#pickerText').text(data[selectedIndex].text);
  if (data[selectedIndex].value == 8) {
    $('#title').val('');
    $('#title').attr('type', 'text');
    canClick();
  } else {
    $('#title').attr('type', 'hidden');
    $('#title').val(data[selectedIndex].text);
    canClick();
  }
});

pickerEl.on('click', function() {
  picker.show(function() {
    picker.refillColumn(0, data);
  });
});
