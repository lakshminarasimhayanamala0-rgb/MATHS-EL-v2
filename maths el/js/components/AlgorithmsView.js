// ExamSlot - Graph Coloring Algorithms Comparison & Step-by-Step Inspector
const { createElement: h, useState } = React;
import { COLOR_PALETTE } from '../sampleData.js';
import { validateColoring } from '../conflictDetector.js';

export function AlgorithmsView({
  graph,
  subjects,
  allResults,
  activeAlgorithm,
  onSelectAlgorithm,
  onNavigateTab
}) {
  const [selectedAlgTab, setSelectedAlgTab] = useState(activeAlgorithm || 'welsh-powell');

  // Validate all three results against graph
  const wpValidation = validateColoring(graph, allResults.welshPowell.coloring);
  const greedyValidation = validateColoring(graph, allResults.greedy.coloring);
  const btValidation = validateColoring(graph, allResults.backtracking.coloring);

  const selectedResult =
    selectedAlgTab === 'welsh-powell'
      ? allResults.welshPowell
      : selectedAlgTab === 'greedy'
      ? allResults.greedy
      : allResults.backtracking;

  const selectedValidation =
    selectedAlgTab === 'welsh-powell'
      ? wpValidation
      : selectedAlgTab === 'greedy'
      ? greedyValidation
      : btValidation;

  return h('div', { className: 'space-y-6' }, [
    // Header
    h('div', { className: 'card p-5 mb-0' }, [
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
        h('div', null, [
          h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Graph Coloring Algorithms: Heuristic vs Exact Analysis'),
          h('p', { className: 'text-xs text-slate-500 mt-0.5' },
            'Rigorous comparison between Welsh-Powell, Greedy heuristic coloring, and Backtracking exact branch-and-bound solver.'
          )
        ]),
        h('div', { className: 'flex items-center gap-3' }, [
          h('button', {
            className: 'btn btn-primary btn-sm text-xs',
            onClick: () => {
              onSelectAlgorithm(selectedAlgTab);
              onNavigateTab('timetable');
            }
          }, `📅 Apply ${selectedAlgTab.replace('-', ' ')} to Timetable`)
        ])
      ])
    ]),

    // Educational Alert on Heuristics vs Exact
    h('div', { className: 'p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs leading-relaxed flex items-start gap-3' }, [
      h('span', { className: 'text-lg select-none' }, '⚠️'),
      h('div', null, [
        h('span', { className: 'font-bold' }, 'Theoretical Complexity & Heuristic Bounds: '),
        'Graph Vertex Coloring is a proven NP-hard problem. ',
        h('strong', null, 'Welsh-Powell'), ' and ', h('strong', null, 'Greedy'),
        ' are polynomial-time greedy heuristics O(V²). They run exceptionally fast and often yield optimal or near-optimal results for practical university timetables, but they do NOT mathematically guarantee the absolute minimum chromatic number χ(G). ',
        'Conversely, ', h('strong', null, 'Backtracking'), ' systematically explores the state space tree with branch-and-bound pruning to guarantee the absolute minimum chromatic number χ(G), but has worst-case exponential complexity O(k^V).'
      ])
    ]),

    // Comparative Metrics Table (Side-by-side)
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
              h('th', { style: { textAlign: 'center' } }, 'Algorithm Category'),
              h('th', { style: { textAlign: 'center' } }, 'Slots / Colors Used'),
              h('th', { style: { textAlign: 'center' } }, 'Execution Time'),
              h('th', { style: { textAlign: 'center' } }, 'Time Complexity'),
              h('th', { style: { textAlign: 'center' } }, 'Mathematical Validity'),
              h('th', { style: { textAlign: 'center' } }, 'Active State')
            ])
          ]),
          h('tbody', null, [
            // Row 1: Welsh-Powell
            h('tr', { key: 'wp', className: activeAlgorithm === 'welsh-powell' ? 'bg-blue-50/50' : '' }, [
              h('td', { className: 'font-bold text-slate-900' }, 'Welsh-Powell Algorithm'),
              h('td', { className: 'text-center' }, [
                h('span', { className: 'badge badge-info text-[11px]' }, 'Degree-Ordered Heuristic')
              ]),
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
                  : h('button', {
                      className: 'btn btn-secondary btn-sm text-[11px] py-0.5 px-2',
                      onClick: () => onSelectAlgorithm('welsh-powell')
                    }, 'Select')
              ])
            ]),

            // Row 2: Greedy
            h('tr', { key: 'gr', className: activeAlgorithm === 'greedy' ? 'bg-blue-50/50' : '' }, [
              h('td', { className: 'font-bold text-slate-900' }, 'Greedy Graph Coloring'),
              h('td', { className: 'text-center' }, [
                h('span', { className: 'badge badge-neutral text-[11px]' }, 'Sequential Heuristic')
              ]),
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
                  : h('button', {
                      className: 'btn btn-secondary btn-sm text-[11px] py-0.5 px-2',
                      onClick: () => onSelectAlgorithm('greedy')
                    }, 'Select')
              ])
            ]),

            // Row 3: Backtracking
            h('tr', { key: 'bt', className: activeAlgorithm === 'backtracking' ? 'bg-blue-50/50' : '' }, [
              h('td', { className: 'font-bold text-slate-900' }, 'Backtracking Exact Solver'),
              h('td', { className: 'text-center' }, [
                h('span', { className: 'badge badge-warning text-[11px]' }, 'Branch & Bound (Exact χ)')
              ]),
              h('td', { className: 'text-center font-extrabold text-emerald-700 text-sm' },
                `${allResults.backtracking.totalColors} (Optimal χ)`
              ),
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
                  : h('button', {
                      className: 'btn btn-secondary btn-sm text-[11px] py-0.5 px-2',
                      onClick: () => onSelectAlgorithm('backtracking')
                    }, 'Select')
              ])
            ])
          ])
        ])
      ])
    ]),

    // Tab Selector for Step-by-Step Inspector
    h('div', { className: 'card p-5' }, [
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200' }, [
        h('div', null, [
          h('h3', { className: 'font-bold text-slate-800 text-base' }, 'Detailed Step-by-Step Execution Trace'),
          h('p', { className: 'text-xs text-slate-500' }, 'Inspect the exact vertex traversal order, degrees, and color decisions.')
        ]),

        h('div', { className: 'inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs' }, [
          h('button', {
            className: `px-3 py-1.5 rounded-md font-bold transition-all ${
              selectedAlgTab === 'welsh-powell'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`,
            onClick: () => setSelectedAlgTab('welsh-powell')
          }, 'Welsh-Powell Trace'),
          h('button', {
            className: `px-3 py-1.5 rounded-md font-bold transition-all ${
              selectedAlgTab === 'greedy'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`,
            onClick: () => setSelectedAlgTab('greedy')
          }, 'Greedy Trace'),
          h('button', {
            className: `px-3 py-1.5 rounded-md font-bold transition-all ${
              selectedAlgTab === 'backtracking'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`,
            onClick: () => setSelectedAlgTab('backtracking')
          }, 'Backtracking Trace')
        ])
      ]),

      // Step table
      h('div', { className: 'table-container' }, [
        h('table', { className: 'data-table' }, [
          h('thead', null, [
            h('tr', null, [
              h('th', { style: { width: '70px' } }, 'Step #'),
              h('th', { style: { width: '120px' } }, 'Subject (Vertex)'),
              h('th', { style: { width: '100px', textAlign: 'center' } }, 'Degree d(v)'),
              h('th', { style: { width: '130px', textAlign: 'center' } }, 'Assigned Color / Slot'),
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
                  }, [
                    h('span', {
                      key: 'dot',
                      className: 'w-2 h-2 rounded-full inline-block mr-1.5',
                      style: { backgroundColor: colorInfo.hex }
                    }),
                    h('span', { key: 'txt' }, `Slot ${st.assignedColor}`)
                  ])
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

