
const d3 = require('d3');
import * as Draw from './draw.js';
import * as CONSTANTS from './constants.js';
import PaxosCluster from './paxos.js';

class States {
  constructor() {
  }

  static import(data, out) {
    States[out] = [];
    return d3.tsv(data).then(d => {

      for (let i in d) {
        let row = d[i];

        if (States[out][+row['state:int']] === undefined) {
          States[out][+row['state:int']] = [];
        }

        let entry = {};
        for (const [key, value] of Object.entries(row)) {
          let keyParts = key.split(':')
          switch(keyParts[1]) {
            case 'int':
            case 'boolean':
            case 'float':
              entry[keyParts[0]] = +value;
              break;
            case 'string':
              entry[keyParts[0]] = value;
              break;
            case 'array':
              entry[keyParts[0]] = value.substring(1, value.length - 1).split(' ').map(d => +d)
              break;
          }
        }

        States[out][+row['state:int']].push(entry);
      }

    });
  }

  static update(stateNumber, graphicWidth, graphicHeight) {
    console.log('States::update', stateNumber);

    Draw.setGraphicSize(graphicWidth, graphicHeight);
    Draw.setState(stateNumber, States.states[stateNumber], States.messages[stateNumber], States.captions[stateNumber]);

    Draw.reset();

    Draw.drawPageTitle(stateNumber);
    Draw.drawTitle(stateNumber);
    Draw.drawSubtitle(stateNumber);
    Draw.drawPrev();
    Draw.drawNext();
    Draw.drawReset();
    Draw.drawCircleLabels(stateNumber);
    Draw.drawCircles(stateNumber)
      .end()
      .then(() => {
        switch(stateNumber) {
          case 21: {
            States.cluster = new PaxosCluster(21, States.states[21], true);
            Draw.drawCircleValues(stateNumber, States.cluster.machines);
            Draw.updateCircleValue(21, 0, States.messages[stateNumber][0].message, false);
            States.setupListeners(21);
            States.cluster.clients.forEach(client => {
              Draw.drawGlow(21, States.cluster.machines.indexOf(client));
            });
            break;
          }
          case 6: {
            Draw.drawCircleValues(stateNumber, null);
            // Draw.drawMessages(stateNumber);
            States.setup6();
            States.messages[stateNumber].forEach(message => {
              if (message.sender != 5) {
                Draw.drawGlow(stateNumber, message.sender);
              }
            });
            break;
          }
          case 14: {
            Draw.drawCircleValues(stateNumber, null);
            Draw.updateCircleValue(14, 0, 'Request1', false);
            Draw.updateCircleValue(14, 1, '1, null, 0/1, 0/1', false);
            States.setupWalkthrough(14);
            break;
          }
          case 15: {
            Draw.drawCircleValues(stateNumber, null);
            Draw.updateCircleValue(15, 0, 'Request1', false);
            Draw.updateCircleValue(15, 1, '1, Request1, 0/1, 0/1', false);
            Draw.updateCircleValue(15, 2, '-1, null', false);
            States.setupWalkthrough(15);
            break;
          }
          case 16: {
            Draw.drawCircleValues(stateNumber, null);
            Draw.updateCircleValue(16, 0, 'Request1', false);
            Draw.updateCircleValue(16, 1, '1, Request1, 0/1, 0/1', false);
            Draw.updateCircleValue(16, 2, '1, null', false);
            States.setupWalkthrough(16);
            break;
          }
          case 17: {
            Draw.drawCircleValues(stateNumber, null);
            Draw.updateCircleValue(17, 0, 'Request1', false);
            Draw.updateCircleValue(17, 1, '1, Request1, 1/1, 0/1', false);
            Draw.updateCircleValue(17, 2, '1, null', false);
            States.setupWalkthrough(17);
            break;
          }
          case 18: {
            Draw.drawCircleValues(stateNumber, null);
            Draw.updateCircleValue(18, 0, 'Request1', false);
            Draw.updateCircleValue(18, 1, '1, Request1, 1/1, 0/1', false);
            Draw.updateCircleValue(18, 2, '1, Request1', false);
            States.setupWalkthrough(18);
            break;
          }
          case 19: {
            Draw.drawCircleValues(stateNumber, null);
            Draw.updateCircleValue(19, 0, 'Request1', false);
            Draw.updateCircleValue(19, 1, '1, Request1, 1/1, 1/1', false);
            Draw.updateCircleValue(19, 2, '1, Request1', false);
            Draw.updateCircleValue(19, 3, 'null', false);
            States.setupWalkthrough(19);
            break;
          }
          case 20: {
            Draw.drawCircleValues(stateNumber, null);
            Draw.updateCircleValue(20, 0, 'Request1', false);
            Draw.updateCircleValue(20, 1, '1, Request1, 1/1, 1/1', false);
            Draw.updateCircleValue(20, 2, '1, Request1', false);
            Draw.updateCircleValue(20, 3, 'Request1', false);
            States.setupWalkthrough(20);
            break;
          }
          default: {
            Draw.drawCircleValues(stateNumber, null);
            Draw.drawMessages(stateNumber);
            States.messages[stateNumber].forEach(message => {
              Draw.drawGlow(stateNumber, message.sender);
            });
          }
        }
      })
      .catch(e => null);  // stfu pls
  }

