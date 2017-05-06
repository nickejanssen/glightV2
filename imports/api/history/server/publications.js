import { Meteor } from 'meteor/meteor';
import { History } from '../history.js';

Meteor.publish("getHistory", function (compId, limit) {

    if (this.userId) {
        let _History = History.find({ companyId: compId }, { sort: { createdAt: -1 }, limit: limit });
        if (_History.count() > 0)
            //console.log("SUccess");
            return _History;
    }
    this.ready();
});