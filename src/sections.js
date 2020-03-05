const d3 = require('d3');
import * as CONSTANTS from './constants';
import Draw from './draw';

class States {
  constructor (graphicWidth, graphicHeight) {
    this.initState = [];
    this.state1 = [];
    this.state2 = [];
    this.state3 = [];
    this.state4 = [];
    this.state5 = [];
    this.state6 = [];
    this.state7 = [];
    this.state8 = [];
    this.state9 = [];
    this.state10 = [];
    this.state11 = [];
    this.state12 = [];
    this.state13 = [];
    this.graphicWidth;
    this.graphicHeight;
    Draw.graphicWidth = graphicWidth;
    Draw.graphicHeight = graphicHeight;
  }

  setGraphicDim(graphicWidth, graphicHeight) {
    this.graphicWidth = graphicWidth;
    this.graphicHeight = graphicHeight;
    Draw.graphicWidth = graphicWidth;
    Draw.graphicHeight = graphicHeight;
  }

  init() {
    console.log('init')

    for (let i = 0; i < 10; ++i) {
      this.initState[i] = {x: 0.5, y: 0.5, r: 0, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 0, class : 'client', label : ''};
    }

    d3.select('#viz>svg')
      .selectAll('circle')
      .data(this.initState)
      .enter()
      .append('circle')
      .attr('cx', d => d.x * this.graphicWidth)
      .attr('cy', d => d.y * this.graphicHeight)
      .attr('r', d => d.r);

    d3.select('#viz>svg')
      .selectAll('text')
      .data(this.initState)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('x', d => d.x * this.graphicWidth)
      .attr('y', d => d.y * this.graphicHeight - CONSTANTS.circleRadius - CONSTANTS.circleLabelPadding)
      .text(d => d.label);
  }

  update0() {
    console.log(0);

    Draw.clearMessage();
    Draw.updateState(0, this.initState);
  }

