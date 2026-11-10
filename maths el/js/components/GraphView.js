// ExamSlot - Interactive Graph Visualization View Component
const { createElement: h, useEffect, useRef, useState } = React;
import { createGraphCanvas } from './GraphCanvas.js';
import { COLOR_PALETTE } from '../sampleData.js';

export function GraphView({
  graph,
  subjects,
  activeAlgorithm,
  activeResult,
  onSelectAlgorithm,
  onNavigateTab
}) {
  const containerRef = useRef(null);
  const canvasInstanceRef = useRef(null);
  const [selectedNodeCode, setSelectedNodeCode] = useState(null);
  const [selectedEdgeData, setSelectedEdgeData] = useState(null);
  const [isPhysicsRunning, setIsPhysicsRunning] = useState(true);

  // Initialize Canvas Graph
  useEffect(() => {
    if (!containerRef.current) return;

    const instance = createGraphCanvas({
      container: containerRef.current,
      graph,
      coloring: activeResult.coloring,
      palette: COLOR_PALETTE,
      onSelectNode: (code) => {
        setSelectedNodeCode(code);
        setSelectedEdgeData(null);
      },
      onSelectEdge: (edge) => {
        setSelectedEdgeData(edge);
        setSelectedNodeCode(null);
      }
    });

    canvasInstanceRef.current = instance;

    return () => {
      if (instance && instance.destroy) {
        instance.destroy();
      }
    };
  }, [graph, activeResult]);

  // Selected subject details
  const selectedSubject = selectedNodeCode
    ? subjects.find((s) => s.code === selectedNodeCode)
    : null;

  const selectedNodeSlot = selectedNodeCode
    ? activeResult.coloring[selectedNodeCode]
    : null;

  const selectedNodeColor = selectedNodeSlot
    ? COLOR_PALETTE[(selectedNodeSlot - 1) % COLOR_PALETTE.length]
    : null;

  const neighbors = selectedNodeCode
    ? graph.adjList[selectedNodeCode] || []
    : [];

  return h('div', { className: 'space-y-6' }, [
    // Top Controls Bar
    h('div', { className: 'card p-4 mb-0 flex flex-wrap items-center justify-between gap-4' }, [
      h('div', null, [
        h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Interactive Conflict Graph G = (V, E)'),
        h('p', { className: 'text-xs text-slate-500 mt-0.5' },
          'Vertices are colored by their assigned examination slot. Vertices connected by edges must never receive the same color.'
        )
      ]),

      // Controls: Zoom, Reset, Physics, Algorithm Switcher
      h('div', { className: 'flex flex-wrap items-center gap-2' }, [
        // Algorithm quick toggle
        h('div', { className: 'inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs' }, [
          h('button', {
            className: `px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeAlgorithm === 'welsh-powell'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`,
            onClick: () => onSelectAlgorithm('welsh-powell')
          }, 'Welsh-Powell'),
          h('button', {
            className: `px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeAlgorithm === 'greedy'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`,
            onClick: () => onSelectAlgorithm('greedy')
          }, 'Greedy'),
          h('button', {
            className: `px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeAlgorithm === 'backtracking'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`,
            onClick: () => onSelectAlgorithm('backtracking')
          }, 'Backtracking')
        ]),

        h('span', { className: 'text-slate-300' }, '|'),

        // Zoom & Physics Buttons
        h('button', {
          className: 'btn btn-secondary btn-sm py-1 px-2.5 text-xs',
          title: 'Zoom In',
          onClick: () => canvasInstanceRef.current && canvasInstanceRef.current.zoomIn()
        }, '🔍+ Zoom In'),
        h('button', {
          className: 'btn btn-secondary btn-sm py-1 px-2.5 text-xs',
          title: 'Zoom Out',
          onClick: () => canvasInstanceRef.current && canvasInstanceRef.current.zoomOut()
        }, '🔍- Zoom Out'),
        h('button', {
          className: 'btn btn-secondary btn-sm py-1 px-2.5 text-xs',
          title: 'Reset Center',
          onClick: () => canvasInstanceRef.current && canvasInstanceRef.current.resetView()
        }, '🎯 Center'),
        h('button', {
          className: `btn btn-sm py-1 px-2.5 text-xs ${isPhysicsRunning ? 'btn-secondary' : 'btn-primary'}`,
          title: 'Toggle Force Simulation',
          onClick: () => {
            if (canvasInstanceRef.current) {
              const state = canvasInstanceRef.current.togglePhysics();
              setIsPhysicsRunning(state);
            }
          }
        }, isPhysicsRunning ? '⏸️ Freeze' : '▶️ Unfreeze')
      ])
    ]),

    // Main Graph Layout (Canvas on Left, Inspector on Right)
    h('div', { className: 'grid grid-cols-1 lg:grid-cols-4 gap-6' }, [
      // Canvas Container (3 cols)
      h('div', { className: 'lg:col-span-3 card p-0 overflow-hidden relative border border-slate-200' }, [
        h('div', {
          ref: containerRef,
          className: 'w-full bg-slate-50 relative',
          style: { height: '560px' }
        }),

        // Overlay Instructions Pill
        h('div', { className: 'absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-[11px] text-slate-600 flex items-center gap-2 pointer-events-none' }, [
          h('span', { className: 'font-semibold text-blue-700' }, '💡 Controls:'),
          h('span', null, 'Drag nodes to reposition • Scroll to zoom • Drag background to pan • Click to inspect')
        ])
      ]),

      // Inspector Sidebar (1 col)
      h('div', { className: 'card p-5 flex flex-col justify-between' }, [
        h('div', null, [
          h('h3', { className: 'font-bold text-slate-800 text-sm mb-3 flex items-center gap-2 border-b border-slate-200 pb-2' }, [
            h('span', null, '🔍 Graph Element Inspector')
          ]),

          // State 1: Node Selected
          selectedNodeCode && selectedSubject && h('div', { className: 'space-y-4' }, [
            h('div', { className: 'p-3 rounded-lg border border-slate-200 bg-slate-50' }, [
              h('div', { className: 'flex justify-between items-start mb-1' }, [
                h('div', { className: 'font-mono text-lg font-black text-slate-900' }, selectedNodeCode),
                selectedNodeColor && h('span', {
                  className: 'badge text-xs',
                  style: { backgroundColor: selectedNodeColor.light, color: selectedNodeColor.text }
                }, `Slot ${selectedNodeSlot} (${selectedNodeColor.name})`)
              ]),
              h('div', { className: 'font-bold text-slate-800 text-xs' }, selectedSubject.name),
              h('div', { className: 'text-[11px] text-slate-500 mt-0.5' }, selectedSubject.department)
            ]),

            // Degree & Enrolled
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

            // Conflicting Neighbors List
            h('div', null, [
              h('div', { className: 'text-xs font-bold text-slate-700 mb-2' },
                `Conflicting Neighbors (${neighbors.length}):`
              ),
              neighbors.length === 0
                ? h('div', { className: 'text-xs text-emerald-600 italic' }, 'No conflicts with any other course.')
                : h('div', { className: 'space-y-1.5 max-h-48 overflow-y-auto pr-1' },
                    neighbors.map((nbr) => {
                      const nbrSlot = activeResult.coloring[nbr.neighbor];
                      const nbrColor = nbrSlot ? COLOR_PALETTE[(nbrSlot - 1) % COLOR_PALETTE.length] : null;

                      return h('div', {
                        key: nbr.neighbor,
                        className: 'flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs'
                      }, [
                        h('div', { className: 'flex items-center gap-1.5' }, [
                          h('span', { className: 'font-mono font-bold text-slate-800' }, nbr.neighbor),
                          nbrColor && h('span', {
                            className: 'w-2 h-2 rounded-full inline-block',
                            style: { backgroundColor: nbrColor.hex },
                            title: `Slot ${nbrSlot}`
                          })
                        ]),
                        h('span', { className: 'text-[11px] font-semibold text-rose-600' },
                          `${nbr.weight} student${nbr.weight > 1 ? 's' : ''}`
                        )
                      ]);
                    })
                  )
            ])
          ]),

          // State 2: Edge Selected
          selectedEdgeData && h('div', { className: 'space-y-4' }, [
            h('div', { className: 'p-3 rounded-lg border border-red-200 bg-red-50 text-red-900 text-xs' }, [
              h('div', { className: 'font-bold text-sm mb-1' }, 'Conflict Edge Selected'),
              h('div', { className: 'font-mono font-bold text-base text-red-800' },
                `${selectedEdgeData.source} ⚡ ${selectedEdgeData.target}`
              ),
              h('div', { className: 'mt-1' },
                `${selectedEdgeData.weight} student(s) enrolled in both courses simultaneously.`
              )
            ]),

            h('div', null, [
              h('div', { className: 'text-xs font-bold text-slate-700 mb-2' }, 'Common Students:'),
              h('div', { className: 'space-y-1 max-h-56 overflow-y-auto pr-1 text-xs' },
                selectedEdgeData.commonStudents.map((st) =>
                  h('div', {
                    key: st.id,
                    className: 'p-2 bg-white rounded border border-slate-200 text-[11px]'
                  }, [
                    h('span', { className: 'font-mono font-bold text-blue-700 mr-2' }, st.id),
                    h('span', { className: 'text-slate-800 font-medium' }, st.name)
                  ])
                )
              )
            ])
          ]),

          // State 3: Nothing Selected
          !selectedNodeCode && !selectedEdgeData && h('div', { className: 'text-center py-12 text-slate-400' }, [
            h('div', { className: 'text-3xl mb-2' }, '👆'),
            h('p', { className: 'text-xs' }, 'Click on any subject vertex or conflict edge in the graph to inspect mutual students and degree parameters.')
          ])
        ]),

        // Bottom CTA
        h('div', { className: 'pt-4 border-t border-slate-100' }, [
          h('button', {
            className: 'btn btn-primary btn-sm w-full text-xs',
            onClick: () => onNavigateTab('timetable')
          }, '📅 View Timetable Slots')
        ])
      ])
    ]),

    // Slot Color Legend Bar
    h('div', { className: 'card p-4' }, [
      h('div', { className: 'text-xs font-bold uppercase tracking-wider text-slate-500 mb-3' },
        `Examination Slot Color Legend (${activeResult.totalColors} Distinct Colors Used)`
      ),
      h('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3' },
        Array.from({ length: activeResult.totalColors }, (_, i) => i + 1).map((slotNum) => {
          const colorInfo = COLOR_PALETTE[(slotNum - 1) % COLOR_PALETTE.length];
          const subjectsInSlot = Object.entries(activeResult.coloring)
            .filter(([_, s]) => s === slotNum)
            .map(([code]) => code);

          return h('div', {
            key: slotNum,
            className: 'flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 bg-white'
          }, [
            h('div', {
              className: 'w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm',
              style: { backgroundColor: colorInfo.hex }
            }, slotNum),
            h('div', { className: 'overflow-hidden' }, [
              h('div', { className: 'text-xs font-bold text-slate-800' }, `Slot ${slotNum}`),
              h('div', { className: 'text-[10px] text-slate-500 truncate font-mono' },
                subjectsInSlot.join(', ') || 'Empty'
              )
            ])
          ]);
        })
      )
    ])
  ]);
}

