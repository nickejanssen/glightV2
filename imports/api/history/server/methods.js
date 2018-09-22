import { History } from '../history.js';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    insertHistory(companyId, type, msg) {
        History.insert({ companyId: companyId, type: type, msg: msg });
    }
});