var Graph = require('node-dijkstra');

function getRoute() {
    var nodes = {
        'A': {
            'B': 1
        },
        'B': {
            'A': 1,
            'C': 2,
            'D': 4
        }
    };
    return new Graph(nodes);
}

window.start = function () {
    var route = getRoute();
    var ret = route.path('A', 'D', { cost: true });
    console.log(ret);
};