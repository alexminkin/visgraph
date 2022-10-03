import G6 from "@antv/g6";

const colors = {
    mainRed: "#ff3d6c",
    dark: "#2d2d2d",
    grey: "#79807e",
    light: "#f0f0f0",
  };



const graph = new G6.Graph({
    container: 'mountNode',
    width: 1280, 
    height: 800,

    layout: {
        type: 'comboForce',  // radial, circular, force, fruchterman, comboForce, 
    }, 

    defaultNode: {
        size: 12, 
        style: {
            fill: colors.dark,
            stroke: colors.dark,
            lineWidth: 1, 
            opacity: 1,
        }
    },

    defaultEdge: {
        style: {
            stroke: colors.dark, 
            lineWidth: 0.3,
            opacity: 1,
            endArrow: false,
          }
    },

    modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    },
});


const main = () => {
    fetch('packages/graph_list.json')
    .then((res) => res.json())
    .then((data) => {
        graph.data(data);
        graph.render();
    });
}

main();



// graph.data(data);
// graph.render(data);