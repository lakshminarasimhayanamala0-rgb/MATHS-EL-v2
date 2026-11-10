// ExamSlot - Analysis & Analytical Reports Component
const { createElement: h, useEffect, useRef } = React;

export function AnalysisView({
  graph,
  subjects,
  allResults,
  metrics,
  timetable
}) {
  const compChartRef = useRef(null);
  const timeChartRef = useRef(null);
  const degreeChartRef = useRef(null);

  // Initialize Charts
  useEffect(() => {
    let compChart = null;
    let timeChart = null;
    let degreeChart = null;

    if (window.Chart) {
      // 1. Slot Comparison Chart
      if (compChartRef.current) {
        compChart = new window.Chart(compChartRef.current, {
          type: 'bar',
          data: {
            labels: ['Welsh-Powell', 'Greedy Coloring', 'Backtracking (Exact)'],
            datasets: [{
              label: 'Examination Slots Required',
              data: [
                allResults.welshPowell.totalColors,
                allResults.greedy.totalColors,
                allResults.backtracking.totalColors
              ],
              backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
                title: { display: true, text: 'Slots / Colors' }
              }
            }
          }
        });
      }

      // 2. Execution Time Chart
      if (timeChartRef.current) {
        timeChart = new window.Chart(timeChartRef.current, {
          type: 'bar',
          data: {
            labels: ['Welsh-Powell', 'Greedy Coloring', 'Backtracking (Exact)'],
            datasets: [{
              label: 'Execution Time (ms)',
              data: [
                allResults.welshPowell.executionTimeMs,
                allResults.greedy.executionTimeMs,
                allResults.backtracking.executionTimeMs
              ],
              backgroundColor: ['#60a5fa', '#a78bfa', '#34d399'],
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Milliseconds (ms)' }
              }
            }
          }
        });
      }

      // 3. Degree Distribution Chart
      if (degreeChartRef.current) {
        const sortedCodes = [...graph.subjectCodes].sort(
          (a, b) => (graph.degrees[b] || 0) - (graph.degrees[a] || 0)
        );
        const degreeVals = sortedCodes.map((c) => graph.degrees[c] || 0);

        degreeChart = new window.Chart(degreeChartRef.current, {
          type: 'bar',
          data: {
            labels: sortedCodes,
            datasets: [{
              label: 'Vertex Degree d(v)',
              data: degreeVals,
              backgroundColor: '#f59e0b',
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
                title: { display: true, text: 'Number of Conflicts' }
              }
            }
          }
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
    // Header
    h('div', { className: 'card p-5 mb-0' }, [
      h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Graph Theory & Timetable Efficiency Analysis'),
      h('p', { className: 'text-xs text-slate-500 mt-0.5' },
        'Comprehensive quantitative metrics, density formulas, connected components, and algorithmic complexity evaluation.'
      )
    ]),

    // Formula & Metric Cards Grid
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
        h('div', { className: 'text-slate-400 text-[10px] uppercase font-bold tracking-wider' }, 'Graph Density (D)'),
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
        h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Connected Subgraphs')
      ]),

      h('div', { className: 'card p-3.5 mb-0 text-center' }, [
        h('div', { className: 'text-slate-400 text-[10px] uppercase font-bold tracking-wider' }, 'Chromatic χ(G)'),
        h('div', { className: 'text-2xl font-extrabold text-rose-700 mt-1' }, optimalSlots),
        h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Exact Minimum Slots')
      ])
    ]),

    // Efficiency & Optimization Summary Card
    h('div', { className: 'card p-5' }, [
      h('div', { className: 'card-title' }, [
        h('span', null, '⚡ Conflict Elimination & Timetable Compression Efficiency'),
        h('span', { className: 'badge badge-success' }, `${reductionPercent}% Slot Reduction`)
      ]),
      h('p', { className: 'text-xs text-slate-600 mb-4' },
        'Comparison of naive sequential examination timetabling against Graph Coloring automated optimization.'
      ),
      h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-xs' }, [
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
          h('div', { className: 'text-[11px] text-blue-600 mt-1' }, 'Massive reduction in invigilator hours, hall costs, and student exam fatigue.')
        ])
      ])
    ]),

    // Visual Charts Row: Algorithms & Degree
    h('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' }, [
      // Chart 1: Slots used comparison
      h('div', { className: 'card' }, [
        h('div', { className: 'card-title' }, [
          h('span', null, '🎨 Examination Slots Used'),
          h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Lower is Better')
        ]),
        h('div', { style: { height: '240px' } }, [
          h('canvas', { ref: compChartRef })
        ])
      ]),

      // Chart 2: Execution Time Comparison
      h('div', { className: 'card' }, [
        h('div', { className: 'card-title' }, [
          h('span', null, '⏱️ Execution Runtime'),
          h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Lower is Faster')
        ]),
        h('div', { style: { height: '240px' } }, [
          h('canvas', { ref: timeChartRef })
        ])
      ]),

      // Chart 3: Vertex Degree Distribution
      h('div', { className: 'card' }, [
        h('div', { className: 'card-title' }, [
          h('span', null, '📶 Subject Vertex Degrees d(v)'),
          h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Descending Order')
        ]),
        h('div', { style: { height: '240px' } }, [
          h('canvas', { ref: degreeChartRef })
        ])
      ])
    ]),

    // Detailed Subject Vertex Degree Table
    h('div', { className: 'card p-5' }, [
      h('div', { className: 'card-title' }, [
        h('span', null, '📋 Vertex Degree d(v) Specification per Subject'),
        h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Degree equals the number of connected conflict edges')
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
            [...subjects]
              .sort((a, b) => (graph.degrees[b.code] || 0) - (graph.degrees[a.code] || 0))
              .map((sub) => {
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
                            h('span', {
                              key: nCode,
                              className: 'px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-mono font-semibold'
                            }, nCode)
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

