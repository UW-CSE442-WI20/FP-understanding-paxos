const d3 = require('d3');
import * as CONSTANTS from './constants.js';

let width, height;
let stateNumber, state, messages, captions;

export function setState(currentStateNumber, currentState, currentMessages, currentCaptions) {
  stateNumber = currentStateNumber;
  state = currentState;
  messages = currentMessages;
  captions = currentCaptions;
}

export function setGraphicSize(graphicWidth, graphicHeight) {
  width = graphicWidth;
  height = graphicHeight;
}

export function drawPageTitle(stateNumber) {
  console.log('Draw::drawPageTitle', stateNumber);

  d3.select('#title')
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .style('left', () => {
      if (stateNumber == 0) {
        return width / CONSTANTS.GRAPHIC_TO_SCREEN_WIDTH_RATIO * 0.2 + 'px';
      } else {
        return d3.select('#paxos')._groups[0][0].offsetLeft + width * CONSTANTS.CAPTION_LEFT_SCREEN_WIDTH_RATIO + 'px';
      }
    })
    .style('top', () => {
      if (stateNumber == 0) {
        return height / CONSTANTS.GRAPHIC_TO_SCREEN_HEIGHT_RATIO * 0.4 + 'px';
      } else {
        return CONSTANTS.BUTTON_CAPTION_PADDING_PX + 'px';
      }
    });

    d3.select('#title h1')
      .style('font-size', (stateNumber == 0 ? CONSTANTS.PAGE_TITLE_FONT_SIZE_0 : CONSTANTS.PAGE_TITLE_FONT_SIZE_1) + 'pt');

    d3.select('#title h4')
      .style('font-size', (stateNumber == 0 ? CONSTANTS.PAGE_AUTHORS_FONT_SIZE_0 : CONSTANTS.PAGE_AUTHORS_FONT_SIZE_1) + 'pt');
}

export function drawCircles(stateNumber) {
  console.log('Draw::drawCircles', stateNumber)

  // create circles if necessary
  d3.select('#paxos svg').selectAll('.machine')
    .data(state)
    .enter()
    .append('circle')
    .classed('machine', true)
    .attr('id', (d, i) => 'server' + i);

  // update circle positions
  return d3.select('#paxos svg').selectAll('.machine')
    .attr('class', d => d.class + ' machine')
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .attr('cx', d => d.x * width + 'px')
    .attr('cy', d => d.y * height + 'px')
    .attr('r', d => d.r)
    .attr('opacity', d => d.opacity)
    .attr('stroke', d => d.stroke)
    .attr('fill', d => d3.scaleLinear().domain([0,1]).range(['white', d.fill])(CONSTANTS.CIRCLE_FILL_RATIO));
}

export function drawCircleValues(stateNumber, machines = null) {
  console.log('Draw::drawCircleValues', stateNumber, machines);

  // create if necessary
  d3.select('#paxos svg').selectAll('.value')
    .data(state)
    .enter()
    .append('text')
    .classed('value', true)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', CONSTANTS.CIRCLE_VALUE_FONT_SIZE)
    .attr('id', (d, i) => 'value' + i)
    .attr('x', (d, i) => d.x * width)
    .attr('y', (d, i) => d.y * height)
    .text((d, i) => {
      if (d.showvalue) {
        if (machines == null) {
          // put logic here ?
        } else {
          switch(d.class) {
            case 'server proposer':
              return machines[i].proposerProposalNumber + ', ' + 'null';
            case 'server acceptor':
              return '-1, null';
            case 'server learner':
              return 'null';
          }
        }
      }
    })
    .attr('opacity', 0);

  d3.select('#paxos svg').selectAll('.value')
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .attr('opacity', d => d.showvalue ? 1 : 0);
}

export function updateCircleValue(stateNumber, machineNumber, value, consensus = false) {
  console.log('Draw::updateCircleValue', stateNumber, machineNumber, value, consensus);

  // update value
  d3.select('#value' + machineNumber)
    .text(value)
    // .classed('consensus', consensus)
    // .style('fill', consensus ? 'black': 'red')
}

export function drawCircleLabels(stateNumber) {
  console.log('Draw::drawCircleLabels', stateNumber, )

  // create circles if necessary
  d3.select('#paxos svg').selectAll('.label')
    .data(state)
    .enter()
    .append('text')
    .classed('label', true)
    .attr('text-anchor', 'middle')
    // .attr('dominant-baseline', 'middle');

  // update label positions
  d3.select('#paxos svg').selectAll('.label')
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .attr('x', d => d.x * width + 'px')
    .attr('y', d => d.y * height - d.r - CONSTANTS.CIRCLE_LABEL_PADDING_PX + 'px')
    .attr('opacity', d => d.opacity)
    .text(d => d.label)
}

