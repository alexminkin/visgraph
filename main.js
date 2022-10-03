import G6, { Algorithm } from '@antv/g6';


const legendData = {
  nodes: [{
    id: 'nodeInfected',
    label: 'Infected',
  }, {
    id: 'nodeHealthy',
    label: 'Healthy',
  }, {
    id: 'nodeVulnerable',
    label: 'Vulnerable',
  }],

  edges: [{
    id: 'edgeInfected',
    label: 'Infected',
  }, {
    id: 'edgeHealthy',
    label: 'Healthy',
  }]
}

const legend = new G6.Legend({
  data: legendData,
  align: 'center',
  layout: 'horizontal', // vertical
  position: 'bottom-right',
  vertiSep: 12,
  horiSep: 24,
  offsetY: -24,
  padding: [4, 16, 8, 16],
  containerStyle: {
    fill: '#ccc',
    lineWidth: 1
  },
  title: 'Filter',
  titleConfig: {
    position: 'center',
    offsetX: 0,
    offsetY: 12,
  },
  filter: {
    enable: true,
    multiple: true,
    trigger: 'click',
    graphActiveState: 'activeByLegend',
    graphInactiveState: 'inactiveByLegend',
    filterFunctions: {
      'nodeInfected': (d) => {
        console.dir(d);
        if (d.hasState('vulnerable')) return true;
        return false
      },
      'nodeHealthy': (d) => {
        if (!d.hasState('vulnerable')) return true;
        return false
      },
      'nodeVulnerable': (d) => {
        if (d.vulnerability > 0) return true;
        return false
      },
      'edgeInfected': (d) => {
        if (d.hasState('vulnerable')) return true;
        return false
      },
      'edgeHealthy': (d) => {
        if (!d.hasState('vulnerable')) return true;
        return false
      },
    }
  }
});

const colors = {
  mainAccent: "#d1372a",
  dark: "#243E73",
  grey: "#89C2D9",
  light: "a8daed",
}

G6.registerBehavior('select-subgraph', {
  getDefaultCfg() {
    return {
      // multiple: true
    };
  },

  getEvents() {
    return {
      'node:click': 'onNodeClick',
      'canvas:click': 'onCanvasClick',
    };
  },


  onNodeClick(e) {
    const graph = this.graph;
    const item = e.item;
    const nodesSetFull = new Set();
    this.removeNodesState();
    nodesSetFull.add(...this.searchRec(item, "in"));
    nodesSetFull.add(...this.searchRec(item, "out"));
    graph.emit("afterTracing", {nodesSet: nodesSetFull});


  },

  searchRec(node, edgeType) {
    const nodesSet = new Set();
    nodesSet.add(node);
    nodesSet.forEach(node => {
      graph.setItemState(node, 'tracing', true);
      if (edgeType === "in") {
        const inEdges = node.getInEdges();
        inEdges.forEach(edge => {
          graph.setItemState(edge, 'tracing', true);
          nodesSet.add(edge.getSource());
        });
      };
      if (edgeType === "out") {
        const outEdges = node.getOutEdges();
        outEdges.forEach(edge => {
          graph.setItemState(edge, 'tracing', true);
          nodesSet.add(edge.getTarget());
        });
      };
    })
    return nodesSet;
    // if (newNodesSet.length > 0) searchRec(newNodesSet);
  },

  onCanvasClick(e) {
    // shouldUpdate can be overrode by users. Returning true means turning the 'active' to be false for all the nodes
    if (this.shouldUpdate(e)) {
      this.removeNodesState();
    }
  },

  removeNodesState() {
    graph.findAllByState('node', 'tracing').forEach(node => {
      graph.setItemState(node, 'tracing', false);
    });
    graph.findAllByState('edge', 'tracing').forEach(edge => {
      graph.setItemState(edge, 'tracing', false);
    });
  }



});

G6.registerLayout('depth-sorting', {
  // getDefaultCfg() {
  //   return {
  //     // center: [0, 0], // The center of the layout
  //     // nodesOffset: 20, // The offset between nodes in the same group
  //     // groupsOffset: 40,
  //     // nodeSize: 20, // The node size
  //     // groups: [], // Array of node groups
  //   };
  // },

  execute() {
    const self = this;
    const nodes = self.nodes;
    const groups = [];
    const nodeSize = 20;
    const nodesOffset = 20;
    const groupsOffset = 40;
    const center = { x: 10, y: 10 };

    // Fill up node groups
    nodes.forEach((node, i) => {

      if (!groups[Number(node.depth)]) {
        groups[Number(node.depth)] = { x: 0, width: 0, size: 0, numCols: 4, nodes: [], };
      };

      groups[Number(node.depth)].nodes.push(node);
    });
    console.log(groups)

    groups.forEach((group, i) => {

      group.x = groups[i - 1] ? groups[i - 1].width + groups[i - 1].x + groupsOffset : center.x;
      group.y = center.y;
      group.width = 4 * nodesOffset;

      group.nodes.forEach((node, i) => {
        node.x = i * nodesOffset % group.width + group.x;
        node.y = Math.floor(i * nodesOffset / group.width) * nodesOffset + group.y;
      })

    });

  }

});



