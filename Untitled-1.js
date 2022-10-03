
execute = function () {
    var self = this;
    var center = self.center;
    var biSep = self.biSep;
    var nodeSep = self.nodeSep;
    var nodeSize = self.nodeSize;
    var part1Pos = 0,
        part2Pos = 0;
    // Layout the graph in horizontally
    if (self.direction === 'horizontal') {
        part1Pos = center[0] - biSep / 2;
        part2Pos = center[0] + biSep / 2;
    }
    var nodes = self.nodes;
    var edges = self.edges;
    var part1Nodes = [];
    var part2Nodes = [];
    var part1NodeMap = new Map();
    var part2NodeMap = new Map();
    // Separate the nodes and init the positions
    nodes.forEach(function (node, i) {
        if (node.cluster === 'part1') {
            part1Nodes.push(node);
            part1NodeMap.set(node.id, i);
        } else {
            part2Nodes.push(node);
            part2NodeMap.set(node.id, i);
        }
    });

    // Sort the nodes in part1
    part1Nodes.forEach(function (p1n) {
        var index = 0;
        var adjCount = 0;
        edges.forEach(function (edge) {
            var sourceId = edge.source;
            var targetId = edge.target;
            if (sourceId === p1n.id) {
                index += part2NodeMap.get(targetId);
                adjCount++;
            } else if (targetId === p1n.id) {
                index += part2NodeMap.get(sourceId);
                adjCount++;
            }
        });
        index /= adjCount;
        p1n.index = index;
    });
    part1Nodes.sort(function (a, b) {
        return a.index - b.index;
    });

    // Sort the nodes in part2
    part2Nodes.forEach(function (p2n) {
        var index = 0;
        var adjCount = 0;
        edges.forEach(function (edge) {
            var sourceId = edge.source;
            var targetId = edge.target;
            if (sourceId === p2n.id) {
                index += part1NodeMap.get(targetId);
                adjCount++;
            } else if (targetId === p2n.id) {
                index += part1NodeMap.get(sourceId);
                adjCount++;
            }
        });
        index /= adjCount;
        p2n.index = index;
    });
    part2Nodes.sort(function (a, b) {
        return a.index - b.index;
    });

    // Place the ndoes
    var hLength = part1Nodes.length > part2Nodes.length ? part1Nodes.length : part2Nodes.length;
    var height = hLength * (nodeSep + nodeSize);
    var begin = center[1] - height / 2;
    if (self.direction === 'vertical') {
        begin = center[0] - height / 2;
    }
    part1Nodes.forEach(function (p1n, i) {
        if (self.direction === 'horizontal') {
            p1n.x = part1Pos;
            p1n.y = begin + i * (nodeSep + nodeSize);
        } else {
            p1n.x = begin + i * (nodeSep + nodeSize);
            p1n.y = part1Pos;
        }
    });
    part2Nodes.forEach(function (p2n, i) {
        if (self.direction === 'horizontal') {
            p2n.x = part2Pos;
            p2n.y = begin + i * (nodeSep + nodeSize);
        } else {
            p2n.x = begin + i * (nodeSep + nodeSize);
            p2n.y = part2Pos;
        }
    });
}



vulnerability.severety * node.depth




//   GraphOptions.autoPaint
//   Boolean optional default: true
//   Whether to paint the graph automatically while item updated or view port changed. In order to enhance the performance, we recommend to turn off antoPaint when you are doing bulk operation on nodes or edges. This can be refered to setAutoPaint().

