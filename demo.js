var Graph = require('node-dijkstra');
var lineGenerator = d3.line(); //.curve(d3.curveCardinal);

function getEdges() {
    return [
        {
            nodes: ['a', 'b'],
            weight: 7,
            path: 'M46,295 C101.333333,338.688765 156.666667,354.688765 212,343'
        },
        {
            nodes: ['a', 'c'],
            weight: 9,
            path: 'M46,295 C68.9433864,290.676911 87.679233,282.949042 102.20754,271.816393 C124,255.11742 124,237.831622 124,198.629219 C124,172.494283 150,155.284544 202,147'
        },
        {
            nodes: ['a', 'f'],
            weight: 14,
            path: 'M46,295 C51.8143739,282.523742 47.8426779,269.707229 34.0849122,256.550462 C27.3437654,250.103797 30.7847707,227.19604 50.2121352,204.310357 C70,181 37.5562615,174.020866 34.0849122,148.795944 C29.5391513,115.763698 62.282237,141.503165 70,125.663166 C76.6340743,112.047338 76.6340743,92.4929496 70,67'
        },
        {
            nodes: ['c', 'd'],
            weight: 11,
            path: 'M202,147 L448,130'
        },
        {
            nodes: ['c', 'f'],
            weight: 2,
            path: 'M70,67 C105.625972,59.9776975 136.743327,64.5297996 163.352063,80.6563065 C189.960799,96.7828133 202.843445,118.897378 202,147'
        },
        {
            nodes: ['b', 'c'],
            weight: 10,
            path: 'M202,147 L212,343'
        },
        {
            nodes: ['b', 'd'],
            weight: 15,
            path: 'M212,343 L448,130'
        },
        {
            nodes: ['d', 'e'],
            weight: 6,
            path: 'M278,37 C288.478716,57.8489779 300.312049,76.8164355 313.5,93.902373 C333.281927,119.531279 363.918346,95.5225179 395.270914,100.416971 C416.172626,103.67994 433.748988,113.54095 448,130'
        },
        {
            nodes: ['e', 'f'],
            weight: 9,
            path: 'M70,67 C69.4914644,46.6789495 87.2252597,33.9239921 123.201386,28.7351277 C152.35111,24.5308406 205.028998,9.56064591 254.692515,15.7867257 C262.44612,16.7587583 270.215281,23.8298498 278,37'
        },
        {
            nodes: ['d', 'g'],
            weight: 3,
            path: 'M448,130 C460.53273,142.926195 471.613301,159.469437 481.241713,179.629725 C503.080571,225.356649 514,280.480074 514,345'
        }
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

function getRoute() {
    var edges = getEdges();
    var nodes = {};
    edges.forEach(function (item) {
        var start = item.nodes[0];
        var end = item.nodes[1];
        nodes[start] = nodes[start] || {};
        nodes[start][end] = item.weight;
        nodes[end] = nodes[end] || {};
        nodes[end][start] = item.weight;
    });
    return new Graph(nodes);
}

function initMap(svg) {
    var edges = getEdges();
    edges.forEach((item) => {
        item.id = 'edge-' + item.nodes.sort().join('-');
    });
    var context = d3.select(svg);
    var gEdge = context.append('g').selectAll('.edge').data(edges).enter().append('g');
    gEdge.append('path')
        .attr('d', d => d.path)
        .attr('id', d => d.id)
        .classed('edge', true);
    gEdge.append('text')
        .classed('weight', true)
        .attr('dy', '-5')
        .append('textPath')
        .attr('xlink:href', d=> `#${d.id}`)
        .attr('startOffset', '50%')
        .text(d => d.weight);

    var vertex = getVertex();
    var gVertex = context.append('g').selectAll('.vertex')
    .data(d3.entries(vertex))
    .enter().append('g')
        .classed('vertex', true)
        .attr('transform', d => `translate(${d.value.x}, ${d.value.y})`);
    gVertex.selectAll('text')
        .data(d => d.key)
        .enter().append('text')
            .classed('vertex', true)
            .text(d => d);
}

function drawRoute(svg, path) {
    var els = Array.from(svg.querySelectorAll('.edge-selected'));
    els.forEach(el => el.classList.remove('edge-selected'));
    var idList = [];
    for(var i = 1; i < path.length; i++) {
        var [start, end] = [path[i - 1], path[i]];
        var pair = [start, end].sort();
        var id = 'edge-' + pair.join('-');
        svg.querySelector('#' + id).classList.add('edge-selected');
    }
}

window.start = function () {
    var svg = document.querySelector('#graph');
    initMap(svg);
    var route = getRoute(svg);

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
                drawRoute(svg, ret.path);
            }
        },
        mounted: function () {
            this.start = 'a';
            this.end = 'g';
        }
    })
};