
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
// import classes
import States from './sections';

window.onresize = resize;
window.onload = start;

let screenWidth;
let screenHeight;
let graphicWidth;
let graphicHeight;

let states;

function resize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  graphicWidth = screenWidth * 0.50
  graphicHeight = screenHeight * 1
  states.setGraphicDim(graphicWidth, graphicHeight);
  update();
}

let sections = [];
let curSection = 0;
const sectionFunctionPrefix = 'update';

function start() {

  states = new States(graphicWidth, graphicHeight);

  resize();

  states.init();

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
  let ypos = window.pageYOffset - screenHeight / 4;
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

  states[sectionFunctionPrefix + curSection]();
}