export function drawTitle(stateNumber) {
  console.log('Draw::drawTitle', stateNumber)

  d3.select('#caption h1')
    .data(captions)
    .text(d => d.title)
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .attr('opacity', d => d.opacity)
}

export function drawSubtitle(stateNumber) {
  console.log('Draw::drawSubtitle', stateNumber)

  d3.select('#caption').select('p')
    .data(captions)
    .html(d => d.subtitle)
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .attr('opacity', d => d.opacity)
}

export function drawMessage(stateNumber, sender, sendee, duration, clientNum, deliveredCallback = null, noisems=0) {
  console.log('Draw::drawMessage', stateNumber, sender, sendee, duration, clientNum, deliveredCallback);

  d3.select('#paxos svg')
    .append('circle')
    .classed('message', true)
    .classed('firstClient', clientNum == 1)
    .attr('cx', state[sender].x * width)
    .attr('cy', state[sender].y * height)
    .attr('r', CONSTANTS.MESSAGE_RADIUS_PX)
    .moveToBack()
    .transition()
    .duration(duration + Math.random() * noisems)
    .ease(d3.easeLinear)
    .attr('cx', state[sendee].x * width)
    .attr('cy', state[sendee].y * height)
    .remove()
    .end()
    .then(function() {
      if (deliveredCallback != null) {
        deliveredCallback(sender, sendee)
      }
    });
}

export function drawMessages(stateNumber) {
  console.log('Draw::drawMessages', stateNumber);

  // check if we've hardcoded messages for this state
  if (messages === undefined) {
    return;
  }

  // make all senders clickable
  // make all senders display their message value
  // make all sendees display received message value
  for (let i in messages) {
    let message = messages[i];

    updateCircleValue(stateNumber, message.sender, message.message, false);

    // send messages on click
    d3.select('#paxos svg').selectAll('#server' + message.sender + ',#value' + message.sender)
      .on('click', function() {
        for (let j in message.sendee) {
          drawMessage(stateNumber, message.sender, message.sendee[j], CONSTANTS.MESSAGE_DURATION_FAST_MS, message.sender + 1, function() {
            updateCircleValue(stateNumber, message.sendee[j], message.message, false)
          }, stateNumber == 5 ? CONSTANTS.MESSAGE_LATENCY_LARGE_MS : CONSTANTS.MESSAGE_LATENCY_SMALL_MS);
        }
      });
  }
}

export function drawGlow(stateNumber, sender) {
  console.log('Draw::drawGlow', stateNumber, sender)

  d3.select('#paxos svg')
    .append('circle')
    .classed('glow', true)
    .attr('cx', state[sender].x * width)
    .attr('cy', state[sender].y * height)
    .attr('r', state[sender].r)
    .attr('opacity', 0)
    .moveToBack()
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .attr('r', state[sender].r + CONSTANTS.CIRCLE_GLOW_PX)
    .attr('opacity', CONSTANTS.CIRCLE_GLOW_OPACITY)
}

