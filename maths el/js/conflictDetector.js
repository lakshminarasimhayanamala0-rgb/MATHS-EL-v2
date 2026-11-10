// ExamSlot - Conflict Graph Detector
// Identifies conflicts between subjects based on student registrations,
// builds the conflict adjacency matrix, edge weights, and conflict lists.

/**
 * Builds the complete conflict graph and adjacency structures
 * @param {Array} subjects - Array of subject objects [{code, name, ...}]
 * @param {Array} students - Array of student objects [{id, name, subjects: [...]}]
 * @returns {Object} Graph representation, adjacency matrix, edges, and statistics
 */
export function buildConflictGraph(subjects, students) {
  const subjectMap = new Map();
  subjects.forEach((s) => {
    subjectMap.set(s.code, s);
  });

  const subjectCodes = subjects.map((s) => s.code);
  const n = subjectCodes.length;

  // Map to store edge weights and common students: key = "CODE_A___CODE_B"
  const edgeMap = new Map();

  // Track student count per subject
  const enrollmentMap = new Map();
  subjectCodes.forEach((code) => enrollmentMap.set(code, 0));

  students.forEach((student) => {
    const registered = (student.subjects || []).filter((code) => subjectMap.has(code));
    
    // Count enrollments
    registered.forEach((code) => {
      enrollmentMap.set(code, (enrollmentMap.get(code) || 0) + 1);
    });

    // Check all combinations (pairs)
    for (let i = 0; i < registered.length; i++) {
      for (let j = i + 1; j < registered.length; j++) {
        const u = registered[i];
        const v = registered[j];
        const key = u < v ? `${u}___${v}` : `${v}___${u}`;

        if (!edgeMap.has(key)) {
          edgeMap.set(key, {
            u: u < v ? u : v,
            v: u < v ? v : u,
            weight: 0,
            commonStudents: []
          });
        }
        const edge = edgeMap.get(key);
        edge.weight += 1;
        edge.commonStudents.push({
          id: student.id,
          name: student.name,
          department: student.department
        });
      }
    }
  });

  // Build Adjacency Matrix (NxN)
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  const matrixDetails = Array.from({ length: n }, () => Array(n).fill(null));

  // Build Adjacency List
  const adjList = {};
  subjectCodes.forEach((code) => {
    adjList[code] = [];
  });

  const edges = [];
  edgeMap.forEach((edgeData, key) => {
    if (edgeData.weight > 0) {
      edges.push({
        id: key,
        source: edgeData.u,
        target: edgeData.v,
        weight: edgeData.weight,
        commonStudents: edgeData.commonStudents
      });

      // Update adjList
      adjList[edgeData.u].push({
        neighbor: edgeData.v,
        weight: edgeData.weight,
        commonStudents: edgeData.commonStudents
      });
      adjList[edgeData.v].push({
        neighbor: edgeData.u,
        weight: edgeData.weight,
        commonStudents: edgeData.commonStudents
      });

      // Update Matrix
      const i = subjectCodes.indexOf(edgeData.u);
      const j = subjectCodes.indexOf(edgeData.v);
      if (i !== -1 && j !== -1) {
        matrix[i][j] = edgeData.weight;
        matrix[j][i] = edgeData.weight;
        matrixDetails[i][j] = edgeData.commonStudents;
        matrixDetails[j][i] = edgeData.commonStudents;
      }
    }
  });

  // Calculate degrees
  const degrees = {};
  subjectCodes.forEach((code) => {
    degrees[code] = (adjList[code] || []).length;
  });

  return {
    subjectCodes,
    subjects,
    enrollmentMap: Object.fromEntries(enrollmentMap),
    adjList,
    degrees,
    edges,
    matrix,
    matrixDetails,
    totalVertices: n,
    totalEdges: edges.length
  };
}

/**
 * Validates a graph coloring assignment.
 * Checks whether any two connected vertices share the exact same color.
 * @param {Object} graph - Conflict graph from buildConflictGraph
 * @param {Object} coloring - Map of subjectCode -> colorNumber
 * @returns {Object} { isValid: boolean, violations: Array }
 */
export function validateColoring(graph, coloring) {
  const violations = [];

  graph.edges.forEach((edge) => {
    const c1 = coloring[edge.source];
    const c2 = coloring[edge.target];

    if (c1 !== undefined && c2 !== undefined && c1 === c2) {
      violations.push({
        u: edge.source,
        v: edge.target,
        color: c1,
        weight: edge.weight,
        commonStudents: edge.commonStudents
      });
    }
  });

  return {
    isValid: violations.length === 0,
    violations
  };
}

/**
 * Checks whether assigning a given subject to a given slot produces a conflict
 * @param {string} subjectCode - Subject being tested
 * @param {number} targetSlot - Target slot number
 * @param {Object} currentSlotAssignments - Map of slot -> Array of subject codes
 * @param {Object} graph - Conflict graph
 * @returns {Object} { hasConflict: boolean, conflictingWith: Array }
 */
export function checkSlotConflict(subjectCode, targetSlot, currentSlotAssignments, graph) {
  const existingInSlot = currentSlotAssignments[targetSlot] || [];
  const conflictingWith = [];

  const neighbors = (graph.adjList[subjectCode] || []).map((item) => item.neighbor);

  existingInSlot.forEach((otherCode) => {
    if (otherCode !== subjectCode && neighbors.includes(otherCode)) {
      const edge = graph.edges.find(
        (e) => (e.source === subjectCode && e.target === otherCode) ||
               (e.source === otherCode && e.target === subjectCode)
      );
      conflictingWith.push({
        subject: otherCode,
        weight: edge ? edge.weight : 1,
        commonStudents: edge ? edge.commonStudents : []
      });
    }
  });

  return {
    hasConflict: conflictingWith.length > 0,
    conflictingWith
  };
}

