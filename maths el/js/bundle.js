// ExamSlot - Unified Application Bundle
// Self-contained, production-grade, zero-CORS browser bundle
(function() {
  'use strict';
  const { createElement: h, useState, useMemo, useEffect, useRef } = React;

  // ==========================================
  // MODULE 1: SAMPLE DATA & CONSTANTS
  // Exactly 7 Subjects as configured in Google Forms:
  // 1. MATH - Mathematics
  // 2. PY - Python Programming
  // 3. JAVA - Java Programming
  // 4. OS - Operating Systems
  // 5. COA - Computer Architecture
  // 6. BE - Biology for Engineering
  // 7. DCN - Data Communication and Networks
  // ==========================================
  const DATASET_VERSION = 'v2_7subjects';

  const INITIAL_SUBJECTS = [
    { code: 'MATH', name: 'Mathematics', department: 'Mathematics & Computing', semester: 'Sem 4', credits: 4 },
    { code: 'PY', name: 'Python Programming', department: 'Computer Science', semester: 'Sem 4', credits: 3 },
    { code: 'JAVA', name: 'Java Programming', department: 'Computer Science', semester: 'Sem 4', credits: 3 },
    { code: 'OS', name: 'Operating Systems', department: 'Computer Science', semester: 'Sem 4', credits: 4 },
    { code: 'COA', name: 'Computer Architecture', department: 'Computer Science', semester: 'Sem 4', credits: 4 },
    { code: 'BE', name: 'Biology for Engineering', department: 'Basic Sciences & Engineering', semester: 'Sem 4', credits: 3 },
    { code: 'DCN', name: 'Data Communication and Networks', department: 'Information Technology', semester: 'Sem 4', credits: 3 }
  ];

  const INITIAL_STUDENTS = [
    { id: 'STU001', name: 'Aarav Sharma', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'PY', 'COA'] },
    { id: 'STU002', name: 'Priya Patel', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'JAVA', 'OS'] },
    { id: 'STU003', name: 'Rohan Verma', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['COA', 'DCN', 'BE'] },
    { id: 'STU004', name: 'Sneha Reddy', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['JAVA', 'DCN', 'MATH'] },
    { id: 'STU005', name: 'Vikram Singh', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'OS', 'BE'] },
    { id: 'STU006', name: 'Ananya Iyer', department: 'AI & Data Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'BE', 'COA'] },
    { id: 'STU007', name: 'Rahul Nair', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'JAVA', 'DCN'] },
    { id: 'STU008', name: 'Pooja Gupta', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['COA', 'OS', 'BE'] },
    { id: 'STU009', name: 'Aditya Joshi', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'COA', 'DCN'] },
    { id: 'STU010', name: 'Kavya Menon', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['JAVA', 'OS', 'BE'] },
    { id: 'STU011', name: 'Siddharth Rao', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'PY', 'DCN'] },
    { id: 'STU012', name: 'Neha Kulkarni', department: 'AI & Data Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['COA', 'BE', 'JAVA'] },
    { id: 'STU013', name: 'Karthik Bhat', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['JAVA', 'COA', 'OS'] },
    { id: 'STU014', name: 'Divya Pillai', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'JAVA', 'BE'] },
    { id: 'STU015', name: 'Varun Deshmukh', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'OS', 'DCN'] },
    { id: 'STU016', name: 'Riya Sen', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['DCN', 'BE', 'MATH'] },
    { id: 'STU017', name: 'Manish Pandey', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'COA', 'DCN'] },
    { id: 'STU018', name: 'Tanvi Shah', department: 'AI & Data Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'JAVA', 'DCN', 'BE'] },
    { id: 'STU019', name: 'Arjun Mehta', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['OS', 'DCN', 'COA'] },
    { id: 'STU020', name: 'Ishita Bose', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'PY', 'OS', 'COA'] }
  ];

  const COLOR_PALETTE = [
    { slot: 1, name: 'Emerald', hex: '#10b981', light: '#d1fae5', text: '#065f46' },
    { slot: 2, name: 'Royal Blue', hex: '#3b82f6', light: '#dbeafe', text: '#1e40af' },
    { slot: 3, name: 'Amber', hex: '#f59e0b', light: '#fef3c7', text: '#92400e' },
    { slot: 4, name: 'Purple', hex: '#8b5cf6', light: '#ede9fe', text: '#5b21b6' },
    { slot: 5, name: 'Rose', hex: '#f43f5e', light: '#ffe4e6', text: '#9f1239' },
    { slot: 6, name: 'Cyan', hex: '#06b6d4', light: '#cffafe', text: '#155e75' },
    { slot: 7, name: 'Orange', hex: '#f97316', light: '#ffedd5', text: '#9a3412' },
    { slot: 8, name: 'Teal', hex: '#14b8a6', light: '#ccfbf1', text: '#115e59' },
    { slot: 9, name: 'Indigo', hex: '#6366f1', light: '#e0e7ff', text: '#3730a3' },
    { slot: 10, name: 'Lime', hex: '#84cc16', light: '#ecfccb', text: '#3f6212' },
    { slot: 11, name: 'Pink', hex: '#ec4899', light: '#fce7f3', text: '#831843' },
    { slot: 12, name: 'Slate', hex: '#64748b', light: '#f1f5f9', text: '#1e293b' }
  ];

  const DEFAULT_EXAM_SETTINGS = {
    startDate: '2026-11-16',
    morningSession: { name: 'Morning Session', time: '09:30 AM - 12:30 PM' },
    afternoonSession: { name: 'Afternoon Session', time: '02:00 PM - 05:00 PM' },
    skipSundays: true,
    universityName: 'APEX INSTITUTE OF TECHNOLOGY & ADVANCED STUDIES',
    examTitle: 'END SEMESTER EXAMINATIONS - AUTUMN 2026'
  };

  // ==========================================
  // MODULE 2: CONFLICT DETECTION & GRAPH BUILDER
  // ==========================================
  function buildConflictGraph(subjects, students) {
    const subjectMap = new Map();
    subjects.forEach((s) => subjectMap.set(s.code, s));
    const subjectCodes = subjects.map((s) => s.code);
    const n = subjectCodes.length;

    const edgeMap = new Map();
    const enrollmentMap = new Map();
    subjectCodes.forEach((code) => enrollmentMap.set(code, 0));

    students.forEach((student) => {
      const registered = (student.subjects || []).filter((code) => subjectMap.has(code));
      registered.forEach((code) => {
        enrollmentMap.set(code, (enrollmentMap.get(code) || 0) + 1);
      });

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

    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    const matrixDetails = Array.from({ length: n }, () => Array(n).fill(null));
    const adjList = {};
    subjectCodes.forEach((code) => { adjList[code] = []; });
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

  function validateColoring(graph, coloring) {
    const violations = [];
    if (!coloring) return { isValid: true, violations: [] };

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

  function validateSubjectSlotMove(subjectCode, targetSlot, currentColoring, graph) {
    const existingInTarget = Object.entries(currentColoring)
      .filter(([code, slot]) => slot === targetSlot && code !== subjectCode)
      .map(([code]) => code);

    const conflicts = [];
    existingInTarget.forEach((otherCode) => {
      const edge = graph.edges.find(
        (e) => (e.source === subjectCode && e.target === otherCode) ||
               (e.source === otherCode && e.target === subjectCode)
      );
      if (edge && edge.weight > 0) {
        conflicts.push({
          targetSubject: otherCode,
          weight: edge.weight,
          commonStudents: edge.commonStudents
        });
      }
    });

    return {
      isAllowed: conflicts.length === 0,
      conflicts
    };
  }

  // ==========================================
  // MODULE 3: GRAPH COLORING ALGORITHMS
  // ==========================================
  function runGreedyColoring(graph) {
    const t0 = performance.now();
    const vertices = [...graph.subjectCodes];
    const coloring = {};
    const steps = [];

    vertices.forEach((v) => { coloring[v] = null; });

    vertices.forEach((vertex, index) => {
      const neighborColors = new Set();
      const neighbors = graph.adjList[vertex] || [];
      neighbors.forEach((item) => {
        const neighborCode = item.neighbor;
        if (coloring[neighborCode] !== null && coloring[neighborCode] !== undefined) {
          neighborColors.add(coloring[neighborCode]);
        }
      });

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

  function runWelshPowell(graph) {
    const t0 = performance.now();
    const vertices = [...graph.subjectCodes];

    vertices.sort((a, b) => {
      const degDiff = (graph.degrees[b] || 0) - (graph.degrees[a] || 0);
      if (degDiff !== 0) return degDiff;
      return a.localeCompare(b);
    });

    const coloring = {};
    vertices.forEach((v) => { coloring[v] = null; });

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
          const neighbors = (graph.adjList[v] || []).map((item) => item.neighbor);
          const hasConflict = verticesInCurrentPass.some((cNode) => neighbors.includes(cNode));

          if (!hasConflict) {
            coloring[v] = currentColor;
            verticesInCurrentPass.push(v);
            coloredCount++;

            steps.push({
              step: stepIndex++,
              vertex: v,
              degree: graph.degrees[v] || 0,
              assignedColor: currentColor,
              passNumber: currentColor,
              explanation: `Slot ${currentColor}: Assigned to ${v} (Degree: ${graph.degrees[v]}). No conflict with existing nodes in this slot [${verticesInCurrentPass.slice(0, -1).join(', ') || 'first'}].`
            });
          }
        }
      }

      passes.push({ color: currentColor, vertices: verticesInCurrentPass });
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

  function findMaximumClique(graph) {
    const vertices = [...graph.subjectCodes];
    const adjSet = {};
    vertices.forEach((v) => {
      adjSet[v] = new Set((graph.adjList[v] || []).map((i) => i.neighbor));
    });

    let maxClique = [];

    function bronKerbosch(R, P, X) {
      if (P.size === 0 && X.size === 0) {
        if (R.size > maxClique.length) {
          maxClique = Array.from(R);
        }
        return;
      }

      const unionPX = new Set([...P, ...X]);
      let pivot = null;
      let maxDegree = -1;
      unionPX.forEach((u) => {
        let degreeInP = 0;
        P.forEach((v) => { if (adjSet[u] && adjSet[u].has(v)) degreeInP++; });
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

  function runBacktrackingColoring(graph, maxTimeMs = 3000) {
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
        steps: []
      };
    }

    vertices.sort((a, b) => (graph.degrees[b] || 0) - (graph.degrees[a] || 0));

    const adjSet = {};
    vertices.forEach((v) => {
      adjSet[v] = new Set((graph.adjList[v] || []).map((i) => i.neighbor));
    });

    const maxClique = findMaximumClique(graph);
    const lowerBound = Math.max(1, maxClique.length);
    const wpResult = runWelshPowell(graph);
    const upperBound = wpResult.totalColors;

    let optimalColoring = null;
    let exactChromaticNumber = upperBound;
    let timeoutOccurred = false;

    function solveKColoring(k) {
      const color = Array(n).fill(0);

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
        if (performance.now() - t0 > maxTimeMs) {
          timeoutOccurred = true;
          return false;
        }
        if (vIdx === n) return true;

        const allowedColors = Math.min(k, maxColorUsed + 1);
        for (let c = 1; c <= allowedColors; c++) {
          if (isSafe(vIdx, c)) {
            color[vIdx] = c;
            if (backtrack(vIdx + 1, Math.max(maxColorUsed, c))) return true;
            color[vIdx] = 0;
          }
        }
        return false;
      }

      if (backtrack(0, 0)) {
        const res = {};
        vertices.forEach((v, idx) => { res[v] = color[idx]; });
        return res;
      }
      return null;
    }

    for (let k = lowerBound; k <= upperBound; k++) {
      const solution = solveKColoring(k);
      if (solution) {
        exactChromaticNumber = k;
        optimalColoring = solution;
        break;
      }
      if (timeoutOccurred) break;
    }

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

  function calculateGraphMetrics(graph) {
    const vCount = graph.totalVertices;
    const eCount = graph.totalEdges;
    const density = vCount > 1 ? (2 * eCount) / (vCount * (vCount - 1)) : 0;
    const degrees = Object.values(graph.degrees);
    const maxDegree = degrees.length ? Math.max(...degrees) : 0;
    const minDegree = degrees.length ? Math.min(...degrees) : 0;
    const avgDegree = degrees.length ? degrees.reduce((a, b) => a + b, 0) / degrees.length : 0;

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
          const neighbors = (graph.adjList[curr] || []).map((i) => i.neighbor);
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

    const maxClique = findMaximumClique(graph);
    const isComplete = eCount === (vCount * (vCount - 1)) / 2 && vCount > 0;
    const brooksUpper = isComplete ? maxDegree + 1 : maxDegree;

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
      brooksUpperBound: Math.max(1, brooksUpper)
    };
  }

  // ==========================================
  // MODULE 4: TIMETABLE GENERATOR & PDF
  // ==========================================
  function generateSlotSchedules(startDateStr, totalSlots, settings = DEFAULT_EXAM_SETTINGS) {
    const schedules = [];
    const start = new Date(startDateStr);
    let currentDate = new Date(start);
    let slotIndex = 1;
    let isMorning = true;

    while (slotIndex <= totalSlots) {
      if (settings.skipSundays && currentDate.getDay() === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const sessionType = isMorning ? 'Morning' : 'Afternoon';
      const sessionTime = isMorning ? settings.morningSession.time : settings.afternoonSession.time;

      schedules.push({
        slot: slotIndex,
        isoDate: currentDate.toISOString().split('T')[0],
        formattedDate,
        dayName,
        sessionType,
        sessionTime
      });

      slotIndex++;
      if (!isMorning) {
        currentDate.setDate(currentDate.getDate() + 1);
        isMorning = true;
      } else {
        isMorning = false;
      }
    }
    return schedules;
  }

  function generateTimetable(coloring, graph, settings = DEFAULT_EXAM_SETTINGS) {
    const slotCount = Math.max(...Object.values(coloring || {}), 0);
    const slotSchedules = generateSlotSchedules(settings.startDate, slotCount, settings);

    const slotsMap = {};
    for (let s = 1; s <= slotCount; s++) { slotsMap[s] = []; }

    const subjectMetaMap = {};
    graph.subjects.forEach((subj) => { subjectMetaMap[subj.code] = subj; });

    Object.entries(coloring || {}).forEach(([code, slot]) => {
      if (!slotsMap[slot]) slotsMap[slot] = [];
      const meta = subjectMetaMap[code] || { code, name: code, department: 'N/A' };
      const enrolledCount = graph.enrollmentMap[code] || 0;

      slotsMap[slot].push({
        code,
        name: meta.name,
        department: meta.department,
        semester: meta.semester || 'N/A',
        credits: meta.credits || 3,
        enrolledCount,
        colorInfo: COLOR_PALETTE[(slot - 1) % COLOR_PALETTE.length]
      });
    });

    const rows = slotSchedules.map((schedule) => {
      const subjectsInSlot = slotsMap[schedule.slot] || [];
      const totalStudents = subjectsInSlot.reduce((sum, s) => sum + s.enrolledCount, 0);

      let hasIntraConflict = false;
      const conflictingPairs = [];

      for (let i = 0; i < subjectsInSlot.length; i++) {
        for (let j = i + 1; j < subjectsInSlot.length; j++) {
          const u = subjectsInSlot[i].code;
          const v = subjectsInSlot[j].code;
          const edge = graph.edges.find(
            (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
          );
          if (edge && edge.weight > 0) {
            hasIntraConflict = true;
            conflictingPairs.push({
              sub1: u,
              sub2: v,
              weight: edge.weight,
              commonStudents: edge.commonStudents
            });
          }
        }
      }

      return {
        ...schedule,
        slotNumber: schedule.slot,
        colorInfo: COLOR_PALETTE[(schedule.slot - 1) % COLOR_PALETTE.length],
        subjects: subjectsInSlot,
        totalStudents,
        hasConflict: hasIntraConflict,
        conflictingPairs
      };
    });

    const totalConflicts = rows.reduce(
      (acc, r) => acc + (r.conflictingPairs ? r.conflictingPairs.length : 0),
      0
    );

    return {
      rows,
      slotsMap,
      slotCount,
      totalConflicts,
      isConflictFree: totalConflicts === 0,
      settings
    };
  }

  function exportTimetableToPDF(timetable, graph) {
    if (window.jspdf && window.jspdf.jsPDF) {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const primary = [30, 64, 175];

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...primary);
        doc.text(timetable.settings.universityName || 'APEX INSTITUTE OF TECHNOLOGY', 420, 38, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text(timetable.settings.examTitle || 'END SEMESTER EXAMINATIONS TIMETABLE', 420, 56, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated: ${new Date().toLocaleString()} | Status: ${timetable.isConflictFree ? '100% CONFLICT-FREE' : 'CONFLICTS PRESENT'}`, 420, 70, { align: 'center' });

        const tableRows = timetable.rows.map((row) => [
          `Slot ${row.slotNumber}`,
          `${row.formattedDate}\n(${row.dayName})`,
          `${row.sessionType}\n${row.sessionTime}`,
          row.subjects.map((s) => s.code).join(', '),
          row.subjects.map((s) => `${s.code} - ${s.name} (${s.enrolledCount} st.)`).join('\n'),
          row.totalStudents,
          row.hasConflict ? 'CLASH' : 'OK'
        ]);

        if (doc.autoTable) {
          doc.autoTable({
            startY: 85,
            head: [['Slot', 'Date & Day', 'Session / Time', 'Codes', 'Subjects & Enrollments', 'Students', 'Status']],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: primary, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
            columnStyles: {
              0: { halign: 'center', cellWidth: 50, fontStyle: 'bold' },
              1: { halign: 'center', cellWidth: 90 },
              2: { halign: 'center', cellWidth: 110 },
              3: { halign: 'center', cellWidth: 80, fontStyle: 'bold' },
              4: { cellWidth: 280 },
              5: { halign: 'center', cellWidth: 60 },
              6: { halign: 'center', cellWidth: 60 }
            },
            styles: { fontSize: 9, cellPadding: 5 }
          });

          const finalY = doc.lastAutoTable.finalY + 35;
          doc.setFontSize(9);
          doc.setTextColor(71, 85, 105);
          doc.text('Prepared by: Timetabling Committee (ExamSlot)', 60, finalY);
          doc.text('Verified by: Head of Examination Cell', 420, finalY, { align: 'center' });
          doc.text('Approved by: Controller of Examinations', 760, finalY, { align: 'right' });

          doc.save(`Exam_Timetable_${new Date().toISOString().slice(0, 10)}.pdf`);
          return;
        }
      } catch (err) {
        console.warn('jsPDF error, falling back to print window:', err);
      }
    }
    openPrintableTimetableWindow(timetable, graph);
  }

  function openPrintableTimetableWindow(timetable, graph) {
    const printWindow = window.open('', '_blank', 'width=1100,height=800');
    if (!printWindow) {
      alert('Please allow popups to print/export the timetable as PDF.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${timetable.settings.examTitle || 'Examination Timetable'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 35px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 24px; }
          .univ-name { font-size: 20px; font-weight: 800; color: #1e40af; text-transform: uppercase; }
          .exam-title { font-size: 15px; font-weight: 600; color: #334155; margin-top: 4px; }
          .meta-info { font-size: 11px; color: #64748b; margin-top: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; vertical-align: top; }
          th { background: #1e40af; color: white; font-weight: 600; text-transform: uppercase; font-size: 10px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .slot-badge { background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
          .footer { margin-top: 50px; display: flex; justify-content: space-between; font-size: 11px; color: #475569; }
          .sig-box { text-align: center; width: 200px; border-top: 1px solid #94a3b8; padding-top: 6px; }
          @media print { button { display: none; } body { margin: 10mm; } }
        </style>
      </head>
      <body>
        <div style="text-align: right; margin-bottom: 10px;">
          <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600;">Print / Save as PDF</button>
        </div>
        <div class="header">
          <div class="univ-name">${timetable.settings.universityName}</div>
          <div class="exam-title">${timetable.settings.examTitle}</div>
          <div class="meta-info">Generated: ${new Date().toLocaleString()} | Total Slots: ${timetable.slotCount} | Status: ${timetable.isConflictFree ? '100% Conflict-Free' : 'Warning: Conflicts'}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 60px;">Slot</th>
              <th style="width: 130px;">Date & Day</th>
              <th style="width: 150px;">Session / Time</th>
              <th>Scheduled Subjects</th>
              <th style="width: 80px; text-align: center;">Students</th>
            </tr>
          </thead>
          <tbody>
            ${timetable.rows.map((r) => `
              <tr>
                <td style="text-align: center;"><span class="slot-badge">Slot ${r.slotNumber}</span></td>
                <td><strong>${r.formattedDate}</strong><br><span style="color:#64748b; font-size:10px;">${r.dayName}</span></td>
                <td><strong>${r.sessionType}</strong><br><span style="color:#64748b; font-size:10px;">${r.sessionTime}</span></td>
                <td>${r.subjects.map((s) => `<div><strong>${s.code}</strong> - ${s.name} <span style="color:#64748b;">(${s.enrolledCount} enrolled)</span></div>`).join('')}</td>
                <td style="text-align: center; font-weight: bold;">${r.totalStudents}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <div class="sig-box">ExamSlot System Administrator</div>
          <div class="sig-box">Head of Examination Cell</div>
          <div class="sig-box">Controller of Examinations</div>
        </div>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }

  // ==========================================
  // MODULE 5: CSV HELPERS & PARSER
  // ==========================================
  function extractGoogleSheetCsvUrl(input) {
    const trimmed = (input || '').trim();
    if (!trimmed) return '';
    if (trimmed.includes('pub?output=csv') || trimmed.includes('gviz/tq?tqx=out:csv')) {
      return trimmed;
    }
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv`;
    }
    if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
      return `https://docs.google.com/spreadsheets/d/${trimmed}/gviz/tq?tqx=out:csv`;
    }
    return trimmed;
  }

  function parseCSV(text) {
    const lines = [];
    let currentRow = [];
    let currentVal = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        currentRow.push(currentVal.trim());
        if (currentRow.some((f) => f.length > 0)) lines.push(currentRow);
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    if (currentVal.length > 0 || currentRow.length > 0) {
      currentRow.push(currentVal.trim());
      if (currentRow.some((f) => f.length > 0)) lines.push(currentRow);
    }
    return lines;
  }

  function detectColumnMapping(headers) {
    const norm = headers.map((h) => h.toLowerCase().trim());
    const findIdx = (patterns) => {
      for (let p of patterns) {
        const idx = norm.findIndex((h) => h.includes(p));
        if (idx !== -1) return idx;
      }
      return -1;
    };
    return {
      idIdx: findIdx(['student id', 'roll no', 'reg no', 'studentid', 'id']),
      nameIdx: findIdx(['name', 'student name', 'full name']),
      deptIdx: findIdx(['department', 'dept', 'branch']),
      semIdx: findIdx(['semester', 'sem', 'term']),
      yearIdx: findIdx(['academic year', 'year', 'batch']),
      subjectsIdx: findIdx(['registered subjects', 'subjects', 'courses', 'course', 'papers'])
    };
  }

  function validateImportedData(rows, existingSubjects, existingStudents = []) {
    if (!rows || rows.length < 2) {
      return { isValid: false, error: 'CSV file must contain a header row and data rows.', records: [] };
    }
    const header = rows[0];
    const dataRows = rows.slice(1);
    const mapping = detectColumnMapping(header);

    if (mapping.idIdx === -1 || mapping.subjectsIdx === -1) {
      return {
        isValid: false,
        error: 'Could not detect required columns ("Student ID" and "Registered Subjects"). Check CSV headers.',
        records: []
      };
    }

    const validCodes = new Set(existingSubjects.map((s) => s.code.toUpperCase()));
    const existingIds = new Set(existingStudents.map((s) => s.id.toUpperCase()));
    const seenBatchIds = new Set();
    const previewRecords = [];
    let validCount = 0;
    let duplicateCount = 0;
    let invalidSubjectCount = 0;

    dataRows.forEach((row, rowIndex) => {
      const rawId = (row[mapping.idIdx] || '').trim();
      const rawName = mapping.nameIdx !== -1 ? (row[mapping.nameIdx] || `Student ${rowIndex + 1}`).trim() : `Student ${rowIndex + 1}`;
      const rawDept = mapping.deptIdx !== -1 ? (row[mapping.deptIdx] || 'General').trim() : 'General';
      const rawSem = mapping.semIdx !== -1 ? (row[mapping.semIdx] || 'Sem 4').trim() : 'Sem 4';
      const rawYear = mapping.yearIdx !== -1 ? (row[mapping.yearIdx] || '2026-2027').trim() : '2026-2027';
      const rawSubjectsStr = (row[mapping.subjectsIdx] || '').trim();

      const rawTokens = rawSubjectsStr.split(/[,;\/|]+/).map((s) => s.trim()).filter((s) => s.length > 0);
      const recognized = [];
      const unrecognized = [];

      rawTokens.forEach((tok) => {
        const uTok = tok.toUpperCase();
        if (validCodes.has(uTok)) {
          if (!recognized.includes(uTok)) recognized.push(uTok);
          return;
        }
        const matched = existingSubjects.find((s) => s.name.toLowerCase() === tok.toLowerCase());
        if (matched) {
          if (!recognized.includes(matched.code)) recognized.push(matched.code);
          return;
        }
        unrecognized.push(tok);
      });

      const flags = [];
      let isValid = true;
      if (!rawId) {
        flags.push('Missing ID');
        isValid = false;
      } else {
        const upId = rawId.toUpperCase();
        if (seenBatchIds.has(upId)) {
          flags.push('Duplicate ID in CSV');
          duplicateCount++;
          isValid = false;
        } else if (existingIds.has(upId)) {
          flags.push('Overwrites Existing');
        }
        seenBatchIds.add(upId);
      }

      if (unrecognized.length > 0) {
        flags.push(`Unknown: ${unrecognized.join(', ')}`);
        invalidSubjectCount++;
      }
      if (recognized.length < 1) {
        flags.push('No Valid Subjects');
        isValid = false;
      }

      if (isValid && flags.length === 0) validCount++;
      else if (isValid && flags.every((f) => f.startsWith('Overwrites'))) validCount++;

      previewRecords.push({
        rowIndex: rowIndex + 2,
        id: rawId.toUpperCase(),
        name: rawName,
        department: rawDept,
        semester: rawSem,
        academicYear: rawYear,
        subjects: recognized,
        unrecognizedSubjects: unrecognized,
        isValid: isValid && recognized.length > 0,
        status: flags.join('; ') || 'Valid'
      });
    });

    return {
      isValid: true,
      totalRows: dataRows.length,
      validCount,
      duplicateCount,
      invalidSubjectCount,
      records: previewRecords
    };
  }

  function exportTimetableToCSV(timetable) {
    const headers = ['Slot', 'Date', 'Day', 'Session', 'Time', 'Subject Codes', 'Subject Names', 'Total Students', 'Status'];
    const rows = timetable.rows.map((row) => [
      `Slot ${row.slotNumber}`,
      `"${row.formattedDate}"`,
      `"${row.dayName}"`,
      `"${row.sessionType}"`,
      `"${row.sessionTime}"`,
      `"${row.subjects.map((s) => s.code).join('; ')}"`,
      `"${row.subjects.map((s) => s.name).join('; ')}"`,
      row.totalStudents,
      `"${row.hasConflict ? 'CONFLICT' : 'OK'}"`
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }

  function downloadFile(content, filename, mimeType = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function generateSampleStudentsCSV() {
    return [
      'Student ID,Full Name,Department,Semester,Academic Year,Registered Subjects',
      'STU101,Anil Kumble,Computer Science,Sem 4,2026-2027,"MATH, PY, COA"',
      'STU102,Smriti Mandhana,Information Technology,Sem 4,2026-2027,"JAVA, DCN, BE"',
      'STU103,Rohit Sharma,Computer Science,Sem 4,2026-2027,"OS, COA, PY"',
      'STU104,Harmanpreet Kaur,AI & Data Science,Sem 4,2026-2027,"MATH, BE, COA"',
      'STU105,Jasprit Bumrah,Information Technology,Sem 4,2026-2027,"JAVA, OS, DCN"'
    ].join('\r\n');
  }

  function generateGoogleFormsSampleCSV() {
    return [
      'Timestamp,Student ID,Student Name,Department,Semester,Academic Year,Select Registered Subjects',
      '2026-11-01 10:14:22,STU201,Kavita Krishnan,Computer Science,Sem 4,2026-2027,"MATH - Mathematics, PY - Python Programming, COA- Computer Architecture"',
      '2026-11-01 10:15:45,STU202,Devendra Soni,Information Technology,Sem 4,2026-2027,"JAVA - Java Programming, DCN- Data Communication and Networks, BE- Biology for Engineering"',
      '2026-11-01 10:18:10,STU203,Meera Nambiar,AI & Data Science,Sem 4,2026-2027,"OS - Operating Systems, BE- Biology for Engineering, PY - Python Programming"',
      '2026-11-01 10:22:30,STU204,Farhan Akhtar,Computer Science,Sem 4,2026-2027,"MATH - Mathematics, OS - Operating Systems, BE- Biology for Engineering"',
      '2026-11-01 10:30:12,STU205,Ritika Sen,Information Technology,Sem 4,2026-2027,"JAVA - Java Programming, COA- Computer Architecture, DCN- Data Communication and Networks"'
    ].join('\r\n');
  }

  // ==========================================
  // MODULE 6: INTERACTIVE GRAPH CANVAS
  // ==========================================
  function createGraphCanvas({ container, graph, coloring, palette, onSelectNode, onSelectEdge }) {
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    const canvas = document.createElement('canvas');
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.display = 'block';
    canvas.style.cursor = 'grab';
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let zoom = 1.0;
    let panX = width / 2;
    let panY = height / 2;
    let isPanning = false;
    let startPanX = 0;
    let startPanY = 0;

    const nodes = graph.subjectCodes.map((code, idx) => {
      const angle = (idx / (graph.subjectCodes.length || 1)) * 2 * Math.PI;
      const r = Math.min(width, height) * 0.32;
      return {
        id: code,
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        radius: 28,
        degree: graph.degrees[code] || 0
      };
    });

    const nodeMap = new Map();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const edges = graph.edges.map((e) => ({
      source: nodeMap.get(e.source),
      target: nodeMap.get(e.target),
      weight: e.weight,
      rawEdge: e
    })).filter((e) => e.source && e.target);

    let draggedNode = null;
    let selectedNode = null;
    let selectedEdge = null;
    let hoveredNode = null;
    let isRunning = true;

    const repulsion = 4500;
    const springLength = 140;
    const springK = 0.045;
    const damping = 0.88;
    const centerGravity = 0.035;

    function tick() {
      if (!isRunning) return;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          let dx = n2.x - n1.x;
          let dy = n2.y - n1.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 400) {
            const force = repulsion / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx -= fx; n1.vy -= fy;
            n2.vx += fx; n2.vy += fy;
          }
        }
      }

      edges.forEach((e) => {
        const dx = e.target.x - e.source.x;
        const dy = e.target.y - e.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - springLength) * springK;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        e.source.vx += fx; e.source.vy += fy;
        e.target.vx -= fx; e.target.vy -= fy;
      });

      nodes.forEach((n) => {
        if (n === draggedNode) return;
        n.vx -= n.x * centerGravity;
        n.vy -= n.y * centerGravity;
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(panX, panY);
      ctx.scale(zoom, zoom);

      // Grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      const size = 60;
      for (let x = -1500; x <= 1500; x += size) {
        ctx.beginPath(); ctx.moveTo(x, -1500); ctx.lineTo(x, 1500); ctx.stroke();
      }
      for (let y = -1500; y <= 1500; y += size) {
        ctx.beginPath(); ctx.moveTo(-1500, y); ctx.lineTo(1500, y); ctx.stroke();
      }

      // Edges
      edges.forEach((e) => {
        const isHighlighted =
          (selectedNode && (e.source.id === selectedNode.id || e.target.id === selectedNode.id)) ||
          (selectedEdge && selectedEdge === e.rawEdge);
        const isDimmed = selectedNode && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(e.source.x, e.source.y);
        ctx.lineTo(e.target.x, e.target.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = Math.min(2 + e.weight * 1.5, 7);
        } else if (isDimmed) {
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.35)';
          ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = Math.min(1.5 + e.weight * 0.8, 5);
        }
        ctx.stroke();

        if (isHighlighted || zoom > 0.85) {
          const midX = (e.source.x + e.target.x) / 2;
          const midY = (e.source.y + e.target.y) / 2;
          ctx.beginPath();
          ctx.arc(midX, midY, 9, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = isHighlighted ? '#ef4444' : '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = isHighlighted ? '#b91c1c' : '#334155';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(e.weight.toString(), midX, midY);
        }
      });

      // Nodes
      nodes.forEach((n) => {
        const isSelected = selectedNode && selectedNode.id === n.id;
        const isHovered = hoveredNode && hoveredNode.id === n.id;
        const isNeighbor = selectedNode && (graph.adjList[selectedNode.id] || []).some((item) => item.neighbor === n.id);
        const isDimmed = selectedNode && !isSelected && !isNeighbor;

        const slot = coloring ? coloring[n.id] : null;
        const colorEntry = slot ? palette[(slot - 1) % palette.length] : null;
        const nodeFill = colorEntry ? colorEntry.hex : '#3b82f6';

        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, 2 * Math.PI);
          ctx.fillStyle = isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(100, 116, 139, 0.2)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, 2 * Math.PI);
        ctx.fillStyle = isDimmed ? '#e2e8f0' : nodeFill;
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#1e40af' : '#ffffff';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        ctx.fillStyle = isDimmed ? '#94a3b8' : '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.id, n.x, n.y - (slot ? 2 : 0));

        if (slot && !isDimmed) {
          ctx.font = '8px sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillText(`Slot ${slot}`, n.x, n.y + 11);
        }

        const badgeX = n.x + n.radius * 0.72;
        const badgeY = n.y - n.radius * 0.72;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 9, 0, 2 * Math.PI);
        ctx.fillStyle = isDimmed ? '#94a3b8' : '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(`d:${n.degree}`, badgeX, badgeY);
      });

      ctx.restore();
    }

    let animId;
    function loop() {
      tick();
      render();
      animId = requestAnimationFrame(loop);
    }
    loop();

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      return {
        graphX: (mouseX - panX) / zoom,
        graphY: (mouseY - panY) / zoom,
        mouseX,
        mouseY
      };
    }

    function findNodeAt(x, y) {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = n.x - x;
        const dy = n.y - y;
        if (dx * dx + dy * dy <= (n.radius + 4) * (n.radius + 4)) return n;
      }
      return null;
    }

    function findEdgeAt(x, y) {
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const p1 = e.source;
        const p2 = e.target;
        const l2 = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
        if (l2 === 0) continue;
        let t = Math.max(0, Math.min(1, ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / l2));
        const projX = p1.x + t * (p2.x - p1.x);
        const projY = p1.y + t * (p2.y - p1.y);
        if (Math.hypot(x - projX, y - projY) < 10) return e.rawEdge;
      }
      return null;
    }

    canvas.addEventListener('mousedown', (e) => {
      const { graphX, graphY, mouseX, mouseY } = getCoords(e);
      const clicked = findNodeAt(graphX, graphY);
      if (clicked) {
        draggedNode = clicked;
        selectedNode = clicked;
        selectedEdge = null;
        if (onSelectNode) onSelectNode(clicked.id);
        canvas.style.cursor = 'grabbing';
      } else {
        const clickedEdge = findEdgeAt(graphX, graphY);
        if (clickedEdge) {
          selectedEdge = clickedEdge;
          selectedNode = null;
          if (onSelectEdge) onSelectEdge(clickedEdge);
        } else {
          isPanning = true;
          startPanX = mouseX - panX;
          startPanY = mouseY - panY;
          selectedNode = null;
          selectedEdge = null;
          if (onSelectNode) onSelectNode(null);
          if (onSelectEdge) onSelectEdge(null);
          canvas.style.cursor = 'move';
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (draggedNode) {
        const { graphX, graphY } = getCoords(e);
        draggedNode.x = graphX;
        draggedNode.y = graphY;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
      } else if (isPanning) {
        const rect = canvas.getBoundingClientRect();
        panX = e.clientX - rect.left - startPanX;
        panY = e.clientY - rect.top - startPanY;
      } else {
        const { graphX, graphY } = getCoords(e);
        const node = findNodeAt(graphX, graphY);
        if (node !== hoveredNode) {
          hoveredNode = node;
          canvas.style.cursor = node ? 'pointer' : 'grab';
        }
      }
    });

    window.addEventListener('mouseup', () => {
      draggedNode = null;
      isPanning = false;
      canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      const newZoom = Math.max(0.3, Math.min(3.5, zoom * zoomFactor));
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      panX = mouseX - (mouseX - panX) * (newZoom / zoom);
      panY = mouseY - (mouseY - panY) * (newZoom / zoom);
      zoom = newZoom;
    });

    function handleResize() {
      width = container.clientWidth || 800;
      height = container.clientHeight || 550;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    window.addEventListener('resize', handleResize);

    return {
      zoomIn: () => { zoom = Math.min(3.5, zoom * 1.2); },
      zoomOut: () => { zoom = Math.max(0.3, zoom * 0.8); },
      resetView: () => { zoom = 1.0; panX = width / 2; panY = height / 2; },
      togglePhysics: () => { isRunning = !isRunning; return isRunning; },
      destroy: () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
      }
    };
  }

  // ==========================================
  // MODULE 7: VIEW COMPONENTS
  // ==========================================

  // --- NAVBAR ---
  function Navbar({ activeTab, activeAlgorithm, totalSlots, isConflictFree, onResetData, onPrintTimetable, liveSheetUrl, isLiveSyncing, onTriggerLiveSync }) {
    return h('header', { className: 'top-navbar' }, [
      h('div', { key: 'l', className: 'flex items-center gap-2' }, [
        h('span', { className: 'text-xs uppercase tracking-wider font-semibold text-slate-400' }, 'ExamSlot / Academic Timetabler'),
        h('span', { className: 'text-slate-300' }, '•'),
        h('span', { className: 'text-sm font-bold text-slate-800 capitalize' }, activeTab.replace('-', ' '))
      ]),
      h('div', { key: 'r', className: 'flex items-center gap-2.5' }, [
        liveSheetUrl && h('button', {
          className: 'btn btn-sm text-xs bg-emerald-600 text-white hover:bg-emerald-700 font-bold',
          onClick: onTriggerLiveSync,
          disabled: isLiveSyncing,
          title: 'Fetch latest student responses from linked Google Sheet'
        }, [
          h('span', { key: 'i' }, isLiveSyncing ? '⏳' : '🔄'),
          h('span', { key: 't' }, isLiveSyncing ? 'Syncing...' : 'Live Sync Form')
        ]),
        h('div', { className: 'badge badge-info cursor-pointer', title: 'Active Timetabling Algorithm' }, [
          h('span', { key: 'i', className: 'mr-1' }, '⚙️'),
          h('span', { key: 't' }, activeAlgorithm === 'welsh-powell' ? 'Welsh-Powell' : activeAlgorithm === 'greedy' ? 'Greedy' : 'Backtracking (Exact)')
        ]),
        h('div', { className: `badge ${isConflictFree ? 'badge-success' : 'badge-danger'}` }, [
          h('span', { key: 'd', className: 'mr-1' }, isConflictFree ? '●' : '▲'),
          h('span', { key: 's' }, isConflictFree ? `Conflict-Free (${totalSlots} Slots)` : 'Conflict Detected!')
        ]),
        h('button', { className: 'btn btn-secondary btn-sm', onClick: onPrintTimetable }, [
          h('span', { key: 'i' }, '🖨️'),
          h('span', { key: 't' }, 'Print Timetable')
        ]),
        h('button', { className: 'btn btn-secondary btn-sm text-slate-600', onClick: onResetData, title: 'Restore sample 7 subjects & 20 students' }, [
          h('span', { key: 'i' }, '🔄'),
          h('span', { key: 't' }, 'Reset Defaults')
        ])
      ])
    ]);
  }

  // --- SIDEBAR ---
  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: null },
    { id: 'students', label: 'Students', icon: '👨‍🎓', badge: 'students' },
    { id: 'subjects', label: 'Subjects', icon: '📚', badge: 'subjects' },
    { id: 'import', label: 'Import Data', icon: '📥', badge: 'Forms' },
    { id: 'conflicts', label: 'Conflict Detection', icon: '⚡', badge: 'conflicts' },
    { id: 'graph', label: 'Graph Visualization', icon: '🕸️', badge: null },
    { id: 'algorithms', label: 'Graph Coloring', icon: '🎨', badge: '3 Alg' },
    { id: 'timetable', label: 'Examination Timetable', icon: '🗓️', badge: 'slots' },
    { id: 'analysis', label: 'Analysis & Reports', icon: '📈', badge: null },
    { id: 'about', label: 'About Project', icon: '📖', badge: null }
  ];

  function Sidebar({ activeTab, onSelectTab, studentCount, subjectCount, conflictCount, slotCount }) {
    return h('aside', { className: 'sidebar' }, [
      h('div', { key: 'h', className: 'sidebar-header' }, [
        h('div', { className: 'flex items-center gap-3' }, [
          h('div', { className: 'w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl font-bold border border-white/20' }, 'Ω'),
          h('div', null, [
            h('h1', { className: 'text-base font-bold tracking-tight text-white leading-tight' }, 'ExamSlot'),
            h('p', { className: 'text-xs text-blue-200 opacity-90' }, 'Automated Timetabling')
          ])
        ]),
        h('div', { className: 'mt-3 text-[11px] text-blue-200/80 uppercase tracking-wider font-semibold' }, 'Experiential Learning System')
      ]),
      h('nav', { key: 'n', className: 'sidebar-nav' },
        MENU_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          let badgeVal = null;
          if (item.badge === 'students') badgeVal = studentCount;
          else if (item.badge === 'subjects') badgeVal = subjectCount;
          else if (item.badge === 'conflicts') badgeVal = conflictCount;
          else if (item.badge === 'slots') badgeVal = `${slotCount} slots`;
          else if (item.badge) badgeVal = item.badge;

          return h('div', {
            key: item.id,
            className: `nav-item ${isActive ? 'active' : ''}`,
            onClick: () => onSelectTab(item.id)
          }, [
            h('span', { key: 'i', className: 'nav-icon' }, item.icon),
            h('span', { key: 'l', className: 'flex-1' }, item.label),
            badgeVal !== null && h('span', {
              key: 'b',
              className: `text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`
            }, badgeVal)
          ]);
        })
      ),
      h('div', { key: 'f', className: 'p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center' }, [
        h('div', { className: 'font-semibold text-slate-700' }, 'Graph Theory Engine v2.0'),
        h('div', { className: 'mt-0.5 text-slate-400' }, 'Academic Timetable Generator')
      ])
    ]);
  }

  // --- DASHBOARD VIEW ---
  function DashboardView({ graph, students, subjects, activeAlgorithm, activeResult, allResults, metrics, timetable, onNavigateTab, onSelectAlgorithm }) {
    const enrollmentChartRef = useRef(null);
    const slotChartRef = useRef(null);

    useEffect(() => {
      let enrollmentChart = null;
      let slotChart = null;

      if (window.Chart && enrollmentChartRef.current) {
        enrollmentChart = new window.Chart(enrollmentChartRef.current, {
          type: 'bar',
          data: {
            labels: graph.subjectCodes,
            datasets: [{
              label: 'Registered Students',
              data: graph.subjectCodes.map((c) => graph.enrollmentMap[c] || 0),
              backgroundColor: '#3b82f6',
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 2 } } }
          }
        });
      }

      if (window.Chart && slotChartRef.current && timetable) {
        slotChart = new window.Chart(slotChartRef.current, {
          type: 'doughnut',
          data: {
            labels: timetable.rows.map((r) => `Slot ${r.slotNumber}`),
            datasets: [{
              data: timetable.rows.map((r) => r.subjects.length),
              backgroundColor: timetable.rows.map((r) => r.colorInfo ? r.colorInfo.hex : '#3b82f6'),
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
          }
        });
      }

      return () => {
        if (enrollmentChart) enrollmentChart.destroy();
        if (slotChart) slotChart.destroy();
      };
    }, [graph, timetable]);

    const chromaticNumber = allResults.backtracking?.chromaticNumber || activeResult.totalColors;
    const executionTime = activeResult.executionTimeMs || 0;

    return h('div', { className: 'space-y-6' }, [
      // Hero Banner
      h('div', {
        key: 'banner',
        className: 'bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden'
      }, [
        h('div', { className: 'relative z-10 max-w-3xl' }, [
          h('div', { className: 'inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 border border-blue-400/20 mb-3' },
            '🎓 Graph Theory & Discrete Mathematics Experiential Project • Fall 2026'
          ),
          h('h2', { className: 'text-2xl font-extrabold tracking-tight text-white mb-2' },
            'Automated Examination Timetabling via Graph Coloring'
          ),
          h('p', { className: 'text-blue-100 text-sm leading-relaxed mb-4' },
            'Transforming student subject registrations into an unweighted/weighted conflict graph G = (V, E) where vertices represent courses, edges represent shared student enrollments, and vertex coloring assigns conflict-free examination time slots.'
          ),
          h('div', { className: 'flex flex-wrap gap-3' }, [
            h('button', {
              className: 'btn btn-primary text-xs bg-white text-blue-900 hover:bg-blue-50 font-bold',
              onClick: () => onNavigateTab('timetable')
            }, '📅 View Timetable Schedule'),
            h('button', {
              className: 'btn btn-secondary text-xs bg-blue-700/60 text-white border-blue-400/30 hover:bg-blue-700',
              onClick: () => onNavigateTab('graph')
            }, '🕸️ Interactive Graph'),
            h('button', {
              className: 'btn btn-secondary text-xs bg-blue-700/60 text-white border-blue-400/30 hover:bg-blue-700',
              onClick: () => onNavigateTab('algorithms')
            }, '⚡ Compare Algorithms')
          ])
        ])
      ]),

      // 6 Stat Cards
      h('div', { key: 'stats', className: 'stat-grid' }, [
        h('div', { className: 'stat-card', onClick: () => onNavigateTab('students'), style: { cursor: 'pointer' } }, [
          h('div', { className: 'stat-icon-wrapper bg-blue-50 text-blue-600' }, '👨‍🎓'),
          h('div', null, [
            h('div', { className: 'stat-val' }, students.length),
            h('div', { className: 'stat-label' }, 'Registered Students')
          ])
        ]),
        h('div', { className: 'stat-card', onClick: () => onNavigateTab('subjects'), style: { cursor: 'pointer' } }, [
          h('div', { className: 'stat-icon-wrapper bg-indigo-50 text-indigo-600' }, '📚'),
          h('div', null, [
            h('div', { className: 'stat-val' }, graph.totalVertices),
            h('div', { className: 'stat-label' }, 'Subjects (|V| Vertices)')
          ])
        ]),
        h('div', { className: 'stat-card', onClick: () => onNavigateTab('conflicts'), style: { cursor: 'pointer' } }, [
          h('div', { className: 'stat-icon-wrapper bg-rose-50 text-rose-600' }, '⚡'),
          h('div', null, [
            h('div', { className: 'stat-val' }, graph.totalEdges),
            h('div', { className: 'stat-label' }, 'Conflict Pairs (|E| Edges)')
          ])
        ]),
        h('div', { className: 'stat-card', onClick: () => onNavigateTab('timetable'), style: { cursor: 'pointer' } }, [
          h('div', { className: 'stat-icon-wrapper bg-emerald-50 text-emerald-600' }, '🗓️'),
          h('div', null, [
            h('div', { className: 'stat-val' }, activeResult.totalColors),
            h('div', { className: 'stat-label' }, `Exam Slots (${activeAlgorithm})`)
          ])
        ]),
        h('div', { className: 'stat-card', onClick: () => onNavigateTab('analysis'), style: { cursor: 'pointer' } }, [
          h('div', { className: 'stat-icon-wrapper bg-amber-50 text-amber-600' }, 'χ(G)'),
          h('div', null, [
            h('div', { className: 'stat-val' }, chromaticNumber),
            h('div', { className: 'stat-label' }, 'Chromatic Number (Exact)')
          ])
        ]),
        h('div', { className: 'stat-card', onClick: () => onNavigateTab('algorithms'), style: { cursor: 'pointer' } }, [
          h('div', { className: 'stat-icon-wrapper bg-purple-50 text-purple-600' }, '⏱️'),
          h('div', null, [
            h('div', { className: 'stat-val text-sm' }, `${executionTime} ms`),
            h('div', { className: 'stat-label' }, 'Alg. Execution Time')
          ])
        ])
      ]),

      // Algorithm Quick Selector
      h('div', { key: 'algSelector', className: 'card flex flex-wrap items-center justify-between gap-4 p-4' }, [
        h('div', { className: 'flex items-center gap-2' }, [
          h('span', { className: 'text-sm font-bold text-slate-700' }, 'Active Timetabling Engine:'),
          h('div', { className: 'inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200' }, [
            h('button', {
              className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeAlgorithm === 'welsh-powell' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`,
              onClick: () => onSelectAlgorithm('welsh-powell')
            }, 'Welsh-Powell (Heuristic)'),
            h('button', {
              className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeAlgorithm === 'greedy' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`,
              onClick: () => onSelectAlgorithm('greedy')
            }, 'Greedy Coloring'),
            h('button', {
              className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeAlgorithm === 'backtracking' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`,
              onClick: () => onSelectAlgorithm('backtracking')
            }, 'Backtracking (Exact Minimum)')
          ])
        ]),
        h('div', { className: 'text-xs text-slate-500' }, [
          h('span', { className: 'font-semibold text-slate-700' }, `${activeResult.totalColors} Examination Slots`),
          ' required to eliminate all student conflicts.'
        ])
      ]),

      // Charts Row
      h('div', { key: 'charts', className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' }, [
        h('div', { className: 'card lg:col-span-2' }, [
          h('div', { className: 'card-title' }, [
            h('span', null, '📊 Student Enrollment Distribution per Course'),
            h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Total Registrations across Subjects')
          ]),
          h('div', { style: { height: '260px' } }, [
            h('canvas', { ref: enrollmentChartRef })
          ])
        ]),
        h('div', { className: 'card' }, [
          h('div', { className: 'card-title' }, [
            h('span', null, '🎯 Slot Load Share'),
            h('span', { className: 'text-xs text-slate-500 font-normal' }, `${timetable.slotCount} Active Slots`)
          ]),
          h('div', { style: { height: '260px' } }, [
            h('canvas', { ref: slotChartRef })
          ])
        ])
      ]),

      // Theoretical Summary Row
      h('div', { key: 'sumRow', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
        h('div', { className: 'card' }, [
          h('div', { className: 'card-title' }, [
            h('span', null, '🛡️ Mathematical Validation & Soundness'),
            h('span', { className: `badge ${timetable.isConflictFree ? 'badge-success' : 'badge-danger'}` },
              timetable.isConflictFree ? '100% Conflict-Free' : 'Conflicts Detected'
            )
          ]),
          h('p', { className: 'text-xs text-slate-600 mb-4' },
            'Every scheduled examination session is continuously verified against the conflict adjacency matrix. Two subjects are scheduled in the same slot if and only if they share 0 enrolled students.'
          ),
          h('div', { className: 'space-y-2 text-xs' }, [
            h('div', { className: 'flex justify-between py-1.5 border-b border-slate-100' }, [
              h('span', { className: 'text-slate-500' }, 'Sequential Scheduling (Naive Slots):'),
              h('span', { className: 'font-bold text-slate-800' }, `${graph.totalVertices} Slots (${graph.totalVertices * 0.5} Days)`)
            ]),
            h('div', { className: 'flex justify-between py-1.5 border-b border-slate-100' }, [
              h('span', { className: 'text-slate-500' }, 'Optimized Coloring Slots:'),
              h('span', { className: 'font-bold text-emerald-600' }, `${activeResult.totalColors} Slots (${Math.ceil(activeResult.totalColors / 2)} Days)`)
            ]),
            h('div', { className: 'flex justify-between py-1.5 border-b border-slate-100' }, [
              h('span', { className: 'text-slate-500' }, 'Examination Days Saved:'),
              h('span', { className: 'font-bold text-blue-600' }, `${(graph.totalVertices * 0.5) - Math.ceil(activeResult.totalColors / 2)} Days Saved (${(((graph.totalVertices - activeResult.totalColors) / (graph.totalVertices || 1)) * 100).toFixed(0)}% reduction)`)
            ]),
            h('div', { className: 'flex justify-between py-1.5' }, [
              h('span', { className: 'text-slate-500' }, 'Simultaneous Clash Count:'),
              h('span', { className: 'font-bold text-emerald-600' }, '0 Conflicts (Mathematically Proven)')
            ])
          ])
        ]),

        h('div', { className: 'card' }, [
          h('div', { className: 'card-title' }, [
            h('span', null, '📐 Graph Theoretical Properties'),
            h('span', { className: 'badge badge-info' }, `Density: ${metrics.densityPercent}%`)
          ]),
          h('p', { className: 'text-xs text-slate-600 mb-4' },
            'Properties calculated in real time from the dynamic student registration dataset.'
          ),
          h('div', { className: 'space-y-2 text-xs' }, [
            h('div', { className: 'flex justify-between py-1.5 border-b border-slate-100' }, [
              h('span', { className: 'text-slate-500' }, 'Maximum Degree Δ(G):'),
              h('span', { className: 'font-bold text-slate-800' }, `${metrics.maxDegree} (Subject with most conflicts)`)
            ]),
            h('div', { className: 'flex justify-between py-1.5 border-b border-slate-100' }, [
              h('span', { className: 'text-slate-500' }, 'Average Vertex Degree:'),
              h('span', { className: 'font-bold text-slate-800' }, `${metrics.avgDegree} conflicts/subject`)
            ]),
            h('div', { className: 'flex justify-between py-1.5 border-b border-slate-100' }, [
              h('span', { className: 'text-slate-500' }, 'Max Clique Size ω(G) [Lower Bound]:'),
              h('span', { className: 'font-bold text-purple-600' }, `ω = ${metrics.cliqueSizeLowerBound} (${metrics.maxClique.join(', ')})`)
            ]),
            h('div', { className: 'flex justify-between py-1.5' }, [
              h('span', { className: 'text-slate-500' }, 'Brooks’ Upper Bound:'),
              h('span', { className: 'font-bold text-slate-800' }, `χ(G) ≤ ${metrics.brooksUpperBound}`)
            ])
          ])
        ])
      ])
    ]);
  }

  // --- STUDENTS VIEW ---
  function StudentsView({ students, subjects, onAddStudent, onUpdateStudent, onDeleteStudent, onResetStudents }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const [formId, setFormId] = useState('');
    const [formName, setFormName] = useState('');
    const [formDept, setFormDept] = useState('Computer Science');
    const [formSem, setFormSem] = useState('Sem 4');
    const [formYear, setFormYear] = useState('2026-2027');
    const [formSubjects, setFormSubjects] = useState([]);
    const [formError, setFormError] = useState('');

    const filteredStudents = useMemo(() => {
      return students.filter((s) => {
        const matchSearch =
          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSubject = !selectedSubjectFilter || (s.subjects || []).includes(selectedSubjectFilter);
        return matchSearch && matchSubject;
      });
    }, [students, searchTerm, selectedSubjectFilter]);

    const openAddModal = () => {
      setEditingStudent(null);
      setFormId(`STU${String(students.length + 1).padStart(3, '0')}`);
      setFormName('');
      setFormDept('Computer Science');
      setFormSem('Sem 4');
      setFormYear('2026-2027');
      setFormSubjects([]);
      setFormError('');
      setModalOpen(true);
    };

    const openEditModal = (student) => {
      setEditingStudent(student);
      setFormId(student.id);
      setFormName(student.name);
      setFormDept(student.department);
      setFormSem(student.semester || 'Sem 4');
      setFormYear(student.academicYear || '2026-2027');
      setFormSubjects([...(student.subjects || [])]);
      setFormError('');
      setModalOpen(true);
    };

    const toggleSubject = (code) => {
      if (formSubjects.includes(code)) {
        setFormSubjects(formSubjects.filter((c) => c !== code));
      } else {
        setFormSubjects([...formSubjects, code]);
      }
    };

    const handleSave = (e) => {
      e.preventDefault();
      setFormError('');
      const trimmedId = formId.trim().toUpperCase();
      const trimmedName = formName.trim();

      if (!trimmedId) { setFormError('Student ID is required.'); return; }
      if (!trimmedName) { setFormError('Student name is required.'); return; }
      if (formSubjects.length < 1) { setFormError('Please select at least 1 registered subject.'); return; }

      if (!editingStudent && students.some((s) => s.id.toUpperCase() === trimmedId)) {
        setFormError(`Student ID "${trimmedId}" already exists.`);
        return;
      }

      const payload = {
        id: trimmedId,
        name: trimmedName,
        department: formDept,
        semester: formSem,
        academicYear: formYear,
        subjects: formSubjects
      };

      if (editingStudent) onUpdateStudent(editingStudent.id, payload);
      else onAddStudent(payload);
      setModalOpen(false);
    };

    return h('div', { className: 'space-y-6' }, [
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 card mb-0 p-5' }, [
        h('div', null, [
          h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Student Registrations'),
          h('p', { className: 'text-xs text-slate-500 mt-0.5' },
            `Managing ${students.length} student course enrollments. Every change automatically recalculates the conflict graph.`
          )
        ]),
        h('div', { className: 'flex items-center gap-3' }, [
          h('button', { className: 'btn btn-primary', onClick: openAddModal }, [
            h('span', { key: 'i' }, '➕'),
            h('span', { key: 't' }, 'Add New Student')
          ])
        ])
      ]),

      h('div', { className: 'card p-4 flex flex-col md:flex-row gap-4 items-center justify-between' }, [
        h('div', { className: 'relative w-full md:w-80' }, [
          h('input', {
            type: 'text',
            placeholder: 'Search by ID, name or department...',
            className: 'form-input pl-9',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }),
          h('span', { className: 'absolute left-3 top-2.5 text-slate-400 text-sm' }, '🔍')
        ]),
        h('div', { className: 'flex items-center gap-3 w-full md:w-auto' }, [
          h('span', { className: 'text-xs font-semibold text-slate-500 whitespace-nowrap' }, 'Filter by Subject:'),
          h('select', {
            className: 'form-select text-xs py-1.5',
            value: selectedSubjectFilter,
            onChange: (e) => setSelectedSubjectFilter(e.target.value)
          }, [
            h('option', { value: '' }, 'All Subjects'),
            subjects.map((sub) => h('option', { key: sub.code, value: sub.code }, `${sub.code} - ${sub.name}`))
          ]),
          (searchTerm || selectedSubjectFilter) && h('button', {
            className: 'btn btn-secondary btn-sm text-xs',
            onClick: () => { setSearchTerm(''); setSelectedSubjectFilter(''); }
          }, 'Clear')
        ])
      ]),

      h('div', { className: 'table-container bg-white shadow-sm' }, [
        h('table', { className: 'data-table' }, [
          h('thead', null, [
            h('tr', null, [
              h('th', { style: { width: '120px' } }, 'Student ID'),
              h('th', null, 'Full Name'),
              h('th', null, 'Department & Semester'),
              h('th', null, 'Registered Subjects'),
              h('th', { style: { width: '80px', textAlign: 'center' } }, 'Count'),
              h('th', { style: { width: '130px', textAlign: 'center' } }, 'Actions')
            ])
          ]),
          h('tbody', null,
            filteredStudents.length === 0
              ? h('tr', null, [h('td', { colSpan: 6, className: 'text-center py-8 text-slate-400 italic' }, 'No students found.')])
              : filteredStudents.map((st) =>
                  h('tr', { key: st.id }, [
                    h('td', { className: 'font-mono font-bold text-blue-700' }, st.id),
                    h('td', { className: 'font-medium text-slate-900' }, st.name),
                    h('td', null, [
                      h('div', { className: 'text-xs font-medium text-slate-800' }, st.department),
                      h('div', { className: 'text-[11px] text-slate-400' }, `${st.semester} • ${st.academicYear || '2026-2027'}`)
                    ]),
                    h('td', null, [
                      h('div', { className: 'flex flex-wrap gap-1.5' },
                        (st.subjects || []).map((c) =>
                          h('span', { key: c, className: 'badge badge-neutral bg-blue-50 text-blue-800 border border-blue-200' }, c)
                        )
                      )
                    ]),
                    h('td', { className: 'text-center font-bold text-slate-700' }, (st.subjects || []).length),
                    h('td', { className: 'text-center' }, [
                      h('div', { className: 'flex items-center justify-center gap-2' }, [
                        h('button', { className: 'btn btn-secondary btn-sm py-1 px-2 text-xs', onClick: () => openEditModal(st) }, '✏️ Edit'),
                        h('button', {
                          className: 'btn btn-danger btn-sm py-1 px-2 text-xs',
                          onClick: () => {
                            if (confirm(`Delete student ${st.name} (${st.id})?`)) onDeleteStudent(st.id);
                          }
                        }, '🗑️')
                      ])
                    ])
                  ])
                )
          )
        ])
      ]),

      modalOpen && h('div', { className: 'modal-overlay', onClick: () => setModalOpen(false) }, [
        h('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() }, [
          h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
            h('h3', { className: 'text-lg font-bold text-slate-800' }, editingStudent ? `Edit Student: ${editingStudent.id}` : 'Add New Student Record'),
            h('button', { className: 'text-slate-400 hover:text-slate-600 font-bold text-xl', onClick: () => setModalOpen(false) }, '✕')
          ]),
          formError && h('div', { className: 'p-3 mb-4 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200' }, `⚠️ ${formError}`),
          h('form', { onSubmit: handleSave, className: 'space-y-4' }, [
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' }, [
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Student ID *'),
                h('input', {
                  type: 'text', className: 'form-input uppercase font-mono', value: formId, disabled: !!editingStudent,
                  onChange: (e) => setFormId(e.target.value)
                })
              ]),
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Full Name *'),
                h('input', {
                  type: 'text', className: 'form-input', value: formName,
                  onChange: (e) => setFormName(e.target.value)
                })
              ])
            ]),
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' }, [
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Department'),
                h('input', { type: 'text', className: 'form-input', value: formDept, onChange: (e) => setFormDept(e.target.value) })
              ]),
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Semester'),
                h('input', { type: 'text', className: 'form-input', value: formSem, onChange: (e) => setFormSem(e.target.value) })
              ]),
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Academic Year'),
                h('input', { type: 'text', className: 'form-input', value: formYear, onChange: (e) => setFormYear(e.target.value) })
              ])
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-700 mb-1.5' }, `Select Registered Subjects (${formSubjects.length} selected) *`),
              h('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-2 border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-48 overflow-y-auto' },
                subjects.map((sub) => {
                  const isSel = formSubjects.includes(sub.code);
                  return h('div', {
                    key: sub.code, onClick: () => toggleSubject(sub.code),
                    className: `cursor-pointer p-2 rounded-lg border text-xs font-medium transition-all ${
                      isSel ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                    }`
                  }, [
                    h('div', { className: 'font-bold' }, sub.code),
                    h('div', { className: `text-[10px] truncate ${isSel ? 'text-blue-100' : 'text-slate-500'}` }, sub.name)
                  ]);
                })
              )
            ]),
            h('div', { className: 'flex justify-end gap-3 pt-4 border-t border-slate-200' }, [
              h('button', { type: 'button', className: 'btn btn-secondary text-xs', onClick: () => setModalOpen(false) }, 'Cancel'),
              h('button', { type: 'submit', className: 'btn btn-primary text-xs' }, editingStudent ? 'Save Changes' : 'Add Student')
            ])
          ])
        ])
      ])
    ]);
  }

  // --- SUBJECTS VIEW ---
  function SubjectsView({ subjects, graph, onAddSubject, onUpdateSubject, onDeleteSubject }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);

    const [formCode, setFormCode] = useState('');
    const [formName, setFormName] = useState('');
    const [formDept, setFormDept] = useState('Computer Science');
    const [formSem, setFormSem] = useState('Sem 4');
    const [formCredits, setFormCredits] = useState(4);
    const [formError, setFormError] = useState('');

    const openAddModal = () => {
      setEditingSubject(null);
      setFormCode('');
      setFormName('');
      setFormDept('Computer Science');
      setFormSem('Sem 4');
      setFormCredits(4);
      setFormError('');
      setModalOpen(true);
    };

    const openEditModal = (sub) => {
      setEditingSubject(sub);
      setFormCode(sub.code);
      setFormName(sub.name);
      setFormDept(sub.department || 'Computer Science');
      setFormSem(sub.semester || 'Sem 4');
      setFormCredits(sub.credits || 4);
      setFormError('');
      setModalOpen(true);
    };

    const handleSave = (e) => {
      e.preventDefault();
      setFormError('');
      const trimmedCode = formCode.trim().toUpperCase();
      const trimmedName = formName.trim();

      if (!trimmedCode) { setFormError('Subject code is required.'); return; }
      if (!trimmedName) { setFormError('Subject title is required.'); return; }
      if (!editingSubject && subjects.some((s) => s.code.toUpperCase() === trimmedCode)) {
        setFormError(`Subject code "${trimmedCode}" already exists.`);
        return;
      }

      const payload = {
        code: trimmedCode,
        name: trimmedName,
        department: formDept,
        semester: formSem,
        credits: Number(formCredits) || 3
      };

      if (editingSubject) onUpdateSubject(editingSubject.code, payload);
      else onAddSubject(payload);
      setModalOpen(false);
    };

    return h('div', { className: 'space-y-6' }, [
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 card mb-0 p-5' }, [
        h('div', null, [
          h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Subject / Course Management'),
          h('p', { className: 'text-xs text-slate-500 mt-0.5' },
            `Each subject corresponds to a Vertex v ∈ V in the conflict graph. Total: ${subjects.length} Vertices.`
          )
        ]),
        h('button', { className: 'btn btn-primary', onClick: openAddModal }, [
          h('span', { key: 'i' }, '➕'),
          h('span', { key: 't' }, 'Add New Subject')
        ])
      ]),

      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' },
        subjects.map((sub) => {
          const degree = graph.degrees[sub.code] || 0;
          const enrolled = graph.enrollmentMap[sub.code] || 0;
          const neighbors = (graph.adjList[sub.code] || []).map((i) => i.neighbor);

          return h('div', {
            key: sub.code,
            className: 'card mb-0 p-4 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between'
          }, [
            h('div', null, [
              h('div', { className: 'flex justify-between items-start mb-2' }, [
                h('span', { className: 'px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-mono font-extrabold text-sm' }, sub.code),
                h('span', { className: `badge ${degree > 4 ? 'badge-danger' : degree > 2 ? 'badge-warning' : 'badge-success'}` }, `Degree d: ${degree}`)
              ]),
              h('h3', { className: 'font-bold text-slate-900 text-sm mb-1 leading-snug' }, sub.name),
              h('div', { className: 'text-xs text-slate-500 mb-3' }, `${sub.department} • ${sub.semester || 'Sem 4'}`),
              h('div', { className: 'grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3 text-xs' }, [
                h('div', null, [
                  h('div', { className: 'text-slate-400 text-[10px] uppercase font-semibold' }, 'Enrollments'),
                  h('div', { className: 'font-bold text-slate-800' }, `${enrolled} students`)
                ]),
                h('div', null, [
                  h('div', { className: 'text-slate-400 text-[10px] uppercase font-semibold' }, 'Credits'),
                  h('div', { className: 'font-bold text-slate-800' }, `${sub.credits || 3} Credits`)
                ])
              ]),
              h('div', { className: 'mb-4' }, [
                h('div', { className: 'text-[11px] font-semibold text-slate-600 mb-1' }, 'Conflicts with:'),
                neighbors.length === 0
                  ? h('span', { className: 'text-[11px] text-emerald-600 italic' }, 'No conflicts (Isolated)')
                  : h('div', { className: 'flex flex-wrap gap-1' },
                      neighbors.map((nCode) =>
                        h('span', { key: nCode, className: 'px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-700 border border-red-200 font-semibold' }, nCode)
                      )
                    )
              ])
            ]),
            h('div', { className: 'flex items-center justify-between pt-3 border-t border-slate-100' }, [
              h('button', { className: 'btn btn-secondary btn-sm text-xs py-1 px-2.5', onClick: () => openEditModal(sub) }, '✏️ Edit'),
              h('button', {
                className: 'btn btn-danger btn-sm text-xs py-1 px-2.5',
                onClick: () => {
                  if (confirm(`Delete subject ${sub.code} - ${sub.name}?`)) onDeleteSubject(sub.code);
                }
              }, '🗑️ Delete')
            ])
          ]);
        })
      ),

      modalOpen && h('div', { className: 'modal-overlay', onClick: () => setModalOpen(false) }, [
        h('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() }, [
          h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
            h('h3', { className: 'text-lg font-bold text-slate-800' }, editingSubject ? `Edit Subject: ${editingSubject.code}` : 'Add New Subject (Vertex)'),
            h('button', { className: 'text-slate-400 hover:text-slate-600 font-bold text-xl', onClick: () => setModalOpen(false) }, '✕')
          ]),
          formError && h('div', { className: 'p-3 mb-4 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200' }, `⚠️ ${formError}`),
          h('form', { onSubmit: handleSave, className: 'space-y-4' }, [
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' }, [
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Subject Code (e.g., MATH, OS) *'),
                h('input', { type: 'text', className: 'form-input uppercase font-mono', value: formCode, disabled: !!editingSubject, onChange: (e) => setFormCode(e.target.value) })
              ]),
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Subject Full Title *'),
                h('input', { type: 'text', className: 'form-input', value: formName, onChange: (e) => setFormName(e.target.value) })
              ])
            ]),
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' }, [
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Department'),
                h('input', { type: 'text', className: 'form-input', value: formDept, onChange: (e) => setFormDept(e.target.value) })
              ]),
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Semester'),
                h('input', { type: 'text', className: 'form-input', value: formSem, onChange: (e) => setFormSem(e.target.value) })
              ]),
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Credits'),
                h('input', { type: 'number', min: 1, max: 10, className: 'form-input', value: formCredits, onChange: (e) => setFormCredits(e.target.value) })
              ])
            ]),
            h('div', { className: 'flex justify-end gap-3 pt-4 border-t border-slate-200' }, [
              h('button', { type: 'button', className: 'btn btn-secondary text-xs', onClick: () => setModalOpen(false) }, 'Cancel'),
              h('button', { type: 'submit', className: 'btn btn-primary text-xs' }, editingSubject ? 'Save Changes' : 'Create Subject')
            ])
          ])
        ])
      ])
    ]);
  }

  // --- IMPORT VIEW ---
  function ImportView({ subjects, students, onCommitImport, onRestoreDefaults, liveSheetUrl = '', onUpdateLiveSheetUrl, isLiveSyncing = false, autoSyncEnabled = false, onToggleAutoSync, onTriggerLiveSync, lastSyncTime = null }) {
    const [activeSubTab, setActiveSubTab] = useState('live-sync');
    const [importMode, setImportMode] = useState('replace');
    const [previewResult, setPreviewResult] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [inputUrl, setInputUrl] = useState(liveSheetUrl || '');

    const handleFileUpload = (file) => {
      setErrorMsg('');
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const rows = parseCSV(text);
          const result = validateImportedData(rows, subjects, students);
          if (!result.isValid) {
            setErrorMsg(result.error || 'Failed to parse CSV.');
            setPreviewResult(null);
          } else {
            setPreviewResult(result);
          }
        } catch (err) {
          setErrorMsg(`Parsing error: ${err.message}`);
          setPreviewResult(null);
        }
      };
      reader.readAsText(file);
    };

    const handleCommit = () => {
      if (!previewResult) return;
      const valid = previewResult.records.filter((r) => r.isValid).map((r) => ({
        id: r.id,
        name: r.name,
        department: r.department,
        semester: r.semester,
        academicYear: r.academicYear,
        subjects: r.subjects
      }));
      if (valid.length === 0) { alert('No valid student records found to import.'); return; }
      onCommitImport(valid, importMode);
      alert(`Imported ${valid.length} student records successfully.`);
      setPreviewResult(null);
    };

    return h('div', { className: 'space-y-6' }, [
      h('div', { className: 'card p-5 mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
        h('div', null, [
          h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Data Import & Google Forms Integration'),
          h('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Connect directly to your Google Sheet for real-time live response sync, or upload a CSV file.')
        ]),
        h('div', { className: 'flex flex-wrap gap-2' }, [
          h('button', {
            className: `btn btn-sm ${activeSubTab === 'live-sync' ? 'btn-primary' : 'btn-secondary'}`,
            onClick: () => setActiveSubTab('live-sync')
          }, '⚡ Live Google Sheet Sync'),
          h('button', {
            className: `btn btn-sm ${activeSubTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`,
            onClick: () => setActiveSubTab('upload')
          }, '📤 Upload CSV'),
          h('button', {
            className: `btn btn-sm ${activeSubTab === 'google-forms' ? 'btn-primary' : 'btn-secondary'}`,
            onClick: () => setActiveSubTab('google-forms')
          }, '📋 Google Forms Guide')
        ])
      ]),

      activeSubTab === 'live-sync' && h('div', { className: 'space-y-6' }, [
        h('div', { className: 'card p-6 border-2 border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 shadow-sm' }, [
          h('div', { className: 'flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200' }, [
            h('div', null, [
              h('div', { className: 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-2' }, [
                h('span', { className: 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' }),
                'REAL-TIME GOOGLE FORMS INTEGRATION'
              ]),
              h('h3', { className: 'text-lg font-bold text-slate-900' }, 'Live Google Sheets Response Sync'),
              h('p', { className: 'text-xs text-slate-600 mt-1' },
                'Whenever students submit the Google Form, Google Sheets saves the responses. ExamSlot fetches them directly in real-time!'
              )
            ]),

            h('div', { className: 'flex items-center gap-3' }, [
              h('label', { className: 'flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm' }, [
                h('input', {
                  type: 'checkbox',
                  checked: autoSyncEnabled,
                  onChange: (e) => onToggleAutoSync && onToggleAutoSync(e.target.checked)
                }),
                h('span', null, 'Auto-Sync Every 15s')
              ]),

              h('button', {
                className: 'btn btn-primary btn-sm flex items-center gap-1.5',
                disabled: isLiveSyncing || !inputUrl,
                onClick: () => {
                  if (onUpdateLiveSheetUrl) onUpdateLiveSheetUrl(inputUrl);
                  if (onTriggerLiveSync) onTriggerLiveSync(inputUrl);
                }
              }, [
                h('span', null, isLiveSyncing ? '⏳' : '🔄'),
                h('span', null, isLiveSyncing ? 'Syncing...' : 'Sync Responses Now')
              ])
            ])
          ]),

          h('div', { className: 'space-y-3' }, [
            h('label', { className: 'block text-xs font-bold text-slate-700 uppercase tracking-wide' },
              'Paste Your Linked Google Sheet URL or Sheet ID:'
            ),
            h('div', { className: 'flex flex-col sm:flex-row gap-2' }, [
              h('input', {
                type: 'text',
                className: 'form-input font-mono text-xs flex-1',
                placeholder: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5n.../edit',
                value: inputUrl,
                onChange: (e) => setInputUrl(e.target.value)
              }),
              h('button', {
                className: 'btn btn-secondary btn-sm text-xs',
                onClick: () => {
                  if (onUpdateLiveSheetUrl) onUpdateLiveSheetUrl(inputUrl);
                  if (onTriggerLiveSync) onTriggerLiveSync(inputUrl);
                }
              }, 'Save & Connect')
            ]),

            h('div', { className: 'p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5' }, [
              h('span', { className: 'text-base select-none' }, '💡'),
              h('div', { className: 'space-y-1' }, [
                h('div', { className: 'font-bold' }, 'How to enable real-time reading on your Google Sheet:'),
                h('div', { className: 'text-[11px] leading-relaxed text-blue-800' },
                  '1. Open your linked Google Sheet (where responses are saved) → Click the green ',
                  h('strong', null, 'Share'), ' button in the top right → Under General access, change to ',
                  h('strong', null, '“Anyone with the link can view”'), '. 2. Copy the URL from your browser address bar and paste it above!'
                )
              ])
            ]),

            lastSyncTime && h('div', { className: 'flex items-center gap-2 text-xs text-slate-600 pt-1' }, [
              h('span', { className: 'text-emerald-600 font-bold' }, '✓ Connected:'),
              h('span', null, `Last successfully synced at ${lastSyncTime}. (${students.length} student registrations currently loaded).`)
            ])
          ])
        ]),

        h('div', { className: 'card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50' }, [
          h('div', { className: 'text-xs text-slate-600' },
            'Want to test with the default sample student dataset (20 students across 7 courses)?'
          ),
          h('button', {
            className: 'btn btn-secondary btn-sm text-xs',
            onClick: () => {
              if (confirm('Restore default 7 subjects and 20 sample students?')) {
                onRestoreDefaults();
              }
            }
          }, '🔄 Restore Default 20-Student Dataset')
        ])
      ]),

      activeSubTab === 'upload' && h('div', { className: 'space-y-6' }, [
        h('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' }, [
          h('div', { className: 'lg:col-span-2' }, [
            h('div', {
              className: `border-2 border-dashed rounded-xl p-8 text-center transition-all bg-white ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
              }`,
              onDragOver: (e) => { e.preventDefault(); setIsDragging(true); },
              onDragLeave: () => setIsDragging(false),
              onDrop: (e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
              }
            }, [
              h('div', { className: 'text-4xl mb-3' }, '📁'),
              h('h3', { className: 'text-base font-bold text-slate-800 mb-1' }, 'Drag & drop student registration CSV here'),
              h('p', { className: 'text-xs text-slate-500 mb-4' }, 'Compatible with Google Forms responses exported from Google Sheets and Excel.'),
              h('label', { className: 'btn btn-primary btn-sm cursor-pointer' }, [
                h('span', null, 'Browse Local File'),
                h('input', {
                  type: 'file', accept: '.csv', className: 'hidden',
                  onChange: (e) => { if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]); }
                })
              ])
            ]),
            errorMsg && h('div', { className: 'mt-3 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200' }, `⚠️ ${errorMsg}`)
          ]),

          h('div', { className: 'card p-5 flex flex-col justify-between' }, [
            h('div', null, [
              h('h3', { className: 'font-bold text-slate-800 text-sm mb-2' }, 'Sample CSV Templates'),
              h('p', { className: 'text-xs text-slate-500 mb-4 leading-relaxed' }, 'Download pre-formatted templates to test importing and validation.'),
              h('div', { className: 'space-y-2' }, [
                h('button', {
                  className: 'btn btn-secondary btn-sm w-full text-xs justify-start',
                  onClick: () => downloadFile(generateSampleStudentsCSV(), 'sample_students_template.csv')
                }, '📄 Standard Registration CSV'),
                h('button', {
                  className: 'btn btn-secondary btn-sm w-full text-xs justify-start',
                  onClick: () => downloadFile(generateGoogleFormsSampleCSV(), 'google_forms_responses_sample.csv')
                }, '📊 Google Forms Export Sample CSV')
              ])
            ]),
            h('div', { className: 'mt-4 pt-3 border-t border-slate-100' }, [
              h('button', {
                className: 'btn btn-secondary btn-sm w-full text-xs text-slate-600',
                onClick: () => { if (confirm('Reset to the initial 7 subjects and 20 students dataset?')) onRestoreDefaults(); }
              }, '🔄 Restore Default 20-Student Dataset')
            ])
          ])
        ]),

        previewResult && h('div', { className: 'card p-5 space-y-4' }, [
          h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200' }, [
            h('div', null, [
              h('h3', { className: 'font-bold text-slate-800 text-base' }, 'Data Import Preview & Validation'),
              h('div', { className: 'flex items-center gap-3 text-xs text-slate-500 mt-1' }, [
                h('span', null, `Total: ${previewResult.totalRows}`),
                h('span', null, '•'),
                h('span', { className: 'text-emerald-600 font-semibold' }, `Valid: ${previewResult.validCount}`),
                h('span', null, '•'),
                h('span', { className: 'text-amber-600 font-semibold' }, `Duplicates: ${previewResult.duplicateCount}`),
                h('span', null, '•'),
                h('span', { className: 'text-rose-600 font-semibold' }, `Unknown: ${previewResult.invalidSubjectCount}`)
              ])
            ]),
            h('div', { className: 'flex items-center gap-3' }, [
              h('div', { className: 'flex items-center gap-2 bg-slate-100 p-1 rounded-lg text-xs' }, [
                h('label', { className: 'flex items-center gap-1 cursor-pointer px-2 py-1' }, [
                  h('input', { type: 'radio', name: 'm', checked: importMode === 'merge', onChange: () => setImportMode('merge') }),
                  h('span', null, 'Merge')
                ]),
                h('label', { className: 'flex items-center gap-1 cursor-pointer px-2 py-1' }, [
                  h('input', { type: 'radio', name: 'm', checked: importMode === 'replace', onChange: () => setImportMode('replace') }),
                  h('span', null, 'Replace All')
                ])
              ]),
              h('button', { className: 'btn btn-primary btn-sm', onClick: handleCommit }, `Commit Import (${previewResult.validCount} Students)`)
            ])
          ]),

          h('div', { className: 'table-container max-h-80' }, [
            h('table', { className: 'data-table' }, [
              h('thead', null, [
                h('tr', null, [
                  h('th', { style: { width: '50px' } }, 'Row'),
                  h('th', { style: { width: '100px' } }, 'Student ID'),
                  h('th', null, 'Name'),
                  h('th', null, 'Department'),
                  h('th', null, 'Subjects'),
                  h('th', null, 'Status')
                ])
              ]),
              h('tbody', null,
                previewResult.records.map((r) =>
                  h('tr', { key: r.rowIndex, className: r.isValid ? '' : 'bg-red-50/50' }, [
                    h('td', { className: 'text-slate-400 font-mono text-xs' }, `#${r.rowIndex}`),
                    h('td', { className: 'font-mono font-bold text-slate-800' }, r.id || 'N/A'),
                    h('td', { className: 'font-medium text-slate-800' }, r.name),
                    h('td', { className: 'text-xs text-slate-500' }, `${r.department} • ${r.semester}`),
                    h('td', null, [
                      h('div', { className: 'flex flex-wrap gap-1' },
                        r.subjects.map((sub) => h('span', { key: sub, className: 'badge badge-info text-[10px]' }, sub))
                      )
                    ]),
                    h('td', null, [
                      h('span', { className: `badge text-[10px] ${r.isValid ? 'badge-success' : 'badge-danger'}` }, r.status)
                    ])
                  ])
                )
              )
            ])
          ])
        ])
      ]),

      activeSubTab === 'google-forms' && h('div', { className: 'card p-6 space-y-4' }, [
        h('h3', { className: 'text-base font-bold text-slate-800' }, 'Google Forms Integration Workflow'),
        h('p', { className: 'text-xs text-slate-600 leading-relaxed' },
          'Google Forms allows students to submit course registrations online. Once collected, export responses as a CSV from Google Sheets and import directly into ExamSlot.'
        ),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-4 pt-2' }, [
          h('div', { className: 'p-4 rounded-xl border border-blue-200 bg-blue-50/50' }, [
            h('div', { className: 'w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-2' }, '1'),
            h('h4', { className: 'font-bold text-xs text-slate-900 mb-1' }, 'Create Google Form'),
            h('p', { className: 'text-[11px] text-slate-600' }, 'Include questions for Student ID, Full Name, Department, Semester, and Checkboxes for Registered Subjects.')
          ]),
          h('div', { className: 'p-4 rounded-xl border border-indigo-200 bg-indigo-50/50' }, [
            h('div', { className: 'w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-2' }, '2'),
            h('h4', { className: 'font-bold text-xs text-slate-900 mb-1' }, 'Link to Google Sheets'),
            h('p', { className: 'text-[11px] text-slate-600' }, 'In Google Forms under "Responses", click "Link to Sheets" to automatically collect student submissions in a spreadsheet.')
          ]),
          h('div', { className: 'p-4 rounded-xl border border-purple-200 bg-purple-50/50' }, [
            h('div', { className: 'w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs mb-2' }, '3'),
            h('h4', { className: 'font-bold text-xs text-slate-900 mb-1' }, 'Download CSV'),
            h('p', { className: 'text-[11px] text-slate-600' }, 'In Google Sheets, click File → Download → Comma Separated Values (.csv).')
          ]),
          h('div', { className: 'p-4 rounded-xl border border-emerald-200 bg-emerald-50/50' }, [
            h('div', { className: 'w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2' }, '4'),
            h('h4', { className: 'font-bold text-xs text-slate-900 mb-1' }, 'Drop into ExamSlot'),
            h('p', { className: 'text-[11px] text-slate-600' }, 'Upload the CSV to ExamSlot. It parses the multi-subject checkbox answers and verifies conflicts automatically.')
          ])
        ])
      ])
    ]);
  }

  // --- CONFLICTS VIEW ---
  function ConflictView({ graph, onNavigateTab }) {
    const [selectedPair, setSelectedPair] = useState(null);
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const subjectCodes = graph.subjectCodes;
    const matrix = graph.matrix;

    const filteredEdges = graph.edges.filter((edge) => {
      const matchSearch =
        edge.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edge.target.toLowerCase().includes(searchTerm.toLowerCase());
      let matchSeverity = true;
      if (filterSeverity === 'high') matchSeverity = edge.weight >= 3;
      else if (filterSeverity === 'medium') matchSeverity = edge.weight === 2;
      else if (filterSeverity === 'low') matchSeverity = edge.weight === 1;
      return matchSearch && matchSeverity;
    });

    const exportConflictsCSV = () => {
      const headers = ['Subject 1', 'Subject 2', 'Mutual Students Count', 'Common Student IDs'];
      const rows = graph.edges.map((e) => [
        e.source, e.target, e.weight, `"${e.commonStudents.map((s) => s.id).join('; ')}"`
      ]);
      downloadFile([headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n'), 'exam_conflict_pairs.csv');
    };

    return h('div', { className: 'space-y-6' }, [
      h('div', { className: 'card p-5 mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
        h('div', null, [
          h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Conflict Detection & Matrix Analysis'),
          h('p', { className: 'text-xs text-slate-500 mt-0.5' },
            `Computed ${graph.totalEdges} conflict pairs (edges) across ${graph.totalVertices} subjects.`
          )
        ]),
        h('div', { className: 'flex items-center gap-3' }, [
          h('button', { className: 'btn btn-secondary btn-sm text-xs', onClick: exportConflictsCSV }, '📥 Export CSV'),
          h('button', { className: 'btn btn-primary btn-sm text-xs', onClick: () => onNavigateTab('graph') }, '🕸️ View in Graph')
        ])
      ]),

      // Matrix
      h('div', { className: 'card p-5' }, [
        h('div', { className: 'card-title' }, [
          h('div', null, [
            h('span', null, '🔲 Conflict Adjacency Matrix A'),
            h('div', { className: 'text-xs text-slate-500 font-normal mt-0.5' }, 'Cell A[i][j] shows mutual student count. Click to inspect.')
          ]),
          h('div', { className: 'flex items-center gap-3 text-xs' }, [
            h('span', { className: 'flex items-center gap-1' }, [
              h('span', { className: 'w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block' }),
              h('span', null, '0')
            ]),
            h('span', { className: 'flex items-center gap-1' }, [
              h('span', { className: 'w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block' }),
              h('span', null, '1-2')
            ]),
            h('span', { className: 'flex items-center gap-1' }, [
              h('span', { className: 'w-3 h-3 rounded bg-red-200 border border-red-400 inline-block' }),
              h('span', null, '3+')
            ])
          ])
        ]),

        h('div', { className: 'overflow-x-auto pb-2' }, [
          h('table', { className: 'border-collapse text-xs text-center mx-auto' }, [
            h('thead', null, [
              h('tr', null, [
                h('th', { className: 'p-2 bg-slate-100 text-slate-500 font-bold border border-slate-200 w-16' }, 'CODE'),
                subjectCodes.map((code) => h('th', { key: code, className: 'p-2 bg-slate-100 font-mono font-bold text-slate-800 border border-slate-200 w-12' }, code))
              ])
            ]),
            h('tbody', null,
              subjectCodes.map((u, i) =>
                h('tr', { key: u }, [
                  h('th', { className: 'p-2 bg-slate-100 font-mono font-bold text-slate-800 border border-slate-200 text-left' }, u),
                  subjectCodes.map((v, j) => {
                    if (i === j) return h('td', { key: v, className: 'p-2 bg-slate-200 text-slate-400 font-mono border border-slate-300' }, '—');
                    const weight = matrix[i][j];
                    const details = graph.matrixDetails[i][j] || [];
                    let cellBg = 'bg-white hover:bg-slate-50 text-slate-400';
                    if (weight >= 3) cellBg = 'bg-red-100 hover:bg-red-200 text-red-900 font-extrabold cursor-pointer border-red-300';
                    else if (weight > 0) cellBg = 'bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold cursor-pointer border-amber-200';

                    return h('td', {
                      key: v, className: `p-2 border border-slate-200 transition-all ${cellBg}`,
                      onClick: () => {
                        if (weight > 0) setSelectedPair({ u, v, weight, commonStudents: details });
                      }
                    }, weight > 0 ? weight : '0');
                  })
                ])
              )
            )
          ])
        ])
      ]),

      // Conflict Pairs Table
      h('div', { className: 'card p-5' }, [
        h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4' }, [
          h('div', { className: 'card-title mb-0' }, [
            h('span', null, '⚡ Conflict Pairs & Edge Weights (|E|)'),
            h('span', { className: 'text-xs text-slate-500 font-normal ml-2' }, `Showing ${filteredEdges.length} of ${graph.totalEdges} edges`)
          ]),
          h('div', { className: 'flex items-center gap-3' }, [
            h('input', {
              type: 'text', placeholder: 'Search courses...', className: 'form-input text-xs py-1.5 w-44',
              value: searchTerm, onChange: (e) => setSearchTerm(e.target.value)
            }),
            h('select', {
              className: 'form-select text-xs py-1.5', value: filterSeverity,
              onChange: (e) => setFilterSeverity(e.target.value)
            }, [
              h('option', { value: 'all' }, 'All Severities'),
              h('option', { value: 'high' }, 'High (≥ 3)'),
              h('option', { value: 'medium' }, 'Medium (2)'),
              h('option', { value: 'low' }, 'Low (1)')
            ])
          ])
        ]),

        h('div', { className: 'table-container bg-white' }, [
          h('table', { className: 'data-table' }, [
            h('thead', null, [
              h('tr', null, [
                h('th', { style: { width: '120px' } }, 'Subject 1 (u)'),
                h('th', { style: { width: '120px' } }, 'Subject 2 (v)'),
                h('th', { style: { width: '110px', textAlign: 'center' } }, 'Weight (Mutual)'),
                h('th', { style: { width: '90px', textAlign: 'center' } }, 'Severity'),
                h('th', null, 'Common Students'),
                h('th', { style: { width: '90px', textAlign: 'center' } }, 'Action')
              ])
            ]),
            h('tbody', null,
              filteredEdges.map((e) =>
                h('tr', { key: e.id }, [
                  h('td', { className: 'font-mono font-bold text-blue-700' }, e.source),
                  h('td', { className: 'font-mono font-bold text-blue-700' }, e.target),
                  h('td', { className: 'text-center font-extrabold text-slate-900 text-sm' }, e.weight),
                  h('td', { className: 'text-center' }, [
                    h('span', { className: `badge text-[10px] ${e.weight >= 3 ? 'badge-danger' : e.weight === 2 ? 'badge-warning' : 'badge-info'}` },
                      e.weight >= 3 ? 'High' : e.weight === 2 ? 'Med' : 'Low'
                    )
                  ]),
                  h('td', null, [
                    h('div', { className: 'flex flex-wrap gap-1 text-xs' },
                      e.commonStudents.map((st) =>
                        h('span', { key: st.id, className: 'px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono text-slate-700 border border-slate-200' },
                          `${st.id} (${st.name})`
                        )
                      )
                    )
                  ]),
                  h('td', { className: 'text-center' }, [
                    h('button', {
                      className: 'btn btn-secondary btn-sm py-1 px-2 text-xs',
                      onClick: () => setSelectedPair({ u: e.source, v: e.target, weight: e.weight, commonStudents: e.commonStudents })
                    }, 'Inspect')
                  ])
                ])
              )
            )
          ])
        ])
      ]),

      selectedPair && h('div', { className: 'modal-overlay', onClick: () => setSelectedPair(null) }, [
        h('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() }, [
          h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
            h('div', null, [
              h('h3', { className: 'text-lg font-bold text-slate-800' }, `Conflict Edge: ${selectedPair.u} ⚡ ${selectedPair.v}`),
              h('p', { className: 'text-xs text-slate-500' }, `${selectedPair.weight} student(s) enrolled in both simultaneously.`)
            ]),
            h('button', { className: 'text-slate-400 hover:text-slate-600 font-bold text-xl', onClick: () => setSelectedPair(null) }, '✕')
          ]),
          h('div', { className: 'p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-800 mb-4' },
            `⚠️ Scheduling ${selectedPair.u} and ${selectedPair.v} at the same slot causes examination clashes for these ${selectedPair.weight} student(s):`
          ),
          h('div', { className: 'table-container mb-4' }, [
            h('table', { className: 'data-table' }, [
              h('thead', null, [
                h('tr', null, [
                  h('th', null, 'Student ID'),
                  h('th', null, 'Name'),
                  h('th', null, 'Department')
                ])
              ]),
              h('tbody', null,
                selectedPair.commonStudents.map((st) =>
                  h('tr', { key: st.id }, [
                    h('td', { className: 'font-mono font-bold text-blue-700' }, st.id),
                    h('td', { className: 'font-medium text-slate-800' }, st.name),
                    h('td', { className: 'text-xs text-slate-500' }, st.department)
                  ])
                )
              )
            ])
          ]),
          h('div', { className: 'flex justify-end pt-3 border-t border-slate-200' }, [
            h('button', { className: 'btn btn-secondary text-xs', onClick: () => setSelectedPair(null) }, 'Close')
          ])
        ])
      ])
    ]);
  }

  // --- GRAPH VIEW ---
  function GraphView({ graph, subjects, activeAlgorithm, activeResult, onSelectAlgorithm, onNavigateTab }) {
    const containerRef = useRef(null);
    const canvasInstanceRef = useRef(null);
    const [selectedNodeCode, setSelectedNodeCode] = useState(null);
    const [selectedEdgeData, setSelectedEdgeData] = useState(null);
    const [isPhysicsRunning, setIsPhysicsRunning] = useState(true);

    useEffect(() => {
      if (!containerRef.current) return;
      const instance = createGraphCanvas({
        container: containerRef.current,
        graph,
        coloring: activeResult.coloring,
        palette: COLOR_PALETTE,
        onSelectNode: (code) => { setSelectedNodeCode(code); setSelectedEdgeData(null); },
        onSelectEdge: (edge) => { setSelectedEdgeData(edge); setSelectedNodeCode(null); }
      });
      canvasInstanceRef.current = instance;
      return () => { if (instance && instance.destroy) instance.destroy(); };
    }, [graph, activeResult]);

    const selectedSubject = selectedNodeCode ? subjects.find((s) => s.code === selectedNodeCode) : null;
    const selectedNodeSlot = selectedNodeCode ? activeResult.coloring[selectedNodeCode] : null;
    const selectedNodeColor = selectedNodeSlot ? COLOR_PALETTE[(selectedNodeSlot - 1) % COLOR_PALETTE.length] : null;
    const neighbors = selectedNodeCode ? graph.adjList[selectedNodeCode] || [] : [];

    return h('div', { className: 'space-y-6' }, [
      h('div', { className: 'card p-4 mb-0 flex flex-wrap items-center justify-between gap-4' }, [
        h('div', null, [
          h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Interactive Conflict Graph G = (V, E)'),
          h('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Vertices colored by examination slot. Conflict edges represent simultaneous exam clashes.')
        ]),
        h('div', { className: 'flex flex-wrap items-center gap-2' }, [
          h('div', { className: 'inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs' }, [
            h('button', {
              className: `px-2.5 py-1 rounded-md font-semibold ${activeAlgorithm === 'welsh-powell' ? 'bg-blue-600 text-white' : 'text-slate-600'}`,
              onClick: () => onSelectAlgorithm('welsh-powell')
            }, 'Welsh-Powell'),
            h('button', {
              className: `px-2.5 py-1 rounded-md font-semibold ${activeAlgorithm === 'greedy' ? 'bg-blue-600 text-white' : 'text-slate-600'}`,
              onClick: () => onSelectAlgorithm('greedy')
            }, 'Greedy'),
            h('button', {
              className: `px-2.5 py-1 rounded-md font-semibold ${activeAlgorithm === 'backtracking' ? 'bg-blue-600 text-white' : 'text-slate-600'}`,
              onClick: () => onSelectAlgorithm('backtracking')
            }, 'Backtracking')
          ]),
          h('span', { className: 'text-slate-300' }, '|'),
          h('button', { className: 'btn btn-secondary btn-sm py-1 px-2.5 text-xs', onClick: () => canvasInstanceRef.current && canvasInstanceRef.current.zoomIn() }, '🔍+ In'),
          h('button', { className: 'btn btn-secondary btn-sm py-1 px-2.5 text-xs', onClick: () => canvasInstanceRef.current && canvasInstanceRef.current.zoomOut() }, '🔍- Out'),
          h('button', { className: 'btn btn-secondary btn-sm py-1 px-2.5 text-xs', onClick: () => canvasInstanceRef.current && canvasInstanceRef.current.resetView() }, '🎯 Center'),
          h('button', {
            className: `btn btn-sm py-1 px-2.5 text-xs ${isPhysicsRunning ? 'btn-secondary' : 'btn-primary'}`,
            onClick: () => {
              if (canvasInstanceRef.current) setIsPhysicsRunning(canvasInstanceRef.current.togglePhysics());
            }
          }, isPhysicsRunning ? '⏸️ Freeze' : '▶️ Run')
        ])
      ]),

      h('div', { className: 'grid grid-cols-1 lg:grid-cols-4 gap-6' }, [
        h('div', { className: 'lg:col-span-3 card p-0 overflow-hidden relative border border-slate-200' }, [
          h('div', { ref: containerRef, className: 'w-full bg-slate-50', style: { height: '560px' } }),
          h('div', { className: 'absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-[11px] text-slate-600 flex items-center gap-2 pointer-events-none' }, [
            h('span', { className: 'font-semibold text-blue-700' }, '💡 Controls:'),
            h('span', null, 'Drag nodes • Scroll to zoom • Drag canvas to pan • Click node/edge to inspect')
          ])
        ]),

        h('div', { className: 'card p-5 flex flex-col justify-between' }, [
          h('div', null, [
            h('h3', { className: 'font-bold text-slate-800 text-sm mb-3 flex items-center gap-2 border-b border-slate-200 pb-2' }, '🔍 Graph Element Inspector'),
            selectedNodeCode && selectedSubject && h('div', { className: 'space-y-4' }, [
              h('div', { className: 'p-3 rounded-lg border border-slate-200 bg-slate-50' }, [
                h('div', { className: 'flex justify-between items-start mb-1' }, [
                  h('div', { className: 'font-mono text-lg font-black text-slate-900' }, selectedNodeCode),
                  selectedNodeColor && h('span', {
                    className: 'badge text-xs',
                    style: { backgroundColor: selectedNodeColor.light, color: selectedNodeColor.text }
                  }, `Slot ${selectedNodeSlot}`)
                ]),
                h('div', { className: 'font-bold text-slate-800 text-xs' }, selectedSubject.name),
                h('div', { className: 'text-[11px] text-slate-500' }, selectedSubject.department)
              ]),
              h('div', { className: 'grid grid-cols-2 gap-2 text-center text-xs' }, [
                h('div', { className: 'p-2 bg-blue-50 rounded border border-blue-100' }, [
                  h('div', { className: 'text-[10px] text-blue-600 uppercase font-semibold' }, 'Vertex Degree'),
                  h('div', { className: 'font-bold text-blue-900 text-sm' }, `d = ${graph.degrees[selectedNodeCode] || 0}`)
                ]),
                h('div', { className: 'p-2 bg-emerald-50 rounded border border-emerald-100' }, [
                  h('div', { className: 'text-[10px] text-emerald-600 uppercase font-semibold' }, 'Students'),
                  h('div', { className: 'font-bold text-emerald-900 text-sm' }, `${graph.enrollmentMap[selectedNodeCode] || 0} enrolled`)
                ])
              ]),
              h('div', null, [
                h('div', { className: 'text-xs font-bold text-slate-700 mb-2' }, `Conflicting Neighbors (${neighbors.length}):`),
                neighbors.length === 0
                  ? h('div', { className: 'text-xs text-emerald-600 italic' }, 'No conflicts.')
                  : h('div', { className: 'space-y-1.5 max-h-48 overflow-y-auto pr-1' },
                      neighbors.map((nbr) =>
                        h('div', { key: nbr.neighbor, className: 'flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs' }, [
                          h('span', { className: 'font-mono font-bold text-slate-800' }, nbr.neighbor),
                          h('span', { className: 'text-[11px] font-semibold text-rose-600' }, `${nbr.weight} student${nbr.weight > 1 ? 's' : ''}`)
                        ])
                      )
                    )
              ])
            ]),

            selectedEdgeData && h('div', { className: 'space-y-3' }, [
              h('div', { className: 'p-3 rounded-lg border border-red-200 bg-red-50 text-red-900 text-xs' }, [
                h('div', { className: 'font-bold mb-1' }, 'Conflict Edge Selected'),
                h('div', { className: 'font-mono font-bold text-base text-red-800' }, `${selectedEdgeData.source} ⚡ ${selectedEdgeData.target}`),
                h('div', { className: 'mt-1' }, `${selectedEdgeData.weight} student(s) enrolled in both courses.`)
              ]),
              h('div', null, [
                h('div', { className: 'text-xs font-bold text-slate-700 mb-1.5' }, 'Common Students:'),
                h('div', { className: 'space-y-1 max-h-56 overflow-y-auto pr-1 text-xs' },
                  selectedEdgeData.commonStudents.map((st) =>
                    h('div', { key: st.id, className: 'p-2 bg-white rounded border border-slate-200 text-[11px]' }, [
                      h('span', { className: 'font-mono font-bold text-blue-700 mr-2' }, st.id),
                      h('span', { className: 'text-slate-800 font-medium' }, st.name)
                    ])
                  )
                )
              ])
            ]),

            !selectedNodeCode && !selectedEdgeData && h('div', { className: 'text-center py-12 text-slate-400' }, [
              h('div', { className: 'text-3xl mb-2' }, '👆'),
              h('p', { className: 'text-xs' }, 'Click on any subject vertex or conflict edge to inspect details.')
            ])
          ]),

          h('div', { className: 'pt-4 border-t border-slate-100' }, [
            h('button', { className: 'btn btn-primary btn-sm w-full text-xs', onClick: () => onNavigateTab('timetable') }, '📅 View Timetable Slots')
          ])
        ])
      ]),

      // Legend
      h('div', { className: 'card p-4' }, [
        h('div', { className: 'text-xs font-bold uppercase tracking-wider text-slate-500 mb-3' },
          `Examination Slot Color Legend (${activeResult.totalColors} Distinct Colors Used)`
        ),
        h('div', { className: 'grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3' },
          Array.from({ length: activeResult.totalColors }, (_, i) => i + 1).map((slotNum) => {
            const colorInfo = COLOR_PALETTE[(slotNum - 1) % COLOR_PALETTE.length];
            const subjectsInSlot = Object.entries(activeResult.coloring).filter(([_, s]) => s === slotNum).map(([c]) => c);

            return h('div', { key: slotNum, className: 'flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 bg-white' }, [
              h('div', {
                className: 'w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm',
                style: { backgroundColor: colorInfo.hex }
              }, slotNum),
              h('div', { className: 'overflow-hidden' }, [
                h('div', { className: 'text-xs font-bold text-slate-800' }, `Slot ${slotNum}`),
                h('div', { className: 'text-[10px] text-slate-500 truncate font-mono' }, subjectsInSlot.join(', ') || 'Empty')
              ])
            ]);
          })
        )
      ])
    ]);
  }

  // --- ALGORITHMS VIEW ---
  function AlgorithmsView({ graph, subjects, allResults, activeAlgorithm, onSelectAlgorithm, onNavigateTab }) {
    const [selectedAlgTab, setSelectedAlgTab] = useState(activeAlgorithm || 'welsh-powell');

    const wpValidation = validateColoring(graph, allResults.welshPowell.coloring);
    const greedyValidation = validateColoring(graph, allResults.greedy.coloring);
    const btValidation = validateColoring(graph, allResults.backtracking.coloring);

    const selectedResult =
      selectedAlgTab === 'welsh-powell' ? allResults.welshPowell :
      selectedAlgTab === 'greedy' ? allResults.greedy : allResults.backtracking;

    return h('div', { className: 'space-y-6' }, [
      h('div', { className: 'card p-5 mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
        h('div', null, [
          h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Graph Coloring Algorithms: Heuristic vs Exact Analysis'),
          h('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Rigorous comparison between Welsh-Powell, Greedy heuristic, and Backtracking exact solver.')
        ]),
        h('button', {
          className: 'btn btn-primary btn-sm text-xs',
          onClick: () => { onSelectAlgorithm(selectedAlgTab); onNavigateTab('timetable'); }
        }, `📅 Apply ${selectedAlgTab.replace('-', ' ')} to Timetable`)
      ]),

      h('div', { className: 'p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs leading-relaxed flex items-start gap-3' }, [
        h('span', { className: 'text-lg select-none' }, '⚠️'),
        h('div', null, [
          h('span', { className: 'font-bold' }, 'Theoretical Complexity & Heuristic Bounds: '),
          'Graph Vertex Coloring is proven NP-hard. ',
          h('strong', null, 'Welsh-Powell'), ' and ', h('strong', null, 'Greedy'),
          ' are polynomial heuristics O(V²). They run in under 1ms and yield near-optimal timetables, but do NOT guarantee the absolute minimum chromatic number χ(G). ',
          h('strong', null, 'Backtracking'), ' guarantees the absolute optimal chromatic number χ(G) via branch-and-bound pruning, but has worst-case exponential complexity O(k^V).'
        ])
      ]),

      // Benchmark Table
      h('div', { className: 'card p-5' }, [
        h('div', { className: 'card-title' }, [
          h('span', null, '📊 Side-by-Side Algorithm Benchmark'),
          h('span', { className: 'text-xs text-slate-500 font-normal' }, `Graph: ${graph.totalVertices} Vertices, ${graph.totalEdges} Edges`)
        ]),
        h('div', { className: 'table-container' }, [
          h('table', { className: 'data-table' }, [
            h('thead', null, [
              h('tr', null, [
                h('th', null, 'Algorithm Name'),
                h('th', { style: { textAlign: 'center' } }, 'Category'),
                h('th', { style: { textAlign: 'center' } }, 'Slots / Colors'),
                h('th', { style: { textAlign: 'center' } }, 'Runtime'),
                h('th', { style: { textAlign: 'center' } }, 'Complexity'),
                h('th', { style: { textAlign: 'center' } }, 'Soundness'),
                h('th', { style: { textAlign: 'center' } }, 'Status')
              ])
            ]),
            h('tbody', null, [
              h('tr', { key: 'wp', className: activeAlgorithm === 'welsh-powell' ? 'bg-blue-50/50' : '' }, [
                h('td', { className: 'font-bold text-slate-900' }, 'Welsh-Powell Algorithm'),
                h('td', { className: 'text-center' }, [h('span', { className: 'badge badge-info text-[11px]' }, 'Degree Heuristic')]),
                h('td', { className: 'text-center font-extrabold text-blue-700 text-sm' }, allResults.welshPowell.totalColors),
                h('td', { className: 'text-center font-mono text-xs' }, `${allResults.welshPowell.executionTimeMs} ms`),
                h('td', { className: 'text-center font-mono text-xs text-slate-600' }, 'O(V log V + V²)'),
                h('td', { className: 'text-center' }, [
                  h('span', { className: `badge ${wpValidation.isValid ? 'badge-success' : 'badge-danger'} text-[10px]` },
                    wpValidation.isValid ? '✓ Valid (0 Clashes)' : '✗ Clashes'
                  )
                ]),
                h('td', { className: 'text-center' }, [
                  activeAlgorithm === 'welsh-powell'
                    ? h('span', { className: 'badge badge-primary bg-blue-600 text-white text-[10px]' }, 'Active')
                    : h('button', { className: 'btn btn-secondary btn-sm text-[11px] py-0.5 px-2', onClick: () => onSelectAlgorithm('welsh-powell') }, 'Select')
                ])
              ]),

              h('tr', { key: 'gr', className: activeAlgorithm === 'greedy' ? 'bg-blue-50/50' : '' }, [
                h('td', { className: 'font-bold text-slate-900' }, 'Greedy Graph Coloring'),
                h('td', { className: 'text-center' }, [h('span', { className: 'badge badge-neutral text-[11px]' }, 'Sequential Heuristic')]),
                h('td', { className: 'text-center font-extrabold text-blue-700 text-sm' }, allResults.greedy.totalColors),
                h('td', { className: 'text-center font-mono text-xs' }, `${allResults.greedy.executionTimeMs} ms`),
                h('td', { className: 'text-center font-mono text-xs text-slate-600' }, 'O(V² + E)'),
                h('td', { className: 'text-center' }, [
                  h('span', { className: `badge ${greedyValidation.isValid ? 'badge-success' : 'badge-danger'} text-[10px]` },
                    greedyValidation.isValid ? '✓ Valid (0 Clashes)' : '✗ Clashes'
                  )
                ]),
                h('td', { className: 'text-center' }, [
                  activeAlgorithm === 'greedy'
                    ? h('span', { className: 'badge badge-primary bg-blue-600 text-white text-[10px]' }, 'Active')
                    : h('button', { className: 'btn btn-secondary btn-sm text-[11px] py-0.5 px-2', onClick: () => onSelectAlgorithm('greedy') }, 'Select')
                ])
              ]),

              h('tr', { key: 'bt', className: activeAlgorithm === 'backtracking' ? 'bg-blue-50/50' : '' }, [
                h('td', { className: 'font-bold text-slate-900' }, 'Backtracking Exact Solver'),
                h('td', { className: 'text-center' }, [h('span', { className: 'badge badge-warning text-[11px]' }, 'Branch & Bound (Exact χ)')]),
                h('td', { className: 'text-center font-extrabold text-emerald-700 text-sm' }, `${allResults.backtracking.totalColors} (Optimal χ)`),
                h('td', { className: 'text-center font-mono text-xs' }, `${allResults.backtracking.executionTimeMs} ms`),
                h('td', { className: 'text-center font-mono text-xs text-slate-600' }, 'O(k^V) [Pruned]'),
                h('td', { className: 'text-center' }, [
                  h('span', { className: `badge ${btValidation.isValid ? 'badge-success' : 'badge-danger'} text-[10px]` },
                    btValidation.isValid ? '✓ Valid (0 Clashes)' : '✗ Clashes'
                  )
                ]),
                h('td', { className: 'text-center' }, [
                  activeAlgorithm === 'backtracking'
                    ? h('span', { className: 'badge badge-primary bg-blue-600 text-white text-[10px]' }, 'Active')
                    : h('button', { className: 'btn btn-secondary btn-sm text-[11px] py-0.5 px-2', onClick: () => onSelectAlgorithm('backtracking') }, 'Select')
                ])
              ])
            ])
          ])
        ])
      ]),

      // Step Trace
      h('div', { className: 'card p-5' }, [
        h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200' }, [
          h('div', null, [
            h('h3', { className: 'font-bold text-slate-800 text-base' }, 'Detailed Step-by-Step Execution Trace'),
            h('p', { className: 'text-xs text-slate-500' }, 'Inspect the exact vertex traversal order, degrees, and color decisions.')
          ]),
          h('div', { className: 'inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs' }, [
            h('button', {
              className: `px-3 py-1.5 rounded-md font-bold ${selectedAlgTab === 'welsh-powell' ? 'bg-blue-600 text-white' : 'text-slate-600'}`,
              onClick: () => setSelectedAlgTab('welsh-powell')
            }, 'Welsh-Powell Trace'),
            h('button', {
              className: `px-3 py-1.5 rounded-md font-bold ${selectedAlgTab === 'greedy' ? 'bg-blue-600 text-white' : 'text-slate-600'}`,
              onClick: () => setSelectedAlgTab('greedy')
            }, 'Greedy Trace'),
            h('button', {
              className: `px-3 py-1.5 rounded-md font-bold ${selectedAlgTab === 'backtracking' ? 'bg-blue-600 text-white' : 'text-slate-600'}`,
              onClick: () => setSelectedAlgTab('backtracking')
            }, 'Backtracking Trace')
          ])
        ]),

        h('div', { className: 'table-container' }, [
          h('table', { className: 'data-table' }, [
            h('thead', null, [
              h('tr', null, [
                h('th', { style: { width: '70px' } }, 'Step #'),
                h('th', { style: { width: '120px' } }, 'Subject'),
                h('th', { style: { width: '100px', textAlign: 'center' } }, 'Degree d(v)'),
                h('th', { style: { width: '130px', textAlign: 'center' } }, 'Slot Color'),
                h('th', null, 'Algorithmic Decision / Explanation')
              ])
            ]),
            h('tbody', null,
              selectedResult.steps.map((st) => {
                const colorInfo = COLOR_PALETTE[(st.assignedColor - 1) % COLOR_PALETTE.length];
                return h('tr', { key: st.step }, [
                  h('td', { className: 'font-mono text-xs text-slate-500 font-bold' }, `#${st.step}`),
                  h('td', { className: 'font-mono font-bold text-blue-700' }, st.vertex),
                  h('td', { className: 'text-center font-bold text-slate-800' }, st.degree),
                  h('td', { className: 'text-center' }, [
                    h('span', {
                      className: 'badge text-xs px-2.5 py-1',
                      style: { backgroundColor: colorInfo.light, color: colorInfo.text }
                    }, `Slot ${st.assignedColor}`)
                  ]),
                  h('td', { className: 'text-xs text-slate-600 leading-relaxed' }, st.explanation)
                ]);
              })
            )
          ])
        ])
      ])
    ]);
  }

  // --- TIMETABLE VIEW ---
  function TimetableView({ timetable, graph, subjects, activeAlgorithm, examSettings, onUpdateExamSettings, onManualMoveSubject, onResetManualAdjustments }) {
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [moveModalData, setMoveModalData] = useState(null);

    const [univName, setUnivName] = useState(examSettings.universityName);
    const [examTitle, setExamTitle] = useState(examSettings.examTitle);
    const [startDate, setStartDate] = useState(examSettings.startDate);
    const [morningTime, setMorningTime] = useState(examSettings.morningSession.time);
    const [afternoonTime, setAfternoonTime] = useState(examSettings.afternoonSession.time);
    const [skipSundays, setSkipSundays] = useState(examSettings.skipSundays);

    const handleOpenMoveModal = (subjectCode, currentSlot) => {
      const defaultTarget = currentSlot === 1 ? 2 : 1;
      const currentColoring = {};
      timetable.rows.forEach((r) => {
        r.subjects.forEach((s) => { currentColoring[s.code] = r.slotNumber; });
      });
      const validation = validateSubjectSlotMove(subjectCode, defaultTarget, currentColoring, graph);
      setMoveModalData({ subjectCode, currentSlot, targetSlot: defaultTarget, validation, currentColoring });
    };

    const handleChangeTargetSlot = (newTarget) => {
      if (!moveModalData) return;
      const targetSlotNum = Number(newTarget);
      const validation = validateSubjectSlotMove(moveModalData.subjectCode, targetSlotNum, moveModalData.currentColoring, graph);
      setMoveModalData({ ...moveModalData, targetSlot: targetSlotNum, validation });
    };

    const handleConfirmMove = () => {
      if (!moveModalData) return;
      onManualMoveSubject(moveModalData.subjectCode, moveModalData.targetSlot);
      setMoveModalData(null);
    };

    const handleSaveSettings = (e) => {
      e.preventDefault();
      onUpdateExamSettings({
        universityName: univName,
        examTitle,
        startDate,
        morningSession: { ...examSettings.morningSession, time: morningTime },
        afternoonSession: { ...examSettings.afternoonSession, time: afternoonTime },
        skipSundays
      });
      setSettingsModalOpen(false);
    };

    return h('div', { className: 'space-y-6' }, [
      h('div', { className: 'card p-5 mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
        h('div', null, [
          h('div', { className: 'flex items-center gap-2 mb-1' }, [
            h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Automated Examination Timetable'),
            h('span', { className: `badge ${timetable.isConflictFree ? 'badge-success' : 'badge-danger'} text-xs font-bold` },
              timetable.isConflictFree ? '✓ 100% Conflict-Free' : '⚠️ Clashes Present'
            )
          ]),
          h('p', { className: 'text-xs text-slate-500' },
            `Generated via ${activeAlgorithm.replace('-', ' ')} algorithm. ${timetable.slotCount} slots across ${Math.ceil(timetable.slotCount / 2)} exam days.`
          )
        ]),
        h('div', { className: 'flex flex-wrap items-center gap-2' }, [
          h('button', { className: 'btn btn-secondary btn-sm text-xs', onClick: () => setSettingsModalOpen(true) }, '⚙️ Settings'),
          h('button', {
            className: 'btn btn-secondary btn-sm text-xs',
            onClick: () => downloadFile(exportTimetableToCSV(timetable), `Exam_Timetable_${new Date().toISOString().slice(0, 10)}.csv`)
          }, '📄 Export CSV'),
          h('button', { className: 'btn btn-primary btn-sm text-xs', onClick: () => exportTimetableToPDF(timetable, graph) }, '🖨️ PDF / Print'),
          h('button', { className: 'btn btn-secondary btn-sm text-xs text-slate-500', onClick: onResetManualAdjustments }, '🔄 Reset Moves')
        ])
      ]),

      h('div', { className: 'space-y-4' },
        timetable.rows.map((row) =>
          h('div', {
            key: row.slotNumber,
            className: `card p-5 border-l-4 transition-all ${row.hasConflict ? 'border-l-red-500 bg-red-50/20' : 'border-l-blue-600 bg-white'}`
          }, [
            h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4' }, [
              h('div', { className: 'flex items-center gap-3' }, [
                h('div', {
                  className: 'w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-sm',
                  style: { backgroundColor: row.colorInfo ? row.colorInfo.hex : '#3b82f6' }
                }, `S${row.slotNumber}`),
                h('div', null, [
                  h('div', { className: 'text-sm font-bold text-slate-900 flex items-center gap-2' }, [
                    h('span', null, row.formattedDate),
                    h('span', { className: 'text-xs text-slate-400 font-normal' }, `(${row.dayName})`),
                    h('span', { className: 'badge badge-info text-[10px]' }, row.sessionType)
                  ]),
                  h('div', { className: 'text-xs text-slate-500 font-medium' }, row.sessionTime)
                ])
              ]),
              h('div', { className: 'flex items-center gap-3' }, [
                h('div', { className: 'text-right text-xs' }, [
                  h('div', { className: 'font-bold text-slate-800' }, `${row.totalStudents} Students`),
                  h('div', { className: 'text-slate-400 text-[10px]' }, `${row.subjects.length} parallel papers`)
                ]),
                row.hasConflict && h('span', { className: 'badge badge-danger text-xs font-bold' }, '⚠️ Conflict Warning')
              ])
            ]),

            row.hasConflict && h('div', { className: 'p-3 mb-4 rounded-lg bg-red-100 text-red-900 text-xs border border-red-300' }, [
              h('div', { className: 'font-bold mb-1' }, '⚠️ MANUAL RESCHEDULING CONFLICT:'),
              row.conflictingPairs.map((cp, idx) =>
                h('div', { key: idx, className: 'mt-0.5' },
                  `• ${cp.sub1} and ${cp.sub2} share ${cp.weight} student(s): ${cp.commonStudents.map((s) => s.id).join(', ')}`
                )
              )
            ]),

            h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' },
              row.subjects.map((sub) =>
                h('div', {
                  key: sub.code,
                  className: 'p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col justify-between transition-all'
                }, [
                  h('div', null, [
                    h('div', { className: 'flex justify-between items-start mb-1' }, [
                      h('span', { className: 'font-mono font-extrabold text-blue-700 text-sm' }, sub.code),
                      h('span', { className: 'text-[11px] font-semibold text-slate-500' }, `${sub.enrolledCount} enrolled`)
                    ]),
                    h('h4', { className: 'font-bold text-xs text-slate-900 mb-1 leading-snug' }, sub.name),
                    h('div', { className: 'text-[11px] text-slate-500' }, `${sub.department} • ${sub.semester}`)
                  ]),
                  h('div', { className: 'mt-3 pt-2 border-t border-slate-200 flex justify-end' }, [
                    h('button', {
                      className: 'btn btn-secondary btn-sm text-[11px] py-1 px-2.5',
                      onClick: () => handleOpenMoveModal(sub.code, row.slotNumber)
                    }, '↔️ Reschedule')
                  ])
                ])
              )
            )
          ])
        )
      ),

      moveModalData && h('div', { className: 'modal-overlay', onClick: () => setMoveModalData(null) }, [
        h('div', { className: 'modal-content max-w-lg', onClick: (e) => e.stopPropagation() }, [
          h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
            h('div', null, [
              h('h3', { className: 'text-base font-bold text-slate-800' }, `Reschedule Course: ${moveModalData.subjectCode}`),
              h('p', { className: 'text-xs text-slate-500' }, `Currently in Slot ${moveModalData.currentSlot}. Select new slot with live conflict check.`)
            ]),
            h('button', { className: 'text-slate-400 hover:text-slate-600 font-bold text-xl', onClick: () => setMoveModalData(null) }, '✕')
          ]),
          h('div', { className: 'space-y-4 mb-5' }, [
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-700 mb-1' }, 'Select Target Examination Slot:'),
              h('select', {
                className: 'form-select text-xs font-bold',
                value: moveModalData.targetSlot,
                onChange: (e) => handleChangeTargetSlot(e.target.value)
              },
                Array.from({ length: timetable.slotCount }, (_, i) => i + 1).map((sNum) =>
                  h('option', { key: sNum, value: sNum }, `Slot ${sNum} ${sNum === moveModalData.currentSlot ? '(Current)' : ''}`)
                )
              )
            ]),

            moveModalData.validation.isAllowed
              ? h('div', { className: 'p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800' }, [
                  h('div', { className: 'font-bold mb-0.5' }, '✓ Safe to Move (0 Conflicts)'),
                  h('div', null, `Subject ${moveModalData.subjectCode} shares 0 mutual students with courses in Slot ${moveModalData.targetSlot}.`)
                ])
              : h('div', { className: 'p-3 rounded-lg bg-red-50 border border-red-300 text-xs text-red-900' }, [
                  h('div', { className: 'font-bold mb-1' }, '⚠️ CONFLICT WARNING: Simultaneous Exam Clash!'),
                  h('p', { className: 'mb-2' }, `Moving to Slot ${moveModalData.targetSlot} clashes with:`),
                  h('div', { className: 'space-y-1.5 bg-white p-2.5 rounded border border-red-200 max-h-36 overflow-y-auto' },
                    moveModalData.validation.conflicts.map((c, i) =>
                      h('div', { key: i, className: 'text-[11px]' }, [
                        h('div', { className: 'font-bold text-red-800' }, `• Clashes with ${c.targetSubject} (${c.weight} student${c.weight > 1 ? 's' : ''})`),
                        h('div', { className: 'text-slate-600 font-mono mt-0.5 pl-2' }, `Affected: ${c.commonStudents.map((s) => s.id).join(', ')}`)
                      ])
                    )
                  )
                ])
          ]),
          h('div', { className: 'flex justify-end gap-3 pt-3 border-t border-slate-200' }, [
            h('button', { className: 'btn btn-secondary text-xs', onClick: () => setMoveModalData(null) }, 'Cancel'),
            h('button', {
              className: `btn text-xs ${moveModalData.validation.isAllowed ? 'btn-primary' : 'btn-danger'}`,
              onClick: handleConfirmMove
            }, moveModalData.validation.isAllowed ? 'Confirm Safe Move' : 'Force Move Anyway')
          ])
        ])
      ]),

      settingsModalOpen && h('div', { className: 'modal-overlay', onClick: () => setSettingsModalOpen(false) }, [
        h('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() }, [
          h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
            h('h3', { className: 'text-base font-bold text-slate-800' }, 'Examination Schedule Settings'),
            h('button', { className: 'text-slate-400 hover:text-slate-600 font-bold text-xl', onClick: () => setSettingsModalOpen(false) }, '✕')
          ]),
          h('form', { onSubmit: handleSaveSettings, className: 'space-y-4' }, [
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'University / Institution Name'),
              h('input', { type: 'text', className: 'form-input', value: univName, onChange: (e) => setUnivName(e.target.value) })
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Examination Title'),
              h('input', { type: 'text', className: 'form-input', value: examTitle, onChange: (e) => setExamTitle(e.target.value) })
            ]),
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3' }, [
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Start Date'),
                h('input', { type: 'date', className: 'form-input', value: startDate, onChange: (e) => setStartDate(e.target.value) })
              ]),
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Morning Window'),
                h('input', { type: 'text', className: 'form-input', value: morningTime, onChange: (e) => setMorningTime(e.target.value) })
              ]),
              h('div', null, [
                h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Afternoon Window'),
                h('input', { type: 'text', className: 'form-input', value: afternoonTime, onChange: (e) => setAfternoonTime(e.target.value) })
              ])
            ]),
            h('div', { className: 'pt-2' }, [
              h('label', { className: 'flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700' }, [
                h('input', { type: 'checkbox', checked: skipSundays, onChange: (e) => setSkipSundays(e.target.checked) }),
                h('span', null, 'Skip Sundays automatically')
              ])
            ]),
            h('div', { className: 'flex justify-end gap-3 pt-3 border-t border-slate-200' }, [
              h('button', { type: 'button', className: 'btn btn-secondary text-xs', onClick: () => setSettingsModalOpen(false) }, 'Cancel'),
              h('button', { type: 'submit', className: 'btn btn-primary text-xs' }, 'Apply Settings')
            ])
          ])
        ])
      ])
    ]);
  }

  // --- ANALYSIS VIEW ---
  function AnalysisView({ graph, subjects, allResults, metrics, timetable }) {
    const compChartRef = useRef(null);
    const timeChartRef = useRef(null);
    const degreeChartRef = useRef(null);

    useEffect(() => {
      let compChart = null, timeChart = null, degreeChart = null;
      if (window.Chart) {
        if (compChartRef.current) {
          compChart = new window.Chart(compChartRef.current, {
            type: 'bar',
            data: {
              labels: ['Welsh-Powell', 'Greedy', 'Backtracking (Exact)'],
              datasets: [{
                label: 'Slots Required',
                data: [allResults.welshPowell.totalColors, allResults.greedy.totalColors, allResults.backtracking.totalColors],
                backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
                borderRadius: 6
              }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
          });
        }
        if (timeChartRef.current) {
          timeChart = new window.Chart(timeChartRef.current, {
            type: 'bar',
            data: {
              labels: ['Welsh-Powell', 'Greedy', 'Backtracking (Exact)'],
              datasets: [{
                label: 'Runtime (ms)',
                data: [allResults.welshPowell.executionTimeMs, allResults.greedy.executionTimeMs, allResults.backtracking.executionTimeMs],
                backgroundColor: ['#60a5fa', '#a78bfa', '#34d399'],
                borderRadius: 6
              }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
          });
        }
        if (degreeChartRef.current) {
          const sorted = [...graph.subjectCodes].sort((a, b) => (graph.degrees[b] || 0) - (graph.degrees[a] || 0));
          degreeChart = new window.Chart(degreeChartRef.current, {
            type: 'bar',
            data: {
              labels: sorted,
              datasets: [{
                label: 'Vertex Degree d(v)',
                data: sorted.map((c) => graph.degrees[c] || 0),
                backgroundColor: '#f59e0b',
                borderRadius: 6
              }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
          });
        }
      }
      return () => {
        if (compChart) compChart.destroy();
        if (timeChart) timeChart.destroy();
        if (degreeChart) degreeChart.destroy();
      };
    }, [allResults, graph]);

    const naiveSlots = graph.totalVertices;
    const optimalSlots = allResults.backtracking.totalColors;
    const reductionPercent = naiveSlots > 0 ? (((naiveSlots - optimalSlots) / naiveSlots) * 100).toFixed(1) : 0;

    return h('div', { className: 'space-y-6' }, [
      h('div', { className: 'card p-5 mb-0' }, [
        h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Graph Theory & Timetable Efficiency Analysis'),
        h('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Quantitative density, connected components, and algorithmic complexity metrics.')
      ]),

      h('div', { className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3' }, [
        h('div', { className: 'card p-3.5 mb-0 text-center' }, [
          h('div', { className: 'text-slate-400 text-[10px] uppercase font-bold tracking-wider' }, 'Vertices |V|'),
          h('div', { className: 'text-2xl font-extrabold text-blue-700 mt-1' }, metrics.vertexCount),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Subjects')
        ]),
        h('div', { className: 'card p-3.5 mb-0 text-center' }, [
          h('div', { className: 'text-slate-400 text-[10px] uppercase font-bold tracking-wider' }, 'Edges |E|'),
          h('div', { className: 'text-2xl font-extrabold text-indigo-700 mt-1' }, metrics.edgeCount),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Conflict Pairs')
        ]),
        h('div', { className: 'card p-3.5 mb-0 text-center' }, [
          h('div', { className: 'text-slate-400 text-[10px] uppercase font-bold tracking-wider' }, 'Density D'),
          h('div', { className: 'text-2xl font-extrabold text-emerald-700 mt-1' }, `${metrics.densityPercent}%`),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, '2|E| / |V|(|V|-1)')
        ]),
        h('div', { className: 'card p-3.5 mb-0 text-center' }, [
          h('div', { className: 'text-slate-400 text-[10px] uppercase font-bold tracking-wider' }, 'Avg Degree d̄'),
          h('div', { className: 'text-2xl font-extrabold text-amber-700 mt-1' }, metrics.avgDegree),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, `Max Δ = ${metrics.maxDegree}`)
        ]),
        h('div', { className: 'card p-3.5 mb-0 text-center' }, [
          h('div', { className: 'text-slate-400 text-[10px] uppercase font-bold tracking-wider' }, 'Components'),
          h('div', { className: 'text-2xl font-extrabold text-purple-700 mt-1' }, metrics.connectedComponentsCount),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Subgraphs')
        ]),
        h('div', { className: 'card p-3.5 mb-0 text-center' }, [
          h('div', { className: 'text-slate-400 text-[10px] uppercase font-bold tracking-wider' }, 'Chromatic χ(G)'),
          h('div', { className: 'text-2xl font-extrabold text-rose-700 mt-1' }, optimalSlots),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Exact Minimum')
        ])
      ]),

      h('div', { className: 'card p-5' }, [
        h('div', { className: 'card-title' }, [
          h('span', null, '⚡ Conflict Elimination & Timetable Compression Efficiency'),
          h('span', { className: 'badge badge-success' }, `${reductionPercent}% Slot Reduction`)
        ]),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3' }, [
          h('div', { className: 'p-3 bg-slate-50 rounded-lg border border-slate-200' }, [
            h('div', { className: 'text-slate-500 font-semibold mb-1' }, 'Naive Sequential Scheduling:'),
            h('div', { className: 'text-lg font-bold text-slate-800' }, `${naiveSlots} Slots (${naiveSlots * 0.5} Days)`),
            h('div', { className: 'text-[11px] text-slate-500 mt-1' }, 'Each subject allocated its own exclusive slot. Zero parallel papers.')
          ]),
          h('div', { className: 'p-3 bg-emerald-50 rounded-lg border border-emerald-200' }, [
            h('div', { className: 'text-emerald-800 font-semibold mb-1' }, 'Graph Coloring Timetable:'),
            h('div', { className: 'text-lg font-bold text-emerald-700' }, `${optimalSlots} Slots (${Math.ceil(optimalSlots / 2)} Days)`),
            h('div', { className: 'text-[11px] text-emerald-600 mt-1' }, 'Parallel independent sets scheduled simultaneously without single conflict.')
          ]),
          h('div', { className: 'p-3 bg-blue-50 rounded-lg border border-blue-200' }, [
            h('div', { className: 'text-blue-800 font-semibold mb-1' }, 'Net Institutional Benefit:'),
            h('div', { className: 'text-lg font-bold text-blue-700' }, `${naiveSlots - optimalSlots} Sessions Saved (${(naiveSlots * 0.5) - Math.ceil(optimalSlots / 2)} Days)`),
            h('div', { className: 'text-[11px] text-blue-600 mt-1' }, 'Massive reduction in invigilator hours and exam room overhead.')
          ])
        ])
      ]),

      h('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' }, [
        h('div', { className: 'card' }, [
          h('div', { className: 'card-title' }, [
            h('span', null, '🎨 Examination Slots Used'),
            h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Lower is Better')
          ]),
          h('div', { style: { height: '240px' } }, [h('canvas', { ref: compChartRef })])
        ]),
        h('div', { className: 'card' }, [
          h('div', { className: 'card-title' }, [
            h('span', null, '⏱️ Execution Runtime (ms)'),
            h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Lower is Faster')
          ]),
          h('div', { style: { height: '240px' } }, [h('canvas', { ref: timeChartRef })])
        ]),
        h('div', { className: 'card' }, [
          h('div', { className: 'card-title' }, [
            h('span', null, '📶 Subject Vertex Degrees d(v)'),
            h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Descending Order')
          ]),
          h('div', { style: { height: '240px' } }, [h('canvas', { ref: degreeChartRef })])
        ])
      ]),

      h('div', { className: 'card p-5' }, [
        h('div', { className: 'card-title' }, [
          h('span', null, '📋 Vertex Degree Specification per Subject'),
          h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Incident edges in conflict graph')
        ]),
        h('div', { className: 'table-container' }, [
          h('table', { className: 'data-table' }, [
            h('thead', null, [
              h('tr', null, [
                h('th', { style: { width: '100px' } }, 'Code'),
                h('th', null, 'Subject Name'),
                h('th', { style: { width: '110px', textAlign: 'center' } }, 'Degree d(v)'),
                h('th', { style: { width: '110px', textAlign: 'center' } }, 'Enrollment'),
                h('th', null, 'Conflicting Subjects List')
              ])
            ]),
            h('tbody', null,
              [...subjects].sort((a, b) => (graph.degrees[b.code] || 0) - (graph.degrees[a.code] || 0)).map((sub) => {
                const degree = graph.degrees[sub.code] || 0;
                const nbrs = (graph.adjList[sub.code] || []).map((i) => i.neighbor);
                return h('tr', { key: sub.code }, [
                  h('td', { className: 'font-mono font-bold text-blue-700' }, sub.code),
                  h('td', { className: 'font-medium text-slate-800' }, sub.name),
                  h('td', { className: 'text-center font-bold text-slate-900 text-sm' }, degree),
                  h('td', { className: 'text-center text-slate-600' }, `${graph.enrollmentMap[sub.code] || 0} students`),
                  h('td', null, [
                    nbrs.length === 0
                      ? h('span', { className: 'text-xs text-emerald-600 italic' }, 'None (Isolated node)')
                      : h('div', { className: 'flex flex-wrap gap-1' },
                          nbrs.map((nCode) =>
                            h('span', { key: nCode, className: 'px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-mono font-semibold' }, nCode)
                          )
                        )
                  ])
                ]);
              })
            )
          ])
        ])
      ])
    ]);
  }

  // --- ABOUT VIEW ---
  function AboutView() {
    return h('div', { className: 'space-y-6 max-w-5xl mx-auto' }, [
      h('div', { className: 'card p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white mb-0' }, [
        h('div', { className: 'inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 border border-blue-400/20 mb-3' },
          'Experiential Learning Project • Discrete Mathematics & Graph Theory'
        ),
        h('h2', { className: 'text-2xl font-black text-white tracking-tight' }, 'Mathematical Foundations of Examination Timetabling'),
        h('p', { className: 'text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed' },
          'A formal treatment of automated examination timetabling using Graph Coloring, Welsh-Powell heuristics, and Exact Branch-and-Bound algorithms.'
        )
      ]),

      h('div', { className: 'card p-6 space-y-4' }, [
        h('h3', { className: 'text-lg font-bold text-slate-900 border-b border-slate-200 pb-2' }, '1. Graph Theory Fundamentals: The Conflict Graph Model'),
        h('p', { className: 'text-xs text-slate-700 leading-relaxed' },
          'In university examination scheduling, we model the problem as an undirected weighted graph G = (V, E, W):'
        ),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-xs' }, [
          h('div', { className: 'p-3 bg-slate-50 rounded-lg border border-slate-200' }, [
            h('div', { className: 'font-bold text-blue-800 mb-1' }, 'Vertices (V)'),
            h('p', { className: 'text-slate-600' }, 'Each vertex v ∈ V represents a unique academic course offering (e.g., MATH, DBMS, OS).')
          ]),
          h('div', { className: 'p-3 bg-slate-50 rounded-lg border border-slate-200' }, [
            h('div', { className: 'font-bold text-blue-800 mb-1' }, 'Edges (E)'),
            h('p', { className: 'text-slate-600' }, 'An edge e = (u, v) ∈ E exists if and only if at least one student is enrolled in both subject u and subject v.')
          ]),
          h('div', { className: 'p-3 bg-slate-50 rounded-lg border border-slate-200' }, [
            h('div', { className: 'font-bold text-blue-800 mb-1' }, 'Edge Weights (W)'),
            h('p', { className: 'text-slate-600' }, 'The weight w(u, v) equals the exact count of shared students enrolled in both u and v simultaneously.')
          ])
        ]),
        h('div', { className: 'p-4 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 space-y-2' }, [
          h('div', { className: 'font-bold text-slate-900' }, 'Formal Conflict Predicate:'),
          h('div', null, 'Edge (u, v) ∈ E ⟺ ∃ student s such that {u, v} ⊆ Registered(s)'),
          h('div', null, 'Edge Weight w(u, v) = |{ s : u ∈ Registered(s) ∧ v ∈ Registered(s) }|')
        ])
      ]),

      h('div', { className: 'card p-6 space-y-4' }, [
        h('h3', { className: 'text-lg font-bold text-slate-900 border-b border-slate-200 pb-2' }, '2. Proper Graph Coloring & Chromatic Number χ(G)'),
        h('p', { className: 'text-xs text-slate-700 leading-relaxed' },
          'A proper k-vertex coloring of graph G is an assignment of k colors c: V → {1, 2, ..., k} such that:'
        ),
        h('div', { className: 'p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono text-blue-900 font-bold text-center' },
          '∀ (u, v) ∈ E ⟹ c(u) ≠ c(v)'
        ),
        h('p', { className: 'text-xs text-slate-700 leading-relaxed' },
          'Each color corresponds to a distinct non-overlapping examination time slot. The constraint ensures no student ever has two conflicting exams scheduled simultaneously.'
        ),
        h('div', { className: 'p-3 border border-slate-200 rounded-lg bg-slate-50 text-xs text-slate-700' }, [
          h('div', { className: 'font-bold text-slate-900 mb-1' }, 'Chromatic Number χ(G):'),
          h('p', null, 'The chromatic number χ(G) is the minimum number of colors needed to properly color G. It represents the absolute minimum number of examination time slots needed.'),
          h('div', { className: 'mt-2 font-mono text-[11px] text-slate-600' },
            'Theoretical Bounds: ω(G) ≤ χ(G) ≤ Δ(G) + 1  (Brooks\' Theorem: χ(G) ≤ Δ(G) unless G is complete or an odd cycle)'
          )
        ])
      ]),

      h('div', { className: 'card p-6 space-y-4' }, [
        h('h3', { className: 'text-lg font-bold text-slate-900 border-b border-slate-200 pb-2' }, '3. Algorithms Implemented in ExamSlot'),
        h('div', { className: 'p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2' }, [
          h('div', { className: 'flex justify-between items-center' }, [
            h('h4', { className: 'font-bold text-slate-900 text-sm' }, 'A. Welsh-Powell Algorithm (1967)'),
            h('span', { className: 'badge badge-info' }, 'O(V log V + V²)')
          ]),
          h('p', { className: 'text-slate-600' }, 'A degree-ordered greedy heuristic. Sorts vertices descending by degree, then assigns Color 1 to the first uncolored vertex and greedily to all subsequent uncolored vertices non-adjacent to any node colored with Color 1. Repeats for Color 2, 3, etc.')
        ]),
        h('div', { className: 'p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2' }, [
          h('div', { className: 'flex justify-between items-center' }, [
            h('h4', { className: 'font-bold text-slate-900 text-sm' }, 'B. Greedy Graph Coloring'),
            h('span', { className: 'badge badge-neutral' }, 'O(V² + E)')
          ]),
          h('p', { className: 'text-slate-600' }, 'Iterates through vertices in natural order and assigns the lowest available color index not taken by any adjacent neighbor.')
        ]),
        h('div', { className: 'p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2' }, [
          h('div', { className: 'flex justify-between items-center' }, [
            h('h4', { className: 'font-bold text-slate-900 text-sm' }, 'C. Backtracking Branch-and-Bound Exact Solver'),
            h('span', { className: 'badge badge-warning' }, 'O(k^V) [Branch & Bound]')
          ]),
          h('p', { className: 'text-slate-600' }, 'Finds the exact minimum chromatic number χ(G). Tests k-colorability iteratively from lower bound ω(G) (maximum clique) to upper bound with symmetry breaking to avoid isomorphic branches.')
        ])
      ]),

      h('div', { className: 'card p-6 text-xs text-slate-600 space-y-2 text-center' }, [
        h('div', { className: 'font-bold text-slate-800 text-sm' }, 'ExamSlot – Automated Timetabling System'),
        h('div', null, 'Built for Experiential Learning in Discrete Mathematics and Graph Theory.'),
        h('div', { className: 'text-slate-400 text-[11px]' }, 'React • Chart.js • Graph Theory • HTML5 Canvas • jsPDF • LocalStorage')
      ])
    ]);
  }

  // ==========================================
  // MODULE 8: MAIN ROOT APP ORCHESTRATOR
  // ==========================================
  function App() {
    const [subjects, setSubjects] = useState(() => {
      try {
        const savedVer = localStorage.getItem('examslot_version');
        if (savedVer !== DATASET_VERSION) {
          localStorage.setItem('examslot_version', DATASET_VERSION);
          localStorage.setItem('examslot_subjects', JSON.stringify(INITIAL_SUBJECTS));
          localStorage.setItem('examslot_students', JSON.stringify(INITIAL_STUDENTS));
          return INITIAL_SUBJECTS;
        }
        const saved = localStorage.getItem('examslot_subjects');
        return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
      } catch (e) { return INITIAL_SUBJECTS; }
    });

    const [students, setStudents] = useState(() => {
      try {
        const savedVer = localStorage.getItem('examslot_version');
        if (savedVer !== DATASET_VERSION) {
          return INITIAL_STUDENTS;
        }
        const saved = localStorage.getItem('examslot_students');
        return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
      } catch (e) { return INITIAL_STUDENTS; }
    });

    const [examSettings, setExamSettings] = useState(() => {
      try {
        const saved = localStorage.getItem('examslot_settings');
        return saved ? JSON.parse(saved) : DEFAULT_EXAM_SETTINGS;
      } catch (e) { return DEFAULT_EXAM_SETTINGS; }
    });

    // Google Forms Live Sync State
    const [liveSheetUrl, setLiveSheetUrl] = useState(() => {
      try {
        return localStorage.getItem('examslot_live_sheet_url') || '';
      } catch (e) { return ''; }
    });
    const [isLiveSyncing, setIsLiveSyncing] = useState(false);
    const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState(null);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [activeAlgorithm, setActiveAlgorithm] = useState('welsh-powell');
    const [manualColoring, setManualColoring] = useState(null);

    useEffect(() => {
      localStorage.setItem('examslot_subjects', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
      localStorage.setItem('examslot_students', JSON.stringify(students));
    }, [students]);

    useEffect(() => {
      localStorage.setItem('examslot_settings', JSON.stringify(examSettings));
    }, [examSettings]);

    useEffect(() => {
      if (liveSheetUrl) {
        localStorage.setItem('examslot_live_sheet_url', liveSheetUrl);
      }
    }, [liveSheetUrl]);

    // Live Sync Fetcher from Google Sheets
    const handleSyncFromGoogleSheet = async (customUrl) => {
      const targetUrl = customUrl || liveSheetUrl;
      if (!targetUrl) return;
      const fetchUrl = extractGoogleSheetCsvUrl(targetUrl);
      if (!fetchUrl) return;

      setIsLiveSyncing(true);
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Please ensure your Google Sheet has Share -> 'Anyone with the link can view' enabled.`);
        }
        const csvText = await response.text();
        const rows = parseCSV(csvText);
        const validation = validateImportedData(rows, subjects, students);

        if (!validation.isValid) {
          alert(`Validation Notice: ${validation.error}`);
        } else {
          const validRecords = validation.records
            .filter((r) => r.isValid)
            .map((r) => ({
              id: r.id,
              name: r.name,
              department: r.department,
              semester: r.semester,
              academicYear: r.academicYear,
              subjects: r.subjects
            }));

          if (validRecords.length > 0) {
            setStudents(validRecords);
            setManualColoring(null);
            setLastSyncTime(new Date().toLocaleTimeString());
          } else {
            alert('No valid student response records were found in the sheet.');
          }
        }
      } catch (err) {
        console.warn('Google Sheet Sync Error:', err);
        alert(`Could not fetch from Google Sheets:\n${err.message}\n\nMake sure the spreadsheet is set to Share -> 'Anyone with the link can view'.`);
      } finally {
        setIsLiveSyncing(false);
      }
    };

    // Periodic Auto-Sync Timer
    useEffect(() => {
      let timer = null;
      if (autoSyncEnabled && liveSheetUrl) {
        timer = setInterval(() => {
          handleSyncFromGoogleSheet(liveSheetUrl);
        }, 15000);
      }
      return () => {
        if (timer) clearInterval(timer);
      };
    }, [autoSyncEnabled, liveSheetUrl, subjects]);

    // Recompute graph dynamically whenever student registrations or subjects change
    const conflictGraph = useMemo(() => {
      return buildConflictGraph(subjects, students);
    }, [subjects, students]);

    const allResults = useMemo(() => {
      const wp = runWelshPowell(conflictGraph);
      const gr = runGreedyColoring(conflictGraph);
      const bt = runBacktrackingColoring(conflictGraph);
      return { welshPowell: wp, greedy: gr, backtracking: bt };
    }, [conflictGraph]);

    const activeResult = useMemo(() => {
      if (activeAlgorithm === 'greedy') return allResults.greedy;
      if (activeAlgorithm === 'backtracking') return allResults.backtracking;
      return allResults.welshPowell;
    }, [activeAlgorithm, allResults]);

    const effectiveColoring = useMemo(() => {
      if (manualColoring) {
        return { ...activeResult.coloring, ...manualColoring };
      }
      return activeResult.coloring;
    }, [manualColoring, activeResult]);

    const timetable = useMemo(() => {
      return generateTimetable(effectiveColoring, conflictGraph, examSettings);
    }, [effectiveColoring, conflictGraph, examSettings]);

    const metrics = useMemo(() => {
      return calculateGraphMetrics(conflictGraph);
    }, [conflictGraph]);

    const handleAddStudent = (newStudent) => {
      setStudents((prev) => [newStudent, ...prev]);
      setManualColoring(null);
    };

    const handleUpdateStudent = (id, updated) => {
      setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
      setManualColoring(null);
    };

    const handleDeleteStudent = (id) => {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setManualColoring(null);
    };

    const handleAddSubject = (newSubject) => {
      setSubjects((prev) => [...prev, newSubject]);
      setManualColoring(null);
    };

    const handleUpdateSubject = (code, updated) => {
      setSubjects((prev) => prev.map((s) => (s.code === code ? { ...s, ...updated } : s)));
    };

    const handleDeleteSubject = (code) => {
      setSubjects((prev) => prev.filter((s) => s.code !== code));
      setStudents((prev) =>
        prev.map((st) => ({
          ...st,
          subjects: (st.subjects || []).filter((c) => c !== code)
        }))
      );
      setManualColoring(null);
    };

    const handleCommitImport = (newStudents, mode) => {
      if (mode === 'replace') {
        setStudents(newStudents);
      } else {
        const studentMap = new Map();
        students.forEach((s) => studentMap.set(s.id.toUpperCase(), s));
        newStudents.forEach((s) => studentMap.set(s.id.toUpperCase(), s));
        setStudents(Array.from(studentMap.values()));
      }
      setManualColoring(null);
    };

    const handleRestoreDefaults = () => {
      setSubjects(INITIAL_SUBJECTS);
      setStudents(INITIAL_STUDENTS);
      setExamSettings(DEFAULT_EXAM_SETTINGS);
      setManualColoring(null);
      localStorage.removeItem('examslot_subjects');
      localStorage.removeItem('examslot_students');
      localStorage.removeItem('examslot_settings');
    };

    const handleManualMoveSubject = (subjectCode, targetSlot) => {
      setManualColoring((prev) => {
        const current = prev || { ...activeResult.coloring };
        return { ...current, [subjectCode]: targetSlot };
      });
    };

    const handleResetManualAdjustments = () => {
      setManualColoring(null);
    };

    let activeView = null;
    switch (activeTab) {
      case 'dashboard':
        activeView = h(DashboardView, {
          graph: conflictGraph,
          students,
          subjects,
          activeAlgorithm,
          activeResult,
          allResults,
          metrics,
          timetable,
          onNavigateTab: setActiveTab,
          onSelectAlgorithm: setActiveAlgorithm
        });
        break;
      case 'students':
        activeView = h(StudentsView, {
          students,
          subjects,
          onAddStudent: handleAddStudent,
          onUpdateStudent: handleUpdateStudent,
          onDeleteStudent: handleDeleteStudent,
          onResetStudents: handleRestoreDefaults
        });
        break;
      case 'subjects':
        activeView = h(SubjectsView, {
          subjects,
          graph: conflictGraph,
          onAddSubject: handleAddSubject,
          onUpdateSubject: handleUpdateSubject,
          onDeleteSubject: handleDeleteSubject
        });
        break;
      case 'import':
        activeView = h(ImportView, {
          subjects,
          students,
          onCommitImport: handleCommitImport,
          onRestoreDefaults: handleRestoreDefaults,
          liveSheetUrl,
          onUpdateLiveSheetUrl: setLiveSheetUrl,
          isLiveSyncing,
          autoSyncEnabled,
          onToggleAutoSync: setAutoSyncEnabled,
          onTriggerLiveSync: handleSyncFromGoogleSheet,
          lastSyncTime
        });
        break;
      case 'conflicts':
        activeView = h(ConflictView, {
          graph: conflictGraph,
          onNavigateTab: setActiveTab
        });
        break;
      case 'graph':
        activeView = h(GraphView, {
          graph: conflictGraph,
          subjects,
          activeAlgorithm,
          activeResult,
          onSelectAlgorithm: setActiveAlgorithm,
          onNavigateTab: setActiveTab
        });
        break;
      case 'algorithms':
        activeView = h(AlgorithmsView, {
          graph: conflictGraph,
          subjects,
          allResults,
          activeAlgorithm,
          onSelectAlgorithm: (alg) => {
            setActiveAlgorithm(alg);
            setManualColoring(null);
          },
          onNavigateTab: setActiveTab
        });
        break;
      case 'timetable':
        activeView = h(TimetableView, {
          timetable,
          graph: conflictGraph,
          subjects,
          activeAlgorithm,
          examSettings,
          onUpdateExamSettings: setExamSettings,
          onManualMoveSubject: handleManualMoveSubject,
          onResetManualAdjustments: handleResetManualAdjustments
        });
        break;
      case 'analysis':
        activeView = h(AnalysisView, {
          graph: conflictGraph,
          subjects,
          allResults,
          metrics,
          timetable
        });
        break;
      case 'about':
        activeView = h(AboutView);
        break;
      default:
        activeView = h(DashboardView, {
          graph: conflictGraph,
          students,
          subjects,
          activeAlgorithm,
          activeResult,
          allResults,
          metrics,
          timetable,
          onNavigateTab: setActiveTab,
          onSelectAlgorithm: setActiveAlgorithm
        });
    }

    return h('div', { className: 'app-container' }, [
      h(Sidebar, {
        key: 'sidebar',
        activeTab,
        onSelectTab: setActiveTab,
        studentCount: students.length,
        subjectCount: subjects.length,
        conflictCount: conflictGraph.totalEdges,
        slotCount: timetable.slotCount
      }),
      h('main', { key: 'main', className: 'main-content' }, [
        h(Navbar, {
          key: 'navbar',
          activeTab,
          activeAlgorithm,
          totalSlots: timetable.slotCount,
          isConflictFree: timetable.isConflictFree,
          onResetData: handleRestoreDefaults,
          onPrintTimetable: () => exportTimetableToPDF(timetable, conflictGraph),
          liveSheetUrl,
          isLiveSyncing,
          onTriggerLiveSync: () => handleSyncFromGoogleSheet(liveSheetUrl)
        }),
        h('div', { key: 'body', className: 'content-body' }, activeView)
      ])
    ]);
  }

  // Expose internal functions for automated testing and extensions
  window.ExamSlotInternal = {
    INITIAL_SUBJECTS,
    INITIAL_STUDENTS,
    DEFAULT_EXAM_SETTINGS,
    buildConflictGraph,
    validateColoring,
    validateSubjectSlotMove,
    runGreedyColoring,
    runWelshPowell,
    runBacktrackingColoring,
    findMaximumClique,
    calculateGraphMetrics,
    generateTimetable,
    parseCSV,
    validateImportedData,
    exportTimetableToCSV
  };

  // Mount React Root
  const container = document.getElementById('root');
  if (container) {
    if (ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(container);
      root.render(h(App));
    } else {
      ReactDOM.render(h(App), container);
    }
  }
})();
