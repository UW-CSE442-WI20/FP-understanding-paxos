
const d3 = require('d3');
const statesData = require('../data/states.txt');
const captionsData = require('../data/captions.txt');
const messageData = require('../data/messages.txt');
import * as CONSTANTS from './constants.js';
import States from './states.js';

window.onload = init;
window.onresize = resize;

function init() {
  console.log('init');

  resize();

  States
    .import(statesData, 'states')
    .then(() => States.import(captionsData, 'captions')
    .then(() => States.import(messageData, 'messages'))
    .then(() => start()));
}

let screenWidth, screenHeight;
let graphicWidth, graphicHeight;

function resize() {
  console.log('resize');

  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  graphicWidth = screenWidth * CONSTANTS.GRAPHIC_TO_SCREEN_WIDTH_RATIO;
  graphicHeight = screenHeight * CONSTANTS.GRAPHIC_TO_SCREEN_HEIGHT_RATIO;

  if (States.states != undefined) {
    update();
  }
}

function start() {
  console.log('start');

  update();

  setupStateListeners();
}

function setupStateListeners() {
  d3.select('body')
  .on('wheel', () => {
    currentState += d3.event.wheelDelta < 0 ? 1 : -1;
    currentState = Math.max(0, currentState);
    update();
  });

  d3.select('#paxos svg').selectAll('.prev')
    .on('click', d => {
      if (d.prevenabled) {
        currentState--;
        update();
      }
    })
    .on('mouseover', function (d) {
      if (d.prevenabled) {
        d3.select(this).style('cursor', 'pointer')
      } else {
        d3.select(this).style('cursor', 'default')
      }
    })

  d3.select('#paxos svg').selectAll('.next')
    .on('click', d => {
      if (d.nextenabled) {
        currentState++;
        update();
      }
    })
    .on('mouseover', function(d) {
      if (d.nextenabled) {
        d3.select(this).style('cursor', 'pointer')
      } else {
        d3.select(this).style('cursor', 'default')
      }
    })

  d3.select('#paxos svg').selectAll('.reset')
    .on('click', d => {
      if (d.resetenabled) {
        switch(currentState) {
          case 21: {
            States.cluster.reset();
            update();
            break;
          }
          default: {
            update();
            break;
          }
        }
      }
    })
    .on('mouseover', function(d) {
      if (d.resetenabled) {
        d3.select(this).style('cursor', 'pointer')
      } else {
        d3.select(this).style('cursor', 'default')
      }
    })
}

let currentState = 14;
function update() {
  console.log('update');

  States.update(currentState, graphicWidth, graphicHeight);
}
