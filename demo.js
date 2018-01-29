var Graph = require('node-dijkstra');

function getRoute() {
    var vertex = {
        a: {
            x: 46,
            y: 295
        },
        b: {
            x: 212,
            y: 343
        },
        c: {
            x: 202,
            y: 147
        },
        d: {
            x: 448,
            y: 130
        },
        e: {
            x: 278,
            y: 37
        },
        f: {
            x: 70,
            y: 67
        }
    };
    var edges = [
        ['a', 'b', 7],
        ['a', 'c', 9],
        ['a', 'f', 14],
        ['c', 'd', 11],
        ['c', 'f', 2],
        ['b', 'c', 10],
        ['b', 'd', 15],
        ['d', 'e', 6],
        ['e', 'f', 9]
    ];
    var reverseEdges = edges.map(function (item) {
        return [item[1], item[0], item[2]];
    });
    edges = edges.concat(reverseEdges).sort();
    var nodes = {};
    edges.forEach(function (item) {
        var key = item[0];
        nodes[key] = nodes[key] || {};
        nodes[key][item[1]] = item[2];
    });
    return new Graph(nodes);
}

window.start = function () {
    var route = getRoute();
    var ret = route.path('d', 'a', { cost: true });
    console.log(ret);
};