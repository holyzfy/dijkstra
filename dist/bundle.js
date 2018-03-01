(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Graph = require('node-dijkstra');
var lineGenerator = d3.line(); //.curve(d3.curveCardinal);

function getEdges() {
    return [{
        nodes: ['a', 'b'],
        weight: 7,
        path: 'M46,295 C101.333333,338.688765 156.666667,354.688765 212,343'
    }, {
        nodes: ['a', 'c'],
        weight: 9,
        path: 'M46,295 C68.9433864,290.676911 87.679233,282.949042 102.20754,271.816393 C124,255.11742 124,237.831622 124,198.629219 C124,172.494283 150,155.284544 202,147'
    }, {
        nodes: ['a', 'f'],
        weight: 14,
        path: 'M46,295 C51.8143739,282.523742 47.8426779,269.707229 34.0849122,256.550462 C27.3437654,250.103797 30.7847707,227.19604 50.2121352,204.310357 C70,181 37.5562615,174.020866 34.0849122,148.795944 C29.5391513,115.763698 62.282237,141.503165 70,125.663166 C76.6340743,112.047338 76.6340743,92.4929496 70,67'
    }, {
        nodes: ['c', 'd'],
        weight: 11,
        path: 'M202,147 L448,130'
    }, {
        nodes: ['c', 'f'],
        weight: 2,
        path: 'M70,67 C105.625972,59.9776975 136.743327,64.5297996 163.352063,80.6563065 C189.960799,96.7828133 202.843445,118.897378 202,147'
    }, {
        nodes: ['b', 'c'],
        weight: 10,
        path: 'M202,147 L212,343'
    }, {
        nodes: ['b', 'd'],
        weight: 15,
        path: 'M212,343 L448,130'
    }, {
        nodes: ['d', 'e'],
        weight: 6,
        path: 'M278,37 C288.478716,57.8489779 300.312049,76.8164355 313.5,93.902373 C333.281927,119.531279 363.918346,95.5225179 395.270914,100.416971 C416.172626,103.67994 433.748988,113.54095 448,130'
    }, {
        nodes: ['e', 'f'],
        weight: 9,
        path: 'M70,67 C69.4914644,46.6789495 87.2252597,33.9239921 123.201386,28.7351277 C152.35111,24.5308406 205.028998,9.56064591 254.692515,15.7867257 C262.44612,16.7587583 270.215281,23.8298498 278,37'
    }, {
        nodes: ['d', 'g'],
        weight: 3,
        path: 'M448,130 C460.53273,142.926195 471.613301,159.469437 481.241713,179.629725 C503.080571,225.356649 514,280.480074 514,345'
    }];
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
    edges.forEach(function (item) {
        item.id = 'edge-' + item.nodes.sort().join('-');
    });
    var context = d3.select(svg);
    var gEdge = context.append('g').selectAll('.edge').data(edges).enter().append('g');
    gEdge.append('path').attr('d', function (d) {
        return d.path;
    }).attr('id', function (d) {
        return d.id;
    }).classed('edge', true);
    gEdge.append('text').classed('weight', true).attr('dy', '-5').append('textPath').attr('xlink:href', function (d) {
        return '#' + d.id;
    }).attr('startOffset', '50%').text(function (d) {
        return d.weight;
    });

    var vertex = getVertex();
    var gVertex = context.append('g').selectAll('.vertex').data(d3.entries(vertex)).enter().append('g').classed('vertex', true).attr('transform', function (d) {
        return 'translate(' + d.value.x + ', ' + d.value.y + ')';
    });
    gVertex.selectAll('text').data(function (d) {
        return d.key;
    }).enter().append('text').classed('vertex', true).text(function (d) {
        return d;
    });
}

function drawRoute(svg, path) {
    var els = Array.from(svg.querySelectorAll('.edge-selected'));
    els.forEach(function (el) {
        return el.classList.remove('edge-selected');
    });
    if (!path) {
        return;
    }
    var idList = [];
    for (var i = 1; i < path.length; i++) {
        var _ref = [path[i - 1], path[i]],
            start = _ref[0],
            end = _ref[1];

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
            path: function path() {
                return this.start + this.end;
            }
        },
        watch: {
            path: function path() {
                var ret = route.path(this.start, this.end, { cost: true });
                this.cost = ret.cost;
                drawRoute(svg, ret.path);
            }
        },
        mounted: function mounted() {
            this.start = 'a';
            this.end = 'g';
        }
    });
};

},{"node-dijkstra":2}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = require('./PriorityQueue');
var removeDeepFromMap = require('./removeDeepFromMap');
var toDeepMap = require('./toDeepMap');
var validateDeep = require('./validateDeep');

