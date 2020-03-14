
const d3 = require('d3');
import * as CONSTANTS from './constants.js';
import * as Draw from './draw.js';

class PaxosMachine {

  // role is one of ['client'|'proposer'|'acceptor'|'learner'|]
  constructor(role, cluster) {
    console.log('PaxosMachine::constructor', role);

    this.role = role;
    this.acceptorAcceptNumber = -1;
    this.acceptorProposalNumber = -1;
    this.cluster = cluster;
    this.acceptorValue = null;
    this.proposerValue = null;
  }

  handle(message) {
    console.log('PaxosMachine::handle', message, this);
    // reset listener
    // this.machineIndex = this.cluster.machines.indexOf(this);
    switch(this.role) {
      case 'client': {
        this.clientValue = message.value;
        Draw.updateCircleValue(this.cluster.stateNum, this.machineIndex, this.clientValue, true);
        this.cluster.updateListeners();
        break;
      }
      case 'proposer': {
        switch(message.type) {
          // got (possibly duplicate) client request
          case 'client request': {
            if (this.proposerValue == undefined) {
              this.proposerValue = message.value;
              this.proposerVoters = [];
              // TODO: send prepare requests to all acceptors (p1a)
              let p1a = {type: 'prepare request', proposalNumber: this.proposerProposalNumber, sender: this};

              Draw.updateCircleValue(this.cluster.stateNum, this.machineIndex, this.proposerProposalNumber + ', ' + this.proposerValue, false);
              this.cluster.send(p1a, this, this.cluster.acceptors);
            }
            break;
          }

          // got prepare response (promise) on a serial number
          case 'prepare response': {  // p1b
            if (message.status == 'fail') {
              this.proposerProposalNumber += this.cluster.proposers.length;
              this.proposerVoters = [];
              // TODO: resend p1a
              let p1a = {type: 'prepare request', proposalNumber: this.proposerProposalNumber, sender: this};
              Draw.updateCircleValue(this.cluster.stateNum, this.machineIndex, this.proposerProposalNumber + ', ' + this.proposerValue, false);
              this.cluster.send(p1a, this, this.cluster.acceptors);

            } else if (message.status == 'success') {
              // consume existing value
              if (message.value != undefined) {
                this.proposerValue = message.value;
              }

              if (!(message.sender in this.proposerVoters)) {
                this.proposerVoters.push(message.sender);
                // majority consensus
                if (this.proposerVoters.length > this.cluster.acceptors.length / 2) {
                  // TODO: send p2a to all acceptors
                  this.proposerVoters = [];
                  let p2a = {type: 'accept request', value: this.proposerValue, proposalNumber: this.proposerProposalNumber, sender: this};

                  this.cluster.send(p2a, this, this.cluster.acceptors);
                } else {
                  this.cluster.updateListeners();
                }
              }
            }
            break;
          }

          // got accept response (vote)
          case 'accept response': {  // p2b
            if (message.status == 'fail') {
              this.proposerProposalNumber += this.cluster.proposers.length;
              this.proposerVoters = [];
              // TODO: resend p1a
              let p1a = {type: 'prepare request', proposalNumber: this.proposerProposalNumber, sender: this};
              Draw.updateCircleValue(this.cluster.stateNum, this.machineIndex, this.proposerProposalNumber + ', ' + this.proposerValue, false);

              this.cluster.send(p1a, this, this.cluster.acceptors);
            } else if (message.status == 'success') {
              if (!(message.sender in this.proposerVoters)) {
                this.proposerVoters.push(message.sender);
                // majority consensus
                if (this.proposerVoters.length > this.cluster.acceptors.length / 2) {
                  this.proposerVoters = [];
                  // TODO: send value to learners
                  let learnerMessage = {value: this.proposerValue};

                  Draw.updateCircleValue(this.cluster.stateNum, this.machineIndex, this.proposerProposalNumber + ', ' + this.proposerValue, true);
                  this.cluster.send(learnerMessage, this, this.cluster.learners);
                } else {
                  this.cluster.updateListeners();
                }
              }
            }
            break;
          }
        }
        break;
      }
      case 'acceptor': {
        switch(message.type) {
          case 'prepare request': {
            if (this.acceptorProposalNumber < message.proposalNumber) {
              this.acceptorProposalNumber = message.proposalNumber;

              // send success prepare response with current value and acceptNumber
              let p1b = {type: 'prepare response', status: 'success', proposalNumber: this.acceptorAcceptNumber, value: this.acceptorValue};
              Draw.updateCircleValue(this.cluster.stateNum, this.machineIndex, this.acceptorProposalNumber + ', ' + this.acceptorValue, true);
              this.cluster.send(p1b, this, [message.sender]);
            } else {
              this.cluster.updateListeners();
              // send fail prepare response
              // let p1b = {type: 'prepare response', status: 'fail'};
              // this.cluster.send(p1b, this, [message.sender]);
            }
            break;
          }
          case 'accept request': {
            if (this.acceptorProposalNumber <= message.proposalNumber) {
              this.acceptorAcceptNumber = message.proposalNumber;
              this.acceptorProposalNumber = message.proposalNumber;
              this.acceptorValue = message.value;

              // send succes accept response
              let p2b = {type: 'accept response', status: 'success'};
              Draw.updateCircleValue(this.cluster.stateNum, this.machineIndex, this.acceptorProposalNumber + ', ' + this.acceptorValue, true);
              this.cluster.send(p2b, this, [message.sender]);
              } else {
                this.cluster.updateListeners();
                // // send fail accept response
                // let p2b = {type: 'accept response', status: 'fail'};
                // this.cluster.send(p2b, this, [message.sender]);
              }
              break;
          }
        }
        break;
      }
      case 'learner': {
        this.learnerValue = message.value;
        // send value to client
        Draw.updateCircleValue(this.cluster.stateNum, this.machineIndex, this.learnerValue, true);
        this.cluster.send({value: this.learnerValue}, this, this.cluster.clients);
        break;
      }
    }
  }
}

