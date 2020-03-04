
// You can require libraries
const d3 = require('d3')

// // You can include local JS files:
// const MyClass = require('./my-class');
// const myClassInstance = new MyClass();
// myClassInstance.sayHi();

// // You can load JSON files directly via require.
// // Note this does not add a network request, it adds
// // the data directly to your JavaScript bundle.
// const exampleData = require('./example-data.json');

// // Anything you put in the static folder will be available
// // over the network, e.g.
// d3.csv('carbon-emissions.csv')
//   .then((data) => {
//     console.log('Dynamically loaded CSV data', data);
//   })


window.onresize = resize;
window.onload = start;

let screenWidth;
let screenHeight;
let graphicWidth;
let graphicHeight;

function resize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  graphicWidth = screenWidth * 0.35
  graphicHeight = screenHeight * 1
  update();
}

let sections = [];
let curSection = 0;
let sectionFunctions = [];

function start() {
  sectionFunctions[0] = update0;
  sectionFunctions[1] = update1;
  sectionFunctions[2] = update2;
  sectionFunctions[3] = update3;
  // sectionFunctions[4] = update4;
  // sectionFunctions[5] = update5;
  // sectionFunctions[6] = update6;
  // sectionFunctions[7] = update7;

  resize();

  init();

  update();

  let start;
  d3.selectAll('.step').each(function(d, i) {
    let top = this.getBoundingClientRect().top;

    if (i === 0) {
      start = top;
    }

    sections.push(top - start);
  });

  console.log(sections)

  d3.select(window).on('scroll.scroller', scroll);
}

function scroll() {
  // get section from current scroll position
  let ypos = window.pageYOffset - screenHeight / 3;
  let section = d3.bisect(sections, ypos);
  section = Math.max(0, section);
  section = Math.min(sections.length, section);

  if (curSection != section) {
    curSection = section;
    update();
  }
}

// helpers
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
}

function update() {
  d3.select('#title').style('color', curSection === 0 ? 'black' : 'lightgray');
  d3.selectAll('.step').style('color', (d, i) => i + 1 === curSection ? 'black' : 'lightgray');

  sectionFunctions[curSection]();
}

const circleInDuration = 500;
const circleOutDuration = circleInDuration;
const circleRadius = 40;

const clientColor = 'black';
const serverColor = 'cadetblue';
const messageColor = 'violetred';

const messageDuration = 1500;

function repeatMessage(messages, state) {
  d3.selectAll('#viz>svg>circle.message')
    .data(messages)
    .attr('cx', d => state[d.from].x * graphicWidth)
    .attr('cy', d => state[d.from].y * graphicHeight)
    .attr('r', d => d.r)
    .transition()
    .duration(messageDuration)
    .ease(d3.easeQuad)
    .attr('cx', d => state[d.to].x * graphicWidth)
    .attr('cy', d => state[d.to].y * graphicHeight)
    .end()
    .then(function() {
      repeatMessage(messages, state);
    }).catch(e => console.log(e));
}

function clearMessage() {
  d3.selectAll('#viz .message')
    .remove();
}

let initState = [];
function init() {
  console.log('init')

  for (let i = 0; i < 10; ++i) {
    initState[i] = {x: 0.5, y: 0.5, r: 0, stroke: clientColor, opacity: 1, class : 'client'};
  }

  d3.select('#viz>svg')
    .selectAll('circle')
    .data(initState)
    .enter()
    .append('circle')
    .attr('cx', d => d.x * graphicWidth)
    .attr('cy', d => d.y * graphicHeight)
    .attr('r', d => d.r);
}

function update0() {
  console.log(0);

  clearMessage();
  d3.select('#viz>svg')
    .selectAll('circle')
    // .data(initState)
    .transition()
    .duration(circleOutDuration)
    .ease(d3.easeExp)
    .attr('r', 0);
}

let state1 = [];
function update1() {
  console.log(1);

  clearMessage();

  copystate(initState, state1);
  state1[0] = {x: 0.25, y: 0.5, r: circleRadius, stroke: clientColor, opacity: 1, class: 'client'};
  state1[1] = {x: 0.75, y: 0.5, r: circleRadius, stroke: serverColor, opacity: 1, class: 'server'};

  messages = [
    {from: 0, to: 1, r: circleRadius / 3, class: 'message'}
  ]

  d3.select('#viz>svg')
    .selectAll('circle')
    .data(state1)
    .transition()
    .duration(circleInDuration)
    .ease(d3.easeExp)
    .attr('cx', d => d.x * graphicWidth)
    .attr('cy', d => d.y * graphicHeight)
    .attr('r', d => d.r)
    .attr('opacity', d => d.opacity)
    .attr('stroke', d => d.stroke)
    .end()
    .then( function() {
      d3.select('#viz>svg')
        .selectAll('.message')
        .data(messages)
        .enter()
        .append('circle')
        .style('fill', 'orange')
        .attr('class', 'message')
        .moveToBack();
      repeatMessage(messages, state1);
    }).catch(e => console.log(e));


}

let state2 = [];
function update2() {
  console.log(2);

  clearMessage();

  copystate(initState, state2);
  state2[0] = {x: 0.25, y: 0.5, r: circleRadius, stroke: clientColor, opacity: 1, class: 'client'};
  state2[1] = {x: 0.75, y: 0.5, r: circleRadius, stroke: serverColor, opacity: 0.2, class: 'server'};

  d3.select('#viz>svg')
    .selectAll('circle')
    .data(state2)
    .transition()
    .duration(circleInDuration)
    .ease(d3.easeExp)
    .attr('cx', d => d.x * graphicWidth)
    .attr('cy', d => d.y * graphicHeight)
    .attr('r', d => d.r)
    .attr('opacity', d => d.opacity)
    .attr('stroke', d => d.stroke);
}

let state3 = [];
function update3() {
  console.log(3);

  clearMessage();

  copystate(initState, state3);
  state3[0] = {x: 0.25, y: 0.5, r: circleRadius, stroke: clientColor, opacity: 1, class: 'client'};
  state3[1] = {x: 0.75, y: 0.35, r: circleRadius, stroke: serverColor, opacity: 1, class: 'server'};
  state3[2] = {x: 0.75, y: 0.50, r: circleRadius, stroke: serverColor, opacity: 1, class: 'server'};
  state3[3] = {x: 0.75, y: 0.65 , r: circleRadius, stroke: serverColor, opacity: 1, class: 'server'};

  messages = [
    {from: 0, to: 1, r: circleRadius / 3, class: 'message'},
    {from: 0, to: 2, r: circleRadius / 3, class: 'message'},
    {from: 0, to: 3, r: circleRadius / 3, class: 'message'}
  ]

  d3.select('#viz>svg')
    .selectAll('circle')
    .data(state3)
    .transition()
    .duration(circleInDuration)
    .ease(d3.easeExp)
    .attr('cx', d => d.x * graphicWidth)
    .attr('cy', d => d.y * graphicHeight)
    .attr('r', d => d.r)
    .attr('opacity', d => d.opacity)
    .attr('stroke', d => d.stroke)
    .attr('class', d => d.class)
    .end()
    .then(function() {
      d3.select('#viz>svg')
        .selectAll('.message')
        .data(messages)
        .enter()
        .append('circle')
        .style('fill', 'orange')
        .attr('class', 'message')
        .moveToBack();
      repeatMessage(messages, state3);
    }).catch(e => console.log(e));
}

function update4() {

  clearMessage();

}

function copystate(from, to) {
  for (let i = 0; i < from.length; ++i) {
    to[i] = JSON.parse(JSON.stringify(from[i]));
  }
}