/** Creates and manages a graph */

var Graph = function () {

  /**
   * Creates a new Graph, optionally initializing it a nodes graph representation.
   *
   * A graph representation is an object that has as keys the name of the point and as values
   * the points reacheable from that node, with the cost to get there:
   *
   *     {
   *       node (Number|String): {
   *         neighbor (Number|String): cost (Number),
   *         ...,
   *       },
   *     }
   *
   * In alternative to an object, you can pass a `Map` of `Map`. This will
   * allow you to specify numbers as keys.
   *
   * @param {Objec|Map} [graph] - Initial graph definition
   * @example
   *
   * const route = new Graph();
   *
   * // Pre-populated graph
   * const route = new Graph({
   *   A: { B: 1 },
   *   B: { A: 1, C: 2, D: 4 },
   * });
   *
   * // Passing a Map
   * const g = new Map()
   *
   * const a = new Map()
   * a.set('B', 1)
   *
   * const b = new Map()
   * b.set('A', 1)
   * b.set('C', 2)
   * b.set('D', 4)
   *
   * g.set('A', a)
   * g.set('B', b)
   *
   * const route = new Graph(g)
   */
  function Graph(graph) {
    _classCallCheck(this, Graph);

    if (graph instanceof Map) {
      validateDeep(graph);
      this.graph = graph;
    } else if (graph) {
      this.graph = toDeepMap(graph);
    } else {
      this.graph = new Map();
    }
  }

  /**
   * Adds a node to the graph
   *
   * @param {string} name      - Name of the node
   * @param {Object|Map} neighbors - Neighbouring nodes and cost to reach them
   * @return {this}
   * @example
   *
   * const route = new Graph();
   *
   * route.addNode('A', { B: 1 });
   *
   * // It's possible to chain the calls
   * route
   *   .addNode('B', { A: 1 })
   *   .addNode('C', { A: 3 });
   *
   * // The neighbors can be expressed in a Map
   * const d = new Map()
   * d.set('A', 2)
   * d.set('B', 8)
   *
   * route.addNode('D', d)
   */


  _createClass(Graph, [{
    key: 'addNode',
    value: function addNode(name, neighbors) {
      var nodes = void 0;
      if (neighbors instanceof Map) {
        validateDeep(neighbors);
        nodes = neighbors;
      } else {
        nodes = toDeepMap(neighbors);
      }

      this.graph.set(name, nodes);

      return this;
    }

    /**
     * @deprecated since version 2.0, use `Graph#addNode` instead
     */

  }, {
    key: 'addVertex',
    value: function addVertex(name, neighbors) {
      return this.addNode(name, neighbors);
    }

    /**
     * Removes a node and all of its references from the graph
     *
     * @param {string|number} key - Key of the node to remove from the graph
     * @return {this}
     * @example
     *
     * const route = new Graph({
     *   A: { B: 1, C: 5 },
     *   B: { A: 3 },
     *   C: { B: 2, A: 2 },
     * });
     *
     * route.removeNode('C');
     * // The graph now is:
     * // { A: { B: 1 }, B: { A: 3 } }
     */

  }, {
    key: 'removeNode',
    value: function removeNode(key) {
      this.graph = removeDeepFromMap(this.graph, key);

      return this;
    }

    /**
     * Compute the shortest path between the specified nodes
     *
     * @param {string}  start     - Starting node
     * @param {string}  goal      - Node we want to reach
     * @param {object}  [options] - Options
     *
     * @param {boolean} [options.trim]    - Exclude the origin and destination nodes from the result
     * @param {boolean} [options.reverse] - Return the path in reversed order
     * @param {boolean} [options.cost]    - Also return the cost of the path when set to true
     *
     * @return {array|object} Computed path between the nodes.
     *
     *  When `option.cost` is set to true, the returned value will be an object with shape:
     *    - `path` *(Array)*: Computed path between the nodes
     *    - `cost` *(Number)*: Cost of the path
     *
     * @example
     *
     * const route = new Graph()
     *
     * route.addNode('A', { B: 1 })
     * route.addNode('B', { A: 1, C: 2, D: 4 })
     * route.addNode('C', { B: 2, D: 1 })
     * route.addNode('D', { C: 1, B: 4 })
     *
     * route.path('A', 'D') // => ['A', 'B', 'C', 'D']
     *
     * // trimmed
     * route.path('A', 'D', { trim: true }) // => [B', 'C']
     *
     * // reversed
     * route.path('A', 'D', { reverse: true }) // => ['D', 'C', 'B', 'A']
     *
     * // include the cost
     * route.path('A', 'D', { cost: true })
     * // => {
     * //       path: [ 'A', 'B', 'C', 'D' ],
     * //       cost: 4
     * //    }
     */

  }, {
    key: 'path',
    value: function path(start, goal) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // Don't run when we don't have nodes set
      if (!this.graph.size) {
        if (options.cost) return { path: null, cost: 0 };

        return null;
      }

      var explored = new Set();
      var frontier = new Queue();
      var previous = new Map();

      var path = [];
      var totalCost = 0;

      var avoid = [];
      if (options.avoid) avoid = [].concat(options.avoid);

      if (avoid.includes(start)) {
        throw new Error('Starting node (' + start + ') cannot be avoided');
      } else if (avoid.includes(goal)) {
        throw new Error('Ending node (' + goal + ') cannot be avoided');
      }

      // Add the starting point to the frontier, it will be the first node visited
      frontier.set(start, 0);

      // Run until we have visited every node in the frontier

      var _loop = function _loop() {
        // Get the node in the frontier with the lowest cost (`priority`)
        var node = frontier.next();

        // When the node with the lowest cost in the frontier in our goal node,
        // we can compute the path and exit the loop
        if (node.key === goal) {
          // Set the total cost to the current value
          totalCost = node.priority;

          var nodeKey = node.key;
          while (previous.has(nodeKey)) {
            path.push(nodeKey);
            nodeKey = previous.get(nodeKey);
          }

          return 'break';
        }

        // Add the current node to the explored set
        explored.add(node.key);

        // Loop all the neighboring nodes
        var neighbors = _this.graph.get(node.key) || new Map();
        neighbors.forEach(function (nCost, nNode) {
          // If we already explored the node, or the node is to be avoided, skip it
          if (explored.has(nNode) || avoid.includes(nNode)) return null;

          // If the neighboring node is not yet in the frontier, we add it with
          // the correct cost
          if (!frontier.has(nNode)) {
            previous.set(nNode, node.key);
            return frontier.set(nNode, node.priority + nCost);
          }

          var frontierPriority = frontier.get(nNode).priority;
          var nodeCost = node.priority + nCost;

          // Otherwise we only update the cost of this node in the frontier when
          // it's below what's currently set
          if (nodeCost < frontierPriority) {
            previous.set(nNode, node.key);
            return frontier.set(nNode, nodeCost);
          }

          return null;
        });
      };

      while (!frontier.isEmpty()) {
        var _ret = _loop();

        if (_ret === 'break') break;
      }

      // Return null when no path can be found
      if (!path.length) {
        if (options.cost) return { path: null, cost: 0 };

        return null;
      }

      // From now on, keep in mind that `path` is populated in reverse order,
      // from destination to origin

      // Remove the first value (the goal node) if we want a trimmed result
      if (options.trim) {
        path.shift();
      } else {
        // Add the origin waypoint at the end of the array
        path = path.concat([start]);
      }

      // Reverse the path if we don't want it reversed, so the result will be
      // from `start` to `goal`
      if (!options.reverse) {
        path = path.reverse();
      }

      // Return an object if we also want the cost
      if (options.cost) {
        return {
          path: path,
          cost: totalCost
        };
      }

      return path;
    }

    /**
     * @deprecated since version 2.0, use `Graph#path` instead
     */

  }, {
    key: 'shortestPath',
    value: function shortestPath() {
      return this.path.apply(this, arguments);
    }
  }]);

  return Graph;
}();

