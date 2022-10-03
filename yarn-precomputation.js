import fs from 'fs';
import lockfile from '@yarnpkg/lockfile';

let file = fs.readFileSync('static/angular-yarn.lock', 'utf8');
let json = lockfile.parse(file).object;



const data = { nodes: [], edges: [] };
const unresolvedDeps = [];
const namesArray = [];

for (let module of Object.keys(json)) {
    namesArray.push(module);
    data.nodes.push({ 
        id: data.nodes.length.toString(), 
        name: module, 
        version: json[module].version,
        vulnerability: 0,
    });
};

for (let module of Object.keys(json)) {
    if (json[module].dependencies) {
        // console.log(1);
        for (let [dep, ver] of Object.entries(json[module].dependencies)) {
            let dependency = dep + "@" + ver;
            if (namesArray.indexOf(dependency) == "-1") {
                // console.log(2);
                unresolvedDeps.push(dependency);
                continue;
            };
            // console.log(3);

            data.edges.push({ source: namesArray.indexOf(dependency).toString(), target: namesArray.indexOf(module).toString(), weight:1 })
            // console.dir(module_stripped)
        };
    };

};

// console.log(JSON.stringify(data));


let fileData = JSON.stringify(data);
fs.writeFileSync('static/angular-graph.json', fileData);