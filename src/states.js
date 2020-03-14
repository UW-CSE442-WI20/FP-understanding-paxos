
const d3 = require('d3');
import * as Draw from './draw.js';
import PaxosCluster from './paxos.js';

class States {
  constructor() {
  }

  static import(data, out) {
    States[out] = [];
    return d3.tsv(data).then(d => {

      for (let i in d) {
        let row = d[i];

        console.log(row);

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
            States.setupListeners(21);
            States.cluster.clients.forEach(client => {
              Draw.drawGlow(21, States.cluster.machines.indexOf(client));
            });
            break;
          }
          default: {
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
    d3.select('#paxos svg').selectAll('.client')
      .on('click', function(d) {
        let clientMachinesIndex = States.states[stateNumber].indexOf(d);
        let clientRequest = {type: 'client request', value: 'hello, world'};
        Draw.updateCircleValue(States.cluster.stateNum, clientMachinesIndex, clientRequest.value, false);
        States.cluster.send(clientRequest, States.cluster.machines[clientMachinesIndex], States.cluster.proposers);
      })
  }

}

module.exports = States;
