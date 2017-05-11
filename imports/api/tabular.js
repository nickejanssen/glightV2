import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Company } from '/imports/api/company/company.js';
import { Policies } from '/imports/api/policies/policies.js';
import Tabular from 'meteor/aldeed:tabular';

TabularTables = {};
//registerHelper
Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

//************************** SHOW ALL COMPANIES *****************************************
TabularTables.companyList = new Tabular.Table({
  name: "companyList",
  collection: Company,
  columns: [
    {
      data: "companyName",
      title: "Company Name",
      render(data, type, row) {
        var company = row;
        var currentCompany = company.companyName;
        var selectedCompany = Company.find({ companyName: currentCompany }).fetch();
        var params = {
          companyId: company._id,
          companyName: company.companyName
        };

        return '<a href="/co-detail/' + company._id + '">' + data + '</a>';
      }
    },
    {
      data: "activeCerts",
      title: "Active"
    },
    {
      data: "waitingCerts",
      title: "Pending"
    },
    {
      data: "expiredCerts",
      title: "Expired"
    }
  ],
  extraFields: ['_id', 'alias', 'isAliasUpdatedByAgent', 'dealerId'],

  responsive: true,
  autoWidth: false,
  "fnDrawCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    Meteor.setTimeout(function () {
      $('.dataTables_processing').hide();
    });
  }
});

//**************************SHOW ALL POLICIES FOR COMPANY *****************************************
TabularTables.policyList = new Tabular.Table({
  name: "policyList",
  collection: Policies,
  columns: [
    {
      data: "companyId",
      title: "Company Name",
      render: function (data, type, row) {
        var policy = row;
        //var currentCo = policy.companyId;
        var coName = Company.findOne({ _id: policy.companyId });
        var con = coName.companyName;
        return con;
      }
    },
    {
      data: "policyName",
      title: "Policy Name",
      render(data, type, row) {
        var policy = row;
        var currentPolicy = policy._id;
        var selectedCompany = Policies.find({ policyName: currentPolicy }).fetch();
        var params = {
          imageurl: policy.imageurl,
          companyName: policy.policyName
        };
        return '<a href='+ policy.imageurl +'>' + data + '</a>';
      }
    },
    {
      data: "coverage",
      title: "Coverage"
    },
    {
      data: "startDate",
      title: "Start Date",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).format('L');
        } else {
          return "Not Added";
        }
      }
    },
    {
      data: "expDate",
      title: "Expiration Date",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).calendar();
        } else {
          return "Not Added";
        }
      }
    }
    /*{
      data: "policyStatus",
      title: "Status",
      render(data, type, row) {
        let status = data;
        var pid = policy._id;
        var cpolicy = Policies.find({ policyName: pid }).fetch();
          //If the user hasnt approved it
          if (cpolicy.uApproved === false) status = "Pending";
          //If it has been received and the start date is after today
          if (cpolicy.policyStatus == "received" && cpolicy.startDate > new Date()) status = "Pending";
          //If it is approved, and not expired
          if (cpolicy.uApproved === true && cpolicy.startDate <= new Date() && new Date() <= cpolicy.expDate) status = "Current";
          //If it is expired
          if (new Date() > cpolicy.expDate) status = "Past";
        return status;
      }
    }*/
  ],
  extraFields: ['_id', 'alias', 'isAliasUpdatedByAgent', 'dealerId'],

  responsive: true,
  autoWidth: false,
  "fnDrawCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    Meteor.setTimeout(function () {
      $('.dataTables_processing').hide();
    });
  }
});