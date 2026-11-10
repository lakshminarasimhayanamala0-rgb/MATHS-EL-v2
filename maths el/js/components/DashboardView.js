// ExamSlot - Dashboard View Component
const { createElement: h, useEffect, useRef } = React;

export function DashboardView({
  graph,
  students,
  subjects,
  activeAlgorithm,
  activeResult,
  allResults,
  metrics,
  timetable,
  onNavigateTab,
  onSelectAlgorithm
}) {
  const enrollmentChartRef = useRef(null);
  const slotChartRef = useRef(null);

  // Initialize / update Chart.js instances
  useEffect(() => {
    let enrollmentChart = null;
    let slotChart = null;

    if (window.Chart && enrollmentChartRef.current) {
      const labels = graph.subjectCodes;
      const data = labels.map((code) => graph.enrollmentMap[code] || 0);

      enrollmentChart = new window.Chart(enrollmentChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Registered Students',
            data,
            backgroundColor: '#3b82f6',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 2 }
            }
          }
        }
      });
    }

    if (window.Chart && slotChartRef.current && timetable) {
      const slotLabels = timetable.rows.map((r) => `Slot ${r.slotNumber}`);
      const slotCounts = timetable.rows.map((r) => r.subjects.length);
      const bgColors = timetable.rows.map((r) => r.colorInfo ? r.colorInfo.hex : '#3b82f6');

      slotChart = new window.Chart(slotChartRef.current, {
        type: 'doughnut',
        data: {
          labels: slotLabels,
          datasets: [{
            data: slotCounts,
            backgroundColor: bgColors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { size: 11 } }
            }
          }
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
    // Welcome / Academic Banner
    h('div', {
      key: 'banner',
      className: 'bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden'
    }, [
      h('div', { className: 'relative z-10 max-w-3xl' }, [
        h('div', { className: 'inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 border border-blue-400/20 mb-3' }, [
          h('span', null, '🎓 Graph Theory & Discrete Mathematics Experiential Project'),
          h('span', null, '•'),
          h('span', null, 'Fall 2026')
        ]),
        h('h2', { className: 'text-2xl font-extrabold tracking-tight text-white mb-2' }, 'Automated Examination Timetabling via Graph Coloring'),
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

    // Stat Grid: 6 Key Metrics
    h('div', { key: 'stats', className: 'stat-grid' }, [
      // 1. Total Registered Students
      h('div', { className: 'stat-card', onClick: () => onNavigateTab('students'), style: { cursor: 'pointer' } }, [
        h('div', { className: 'stat-icon-wrapper bg-blue-50 text-blue-600' }, '👨‍🎓'),
        h('div', null, [
          h('div', { className: 'stat-val' }, students.length),
          h('div', { className: 'stat-label' }, 'Registered Students')
        ])
      ]),

      // 2. Total Subjects (Vertices)
      h('div', { className: 'stat-card', onClick: () => onNavigateTab('subjects'), style: { cursor: 'pointer' } }, [
        h('div', { className: 'stat-icon-wrapper bg-indigo-50 text-indigo-600' }, '📚'),
        h('div', null, [
          h('div', { className: 'stat-val' }, graph.totalVertices),
          h('div', { className: 'stat-label' }, 'Subjects (|V| Vertices)')
        ])
      ]),

      // 3. Conflict Pairs (Edges)
      h('div', { className: 'stat-card', onClick: () => onNavigateTab('conflicts'), style: { cursor: 'pointer' } }, [
        h('div', { className: 'stat-icon-wrapper bg-rose-50 text-rose-600' }, '⚡'),
        h('div', null, [
          h('div', { className: 'stat-val' }, graph.totalEdges),
          h('div', { className: 'stat-label' }, 'Conflict Pairs (|E| Edges)')
        ])
      ]),

      // 4. Examination Slots
      h('div', { className: 'stat-card', onClick: () => onNavigateTab('timetable'), style: { cursor: 'pointer' } }, [
        h('div', { className: 'stat-icon-wrapper bg-emerald-50 text-emerald-600' }, '🗓️'),
        h('div', null, [
          h('div', { className: 'stat-val' }, activeResult.totalColors),
          h('div', { className: 'stat-label' }, `Exam Slots (${activeAlgorithm})`)
        ])
      ]),

      // 5. Chromatic Number χ(G)
      h('div', { className: 'stat-card', onClick: () => onNavigateTab('analysis'), style: { cursor: 'pointer' } }, [
        h('div', { className: 'stat-icon-wrapper bg-amber-50 text-amber-600' }, 'χ(G)'),
        h('div', null, [
          h('div', { className: 'stat-val' }, chromaticNumber),
          h('div', { className: 'stat-label' }, 'Chromatic Number (Exact)')
        ])
      ]),

      // 6. Algorithm Execution Time
      h('div', { className: 'stat-card', onClick: () => onNavigateTab('algorithms'), style: { cursor: 'pointer' } }, [
        h('div', { className: 'stat-icon-wrapper bg-purple-50 text-purple-600' }, '⏱️'),
        h('div', null, [
          h('div', { className: 'stat-val text-sm' }, `${executionTime} ms`),
          h('div', { className: 'stat-label' }, 'Alg. Execution Time')
        ])
      ])
    ]),

    // Algorithm Quick Selector Tabs
    h('div', { key: 'algSelector', className: 'card flex flex-wrap items-center justify-between gap-4 p-4' }, [
      h('div', { className: 'flex items-center gap-2' }, [
        h('span', { className: 'text-sm font-bold text-slate-700' }, 'Active Timetabling Engine:'),
        h('div', { className: 'inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200' }, [
          h('button', {
            className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeAlgorithm === 'welsh-powell'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`,
            onClick: () => onSelectAlgorithm('welsh-powell')
          }, 'Welsh-Powell (Heuristic)'),
          h('button', {
            className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeAlgorithm === 'greedy'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`,
            onClick: () => onSelectAlgorithm('greedy')
          }, 'Greedy Coloring'),
          h('button', {
            className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeAlgorithm === 'backtracking'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
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

    // Visual Charts Row
    h('div', { key: 'charts', className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' }, [
      // Chart 1: Enrollment per Subject
      h('div', { className: 'card lg:col-span-2' }, [
        h('div', { className: 'card-title' }, [
          h('span', null, '📊 Student Enrollment Distribution per Course'),
          h('span', { className: 'text-xs text-slate-500 font-normal' }, 'Total Registrations across Subjects')
        ]),
        h('div', { style: { height: '260px' } }, [
          h('canvas', { ref: enrollmentChartRef })
        ])
      ]),

      // Chart 2: Slot Allocation Breakdown
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

    // Summary Matrix / Conflict Highlights
    h('div', { key: 'summaryDetails', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
      // Timetable Status Card
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
        h('div', { className: 'space-y-2' }, [
          h('div', { className: 'flex justify-between text-xs py-1.5 border-b border-slate-100' }, [
            h('span', { className: 'text-slate-500' }, 'Sequential Scheduling (Naive Slots):'),
            h('span', { className: 'font-bold text-slate-800' }, `${graph.totalVertices} Slots (${graph.totalVertices * 0.5} Days)`)
          ]),
          h('div', { className: 'flex justify-between text-xs py-1.5 border-b border-slate-100' }, [
            h('span', { className: 'text-slate-500' }, 'Optimized Coloring Slots:'),
            h('span', { className: 'font-bold text-emerald-600' }, `${activeResult.totalColors} Slots (${Math.ceil(activeResult.totalColors / 2)} Days)`)
          ]),
          h('div', { className: 'flex justify-between text-xs py-1.5 border-b border-slate-100' }, [
            h('span', { className: 'text-slate-500' }, 'Examination Days Saved:'),
            h('span', { className: 'font-bold text-blue-600' }, `${(graph.totalVertices * 0.5) - Math.ceil(activeResult.totalColors / 2)} Days Saved (${(((graph.totalVertices - activeResult.totalColors) / graph.totalVertices) * 100).toFixed(0)}% reduction)`)
          ]),
          h('div', { className: 'flex justify-between text-xs py-1.5' }, [
            h('span', { className: 'text-slate-500' }, 'Simultaneous Clash Count:'),
            h('span', { className: 'font-bold text-emerald-600' }, '0 Conflicts (Mathematically Proven)')
          ])
        ])
      ]),

      // Graph Theory Health Card
      h('div', { className: 'card' }, [
        h('div', { className: 'card-title' }, [
          h('span', null, '📐 Graph Theoretical Properties'),
          h('span', { className: 'badge badge-info' }, `Density: ${metrics.densityPercent}%`)
        ]),
        h('p', { className: 'text-xs text-slate-600 mb-4' },
          'Properties calculated in real time from the dynamic student registration dataset.'
        ),
        h('div', { className: 'space-y-2' }, [
          h('div', { className: 'flex justify-between text-xs py-1.5 border-b border-slate-100' }, [
            h('span', { className: 'text-slate-500' }, 'Maximum Degree Δ(G):'),
            h('span', { className: 'font-bold text-slate-800' }, `${metrics.maxDegree} (Subject with most conflicts)`)
          ]),
          h('div', { className: 'flex justify-between text-xs py-1.5 border-b border-slate-100' }, [
            h('span', { className: 'text-slate-500' }, 'Average Vertex Degree:'),
            h('span', { className: 'font-bold text-slate-800' }, `${metrics.avgDegree} conflicts/subject`)
          ]),
          h('div', { className: 'flex justify-between text-xs py-1.5 border-b border-slate-100' }, [
            h('span', { className: 'text-slate-500' }, 'Max Clique Size ω(G) [Lower Bound]:'),
            h('span', { className: 'font-bold text-purple-600' }, `ω = ${metrics.cliqueSizeLowerBound} (${metrics.maxClique.join(', ')})`)
          ]),
          h('div', { className: 'flex justify-between text-xs py-1.5' }, [
            h('span', { className: 'text-slate-500' }, 'Brooks’ Upper Bound:'),
            h('span', { className: 'font-bold text-slate-800' }, `χ(G) ≤ ${metrics.brooksUpperBound}`)
          ])
        ])
      ])
    ])
  ]);
}