  static setupListeners(stateNumber) {
    console.log('State::setupListeners', stateNumber);

    // client listener
    States.cluster.clients.forEach(client => {
      d3.select('#paxos svg').selectAll('#server' + client.machineIndex + ',#value' + client.machineIndex)
        .on('click', function() {
          let clientRequest = {type: 'client request', value: States.messages[stateNumber][States.cluster.clients.indexOf(client)].message};
          Draw.updateCircleValue(stateNumber, client.machineIndex, clientRequest.value, false);
          States.cluster.send(clientRequest, client, States.cluster.proposers);
        })
    });
  }

  static setupWalkthrough(stateNumber) {
    console.log('States::setupWalkthrough', stateNumber);

    States.messages[stateNumber].forEach(message => {
      Draw.drawGlow(stateNumber, message.sender);
      d3.select('#paxos svg').selectAll('#server' + message.sender + ',#value' + message.sender)
        .on('click', function() {
          Draw.drawMessage(stateNumber, message.sender, message.sendee[0], CONSTANTS.MESSAGE_DURATION_MS, function() {
            Draw.updateCircleValue(stateNumber, message.sendee[0], message.ondelivermessage, true);
          })
        });
    });
  }

  static setup6() {
    console.log('Sates::setup6');

    let messages = States.messages[6];

    let broadcast;
    let fixed = false;
    
    for (let i in messages) {
      let message = messages[i];

      if (message.sender == 5) {
        broadcast = message;
        continue;
      }
      
      Draw.updateCircleValue(States.stateNumber, message.sender, message.message, false);

      // send messages on click
      d3.select('#paxos svg').selectAll('#server' + message.sender + ',#value' + message.sender)
        .on('click', function() {
          for (let j in message.sendee) {
            Draw.drawMessage(States.stateNumber, message.sender, message.sendee[j], CONSTANTS.MESSAGE_DURATION_MS, function() {
              if (fixed) {
                return;
              }
              fixed = true;
              Draw.updateCircleValue(States.stateNumber, message.sendee[j], message.message, false);
              Draw.drawGlow(States.stateNumber, message.sendee[j]);
              d3.select('#paxos svg').selectAll('#server' + message.sendee[j] + ',#value' + message.sendee[j])
                .on('click', function() {
                  for (let k in broadcast.sendee) {
                    Draw.drawMessage(States.stateNumber, broadcast.sender, broadcast.sendee[k], CONSTANTS.MESSAGE_DURATION_MS, function() {
                      Draw.updateCircleValue(States.stateNumber, broadcast.sendee[k], message.message, false);
                    }, 0);
                  }
                });
            }, CONSTANTS.MESSAGE_LATENCY_MS);
          }
        });
    }
  }

}

module.exports = States;
