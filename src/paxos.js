
class PaxosMachine {

    // role is one of ['client'|'proposer'|'acceptor'|'learner'|'aggregate']
    constructor(role, proposers, acceptors, learners) {
        this.role = role;
        this.proposers = proposers;
        this.acceptors = acceptors;
        this.learners = learners;
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
                        }
                        break;
                    }

                    // got prepare response (promise) on a serial number
                    case 'prepare response': {  // p1b
                        if (message.status == 'fail') {
                            this.proposerProposalNumber += this.proposers.length;
                            this.proposerVoters = [];
                            // TODO: resend p1a
                        } else if (message.status == 'success') {
                            // consume existing value
                            if (message.value != undefined) {
                                this.proposerValue = message.value;
                            }
                            // TODO: send p2a with value
                        }
                        break;
                    }
                    
                    // got accept response (vote)
                    case 'accept response': {  // p2b
                        if (message.status == 'fail') {
                            this.proposerProposalNumber += this.proposers.length;
                            this.proposerVoters = [];
                            // TODO: resend p1a
                        } else if (message.status == 'success') {
                            if (!(message.sender in this.proposerVoters)) {
                                this.proposerVoters.append(message.sender);
                                // majority consensus
                                if (this.proposerVoters.length > this.acceptors.length / 2) {
                                    // TODO: send value to learners
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
                            
                        } else {
                            // send fail prepare response
                        }
                        break;
                    }
                    case 'accept request': {
                        break;
                    }
                }
                break;
            }
            case 'learner': {
                this.learnerValue = message.value;
                // send value to client
                break;
            }
        }
    }
}
