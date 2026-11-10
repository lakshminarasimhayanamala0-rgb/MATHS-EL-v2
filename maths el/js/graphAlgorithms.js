// ExamSlot - Graph Coloring Algorithms & Metrics
// Implements:
// 1. Greedy Graph Coloring
// 2. Welsh-Powell Algorithm (Degree-ordered greedy heuristic)
// 3. Backtracking Graph Coloring (Exact Chromatic Number with Symmetry Breaking)
// 4. Graph Theory Metrics (Density, Connected Components, Max Clique, Bounds)

/**
 * Executes the Greedy Graph Coloring algorithm
 * Iterates through vertices in their natural order and assigns the lowest available color.
 * Time Complexity: O(V^2 + E)
 * Note: Greedy is a heuristic; result depends on vertex ordering.
 * 
 * @param {Object} graph - Conflict graph from buildConflictGraph
 * @returns {Object} Algorithm results including colors, time, and step trace
 */
export function runGreedyColoring(graph) {
  const t0 = performance.now();
  const vertices = [...graph.subjectCodes];
  const coloring = {};
  const steps = [];

  // Initialize all vertices as uncolored (-1)
  vertices.forEach((v) => {
    coloring[v] = null;
  });

  // Assign colors
  vertices.forEach((vertex, index) => {
    // Collect colors of adjacent vertices that have already been colored
    const neighborColors = new Set();
    const neighbors = graph.adjList[vertex] || [];

    neighbors.forEach((item) => {
      const neighborCode = item.neighbor;
      if (coloring[neighborCode] !== null && coloring[neighborCode] !== undefined) {
        neighborColors.add(coloring[neighborCode]);
      }
    });

    // Find the lowest positive integer color not used by neighbors (1-indexed)
    let assignedColor = 1;
    while (neighborColors.has(assignedColor)) {
      assignedColor++;
    }

    coloring[vertex] = assignedColor;

    steps.push({
      step: index + 1,
      vertex,
      degree: graph.degrees[vertex] || 0,
      neighborColors: Array.from(neighborColors),
      assignedColor,
      explanation: `Vertex ${vertex} evaluated. Adjacent colors already used: [${Array.from(neighborColors).join(', ') || 'None'}]. Smallest available color is Slot ${assignedColor}.`
    });
  });

  const t1 = performance.now();
  const totalColors = Math.max(...Object.values(coloring), 0);

  return {
    algorithm: 'Greedy Graph Coloring',
    isExact: false,
    executionTimeMs: Number((t1 - t0).toFixed(3)),
    coloring,
    totalColors,
    steps,
    orderedVertices: vertices
  };
}

/**
 * Executes the Welsh-Powell Graph Coloring algorithm
 * 1. Sort vertices in descending order of degree d(v).
 * 2. Assign Color 1 to the first uncolored vertex and to all subsequent uncolored
 *    vertices that are non-adjacent to any vertex colored with Color 1.
 * 3. Repeat with Color 2, 3, ... until all vertices are colored.
 * Time Complexity: O(V log V + V^2)
 * 
 * @param {Object} graph - Conflict graph from buildConflictGraph
 * @returns {Object} Algorithm results including colors, time, and step trace
 */
export function runWelshPowell(graph) {
  const t0 = performance.now();
  const vertices = [...graph.subjectCodes];

  // Sort vertices by descending degree; tie-break alphabetically
  vertices.sort((a, b) => {
    const degDiff = (graph.degrees[b] || 0) - (graph.degrees[a] || 0);
    if (degDiff !== 0) return degDiff;
    return a.localeCompare(b);
  });

  const coloring = {};
  vertices.forEach((v) => {
    coloring[v] = null;
  });

  let currentColor = 1;
  let coloredCount = 0;
  const n = vertices.length;
  const passes = [];
  const steps = [];
  let stepIndex = 1;

  while (coloredCount < n) {
    const verticesInCurrentPass = [];

    for (let i = 0; i < n; i++) {
      const v = vertices[i];
      if (coloring[v] === null) {
        // Check if v is adjacent to any vertex already colored with currentColor in this pass
        const neighbors = (graph.adjList[v] || []).map((item) => item.neighbor);
        const hasConflictWithCurrentColor = verticesInCurrentPass.some((coloredNode) =>
          neighbors.includes(coloredNode)
        );

        if (!hasConflictWithCurrentColor) {
          coloring[v] = currentColor;
          verticesInCurrentPass.push(v);
          coloredCount++;

          steps.push({
            step: stepIndex++,
            vertex: v,
            degree: graph.degrees[v] || 0,
            assignedColor: currentColor,
            passNumber: currentColor,
            explanation: `Slot ${currentColor}: Assigned to ${v} (Degree: ${graph.degrees[v]}). No conflict with already assigned nodes in this slot [${verticesInCurrentPass.slice(0, -1).join(', ') || 'first'}].`
          });
        }
      }
    }

    passes.push({
      color: currentColor,
      vertices: verticesInCurrentPass
    });

    currentColor++;
  }

  const t1 = performance.now();
  const totalColors = currentColor - 1;

  return {
    algorithm: 'Welsh-Powell Algorithm',
    isExact: false,
    executionTimeMs: Number((t1 - t0).toFixed(3)),
    coloring,
    totalColors,
    passes,
    steps,
    orderedVertices: vertices
  };
}

