
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
          case 22:
          case 21: {
            States.cluster = new PaxosCluster(stateNumber, States.states[stateNumber], true);
            Draw.drawCircleValues(stateNumber, States.cluster.machines);
            States.cluster.clients.forEach((client, i) => {
              Draw.updateCircleValue(stateNumber, client.machineIndex, States.messages[stateNumber][i].message, false);
            });
            States.setupListeners(stateNumber);
            States.cluster.clients.forEach(client => {
              Draw.drawGlow(stateNumber, client.machineIndex);
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
    States.cluster.clients.forEach((client, i) => {
      d3.select('#paxos svg').selectAll('#server' + client.machineIndex + ',#value' + client.machineIndex)
        .on('click', function() {
          let clientRequest = {type: 'client request', value: States.messages[stateNumber][i].message};
          Draw.updateCircleValue(stateNumber, client.machineIndex, clientRequest.value, false);
          States.cluster.send(clientRequest, client, States.cluster.proposers);
        })
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
            }, 1000);
          }
        });
    }
  }

}

module.exports = States;
