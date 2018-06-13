import './autoLiability.html';

Template.autoLiability.onRendered(function(){
  $('.select').select2();
});

Template.autoLiability.helpers({

});

Template.autoLiability.events({
  'change #covType'(event) {
    event.preventDefault();
    if ($('#covType').val() === 'Other') {
      $('#txtcovType').attr('name','covType').css('display','block');
    }else {
      $('#txtcovType').attr('name','').css('display','none');
    }
  },
  'change #combLim'(event) {
    event.preventDefault();
    if ($('#combLim').val() === 'Other') {
      $('#txtcombLim').attr('name','combLim').css('display','block');
    }else {
      $('#txtcombLim').attr('name','').css('display','none');
    }
  },
  'change #medPay'(event) {
    event.preventDefault();
    if ($('#medPay').val() === 'Other') {
      $('#txtmedPay').attr('name','medPay').css('display','block');
    }else {
      $('#txtmedPay').attr('name','').css('display','none');
    }
  },
  'change #perPer'(event) {
    event.preventDefault();
    if ($('#perPer').val() === 'Other') {
      $('#txtperPer').attr('name','perPer').css('display','block');
    }else {
      $('#txtperPer').attr('name','').css('display','none');
    }
  },
  'change #perAcc'(event) {
    event.preventDefault();
    if ($('#perAcc').val() === 'Other') {
      $('#txtperAcc').attr('name','perAcc').css('display','block');
    }else {
      $('#txtperAcc').attr('name','').css('display','none');
    }
  },
  'change #dmgPremise'(event) {
    event.preventDefault();
    if ($('#dmgPremise').val() === 'Other') {
      $('#txtdmgPremise').attr('name','dmgPremise').css('display','block');
    }else {
      $('#txtdmgPremise').attr('name','').css('display','none');
    }
  },
  'change #med1Pay'(event) {
    event.preventDefault();
    if ($('#med1Pay').val() === 'Other') {
      $('#txt1medPay').attr('name','medPay').css('display','block');
    }else {
      $('#txt1medPay').attr('name','').css('display','none');
    }
  },
});
