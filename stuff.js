rootNode = ''

graph.getNodes().forEach




graph.getNodes()[0].getNeighbors('target');
graph.getNodes()[0].set("test", "123")
graph.getNodes()[0].get("test")

graph.getNodes().forEach(item => item.set("test2", "0"))



graph.getNodes()[rootNode].getNeighbors('target');


layout: {
    type: 'radial',
    center: [200, 200], // The center of the graph by default
    linkDistance: 50, // The edge length
    maxIteration: 1000,
    focusNode: '0',
    unitRadius: 100,
    nodeSpacing: 50,
    preventOverlap: true,
  },