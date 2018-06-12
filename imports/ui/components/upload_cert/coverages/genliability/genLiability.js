import './genLiability.html';

Template.genLiability.onRendered(function(){
  $('.select').select2();
});

Template.genLiability.events({
  'change #genAgg'(event) {
    event.preventDefault();
    if ($('#genAgg').val() === 'Other') {
      $('#txtgenAgg').attr('name','genAgg').css('display','block');
    }else {
      $('#txtgenAgg').attr('name','').css('display','none');
    }
  },
  'change #proAgg'(event) {
    event.preventDefault();
    if ($('#proAgg').val() === 'Other') {
      $('#txtproAgg').attr('name','proAgg').css('display','block');
    }else {
      $('#txtproAgg').attr('name','').css('display','none');
    }
  },
  'change #Occurence'(event) {
    event.preventDefault();
    if ($('#Occurence').val() === 'Other') {
      $('#txtOccurence').attr('name','Occurence').css('display','block');
    }else {
      $('#txtOccurence').attr('name','').css('display','none');
    }
  },
  'change #perAdvert'(event) {
    event.preventDefault();
    if ($('#perAdvert').val() === 'Other') {
      $('#txtperAdvert').attr('name','perAdvert').css('display','block');
    }else {
      $('#txtperAdvert').attr('name','').css('display','none');
    }
  },
  'change #deductible'(event) {
    event.preventDefault();
    if ($('#deductible').val() === 'Other') {
      $('#txtdeductible').attr('name','deductible').css('display','block');
    }else {
      $('#txtdeductible').attr('name','').css('display','none');
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
  'change #dmgPremise'(event) {
    event.preventDefault();
    if ($('#dmgPremise').val() === 'Other') {
      $('#txtdmgPremise').attr('name','dmgPremise').css('display','block');
    }else {
      $('#txtdmgPremise').attr('name','').css('display','none');
    }
  },
})
