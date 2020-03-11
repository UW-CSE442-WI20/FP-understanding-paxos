import Draw from './draw';
import * as CONSTANTS from './constants';
const d3 = require('d3');


class PaxosMachine {

    // role is one of ['client'|'proposer'|'acceptor'|'learner'|'aggregate']
    constructor(role, cluster) {
        this.role = role;
        this.delay = delay;
        this.acceptorAcceptNumber = -1;
        this.acceptorProposalNumber = -1;
        this.cluster = cluster;
    }

    handle(message) {
        switch(this.role) {
            case 'client': {
                this.clientValue = message.value;
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

                            this.cluster.sendToAll(p1a, this.cluster.acceptors);
                        }
                        break;
                    }

                    // got prepare response (promise) on a serial number
                    case 'prepare response': {  // p1b
                        if (message.status == 'fail') {
                            this.proposerProposalNumber += this.proposers.length;
                            this.proposerVoters = [];
                            // TODO: resend p1a
                            let p1a = {type: 'prepare request', proposalNumber: this.proposerProposalNumber, sender: this};

                            this.cluster.sendToAll(p1a, this.cluster.acceptors);

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

                                    this.cluster.sendToAll(p2a, this.cluster.acceptors);
                                }
                            }
                        }
                        break;
                    }

                    // got accept response (vote)
                    case 'accept response': {  // p2b
                        if (message.status == 'fail') {
                            this.proposerProposalNumber += this.proposers.length;
                            this.proposerVoters = [];
                            // TODO: resend p1a
                            let p1a = {type: 'prepare request', proposalNumber: this.proposerProposalNumber, sender: this};

                            this.cluster.sendToAll(p1a, this.cluster.acceptors);
                        } else if (message.status == 'success') {
                            if (!(message.sender in this.proposerVoters)) {
                                this.proposerVoters.push(message.sender);
                                // majority consensus
                                if (this.proposerVoters.length > this.cluster.acceptors.length / 2) {
                                    // TODO: send value to learners
                                    let learnerMessage = {value: this.proposerValue};

                                    this.cluster.sendToAll(learnerMessage, this.cluster.learners);
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
                            this.cluster.sendToAll(p1b, [message.sender]);
                        } else {
                            // send fail prepare response
                            let p1b = {type: 'prepare response', status: 'fail'};
                            this.cluster.sendToAll(p1b, [message.sender]);
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
                            this.cluster.sendToAll(p2b, [message.sender]);
                        } else {
                            // send fail accept response
                            let p2b = {type: 'accept response', status: 'fail'};
                            this.cluster.sendToAll(p2b, [message.sender]);
                        }
                        break;
                    }
                }
                break;
            }
            case 'learner': {
                this.learnerValue = message.value;
                // send value to client
                this.cluster.sendToAll({value: this.learnerValue}, [this.cluster.client]);
                break;
            }
        }
    }
}

class PaxosCluster {
    constructor(stateNum, state) {
        this.stateNum = stateNum;
        this.state = state;
        let paxosMachine;
        this.machines = [];
        this.proposers = [];
        this.acceptors = [];
        this.learners = [];

        // this.machines maintains same order as state
        for (let i in state) {
            if (state[i]['r:int'] === 0) {
               continue;
            }
            switch(state[i]['class:string']) {
                case 'client':
                    paxosMachine = new PaxosMachine('client', this);
                    this.machines.push(paxosMachine);
                    break;
                case 'server proposer':
                    paxosMachine = new PaxosMachine('proposer', this);
                    this.machines.push(paxosMachine);
                    break;
                case 'server acceptor':
                    paxosMachine = new PaxosMachine('acceptor', this);
                    this.machines.push(paxosMachine);
                    break;
                case 'server learner':
                    paxosMachine = new PaxosMachine('learner', this);
                    this.machines.push(paxosMachine);
                    break;
            }
        }

    }

    drawCluster() {
        Draw.updateState(this.stateNum, this.state);
        d3.selectAll('#viz>svg>circle')
            .on('mouseup', function(d, i) {
                console.log(servers[i].role);
                // switch(servers[i].role) {
                //     case 'client':

                // }
            });
    }

    sendToAll(message, sender, recipients) {
        // draw before send
        let circles = [];
        let argSender = this.machines.indexOf(sender);
        for (i in recipients) {
            circles.push({from: argSender, to: this.machines.indexOf(recipients[i]), r: CONSTANTS.circleRadius});
        }
        Draw.drawMessage(circles);
        Draw.transitionMessages()
        for (i in recipients) {
            recipients[i].handle(message);
        }
    }
}

module.exports = PaxosCluster;
