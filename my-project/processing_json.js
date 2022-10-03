import electron from './electron/electron.json' assert {type: 'json'};
import fs from 'fs';

const data = {nodes: [], edges: [], };
const namesArray = [];

for (let module_ of electron) {
    let module = module_.path;
    if (namesArray.indexOf(module) == -1) {
        namesArray.push(module);
        let id_module = data.nodes.length.toString();
        data.nodes.push({
            id: id_module,
            name: module,
            version: null,
            depth: 0,
        });
    }

    if (module_.result.dependencies) {
        let dependencies = module_.result.dependencies;
        for (let obj_dep of dependencies) {
            let dep_name_v = obj_dep.name + '@' + obj_dep.requirement;
            if (namesArray.indexOf(dep_name_v) == -1) {
                namesArray.push(dep_name_v);  // obj_dep.name
                let id_obj_dep = data.nodes.length.toString();
                data.nodes.push({
                    id: id_obj_dep,
                    name: obj_dep.name,
                    version: obj_dep.requirement,
                    depth: 1,
                });
            }

            data.edges.push({
                source: namesArray.indexOf(dep_name_v).toString(), 
                target: namesArray.indexOf(module).toString(),
                weight: 1,
            });
            if (obj_dep.parent) {
                let parent = obj_dep.parent;
                for (let item of parent) {
                    if (namesArray.indexOf(item) == -1) {
                        let name_parent = item.slice(0, item.indexOf('@'));
                        let version_parent = item.slice(item.indexOf('@') + 2);
                        let id_parent = data.nodes.length.toString();
                        namesArray.push(item);   // name_parent
                        data.nodes.push({
                            id: id_parent,
                            name: name_parent, 
                            version: version_parent, 
                            depth: 2,
                        });
                    }
                    
                    data.edges.push({
                        source: namesArray.indexOf(item).toString(), 
                        target: namesArray.indexOf(dep_name_v).toString(),
                        weight: 1,
                    });
                }
            }
        }
    }
}


let graphList = JSON.stringify(data);
fs.writeFileSync('graph_list.json', graphList);

// const colors = {
//     mainRed: "#ff3d6c",
//     dark: "#2d2d2d",
//     grey: "#79807e",
//     light: "#f0f0f0",
//   }


// const graph = new G6.Graph({
//     container: 'mountNode',
//     width: 1280, 
//     height: 800,

//     layout: {
//         type: 'radial',
//     }, 

//     defaultNode: {
//         size: 12, 
//         style: {
//             fill: colors.dark,
//             stroke: colors.dark,
//             lineWidth: 1, 
//             opacity: 1,
//         }
//     },

//     defaultEdge: {
//         style: {
//             stroke: colors.dark, 
//             lineWidth: 0.3,
//             opacity: 1,
//             endArrow: false,
//           }
//     },

//     modes: {
//         default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
//     },
// });


// graph.data(data);
// graph.render(data);