export function drawReset() {
  console.log('Draw::drawReset')

  d3.select('#paxos svg').selectAll('rect.reset')
    .data(captions)
    .enter()
    .append('rect')
    .classed('reset', true)
    .classed('button', true)
    .attr('x', (width - CONSTANTS.BUTTON_WIDTH_RATIO * width) / 2)
    .attr('y', height - CONSTANTS.CAPTION_SUBTITLE_PADDING_PX - CONSTANTS.BUTTON_HEIGHT_RATIO * height)
    .attr('width', CONSTANTS.BUTTON_WIDTH_RATIO * width)
    .attr('height', CONSTANTS.BUTTON_HEIGHT_RATIO * height)
    .attr('rx', CONSTANTS.BUTTON_RADIUS)
    .attr('opacity', CONSTANTS.BUTTON_DISABLED_OPACITY)

  d3.select('#paxos svg').selectAll('text.reset')
    .data(captions)
    .enter()
    .append('text')
    .text('reset')
    .classed('reset', true)
    .classed('button', true)
    .attr('x', width / 2)
    .attr('y', height - CONSTANTS.CAPTION_SUBTITLE_PADDING_PX - CONSTANTS.BUTTON_HEIGHT_RATIO * height / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', CONSTANTS.BUTTON_FONT_SIZE)
    .attr('opacity', CONSTANTS.BUTTON_DISABLED_OPACITY);

  d3.select('#paxos svg').selectAll('.reset')
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .attr('opacity', d => d.resetenabled ? 1 : CONSTANTS.BUTTON_DISABLED_OPACITY);
}

export function drawPrev() {
  console.log('Draw::drawPrev')

  d3.select('#paxos svg').selectAll('rect.prev')
    .data(captions)
    .enter()
    .append('rect')
    .classed('prev', true)
    .classed('button', true)
    .attr('x', (width - CONSTANTS.BUTTON_WIDTH_RATIO * width) / 2 - CONSTANTS.BUTTON_WIDTH_RATIO * width - CONSTANTS.BUTTON_CAPTION_PADDING_PX)
    .attr('y', height - CONSTANTS.CAPTION_SUBTITLE_PADDING_PX - CONSTANTS.BUTTON_HEIGHT_RATIO * height)
    .attr('width', CONSTANTS.BUTTON_WIDTH_RATIO * width)
    .attr('height', CONSTANTS.BUTTON_HEIGHT_RATIO * height)
    .attr('rx', CONSTANTS.BUTTON_RADIUS)
    .attr('opacity', CONSTANTS.BUTTON_DISABLED_OPACITY);

  d3.select('#paxos svg').selectAll('text.prev')
    .data(captions)
    .enter()
    .append('text')
    .text('prev')
    .classed('prev', true)
    .classed('button', true)
    .attr('x', width / 2 - CONSTANTS.BUTTON_WIDTH_RATIO * width - CONSTANTS.BUTTON_CAPTION_PADDING_PX)
    .attr('y', height - CONSTANTS.CAPTION_SUBTITLE_PADDING_PX - CONSTANTS.BUTTON_HEIGHT_RATIO * height / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', CONSTANTS.BUTTON_FONT_SIZE)
    .attr('opacity', CONSTANTS.BUTTON_DISABLED_OPACITY);

  d3.select('#paxos svg').selectAll('.prev')
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .attr('opacity', d => d.prevenabled ? 1 : CONSTANTS.BUTTON_DISABLED_OPACITY);
}

export function drawNext() {
  console.log('Draw::drawNext')

  d3.select('#paxos svg').selectAll('rect.next')
    .data(captions)
    .enter()
    .append('rect')
    .classed('next', true)
    .classed('button', true)
    .attr('x', (width - CONSTANTS.BUTTON_WIDTH_RATIO * width) / 2 + CONSTANTS.BUTTON_WIDTH_RATIO * width + CONSTANTS.BUTTON_CAPTION_PADDING_PX)
    .attr('y', height - CONSTANTS.CAPTION_SUBTITLE_PADDING_PX - CONSTANTS.BUTTON_HEIGHT_RATIO * height)
    .attr('width', CONSTANTS.BUTTON_WIDTH_RATIO * width)
    .attr('height', CONSTANTS.BUTTON_HEIGHT_RATIO * height)
    .attr('rx', CONSTANTS.BUTTON_RADIUS)
    .attr('opacity', CONSTANTS.BUTTON_DISABLED_OPACITY);

  d3.select('#paxos svg').selectAll('text.next')
    .data(captions)
    .enter()
    .append('text')
    .text('next')
    .classed('next', true)
    .classed('button', true)
    .attr('x', width / 2 + CONSTANTS.BUTTON_WIDTH_RATIO * width + CONSTANTS.BUTTON_CAPTION_PADDING_PX)
    .attr('y', height - CONSTANTS.CAPTION_SUBTITLE_PADDING_PX - CONSTANTS.BUTTON_HEIGHT_RATIO * height / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', CONSTANTS.BUTTON_FONT_SIZE)
    .attr('opacity', CONSTANTS.BUTTON_DISABLED_OPACITY);

  d3.select('#paxos svg').selectAll('.next')
    .transition()
    .duration(CONSTANTS.STATE_TRANSITION_MS)
    .ease(d3.easeQuad)
    .attr('opacity', d => d.nextenabled ? 1 : CONSTANTS.BUTTON_DISABLED_OPACITY);
}

export function reset() {
  // reset listeners
  d3.select('#paxos svg').selectAll('.machine').on('click', null);

  // reset messages
  d3.select('#paxos svg').selectAll('.message').remove();

  // reset glow
  d3.select('#paxos svg').selectAll('.glow').remove();

  // reset values
  d3.select('#paxos svg').selectAll('.value').remove();
}

d3.selection.prototype.moveToFront = function() {
  this.each(function(){
    this.parentNode.appendChild(this);
  });
  return this;
};

d3.selection.prototype.moveToBack = function() {
  this.each(function() {
      var firstChild = this.parentNode.firstChild;
      if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
      }
  })
  return this;
}
