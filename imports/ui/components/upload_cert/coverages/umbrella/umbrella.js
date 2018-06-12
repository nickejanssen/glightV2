import './umbrella.html';

Template.umbrella.onRendered(function(){
  $('.select').select2();
});

Template.umbrella.events({
  'change #occur'(event) {
    event.preventDefault();
    if ($('#occur').val() === 'Other') {
      $('#txtoccur').attr('name','occur').css('display','block');
    }else {
      $('#txtoccur').attr('name','').css('display','none');
    }
  },
  'change #agg'(event) {
    event.preventDefault();
    if ($('#agg').val() === 'Other') {
      $('#txtagg').attr('name','agg').css('display','block');
    }else {
      $('#txtagg').attr('name','').css('display','none');
    }
  },
})
