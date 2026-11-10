// ExamSlot - Conflict Detection & Matrix Component
const { createElement: h, useState } = React;
import { downloadFile } from '../csvHelper.js';

export function ConflictView({ graph, onNavigateTab }) {
  const [selectedPair, setSelectedPair] = useState(null); // { u, v, weight, commonStudents }
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all' | 'high' | 'medium' | 'low'
  const [searchTerm, setSearchTerm] = useState('');

  const subjectCodes = graph.subjectCodes;
  const matrix = graph.matrix;

  // Filtered conflict pairs
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
    const headers = ['Subject 1', 'Subject 2', 'Mutual Student Count', 'Common Student IDs'];
    const rows = graph.edges.map((e) => [
      e.source,
      e.target,
      e.weight,
      `"${e.commonStudents.map((s) => s.id).join('; ')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadFile(csvContent, 'exam_conflict_pairs.csv');
  };

  return h('div', { className: 'space-y-6' }, [
    // Header & Summary
    h('div', { className: 'card p-5 mb-0' }, [
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
        h('div', null, [
          h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Conflict Detection & Matrix Analysis'),
          h('p', { className: 'text-xs text-slate-500 mt-0.5' },
            `Computed ${graph.totalEdges} total conflict pairs (edges) across ${graph.totalVertices} subjects. Edge weights represent common student enrollments.`
          )
        ]),
        h('div', { className: 'flex items-center gap-3' }, [
          h('button', {
            className: 'btn btn-secondary btn-sm text-xs',
            onClick: exportConflictsCSV
          }, [
            h('span', { key: 'i' }, '📥'),
            h('span', { key: 't' }, 'Export Conflicts CSV')
          ]),
          h('button', {
            className: 'btn btn-primary btn-sm text-xs',
            onClick: () => onNavigateTab('graph')
          }, [
            h('span', { key: 'i' }, '🕸️'),
            h('span', { key: 't' }, 'View in Graph')
          ])
        ])
      ])
    ]),

    // Section 1: Interactive Conflict Matrix (Adjacency Matrix)
    h('div', { className: 'card p-5' }, [
      h('div', { className: 'card-title' }, [
        h('div', null, [
          h('span', null, '🔲 Conflict Adjacency Matrix (A)'),
          h('div', { className: 'text-xs text-slate-500 font-normal mt-0.5' },
            'Cell A[i][j] indicates number of students enrolled in both Subject i and Subject j. Click any cell to inspect common students.'
          )
        ]),
        h('div', { className: 'flex items-center gap-3 text-xs' }, [
          h('div', { className: 'flex items-center gap-1' }, [
            h('span', { className: 'w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block' }),
            h('span', { className: 'text-slate-600' }, '0 (No Clash)')
          ]),
          h('div', { className: 'flex items-center gap-1' }, [
            h('span', { className: 'w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block' }),
            h('span', { className: 'text-slate-600' }, '1-2 Students')
          ]),
          h('div', { className: 'flex items-center gap-1' }, [
            h('span', { className: 'w-3 h-3 rounded bg-red-200 border border-red-400 inline-block' }),
            h('span', { className: 'text-slate-600' }, '3+ Students')
          ])
        ])
      ]),

      // Scrollable Matrix Container
      h('div', { className: 'overflow-x-auto pb-2' }, [
        h('table', { className: 'border-collapse text-xs text-center mx-auto' }, [
          h('thead', null, [
            h('tr', null, [
              h('th', { className: 'p-2 bg-slate-100 text-slate-500 font-bold border border-slate-200 w-16' }, 'CODE'),
              subjectCodes.map((code) =>
                h('th', {
                  key: code,
                  className: 'p-2 bg-slate-100 font-mono font-bold text-slate-800 border border-slate-200 w-12'
                }, code)
              )
            ])
          ]),
          h('tbody', null,
            subjectCodes.map((u, i) =>
              h('tr', { key: u }, [
                h('th', { className: 'p-2 bg-slate-100 font-mono font-bold text-slate-800 border border-slate-200 text-left' }, u),
                subjectCodes.map((v, j) => {
                  if (i === j) {
                    return h('td', {
                      key: v,
                      className: 'p-2 bg-slate-200 text-slate-400 font-mono border border-slate-300 select-none'
                    }, '—');
                  }

                  const weight = matrix[i][j];
                  const details = graph.matrixDetails[i][j] || [];
                  const isConflict = weight > 0;

                  let cellBg = 'bg-white hover:bg-slate-50 text-slate-400';
                  if (weight >= 3) {
                    cellBg = 'bg-red-100 hover:bg-red-200 text-red-900 font-extrabold cursor-pointer border-red-300';
                  } else if (weight > 0) {
                    cellBg = 'bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold cursor-pointer border-amber-200';
                  }

                  return h('td', {
                    key: v,
                    className: `p-2 border border-slate-200 transition-all ${cellBg}`,
                    title: isConflict ? `${weight} students in both ${u} and ${v}. Click to inspect.` : 'No conflict',
                    onClick: () => {
                      if (isConflict) {
                        setSelectedPair({
                          u,
                          v,
                          weight,
                          commonStudents: details
                        });
                      }
                    }
                  }, weight > 0 ? weight : '0');
                })
              ])
            )
          ])
        ])
      ])
    ]),

    // Section 2: Conflict Pairs Table
    h('div', { className: 'card p-5' }, [
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4' }, [
        h('div', { className: 'card-title mb-0' }, [
          h('span', null, '⚡ Conflict Pairs & Edge Weights (|E|)'),
          h('span', { className: 'text-xs text-slate-500 font-normal ml-2' },
            `Showing ${filteredEdges.length} of ${graph.totalEdges} edges`
          )
        ]),

        // Search and Severity Filter
        h('div', { className: 'flex items-center gap-3' }, [
          h('input', {
            type: 'text',
            placeholder: 'Search courses...',
            className: 'form-input text-xs py-1.5 w-44',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }),
          h('select', {
            className: 'form-select text-xs py-1.5',
            value: filterSeverity,
            onChange: (e) => setFilterSeverity(e.target.value)
          }, [
            h('option', { value: 'all' }, 'All Severities'),
            h('option', { value: 'high' }, 'High (≥ 3 students)'),
            h('option', { value: 'medium' }, 'Medium (2 students)'),
            h('option', { value: 'low' }, 'Low (1 student)')
          ])
        ])
      ]),

      h('div', { className: 'table-container bg-white' }, [
        h('table', { className: 'data-table' }, [
          h('thead', null, [
            h('tr', null, [
              h('th', { style: { width: '130px' } }, 'Subject 1 (u)'),
              h('th', { style: { width: '130px' } }, 'Subject 2 (v)'),
              h('th', { style: { width: '110px', textAlign: 'center' } }, 'Weight (Mutual)'),
              h('th', { style: { width: '100px', textAlign: 'center' } }, 'Severity'),
              h('th', null, 'Common Students'),
              h('th', { style: { width: '90px', textAlign: 'center' } }, 'Action')
            ])
          ]),
          h('tbody', null,
            filteredEdges.length === 0
              ? h('tr', null, [
                  h('td', { colSpan: 6, className: 'text-center py-6 text-slate-400 italic' },
                    'No conflict pairs match the filter criteria.'
                  )
                ])
              : filteredEdges.map((e) => {
                  const severityBadge =
                    e.weight >= 3
                      ? h('span', { className: 'badge badge-danger text-[10px]' }, 'High')
                      : e.weight === 2
                      ? h('span', { className: 'badge badge-warning text-[10px]' }, 'Medium')
                      : h('span', { className: 'badge badge-info text-[10px]' }, 'Low');

                  return h('tr', { key: e.id }, [
                    h('td', { className: 'font-mono font-bold text-blue-700' }, e.source),
                    h('td', { className: 'font-mono font-bold text-blue-700' }, e.target),
                    h('td', { className: 'text-center font-extrabold text-slate-900 text-sm' }, e.weight),
                    h('td', { className: 'text-center' }, severityBadge),
                    h('td', null, [
                      h('div', { className: 'flex flex-wrap gap-1 text-xs' },
                        e.commonStudents.map((st) =>
                          h('span', {
                            key: st.id,
                            className: 'px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono text-slate-700 border border-slate-200'
                          }, `${st.id} (${st.name})`)
                        )
                      )
                    ]),
                    h('td', { className: 'text-center' }, [
                      h('button', {
                        className: 'btn btn-secondary btn-sm py-1 px-2 text-xs',
                        onClick: () => setSelectedPair({
                          u: e.source,
                          v: e.target,
                          weight: e.weight,
                          commonStudents: e.commonStudents
                        })
                      }, 'Inspect')
                    ])
                  ]);
                })
          )
        ])
      ])
    ]),

    // Modal: Common Students Details
    selectedPair && h('div', { className: 'modal-overlay', onClick: () => setSelectedPair(null) }, [
      h('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() }, [
        h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
          h('div', null, [
            h('h3', { className: 'text-lg font-bold text-slate-800' },
              `Conflict Edge: ${selectedPair.u} ⚡ ${selectedPair.v}`
            ),
            h('p', { className: 'text-xs text-slate-500' },
              `${selectedPair.weight} student(s) enrolled in both courses simultaneously.`
            )
          ]),
          h('button', {
            className: 'text-slate-400 hover:text-slate-600 font-bold text-xl',
            onClick: () => setSelectedPair(null)
          }, '✕')
        ]),

        h('div', { className: 'space-y-3 mb-4' }, [
          h('div', { className: 'p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-800' },
            `⚠️ Scheduling ${selectedPair.u} and ${selectedPair.v} at the same examination time slot is prohibited because these ${selectedPair.weight} students would experience an exam clash.`
          ),

          h('div', { className: 'table-container' }, [
            h('table', { className: 'data-table' }, [
              h('thead', null, [
                h('tr', null, [
                  h('th', null, 'Student ID'),
                  h('th', null, 'Student Name'),
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
          ])
        ]),

        h('div', { className: 'flex justify-end pt-3 border-t border-slate-200' }, [
          h('button', {
            className: 'btn btn-secondary text-xs',
            onClick: () => setSelectedPair(null)
          }, 'Close')
        ])
      ])
    ])
  ]);
}