  update1() {
    console.log(1);

    Draw.clearMessage();

    this.copystate(this.initState, this.state1);
    this.state1[0] = {x: 0.25, y: 0.5, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state1[1] = {x: 0.75, y: 0.5, r: CONSTANTS.circleRadius, stroke: CONSTANTS.serverColor, fill: CONSTANTS.serverColor, opacity: 1, class: 'server', label: 'Server'};

    let messages = [
      {from: 0, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message'}
    ];
    Draw.updateState(1, this.state1, messages);

  }

  update2() {
    console.log(2);

    Draw.clearMessage();

    this.copystate(this.initState, this.state2);
    this.state2[0] = {x: 0.25, y: 0.5, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state2[1] = {x: 0.75, y: 0.5, r: CONSTANTS.circleRadius, stroke: CONSTANTS.serverColor, fill: CONSTANTS.serverColor, opacity: 0.2, class: 'server', label: 'Server'};

    Draw.updateState(2, this.state2);
  }

  update3() {
    console.log(3);

    Draw.clearMessage();

    this.copystate(this.initState, this.state3);
    this.state3[0] = {x: 0.25, y: 0.5, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state3[1] = {x: 0.75, y: 0.30, r: CONSTANTS.circleRadius, stroke: CONSTANTS.serverColor, fill: CONSTANTS.serverColor, opacity: 1, class: 'server', label: 'Server 1'};
    this.state3[2] = {x: 0.75, y: 0.50, r: CONSTANTS.circleRadius, stroke: CONSTANTS.serverColor, fill: CONSTANTS.serverColor, opacity: 1, class: 'server', label: 'Server 2'};
    this.state3[3] = {x: 0.75, y: 0.70 , r: CONSTANTS.circleRadius, stroke: CONSTANTS.serverColor, fill: CONSTANTS.serverColor, opacity: 1, class: 'server', label: 'Server 3'};

    let messages = [
      {from: 0, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message'},
      {from: 0, to: 2, r: CONSTANTS.circleRadius / 3, class: 'message'},
      {from: 0, to: 3, r: CONSTANTS.circleRadius / 3, class: 'message'}
    ];
    Draw.updateState(3, this.state3, messages);
  }

  update4() {
    console.log(4)
    Draw.clearMessage();

    this.copystate(this.initState, this.state4);
    this.state4[0] = {x: 0.5, y: 0.5, r: CONSTANTS.circleRadius * 2, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server proposer', label: 'Proposer'};
    Draw.updateState(4, this.state4);
  }

  update5() {
    console.log(5)
    Draw.clearMessage();

    this.copystate(this.initState, this.state5);
    this.state5[0] = {x: 0.5, y: 0.5, r: CONSTANTS.circleRadius * 2, stroke: CONSTANTS.acceptorColor, fill: CONSTANTS.acceptorColor, opacity: 1, class: 'server proposer', label: 'Acceptor'};
    Draw.updateState(5, this.state5);
  }

  update6() {
    console.log(6)
    Draw.clearMessage();

    this.copystate(this.initState, this.state6);
    this.state6[0] = {x: 0.5, y: 0.5, r: CONSTANTS.circleRadius * 2, stroke: CONSTANTS.learnerColor, fill: CONSTANTS.learnerColor, opacity: 1, class: 'server proposer', label: 'Learner'};
    Draw.updateState(6, this.state6);
  }

  update7() {
    console.log(7)
    Draw.clearMessage();

    this.copystate(this.initState, this.state7);
    this.state7[0] = {x: 0.20, y: 0.50, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state7[1] = {x: 0.6, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server', label: 'Proposer'};
    this.state7[2] = {x: 0.9, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.acceptorColor, fill: CONSTANTS.acceptorColor, opacity: 1, class: 'server', label: 'Acceptor'};
    this.state7[3] = {x: 0.75, y: 0.6, r: CONSTANTS.circleRadius, stroke: CONSTANTS.learnerColor, fill: CONSTANTS.learnerColor, opacity: 1, class: 'server', label: 'Learner'};

    let messages = [
      {from: 0, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message clientRequest', resend: true},
    ];

    Draw.updateState(7, this.state7, messages, messages[0].resend);
  }

  update8() {
    console.log(8)
    Draw.clearMessage();

    this.copystate(this.initState, this.state8);
    this.state8[0] = {x: 0.20, y: 0.50, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state8[1] = {x: 0.6, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server', label: 'Proposer'};
    this.state8[2] = {x: 0.9, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.acceptorColor, fill: CONSTANTS.acceptorColor, opacity: 1, class: 'server', label: 'Acceptor'};
    this.state8[3] = {x: 0.75, y: 0.6, r: CONSTANTS.circleRadius, stroke: CONSTANTS.learnerColor, fill: CONSTANTS.learnerColor, opacity: 1, class: 'server', label: 'Learner'};

    let messages = [
        {from: 1, to: 2, r: CONSTANTS.circleRadius / 3, class: 'message prepareRequest', resend: true},
        {from: 0, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message clientRequest', resend: true}
    ];

    Draw.updateState(8, this.state8, messages, messages[0].resend);
  }

  update9() {
    console.log(9)
    Draw.clearMessage();

    this.copystate(this.initState, this.state9);
    this.state9[0] = {x: 0.20, y: 0.50, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state9[1] = {x: 0.6, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server', label: 'Proposer'};
    this.state9[2] = {x: 0.9, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.acceptorColor, fill: CONSTANTS.acceptorColor, opacity: 1, class: 'server', label: 'Acceptor'};
    this.state9[3] = {x: 0.75, y: 0.6, r: CONSTANTS.circleRadius, stroke: CONSTANTS.learnerColor, fill: CONSTANTS.learnerColor, opacity: 1, class: 'server', label: 'Learner'};

    let messages = [
        {from: 2, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message prepareOk', resend: false},
        {from: 0, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message clientRequest', resend: true}
    ];

    Draw.updateState(9, this.state9, messages, messages[0].resend);
  }

  update10() {
    console.log(10)
    Draw.clearMessage();

    this.copystate(this.initState, this.state10);
    this.state10[0] = {x: 0.20, y: 0.50, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state10[1] = {x: 0.6, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server', label: 'Proposer'};
    this.state10[2] = {x: 0.9, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.acceptorColor, fill: CONSTANTS.acceptorColor, opacity: 1, class: 'server', label: 'Acceptor'};
    this.state10[3] = {x: 0.75, y: 0.6, r: CONSTANTS.circleRadius, stroke: CONSTANTS.learnerColor, fill: CONSTANTS.learnerColor, opacity: 1, class: 'server', label: 'Learner'};

    let messages = [
        {from: 1, to: 2, r: CONSTANTS.circleRadius / 3, class: 'message acceptRequest', resend: true},
        {from: 0, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message clientRequest', resend: true}
    ];

    Draw.updateState(10, this.state10, messages, messages[0].resend);
  }

  update11() {
    console.log(11)
    Draw.clearMessage();

    this.copystate(this.initState, this.state11);
    this.state11[0] = {x: 0.20, y: 0.50, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state11[1] = {x: 0.6, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server', label: 'Proposer'};
    this.state11[2] = {x: 0.9, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.acceptorColor, fill: CONSTANTS.acceptorColor, opacity: 1, class: 'server', label: 'Acceptor'};
    this.state11[3] = {x: 0.75, y: 0.6, r: CONSTANTS.circleRadius, stroke: CONSTANTS.learnerColor, fill: CONSTANTS.learnerColor, opacity: 1, class: 'server', label: 'Learner'};

    let messages = [
        {from: 2, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message acceptOk', resend: false},
        {from: 0, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message clientRequest', resend: true}
    ];

    Draw.updateState(11, this.state11, messages, messages[0].resend);
  }

  update12() {
    console.log(12)
    Draw.clearMessage();

    this.copystate(this.initState, this.state12);
    this.state12[0] = {x: 0.20, y: 0.50, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state12[1] = {x: 0.6, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server', label: 'Proposer'};
    this.state12[2] = {x: 0.9, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.acceptorColor, fill: CONSTANTS.acceptorColor, opacity: 1, class: 'server', label: 'Acceptor'};
    this.state12[3] = {x: 0.75, y: 0.6, r: CONSTANTS.circleRadius, stroke: CONSTANTS.learnerColor, fill: CONSTANTS.learnerColor, opacity: 1, class: 'server', label: 'Learner'};

    let messages = [
        {from: 1, to: 3, r: CONSTANTS.circleRadius / 3, class: 'message learnRequest', resend: false},
        {from: 0, to: 1, r: CONSTANTS.circleRadius / 3, class: 'message clientRequest', resend: true}
    ];

    Draw.updateState(12, this.state12, messages, messages[0].resend);
  }

  update13() {
    console.log(13)
    Draw.clearMessage();

    this.copystate(this.initState, this.state13);
    this.state13[0] = {x: 0.20, y: 0.50, r: CONSTANTS.circleRadius, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
    this.state13[1] = {x: 0.6, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server', label: 'Proposer'};
    this.state13[2] = {x: 0.9, y: 0.4, r: CONSTANTS.circleRadius, stroke: CONSTANTS.acceptorColor, fill: CONSTANTS.acceptorColor, opacity: 1, class: 'server', label: 'Acceptor'};
    this.state13[3] = {x: 0.75, y: 0.6, r: CONSTANTS.circleRadius, stroke: CONSTANTS.learnerColor, fill: CONSTANTS.learnerColor, opacity: 1, class: 'server', label: 'Learner'};

    let messages = [
        {from: 3, to: 0, r: CONSTANTS.circleRadius / 3, class: 'message clientReply', resend: false},
    ];

    Draw.updateState(13, this.state13, messages, messages[0].resend);
  }

  copystate(from, to) {
    for (let i = 0; i < from.length; ++i) {
      to[i] = JSON.parse(JSON.stringify(from[i]));
    }
  }
}

module.exports = States;
