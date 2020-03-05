const d3 = require('d3');


class Parser {
    constructor () {
    }

    static parse(requiredFile) {
        // returns a promise
        Parser.out = [];
        return d3.csv(requiredFile, function(d) {
            if (Parser.out[+d['state:int']] === undefined) {
                Parser.out[+d['state:int']] = [];
            }
            let entry = {};
            for (const [key, value] of Object.entries(d)) {
                let arr = key.split(':')
                switch(arr[1]) {
                    case 'int':
                    case 'boolean':
                    case 'float':
                        entry[arr[0]] = +value;
                        break;
                    case 'string':
                        entry[arr[0]] = value;
                        break;
                }
            }
            Parser.out[+d['state:int']].push(entry);
        });
    }

    static clear() {
        Parser.out = [];
    }
}

module.exports = Parser;