module.exports = Graph;

},{"./PriorityQueue":3,"./removeDeepFromMap":4,"./toDeepMap":5,"./validateDeep":6}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This very basic implementation of a priority queue is used to select the
 * next node of the graph to walk to.
 *
 * The queue is always sorted to have the least expensive node on top.
 * Some helper methods are also implemented.
 *
 * You should **never** modify the queue directly, but only using the methods
 * provided by the class.
 */
var PriorityQueue = function () {

  /**
   * Creates a new empty priority queue
   */
  function PriorityQueue() {
    _classCallCheck(this, PriorityQueue);

    // The `keys` set is used to greatly improve the speed at which we can
    // check the presence of a value in the queue
    this.keys = new Set();
    this.queue = [];
  }

  /**
   * Sort the queue to have the least expensive node to visit on top
   *
   * @private
   */


  _createClass(PriorityQueue, [{
    key: 'sort',
    value: function sort() {
      this.queue.sort(function (a, b) {
        return a.priority - b.priority;
      });
    }

    /**
     * Sets a priority for a key in the queue.
     * Inserts it in the queue if it does not already exists.
     *
     * @param {any}     key       Key to update or insert
     * @param {number}  value     Priority of the key
     * @return {number} Size of the queue
     */

  }, {
    key: 'set',
    value: function set(key, value) {
      var priority = Number(value);
      if (isNaN(priority)) throw new TypeError('"priority" must be a number');

      if (!this.keys.has(key)) {
        // Insert a new entry if the key is not already in the queue
        this.keys.add(key);
        this.queue.push({ key: key, priority: priority });
      } else {
        // Update the priority of an existing key
        this.queue.map(function (element) {
          if (element.key === key) {
            Object.assign(element, { priority: priority });
          }

          return element;
        });
      }

      this.sort();
      return this.queue.length;
    }

    /**
     * The next method is used to dequeue a key:
     * It removes the first element from the queue and returns it
     *
     * @return {object} First priority queue entry
     */

  }, {
    key: 'next',
    value: function next() {
      var element = this.queue.shift();

      // Remove the key from the `_keys` set
      this.keys.delete(element.key);

      return element;
    }

    /**
     * @return {boolean} `true` when the queue is empty
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return Boolean(this.queue.length === 0);
    }

    /**
     * Check if the queue has a key in it
     *
     * @param {any} key   Key to lookup
     * @return {boolean}
     */

  }, {
    key: 'has',
    value: function has(key) {
      return this.keys.has(key);
    }

    /**
     * Get the element in the queue with the specified key
     *
     * @param {any} key   Key to lookup
     * @return {object}
     */

  }, {
    key: 'get',
    value: function get(key) {
      return this.queue.find(function (element) {
        return element.key === key;
      });
    }
  }]);

  return PriorityQueue;
}();

