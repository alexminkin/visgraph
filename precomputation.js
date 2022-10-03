
import { Algorithm } from '@antv/g6';
import fs from 'fs';

import responseJSON from './package-lock.json' assert {type: 'json'};

const data = { nodes: [], edges: [] };
const unresolvedDeps = [];
const namesArray = [];


for (let module_ of Object.keys(responseJSON.packages)) {
    let module = module_.replace("node_modules/", "");
    namesArray.push(module);
    data.nodes.push({ 
        id: data.nodes.length.toString(), 
        name: module, 
        vulnerability: (() => { let n = Math.round(Math.random() * 100 - 95); return n > 0 ? n : 0; })(),
    });
};

for (let module of Object.keys(responseJSON.packages)) {
    // console.log(data[module][devDependencies])
    const module_stripped = module.replace("node_modules/", "");
    if (responseJSON.packages[module].dependencies) {
        for (let j of Object.keys(responseJSON.packages[module].dependencies)) {
            if (namesArray.indexOf(j) == "-1") {
                unresolvedDeps.push(j);
                continue;
            };
            data.edges.push({ source: namesArray.indexOf(j).toString(), target: namesArray.indexOf(module_stripped).toString(), weight:1 })
            // console.dir(module_stripped)
        };
    } else if (responseJSON.packages[module].devDependencies) {
        for (let j of Object.keys(responseJSON.packages[module].devDependencies)) {
            if (namesArray.indexOf(j) == "-1") {
                unresolvedDeps.push(j);
                continue;
            };
            data.edges.push({ source: namesArray.indexOf(j).toString(), target: namesArray.indexOf(module_stripped).toString(), weight:1 })
        };
    };

};


// Calculate each node's depth

const { findShortestPath } = Algorithm;
data.nodes.forEach((node) => {
let { length } = findShortestPath(data, "0", node.id);
length++;
if (length == Infinity) length = 0;
node.depth = length.toString();
});

let fileData = JSON.stringify(data);
fs.writeFileSync('static/current-project.json', fileData);