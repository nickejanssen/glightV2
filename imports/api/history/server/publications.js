import { Meteor } from 'meteor/meteor';
import { History } from '../history.js';
import { Company } from '/imports/api/company/company.js';

Meteor.publish("getHistory", function (compId, limit) {

    if (this.userId) {
        let _History = History.find({ companyId: compId }, { sort: { createdAt: -1 }, limit: limit });
        if (_History.count() > 0)
            //console.log("SUccess");
            return _History;
    }
    this.ready();
});

Meteor.publish("dashboardHistory", function (limit) {

    if (this.userId) {
      let compId = [];
      let company = Company.find({userId: this.userId}).fetch();
      company.forEach(function(d,i){
        compId.push(d._id);
      });
      let history = History.find({'companyId': { $in: compId }},{ sort: { createdAt: -1 }, limit: limit });
      if (history.count() > 0){
        return history;
      }
    }
    this.ready();
});