class PaxosCluster {
  constructor(stateNum, state, step=false) {
    console.log('PaxosCluster::constructor', stateNum);

    this.stateNum = stateNum;
    this.state = state;

    this.sequenceNum = -1;
    this.sendMap = {};
    this.step = step;

    this.reset();
  }

  reset() {
    console.log('PaxosCluster::reset');

    this.sequenceNum++;

    this.clients = [];
    this.proposers = [];
    this.acceptors = [];
    this.learners = [];
    this.machines = [];

    // this.machines maintains same order as state
    let paxosMachine;
    for (let i in this.state) {
      if (this.state[i]['r'] === 0) {
        continue;
      }
      switch(this.state[i]['class']) {
        case 'client':
          paxosMachine = new PaxosMachine('client', this);
          this.clients.push(paxosMachine);
          break;
        case 'server proposer':
          paxosMachine = new PaxosMachine('proposer', this);
          this.proposers.push(paxosMachine);
          paxosMachine.proposerProposalNumber = this.proposers.length;
          break;
        case 'server acceptor':
          paxosMachine = new PaxosMachine('acceptor', this);
          this.acceptors.push(paxosMachine);
          break;
        case 'server learner':
          paxosMachine = new PaxosMachine('learner', this);
          this.learners.push(paxosMachine);
          break;
        }
        paxosMachine.machineIndex = this.machines.length;
        this.machines.push(paxosMachine);
    }
  }

  send(message, sender, sendees) {
    console.log('PaxosCluster::send', message, sender, sendees);

    // for future validation
    message.sequenceNum = this.sequenceNum;

    sender = this.machines.indexOf(sender);
    sendees = sendees.map(s => this.machines.indexOf(s));
    if (this.step && this.machines[sender].role !== 'client') {
      this.sendMap[sender] = {sendees: sendees, message: message};
      this.updateListeners();
      return;
    }

    for (let i in sendees) {
      let that = this;
      Draw.drawMessage(this.stateNum, sender, sendees[i], CONSTANTS.MESSAGE_DURATION_MS, function() {
        // validate
        if (message.sequenceNum == that.sequenceNum) {
            that.machines[sendees[i]].handle(message);
        }
      });
    }
  }

  updateListeners() {
    if (!this.step) {
      return;
    }
    console.log('PaxosCluster::updateListeners', this.sendMap);

    // reset glow
    d3.select('#paxos svg').selectAll('.glow').remove();

    // update listeners
    let that = this;
    for (const key in this.sendMap){
      Draw.drawGlow(this.stateNum, key);
      d3.select('#paxos svg').selectAll('#server' + key + ',#value' + key)
        .on('click', function() {
          d3.select('#paxos svg').selectAll('#server' + key + ', #value' + key).on('click', null);
          let v = that.sendMap[key];
          delete that.sendMap[key];
          for (let i in v.sendees) {
            Draw.drawMessage(that.stateNum, key, v.sendees[i], CONSTANTS.MESSAGE_DURATION_MS, function() {
              // validate
              if (v.message.sequenceNum == that.sequenceNum) {
                that.machines[v.sendees[i]].handle(v.message);
              }
            });
          }
        })
    }
  }
}

module.exports = PaxosCluster;
