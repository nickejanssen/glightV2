import './epc.html';

Template.epc.onRendered(function(){
  $('.select').select2();
});

Template.epc.events({
  'change #covType'(event) {
    event.preventDefault();
    if ($('#covType').val() === 'Other') {
      $('#txtcovType').attr('name','covType').css('display','block');
    }else {
      $('#txtcovType').attr('name','').css('display','none');
    }
  },
  'change #val'(event) {
    event.preventDefault();
    if ($('#val').val() === 'Other') {
      $('#txtval').attr('name','val').css('display','block');
    }else {
      $('#txtval').attr('name','').css('display','none');
    }
  },
  'change #coIns'(event) {
    event.preventDefault();
    if ($('#coIns').val() === 'Other') {
      $('#txtcoIns').attr('name','coIns').css('display','block');
    }else {
      $('#txtcoIns').attr('name','').css('display','none');
    }
  },
  'change #deduct'(event) {
    event.preventDefault();
    if ($('#deduct').val() === 'Other') {
      $('#txtdeduct').attr('name','deduct').css('display','block');
    }else {
      $('#txtdeduct').attr('name','').css('display','none');
    }
  },
});
