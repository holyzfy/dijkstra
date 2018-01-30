var Graph = require('node-dijkstra');
var lineGenerator = d3.line(); //.curve(d3.curveCardinal);

function getEdges() {
    return [
        ['a', 'b', 7],
        ['a', 'c', 9],
        ['a', 'f', 14],
        ['c', 'd', 11],
        ['c', 'f', 2],
        ['b', 'c', 10],
        ['b', 'd', 15],
        ['d', 'e', 6],
        ['e', 'f', 9],
        ['d', 'g', 3]
    ];
}

function getVertex() {
    return {
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
        },
        g: {
            x: 514,
            y: 345
        }
    };
}

function draw(edges, vertex, elem) {
    edges.forEach(item => {
        var start = item[0];
        var end = item[1];
        item[3] = vertex[start];
        item[4] = vertex[end];
        return item;
    });
    var svg = d3.select('#graph');
    var gEdge = svg.append('g').selectAll('.edge')
        .data(edges)
        .enter();
        gEdge.append('path')
            .classed('edge', true)
            .attr('d', d => {
                return lineGenerator([
                    [d[3].x, d[3].y],
                    [d[4].x, d[4].y]
                ]);
            });
        gEdge.append('text')
            .classed('cost', true)
            .text(d => d[2])
            .attr('x', d => {
                return (d[3].x + d[4].x) / 2;
            })
            .attr('y', d => {
                return (d[3].y + d[4].y) / 2;
            });

    svg.append('g').classed('route', true);

    var gVertex = svg.append('g').selectAll('.vertex')
        .data(d3.entries(vertex))
        .enter().append('g')
            .classed('vertex', true)
            .attr('transform', d => `translate(${d.value.x}, ${d.value.y})`);

    gVertex.selectAll('text')
        .data(d => d.key)
        .enter().append('text')
            .text(d => d);
    return svg;
}

function getRoute() {
    var edges = getEdges();
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

function drawRoute(svg, path, vertex) {
    var gRoute = svg.select('.route');
    if(!path) {
        return gRoute.html('');
    }
    var points = path.map(item => [vertex[item].x, vertex[item].y]);
    var pathData = lineGenerator(points);
    gRoute.html('').append('path').attr('d', pathData);
}

window.start = function () {
    var svg = draw(getEdges(), getVertex(), '#graph');
    var route = getRoute();

    new Vue({
        el: '#demo',
        data: {
            start: '',
            end: '',
            cost: 0
        },
        computed: {
            path: function () {
                return this.start + this.end;
            }
        },
        watch: {
            path: function () {
                var ret = route.path(this.start, this.end, { cost: true });
                this.cost = ret.cost;
                drawRoute(svg, ret.path, getVertex());
            }
        },
        mounted: function () {
            this.start = 'a';
            this.end = 'e';
        }
    })
};