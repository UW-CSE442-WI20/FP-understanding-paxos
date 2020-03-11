const d3 = require('d3');
import * as CONSTANTS from './constants';
import Draw from './draw';
import PaxosCluster from './paxos';

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
    if (stateNum == 14) {
      this.update14();
      return;
    }
    Draw.clearMessage();
    Draw.updateState(stateNum, this.states[stateNum], this.messages[stateNum]);
  }

  // // 333 vanilla

  update14() {
    console.log(14)
    Draw.clearMessage();

    let cluster = new PaxosCluster(14, this.states[14]);
    d3.select('#viz>svg')
      .on("mousedown", d => console.log(d3.mouse(this)));
    cluster.drawCluster();
  }



  copystate(from, to) {
    for (let i = 0; i < from.length; ++i) {
      to[i] = JSON.parse(JSON.stringify(from[i]));
    }
  }
}

module.exports = States;