/**
 * Finds the exact chromatic number χ(G) using Recursive Backtracking with Branch & Bound
 * and Symmetry Breaking.
 * Tests k = 1, 2, ... until a valid k-coloring is found.
 * For small to medium university subject graphs (|V| <= 30), this finishes in milliseconds
 * and provides the mathematically guaranteed minimum chromatic number.
 * 
 * @param {Object} graph - Conflict graph from buildConflictGraph
 * @param {number} maxTimeMs - Safety timeout in ms to prevent hanging on massive graphs
 * @returns {Object} Algorithm results
 */
export function runBacktrackingColoring(graph, maxTimeMs = 3000) {
  const t0 = performance.now();
  const vertices = [...graph.subjectCodes];
  const n = vertices.length;

  if (n === 0) {
    return {
      algorithm: 'Backtracking (Exact Minimum Coloring)',
      isExact: true,
      executionTimeMs: 0,
      coloring: {},
      totalColors: 0,
      steps: [],
      orderedVertices: []
    };
  }

  // Degree heuristic: order vertices by descending degree for faster pruning
  vertices.sort((a, b) => (graph.degrees[b] || 0) - (graph.degrees[a] || 0));

  // Build fast adjacency lookup
  const adjSet = {};
  vertices.forEach((v) => {
    adjSet[v] = new Set((graph.adjList[v] || []).map((item) => item.neighbor));
  });

  // Calculate lower bound: Maximum Clique size ω(G)
  const maxClique = findMaximumClique(graph);
  const lowerBound = Math.max(1, maxClique.length);

  // Upper bound from Welsh-Powell
  const wpResult = runWelshPowell(graph);
  const upperBound = wpResult.totalColors;

  let optimalColoring = null;
  let exactChromaticNumber = upperBound;
  let timeoutOccurred = false;

  // Decision procedure: Can graph be colored with k colors?
  function solveKColoring(k) {
    const color = Array(n).fill(0);
    let stateVisits = 0;

    function isSafe(vIdx, c) {
      const v = vertices[vIdx];
      for (let i = 0; i < vIdx; i++) {
        if (color[i] === c && adjSet[v].has(vertices[i])) {
          return false;
        }
      }
      return true;
    }

    function backtrack(vIdx, maxColorUsed) {
      stateVisits++;
      if (performance.now() - t0 > maxTimeMs) {
        timeoutOccurred = true;
        return false;
      }

      if (vIdx === n) {
        return true;
      }

      // Symmetry breaking: do not test colors beyond (maxColorUsed + 1)
      const allowedColors = Math.min(k, maxColorUsed + 1);

      for (let c = 1; c <= allowedColors; c++) {
        if (isSafe(vIdx, c)) {
          color[vIdx] = c;
          if (backtrack(vIdx + 1, Math.max(maxColorUsed, c))) {
            return true;
          }
          color[vIdx] = 0; // undo
        }
      }

      return false;
    }

    const success = backtrack(0, 0);
    if (success) {
      const res = {};
      vertices.forEach((v, idx) => {
        res[v] = color[idx];
      });
      return res;
    }
    return null;
  }

  // Iterate from lowerBound to upperBound
  for (let k = lowerBound; k <= upperBound; k++) {
    const solution = solveKColoring(k);
    if (solution) {
      exactChromaticNumber = k;
      optimalColoring = solution;
      break;
    }
    if (timeoutOccurred) break;
  }

  // Fallback to Welsh-Powell if timeout
  if (!optimalColoring) {
    optimalColoring = wpResult.coloring;
    exactChromaticNumber = wpResult.totalColors;
  }

  const t1 = performance.now();

  const steps = vertices.map((v, i) => ({
    step: i + 1,
    vertex: v,
    degree: graph.degrees[v] || 0,
    assignedColor: optimalColoring[v],
    explanation: `Vertex ${v} assigned optimal Slot ${optimalColoring[v]}.`
  }));

  return {
    algorithm: 'Backtracking (Exact Minimum Coloring)',
    isExact: !timeoutOccurred,
    timedOut: timeoutOccurred,
    executionTimeMs: Number((t1 - t0).toFixed(3)),
    coloring: optimalColoring,
    totalColors: exactChromaticNumber,
    chromaticNumber: exactChromaticNumber,
    lowerBoundClique: lowerBound,
    upperBoundWP: upperBound,
    steps,
    orderedVertices: vertices
  };
}

