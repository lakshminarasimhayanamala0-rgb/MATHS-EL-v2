// ExamSlot - Examination Timetable & Manual Adjustment Component
const { createElement: h, useState } = React;
import { exportTimetableToCSV, downloadFile } from '../csvHelper.js';
import { exportTimetableToPDF } from '../pdfExport.js';
import { validateSubjectSlotMove } from '../timetableGenerator.js';

export function TimetableView({
  timetable,
  graph,
  subjects,
  activeAlgorithm,
  examSettings,
  onUpdateExamSettings,
  onManualMoveSubject,
  onResetManualAdjustments
}) {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [moveModalData, setMoveModalData] = useState(null); // { subjectCode, currentSlot, targetSlot, validation }

  // Settings form state
  const [univName, setUnivName] = useState(examSettings.universityName);
  const [examTitle, setExamTitle] = useState(examSettings.examTitle);
  const [startDate, setStartDate] = useState(examSettings.startDate);
  const [morningTime, setMorningTime] = useState(examSettings.morningSession.time);
  const [afternoonTime, setAfternoonTime] = useState(examSettings.afternoonSession.time);
  const [skipSundays, setSkipSundays] = useState(examSettings.skipSundays);

  const handleOpenMoveModal = (subjectCode, currentSlot) => {
    // Default target slot to another slot
    const defaultTarget = currentSlot === 1 ? 2 : 1;
    const currentColoring = {};
    timetable.rows.forEach((r) => {
      r.subjects.forEach((s) => {
        currentColoring[s.code] = r.slotNumber;
      });
    });

    const validation = validateSubjectSlotMove(subjectCode, defaultTarget, currentColoring, graph);

    setMoveModalData({
      subjectCode,
      currentSlot,
      targetSlot: defaultTarget,
      validation,
      currentColoring
    });
  };

  const handleChangeTargetSlot = (newTarget) => {
    if (!moveModalData) return;
    const targetSlotNum = Number(newTarget);
    const validation = validateSubjectSlotMove(
      moveModalData.subjectCode,
      targetSlotNum,
      moveModalData.currentColoring,
      graph
    );

    setMoveModalData({
      ...moveModalData,
      targetSlot: targetSlotNum,
      validation
    });
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
    // Header & Actions Bar
    h('div', { className: 'card p-5 mb-0' }, [
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
        h('div', null, [
          h('div', { className: 'flex items-center gap-2 mb-1' }, [
            h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Automated Examination Timetable'),
            h('span', {
              className: `badge ${timetable.isConflictFree ? 'badge-success' : 'badge-danger'} text-xs font-bold`
            }, timetable.isConflictFree ? '✓ 100% Conflict-Free' : '⚠️ Clashes Present')
          ]),
          h('p', { className: 'text-xs text-slate-500' },
            `Generated via ${activeAlgorithm.replace('-', ' ')} algorithm. ${timetable.slotCount} examination sessions scheduled across ${Math.ceil(timetable.slotCount / 2)} examination days.`
          )
        ]),

        // Export and Action buttons
        h('div', { className: 'flex flex-wrap items-center gap-2' }, [
          h('button', {
            className: 'btn btn-secondary btn-sm text-xs',
            onClick: () => setSettingsModalOpen(true)
          }, [
            h('span', { key: 'i' }, '⚙️'),
            h('span', { key: 't' }, 'Exam Settings')
          ]),
          h('button', {
            className: 'btn btn-secondary btn-sm text-xs',
            onClick: () => {
              const csvData = exportTimetableToCSV(timetable);
              downloadFile(csvData, `Examination_Timetable_${new Date().toISOString().slice(0, 10)}.csv`);
            }
          }, [
            h('span', { key: 'i' }, '📄'),
            h('span', { key: 't' }, 'Export CSV')
          ]),
          h('button', {
            className: 'btn btn-primary btn-sm text-xs',
            onClick: () => exportTimetableToPDF(timetable, graph)
          }, [
            h('span', { key: 'i' }, '🖨️'),
            h('span', { key: 't' }, 'Export PDF / Print')
          ]),
          h('button', {
            className: 'btn btn-secondary btn-sm text-xs text-slate-500',
            title: 'Reset any manual drag/drop moves back to pure algorithmic assignment',
            onClick: onResetManualAdjustments
          }, '🔄 Reset Moves')
        ])
      ])
    ]),

    // Schedule Timeline Cards
    h('div', { className: 'space-y-4' },
      timetable.rows.map((row) => {
        return h('div', {
          key: row.slotNumber,
          className: `card p-5 border-l-4 transition-all ${
            row.hasConflict ? 'border-l-red-500 bg-red-50/20' : 'border-l-blue-600 bg-white'
          }`
        }, [
          // Row Header: Slot, Date, Session, Status
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
              row.hasConflict && h('span', { className: 'badge badge-danger text-xs font-bold' },
                '⚠️ Conflict Warning'
              )
            ])
          ]),

          // Warning box if intra-slot conflict exists
          row.hasConflict && h('div', { className: 'p-3 mb-4 rounded-lg bg-red-100 text-red-900 text-xs border border-red-300' }, [
            h('div', { className: 'font-bold mb-1' }, '⚠️ MANUAL ADJUSTMENT CONFLICT DETECTED:'),
            row.conflictingPairs.map((cp, idx) =>
              h('div', { key: idx, className: 'mt-0.5' },
                `• ${cp.sub1} and ${cp.sub2} share ${cp.weight} student(s): ${cp.commonStudents.map((s) => s.id).join(', ')}`
              )
            )
          ]),

          // Scheduled Subjects Grid
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

                // Move Button
                h('div', { className: 'mt-3 pt-2 border-t border-slate-200 flex justify-end' }, [
                  h('button', {
                    className: 'btn btn-secondary btn-sm text-[11px] py-1 px-2.5',
                    title: 'Move this subject to a different slot with live conflict checking',
                    onClick: () => handleOpenMoveModal(sub.code, row.slotNumber)
                  }, '↔️ Reschedule Slot')
                ])
              ])
            )
          )
        ]);
      })
    ),

    // Modal: Reschedule / Move Subject with Live Conflict Validation
    moveModalData && h('div', { className: 'modal-overlay', onClick: () => setMoveModalData(null) }, [
      h('div', { className: 'modal-content max-w-lg', onClick: (e) => e.stopPropagation() }, [
        h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
          h('div', null, [
            h('h3', { className: 'text-base font-bold text-slate-800' },
              `Reschedule Course: ${moveModalData.subjectCode}`
            ),
            h('p', { className: 'text-xs text-slate-500' },
              `Currently in Slot ${moveModalData.currentSlot}. Move to another slot with live conflict checking.`
            )
          ]),
          h('button', {
            className: 'text-slate-400 hover:text-slate-600 font-bold text-xl',
            onClick: () => setMoveModalData(null)
          }, '✕')
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

          // Live Validation Result Alert
          moveModalData.validation.isAllowed
            ? h('div', { className: 'p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800' }, [
                h('div', { className: 'font-bold mb-0.5 flex items-center gap-1.5' }, [
                  h('span', null, '✓'),
                  h('span', null, 'Safe to Move (0 Conflicts)')
                ]),
                h('div', null,
                  `Subject ${moveModalData.subjectCode} shares 0 mutual students with other courses scheduled in Slot ${moveModalData.targetSlot}.`
                )
              ])
            : h('div', { className: 'p-3 rounded-lg bg-red-50 border border-red-300 text-xs text-red-900' }, [
                h('div', { className: 'font-bold mb-1 flex items-center gap-1.5' }, [
                  h('span', null, '⚠️'),
                  h('span', null, 'CONFLICT WARNING: Collision Detected!')
                ]),
                h('p', { className: 'mb-2' },
                  `Moving ${moveModalData.subjectCode} to Slot ${moveModalData.targetSlot} violates conflict-free constraints with the following subject(s):`
                ),
                h('div', { className: 'space-y-1.5 bg-white p-2.5 rounded border border-red-200 max-h-36 overflow-y-auto' },
                  moveModalData.validation.conflicts.map((c, i) =>
                    h('div', { key: i, className: 'text-[11px]' }, [
                      h('div', { className: 'font-bold text-red-800' },
                        `• Clashes with ${c.targetSubject} (${c.weight} student${c.weight > 1 ? 's' : ''})`
                      ),
                      h('div', { className: 'text-slate-600 font-mono mt-0.5 pl-2' },
                        `Affected: ${c.commonStudents.map((s) => s.id).join(', ')}`
                      )
                    ])
                  )
                )
              ])
        ]),

        // Modal Actions
        h('div', { className: 'flex justify-end gap-3 pt-3 border-t border-slate-200' }, [
          h('button', {
            className: 'btn btn-secondary text-xs',
            onClick: () => setMoveModalData(null)
          }, 'Cancel'),
          h('button', {
            className: `btn text-xs ${moveModalData.validation.isAllowed ? 'btn-primary' : 'btn-danger'}`,
            onClick: handleConfirmMove
          }, moveModalData.validation.isAllowed ? 'Confirm Safe Move' : 'Force Move Anyway')
        ])
      ])
    ]),

    // Modal: Exam Settings
    settingsModalOpen && h('div', { className: 'modal-overlay', onClick: () => setSettingsModalOpen(false) }, [
      h('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() }, [
        h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
          h('h3', { className: 'text-base font-bold text-slate-800' }, 'Examination Schedule Parameters'),
          h('button', {
            className: 'text-slate-400 hover:text-slate-600 font-bold text-xl',
            onClick: () => setSettingsModalOpen(false)
          }, '✕')
        ]),

        h('form', { onSubmit: handleSaveSettings, className: 'space-y-4' }, [
          h('div', null, [
            h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'University / Institution Name'),
            h('input', {
              type: 'text',
              className: 'form-input',
              value: univName,
              onChange: (e) => setUnivName(e.target.value)
            })
          ]),
          h('div', null, [
            h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Examination Title'),
            h('input', {
              type: 'text',
              className: 'form-input',
              value: examTitle,
              onChange: (e) => setExamTitle(e.target.value)
            })
          ]),
          h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3' }, [
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Start Date'),
              h('input', {
                type: 'date',
                className: 'form-input',
                value: startDate,
                onChange: (e) => setStartDate(e.target.value)
              })
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Morning Window'),
              h('input', {
                type: 'text',
                className: 'form-input',
                value: morningTime,
                onChange: (e) => setMorningTime(e.target.value)
              })
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Afternoon Window'),
              h('input', {
                type: 'text',
                className: 'form-input',
                value: afternoonTime,
                onChange: (e) => setAfternoonTime(e.target.value)
              })
            ])
          ]),

          h('div', { className: 'pt-2' }, [
            h('label', { className: 'flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700' }, [
              h('input', {
                type: 'checkbox',
                checked: skipSundays,
                onChange: (e) => setSkipSundays(e.target.checked)
              }),
              h('span', null, 'Skip Sundays automatically during date scheduling')
            ])
          ]),

          // Footer
          h('div', { className: 'flex justify-end gap-3 pt-3 border-t border-slate-200' }, [
            h('button', {
              type: 'button',
              className: 'btn btn-secondary text-xs',
              onClick: () => setSettingsModalOpen(false)
            }, 'Cancel'),
            h('button', {
              type: 'submit',
              className: 'btn btn-primary text-xs'
            }, 'Apply Settings')
          ])
        ])
      ])
    ])
  ]);
}

