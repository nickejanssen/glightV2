import { Meteor } from 'meteor/meteor';
import { Agents } from '../agents.js';


Meteor.publish("AllAgents", function() {

  if (this.userId) {
    let _Agents = Agents.find({userId:this.userId});
    if (_Agents.count() > 0)
      //console.log("SUccess");
      return _Agents;
    }
  this.ready();
});