/**
 * Finds the Maximum Clique in the graph using the Bron-Kerbosch algorithm with pivoting
 * @param {Object} graph - Conflict graph
 * @returns {Array} Array of vertex codes forming the largest clique
 */
export function findMaximumClique(graph) {
  const vertices = [...graph.subjectCodes];
  const adjSet = {};
  vertices.forEach((v) => {
    adjSet[v] = new Set((graph.adjList[v] || []).map((item) => item.neighbor));
  });

  let maxClique = [];

  function bronKerbosch(R, P, X) {
    if (P.size === 0 && X.size === 0) {
      if (R.size > maxClique.length) {
        maxClique = Array.from(R);
      }
      return;
    }

    // Pivot selection (vertex with maximum degree in P ∪ X)
    const unionPX = new Set([...P, ...X]);
    let pivot = null;
    let maxDegree = -1;
    unionPX.forEach((u) => {
      let degreeInP = 0;
      P.forEach((v) => {
        if (adjSet[u] && adjSet[u].has(v)) degreeInP++;
      });
      if (degreeInP > maxDegree) {
        maxDegree = degreeInP;
        pivot = u;
      }
    });

    const candidates = new Set();
    P.forEach((v) => {
      if (!pivot || !adjSet[pivot] || !adjSet[pivot].has(v)) {
        candidates.add(v);
      }
    });

    candidates.forEach((v) => {
      const neighbors = adjSet[v] || new Set();
      const newR = new Set(R).add(v);
      const newP = new Set([...P].filter((node) => neighbors.has(node)));
      const newX = new Set([...X].filter((node) => neighbors.has(node)));

      bronKerbosch(newR, newP, newX);

      P.delete(v);
      X.add(v);
    });
  }

  bronKerbosch(new Set(), new Set(vertices), new Set());
  return maxClique;
}

/**
 * Calculates theoretical graph metrics:
 * Density, Connected Components, Max/Min/Avg Degree, Brooks' bound
 * @param {Object} graph - Conflict graph
 * @returns {Object} Metric summary
 */
export function calculateGraphMetrics(graph) {
  const vCount = graph.totalVertices;
  const eCount = graph.totalEdges;

  // Graph Density D = 2|E| / (|V|(|V|-1))
  const density = vCount > 1 ? (2 * eCount) / (vCount * (vCount - 1)) : 0;

  // Degrees
  const degrees = Object.values(graph.degrees);
  const maxDegree = degrees.length ? Math.max(...degrees) : 0;
  const minDegree = degrees.length ? Math.min(...degrees) : 0;
  const avgDegree = degrees.length ? degrees.reduce((a, b) => a + b, 0) / degrees.length : 0;

  // Connected Components using BFS
  const visited = new Set();
  const components = [];

  graph.subjectCodes.forEach((startNode) => {
    if (!visited.has(startNode)) {
      const comp = [];
      const queue = [startNode];
      visited.add(startNode);

      while (queue.length > 0) {
        const curr = queue.shift();
        comp.push(curr);

        const neighbors = (graph.adjList[curr] || []).map((item) => item.neighbor);
        neighbors.forEach((nbr) => {
          if (!visited.has(nbr)) {
            visited.add(nbr);
            queue.push(nbr);
          }
        });
      }
      components.push(comp);
    }
  });

  // Maximum Clique (Lower bound for chromatic number)
  const maxClique = findMaximumClique(graph);

  // Brooks' Bound: For connected, neither complete nor odd cycle, χ(G) <= Δ(G)
  const isCompleteGraph = eCount === (vCount * (vCount - 1)) / 2 && vCount > 0;
  const brooksUpperBound = isCompleteGraph ? maxDegree + 1 : maxDegree;

  return {
    vertexCount: vCount,
    edgeCount: eCount,
    density: Number(density.toFixed(4)),
    densityPercent: Number((density * 100).toFixed(1)),
    maxDegree,
    minDegree,
    avgDegree: Number(avgDegree.toFixed(2)),
    connectedComponentsCount: components.length,
    components,
    maxClique,
    cliqueSizeLowerBound: maxClique.length,
    brooksUpperBound: Math.max(1, brooksUpperBound)
  };
}

