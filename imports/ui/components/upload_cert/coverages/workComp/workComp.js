import './workComp.html';

Template.workComp.onRendered(function(){
  $('.select').select2();
});

Template.workComp.events({
  'change #deduct'(event) {
    event.preventDefault();
    if ($('#deduct').val() === 'Other') {
      $('#txtdeduct').attr('name','deduct').css('display','block');
    }else {
      $('#txtdeduct').attr('name','').css('display','none');
    }
  },
  'change #aggDeduct'(event) {
    event.preventDefault();
    if ($('#aggDeduct').val() === 'Other') {
      $('#txtaggDeduct').attr('name','aggDeduct').css('display','block');
    }else {
      $('#txtaggDeduct').attr('name','').css('display','none');
    }
  },
})
