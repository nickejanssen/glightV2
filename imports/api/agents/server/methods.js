import { Meteor } from 'meteor/meteor';
import { Agents } from '../agents.js';

Meteor.methods({
  AddNewAgent(agentDetail) {
    console.log(agentDetail);

    return Agents.insert(agentDetail);
  }
});