// // Instantiate the Minimap
// const minimap = new G6.Minimap({
//   size: [100, 100],
//   className: 'minimap',
//   type: 'delegate',
// });
// const grid = new G6.Grid();
// Instantiate a Graph
const graph = new G6.Graph({
  container: 'mountNode', // The id of the container
  // The width and height of the graph
  width: 1280,
  height: 700,
  // fitView: true,
  // fitViewPadding: [20, 40, 50, 20],

  layout: {
    type: 'depth-sorting',
  },

  defaultNode: {
    size: 8,
    style: {
      fill: colors.light,
      stroke: colors.dark,
      lineWidth: 0,
      opacity: 1,

    },

    // labelCfg: {
    //   style: {
    //     fontSize: 5,
    //   },
    //   position: 'right',
    //   offset: 1,
    // },
  },
  // The style properties and other properties for all the edges in the default state
  defaultEdge: {

    style: {
      stroke: colors.light, // The color of the edges
      lineWidth: 0.3, //
      opacity: 1, // The opacity of edges
      endArrow: false,
    }

  },

  //active, selected, highlight, inactive, disable
  nodeStateStyles: {
    tracing: {
      // stroke: "#ff3d6e",
      lineWidth: 3,

    },

    // "severity:0": {fill: '#ffffff'}, //ffffff
    "severity:1": {fill: colors.mainAccent}, //ffcccc
    "severity:2": {fill: colors.mainAccent}, //ff9999
    "severity:3": {fill: colors.mainAccent}, //ff6666
    "severity:4": {fill: colors.mainAccent}, //ff3333
    "severity:5": {fill: colors.mainAccent}, //ff0000
    // The node style when the state 'hover' is true
    // disable: {
    //   fill: "red",
    // },


    vulnerable: {
      stroke: colors.mainAccent,
      lineWidth: 1,
    },

    activeByLegend: {},
    inactiveByLegend: {
      opacity: 0.2,
    },

    // The node style when the state 'click' is true
  },


  
  // The edge styles in different states
  edgeStateStyles: {
    // The edge style when the state 'click' is true
    tracing: {
      lineWidth: 2,
      opacity: 1,
      endArrow: true,
      stroke: colors.dark,
    },
    vulnerable: {
      stroke: colors.mainAccent,
      lineWidth: 0.5,
    },
    activeByLegend: {},
    inactiveByLegend: {
      opacity: 0.2,
    },

  },

  modes: {
    default: [
      'drag-node',  'scroll-canvas', 'select-subgraph',
      // 'click-select', 'brush-select',
      // {
      //   type: 'activate-relations',
      //   trigger: 'click',

      // },

      {
        type: 'drag-canvas',
        enableOptimize: true,
      },
      // {
      //   type: 'zoom-canvas',
      //   enableOptimize: true,
      //   optimizeZoom: 0.9,
      // },
      {
        type: 'tooltip', // Tooltip
        formatText(model) {

          const text =
          `<div'>
          <ul id='menu'>
            <li>Name: ${model.name}</li>
            <li>Name ${model.id}</li>
            <li>Depth ${model.depth}</li>
            <li>Vulnerability ${model.vulnerability}</li>
          </ul>
        </div>`;
          // The content of tooltip
          // const text = `label: ${model.name}<br/>id: ${model.id}<br/>depth: ${model.depth} <br/>vulnerability: ${model.vulnerability}`
          // const text = 'model: ' + JSON.stringify(model);
          return text;
        },

      },
      {
        type: 'edge-tooltip', // Edge tooltip
        formatText(model) {
          // The content of the edge tooltip
          const text =
            'source: '
            + model.source
            + '<br/> target: '
            + model.target
            + '<br/> weight: '
            + model.weight;
          // + JSON.stringify(model.style);
          return text;
        },
      },

    ],
    // edit: [],
  },

  plugins: [legend],
});








const main = async () => {

  function threatTrace (node) {
    const nodesSet = new Set();
    nodesSet.add(node)
    nodesSet.forEach(node => {
      graph.setItemState(node, "vulnerable", true);
      const outEdges = node.getOutEdges();
      outEdges.forEach(edge => {
        graph.setItemState(edge, "vulnerable", true);
        nodesSet.add(edge.getTarget());
      });

    })
    // if (newNodesSet.length > 0) threatTrace(newNodesSet);
  };

  // fetch('https://gw.alipayobjects.com/os/basement_prod/da5a1b47-37d6-44d7-8d10-f3e046dabf82.json')
  // fetch('three_data_no_edges.json')
  fetch('angular-graph.json')
    // fetch('data_5k.json')
    .then((res) => res.json())
    .then((data) => {


      graph.data(data); // Load the remote data
      graph.render(); // Render the graph

      // // not working properly
      // graph.on('afterTracing', (ev) => {
      //   const {nodesSet} = ev;
        
      //   const outDiv = document.createElement('div');
      //   outDiv.style.float = 'top-right';
      //   outDiv.style.position = 'absolute';
      //   const lst = document.createElement('ul');
      //   nodesSet.forEach( node => {
      //     const lstItem = document.createElement('li');
      //     lstItem.innerText = node.getModel().name;
      //     lst.appendChild(lstItem);
      //   });

      //   outDiv.appendChild(lst);
      //   document.body.appendChild(outDiv);
        

      // });

      
      graph.on('afterlayout', (ev) => {
        graph.getNodes().forEach(node => {
          if (node.getModel().vulnerability > 0) {
            threatTrace(node);
          };
          graph.setItemState(node, "severity", node.getModel().vulnerability);

        });

      });

      graph.on('node:click', (e) => {
        const { item } = e;
        console.log( item );
      });

      // // Click an edge
      graph.on('edge:click', (e) => {
        const { item } = e;
        console.log( item );
      });
      console.log(graph);

    });

};
main();

//




