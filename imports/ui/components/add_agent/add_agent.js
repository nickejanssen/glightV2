import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import { Agents } from '../../../api/agents/agents.js';
import './add_agent.html';
//import './added_modal.html';

Template.add_agent.helpers({
   AllCompanies:function(){
    var _CompanyDetail=Template.instance().companyDetail.get("AllCompanies");
    return _CompanyDetail;
   }
});

Template.add_agent.onCreated(function () {
  let _self = this;
  _self.companyDetail = new ReactiveDict();
  Tracker.autorun(() => {
    let _AllCompanies = Meteor.subscribe("AllCompanies");
    if (_AllCompanies.ready()) {
      let _Company = Company.find({});
      _self.companyDetail.set("AllCompanies", _Company.fetch())
    }
  });
});

Template.add_agent.onRendered(() => {
  $('select').not('.disabled').material_select();
});

Template.add_agent.events({
  'submit #formAddAgent'(event, template) {
    event.preventDefault();

    let AddAgent = {};

    AddAgent.userId = Meteor.userId();
    AddAgent.companyName = event.currentTarget.Cname.value.trim();
    AddAgent.firstName = event.currentTarget.cfName.value.trim();
    AddAgent.lastName = event.currentTarget.clName.value.trim();
    AddAgent.agentEmail = event.currentTarget.cemail.value.trim();
    AddAgent.agentPhone = event.currentTarget.cphone.value.trim();

    Meteor.call("AddNewAgent", AddAgent, (error, result) => {
      if(error){
        console.log(error.reason);
      } else {
        Materialize.toast("Agent Added", 8000, 'green');
        document.getElementById("formAddAgent").reset();
      }
    });
  }
});
