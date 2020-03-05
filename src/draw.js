const d3 = require('d3');
import * as CONSTANTS from './constants';

class Draw {
  constructor () {
  }

  static updateState(stateNum, circles, messages = []) {
    Draw.stateNum = stateNum;
    d3.select('#viz>svg')
      .selectAll('circle')
      .data(circles)
      .attr('class', d => d.class)
      .transition()
      .duration(CONSTANTS.circleInDuration)
      .ease(d3.easeExp)
      .attr('cx', d => d.x * Draw.graphicWidth)
      .attr('cy', d => d.y * Draw.graphicHeight)
      .attr('r', d => d.r)
      .attr('opacity', d => d.opacity)
      .attr('stroke', d => d.stroke)
      .attr('fill', d => d3.scaleLinear().range(['white', d.fill]).domain([0, 1])(CONSTANTS.circleFillRatio))
      .end()
      .then( function() {
        // draw message
        Draw.drawMessage(messages);
        Draw.transitionMessages(stateNum, messages, circles);
      }).catch(e => console.log(e));

    this.updateLabels(circles);
  }

  static drawMessage(messages) {
    d3.select('#viz>svg')
      .selectAll('.message')
      .data(messages)
      .enter()
      .append('circle')
      .style('fill', CONSTANTS.messageColor)
      .attr('class', 'message')
      .moveToBack();

  }


  static transitionMessages(stateNum, messages, state) {
    d3.selectAll('#viz>svg>circle.message').each(function(d, i) {
      Draw.repeatMessage(stateNum, messages[i], state, this);
    })
  }

  static repeatMessage(stateNum, message, state, messageObj) {
    if (stateNum !== Draw.stateNum) {
      return;
    }

    d3.select(messageObj)
      .attr('cx', state[message.from].x * Draw.graphicWidth)
      .attr('cy', state[message.from].y * Draw.graphicHeight)
      .attr('r', message.r)
      .transition()
      .duration(CONSTANTS.messageDuration)
      .ease(d3.easeQuadInOut)
      .attr('cx', state[message.to].x * Draw.graphicWidth)
      .attr('cy', state[message.to].y * Draw.graphicHeight)
      .end()
      .then(function() {
        if (message.resend) {
          Draw.repeatMessage(stateNum, message, state, messageObj);
        }
      }).catch(e => console.log(e));
  }

  static clearMessage() {
    d3.selectAll('#viz .message')
      .remove();
  }

  static updateLabels(state) {
    d3.selectAll('#viz>svg text')
    .data(state)
    .transition()
    .duration(CONSTANTS.labelDuration)
    .ease(d3.easeExp)
    .attr('x', d => d.x * Draw.graphicWidth)
    .attr('y', d => d.y * Draw.graphicHeight - d.r - CONSTANTS.circleLabelPadding)
    .attr('opacity', d => d.opacity)
    .text(d => d.label);
  }
}

module.exports = Draw;
