// ExamSlot - Subject Management Component
const { createElement: h, useState } = React;

export function SubjectsView({
  subjects,
  graph,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Form State
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

    if (!trimmedCode) {
      setFormError('Subject code is required.');
      return;
    }
    if (!trimmedName) {
      setFormError('Subject title is required.');
      return;
    }

    // Check duplicate code
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

    if (editingSubject) {
      onUpdateSubject(editingSubject.code, payload);
    } else {
      onAddSubject(payload);
    }

    setModalOpen(false);
  };

  return h('div', { className: 'space-y-6' }, [
    // Header & Actions Bar
    h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 card mb-0 p-5' }, [
      h('div', null, [
        h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Subject / Course Management'),
        h('p', { className: 'text-xs text-slate-500 mt-0.5' },
          `Each subject corresponds to a Vertex v ∈ V in the conflict graph. Total: ${subjects.length} Vertices.`
        )
      ]),
      h('div', { className: 'flex items-center gap-3' }, [
        h('button', {
          className: 'btn btn-primary',
          onClick: openAddModal
        }, [
          h('span', { key: 'i' }, '➕'),
          h('span', { key: 't' }, 'Add New Subject')
        ])
      ])
    ]),

    // Subject Cards Grid
    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' },
      subjects.map((sub) => {
        const degree = graph.degrees[sub.code] || 0;
        const enrolled = graph.enrollmentMap[sub.code] || 0;
        const neighbors = (graph.adjList[sub.code] || []).map((item) => item.neighbor);

        return h('div', {
          key: sub.code,
          className: 'card mb-0 p-4 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between'
        }, [
          // Top section
          h('div', null, [
            h('div', { className: 'flex justify-between items-start mb-2' }, [
              h('span', { className: 'px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-mono font-extrabold text-sm' }, sub.code),
              h('span', {
                className: `badge ${degree > 4 ? 'badge-danger' : degree > 2 ? 'badge-warning' : 'badge-success'}`,
                title: `${degree} conflicting subjects`
              }, `Degree d: ${degree}`)
            ]),
            h('h3', { className: 'font-bold text-slate-900 text-sm mb-1 leading-snug' }, sub.name),
            h('div', { className: 'text-xs text-slate-500 mb-3' }, `${sub.department} • ${sub.semester || 'Sem 4'}`),

            // Metrics row
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

            // Conflicting subjects tags
            h('div', { className: 'mb-4' }, [
              h('div', { className: 'text-[11px] font-semibold text-slate-600 mb-1' }, 'Conflicts with:'),
              neighbors.length === 0
                ? h('span', { className: 'text-[11px] text-emerald-600 italic' }, 'No conflicts (Isolated vertex)')
                : h('div', { className: 'flex flex-wrap gap-1' },
                    neighbors.map((nCode) =>
                      h('span', {
                        key: nCode,
                        className: 'px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-700 border border-red-200 font-semibold'
                      }, nCode)
                    )
                  )
            ])
          ]),

          // Bottom actions
          h('div', { className: 'flex items-center justify-between pt-3 border-t border-slate-100' }, [
            h('button', {
              className: 'btn btn-secondary btn-sm text-xs py-1 px-2.5',
              onClick: () => openEditModal(sub)
            }, '✏️ Edit'),
            h('button', {
              className: 'btn btn-danger btn-sm text-xs py-1 px-2.5',
              onClick: () => {
                if (enrolled > 0) {
                  if (!confirm(`Warning: ${enrolled} students are currently enrolled in ${sub.code}. Deleting it will remove it from all student registrations. Proceed?`)) {
                    return;
                  }
                } else if (!confirm(`Delete subject ${sub.code} - ${sub.name}?`)) {
                  return;
                }
                onDeleteSubject(sub.code);
              }
            }, '🗑️ Delete')
          ])
        ]);
      })
    ),

    // Add / Edit Modal
    modalOpen && h('div', { className: 'modal-overlay', onClick: () => setModalOpen(false) }, [
      h('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() }, [
        h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
          h('h3', { className: 'text-lg font-bold text-slate-800' },
            editingSubject ? `Edit Subject: ${editingSubject.code}` : 'Add New Subject (Vertex)'
          ),
          h('button', {
            className: 'text-slate-400 hover:text-slate-600 font-bold text-xl',
            onClick: () => setModalOpen(false)
          }, '✕')
        ]),

        formError && h('div', { className: 'p-3 mb-4 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200' },
          `⚠️ ${formError}`
        ),

        h('form', { onSubmit: handleSave, className: 'space-y-4' }, [
          h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' }, [
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Subject Code (e.g., MATH, OS) *'),
              h('input', {
                type: 'text',
                className: 'form-input uppercase font-mono',
                placeholder: 'e.g., CLOUD',
                value: formCode,
                disabled: !!editingSubject,
                onChange: (e) => setFormCode(e.target.value)
              })
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Subject Full Title *'),
              h('input', {
                type: 'text',
                className: 'form-input',
                placeholder: 'e.g., Cloud Computing Architecture',
                value: formName,
                onChange: (e) => setFormName(e.target.value)
              })
            ])
          ]),

          h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' }, [
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Department'),
              h('input', {
                type: 'text',
                className: 'form-input',
                value: formDept,
                onChange: (e) => setFormDept(e.target.value)
              })
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Semester'),
              h('input', {
                type: 'text',
                className: 'form-input',
                value: formSem,
                onChange: (e) => setFormSem(e.target.value)
              })
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Credits'),
              h('input', {
                type: 'number',
                min: 1,
                max: 10,
                className: 'form-input',
                value: formCredits,
                onChange: (e) => setFormCredits(e.target.value)
              })
            ])
          ]),

          // Modal Footer
          h('div', { className: 'flex justify-end gap-3 pt-4 border-t border-slate-200' }, [
            h('button', {
              type: 'button',
              className: 'btn btn-secondary text-xs',
              onClick: () => setModalOpen(false)
            }, 'Cancel'),
            h('button', {
              type: 'submit',
              className: 'btn btn-primary text-xs'
            }, editingSubject ? 'Save Changes' : 'Create Subject')
          ])
        ])
      ])
    ])
  ]);
}