module.exports = PriorityQueue;

},{}],4:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Removes a key and all of its references from a map.
 * This function has no side-effects as it returns
 * a brand new map.
 *
 * @param {Map}     map - Map to remove the key from
 * @param {string}  key - Key to remove from the map
 * @return {Map}    New map without the passed key
 */
function removeDeepFromMap(map, key) {
  var newMap = new Map();

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = _slicedToArray(_ref, 2);

      var aKey = _ref2[0];
      var val = _ref2[1];

      if (aKey !== key && val instanceof Map) {
        newMap.set(aKey, removeDeepFromMap(val, key));
      } else if (aKey !== key) {
        newMap.set(aKey, val);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return newMap;
}

module.exports = removeDeepFromMap;

},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Validates a cost for a node
 *
 * @private
 * @param {number} val - Cost to validate
 * @return {bool}
 */
function isValidNode(val) {
  var cost = Number(val);

  if (isNaN(cost) || cost <= 0) {
    return false;
  }

  return true;
}

/**
 * Creates a deep `Map` from the passed object.
 *
 * @param  {Object} source - Object to populate the map with
 * @return {Map} New map with the passed object data
 */
function toDeepMap(source) {
  var map = new Map();
  var keys = Object.keys(source);

  keys.forEach(function (key) {
    var val = source[key];

    if (val !== null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && !Array.isArray(val)) {
      return map.set(key, toDeepMap(val));
    }

    if (!isValidNode(val)) {
      throw new Error('Could not add node at key "' + key + '", make sure it\'s a valid node', val);
    }

    return map.set(key, Number(val));
  });

  return map;
}

module.exports = toDeepMap;

},{}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Validate a map to ensure all it's values are either a number or a map
 *
 * @param {Map} map - Map to valiadte
 */
function validateDeep(map) {
  if (!(map instanceof Map)) {
    throw new Error('Invalid graph: Expected Map instead found ' + (typeof map === 'undefined' ? 'undefined' : _typeof(map)));
  }

  map.forEach(function (value, key) {
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value instanceof Map) {
      validateDeep(value);
      return;
    }

    if (typeof value !== 'number' || value <= 0) {
      throw new Error('Values must be numbers greater than 0. Found value ' + value + ' at ' + key);
    }
  });
}

module.exports = validateDeep;

},{}]},{},[1]);
