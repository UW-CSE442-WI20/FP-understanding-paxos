const d3 = require('d3');
import * as CONSTANTS from './constants';
import Draw from './draw';

class States {
  constructor (states, messages, graphicWidth, graphicHeight) {
    this.states = states;
    this.messages = messages;
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

    // for (let i = 0; i < 10; ++i) {
    //   this.states[0][i] = {x: 0.5, y: 0.5, r: 0, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 0, class : 'client', label : ''};
    // }

    d3.select('#viz>svg')
      .selectAll('circle')
      .data(this.states[0])
      .enter()
      .append('circle')
      .attr('cx', d => d.x * this.graphicWidth)
      .attr('cy', d => d.y * this.graphicHeight)
      .attr('r', d => d.r);

    d3.select('#viz>svg')
      .selectAll('text')
      .data(this.states[0])
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('x', d => d.x * this.graphicWidth)
      .attr('y', d => d.y * this.graphicHeight - CONSTANTS.circleRadius - CONSTANTS.circleLabelPadding)
      .text(d => d.label);
  }

  update(stateNum) {
    console.log(stateNum)

    Draw.clearMessage();
    Draw.updateState(stateNum, this.states[stateNum], this.messages[stateNum]);
  }

  // // title

  // update0() {
  //   console.log(0);

  //   Draw.clearMessage();
  //   Draw.updateState(0, this.states[0]);
  // }

  // // motivation

  // update1() {
  //   console.log(1);

  //   Draw.clearMessage();

  //   Draw.updateState(1, this.states[1], this.messages[1]);

  // }

  // update2() {
  //   console.log(2);

  //   Draw.clearMessage();

  //   Draw.updateState(2, this.states[2]);
  // }

  // update3() {
  //   console.log(3);

  //   Draw.clearMessage();

  //   Draw.updateState(3, this.states[3], this.messages[3]);
  // }

  // // roles

  // update4() {
  //   console.log(4)
  //   Draw.clearMessage();

  //   Draw.updateState(4, this.states[4]);
  // }

  // update5() {
  //   console.log(5)
  //   Draw.clearMessage();

  //   Draw.updateState(5, this.states[5]);
  // }

  // update6() {
  //   console.log(6)
  //   Draw.clearMessage();

  //   Draw.updateState(6, this.states[6]);
  // }

  // // 111 vanilla

  // update7() {
  //   console.log(7)
  //   Draw.clearMessage();

  //   Draw.updateState(7, this.states[7], this.messages[7]);
  // }

  // update8() {
  //   console.log(8)
  //   Draw.clearMessage();

  //   Draw.updateState(8, this.states[8], this.messages[8]);
  // }

  // update9() {
  //   console.log(9)
  //   Draw.clearMessage();

  //   Draw.updateState(9, this.states[9], this.messages[9]);
  // }

  // update10() {
  //   console.log(10)
  //   Draw.clearMessage();

  //   Draw.updateState(10, this.states[10], this.messages[10]);
  // }

  // update11() {
  //   console.log(11)
  //   Draw.clearMessage();

  //   Draw.updateState(11, this.states[11], this.messages[11]);
  // }

  // update12() {
  //   console.log(12)
  //   Draw.clearMessage();

  //   Draw.updateState(12, this.states[12], this.messages[12]);
  // }

  // update13() {
  //   console.log(13)
  //   Draw.clearMessage();

  //   Draw.updateState(13, this.states[13], this.messages[13]);
  // }

  // // 333 vanilla

  // update14() {
  //   console.log(14)
  //   Draw.clearMessage();

  //   this.copystate(this.states[0], this.states[1]4);
  //   this.states[14][0] = {x: 0.10, y: 0.50, r: CONSTANTS.circleRadius / 2, stroke: CONSTANTS.clientColor, fill: 'white', opacity: 1, class: 'client', label: 'Client'};
  //   this.states[14][1] = {x: 0.3, y: 0.3, r: CONSTANTS.circleRadius / 2, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server proposer', label: 'Proposer 1'};
  //   this.states[14][2] = {x: 0.3, y: 0.5, r: CONSTANTS.circleRadius / 2, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server proposer', label: 'Proposer 2'};
  //   this.states[14][3] = {x: 0.3, y: 0.7, r: CONSTANTS.circleRadius / 2, stroke: CONSTANTS.proposerColor, fill: CONSTANTS.proposerColor, opacity: 1, class: 'server proposer', label: 'Proposer 3'};

  // }



  copystate(from, to) {
    for (let i = 0; i < from.length; ++i) {
      to[i] = JSON.parse(JSON.stringify(from[i]));
    }
  }
}

module.exports = States;
