import moment from 'moment';
import { coverageType } from '/imports/api/constant.js'
// format date
Template.registerHelper('formatDate', function(date, dateFormat) {
    return moment(date).format('L');
});

Template.registerHelper('getCoverageValue', function(coverageKey) {
    let coverageVal = ''
    coverageType.forEach(function(d,i){
        if(d.key == coverageKey){
            coverageVal = d.value;
        }
    });
    return coverageVal;
});
