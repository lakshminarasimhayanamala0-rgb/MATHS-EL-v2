// ExamSlot - Student Management Component
const { createElement: h, useState, useMemo } = React;

export function StudentsView({
  students,
  subjects,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onResetStudents
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formDept, setFormDept] = useState('Computer Science');
  const [formSem, setFormSem] = useState('Sem 4');
  const [formYear, setFormYear] = useState('2026-2027');
  const [formSubjects, setFormSubjects] = useState([]);
  const [formError, setFormError] = useState('');

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSubject =
        !selectedSubjectFilter || (s.subjects || []).includes(selectedSubjectFilter);

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

    if (!trimmedId) {
      setFormError('Student ID is required.');
      return;
    }
    if (!trimmedName) {
      setFormError('Student name is required.');
      return;
    }
    if (formSubjects.length < 1) {
      setFormError('Please select at least 1 registered subject.');
      return;
    }

    // Check duplicate ID
    if (!editingStudent && students.some((s) => s.id.toUpperCase() === trimmedId)) {
      setFormError(`Student ID "${trimmedId}" already exists. Please choose a unique ID.`);
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

    if (editingStudent) {
      onUpdateStudent(editingStudent.id, payload);
    } else {
      onAddStudent(payload);
    }

    setModalOpen(false);
  };

  return h('div', { className: 'space-y-6' }, [
    // Header & Actions Bar
    h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 card mb-0 p-5' }, [
      h('div', null, [
        h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Student Registrations'),
        h('p', { className: 'text-xs text-slate-500 mt-0.5' },
          `Managing ${students.length} student course enrollments. Every change automatically recalculates the conflict graph.`
        )
      ]),
      h('div', { className: 'flex items-center gap-3' }, [
        h('button', {
          className: 'btn btn-primary',
          onClick: openAddModal
        }, [
          h('span', { key: 'i' }, '➕'),
          h('span', { key: 't' }, 'Add New Student')
        ])
      ])
    ]),

    // Search and Filters Bar
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
          subjects.map((sub) =>
            h('option', { key: sub.code, value: sub.code }, `${sub.code} - ${sub.name}`)
          )
        ]),
        (searchTerm || selectedSubjectFilter) && h('button', {
          className: 'btn btn-secondary btn-sm text-xs',
          onClick: () => {
            setSearchTerm('');
            setSelectedSubjectFilter('');
          }
        }, 'Clear Filters')
      ])
    ]),

    // Students Data Table
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
        h('tbody', null, [
          filteredStudents.length === 0
            ? h('tr', null, [
                h('td', { colSpan: 6, className: 'text-center py-8 text-slate-400 italic' },
                  'No matching students found.'
                )
              ])
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
                      (st.subjects || []).map((code) =>
                        h('span', {
                          key: code,
                          className: 'badge badge-neutral bg-blue-50 text-blue-800 border border-blue-200'
                        }, code)
                      )
                    )
                  ]),
                  h('td', { className: 'text-center font-bold text-slate-700' }, (st.subjects || []).length),
                  h('td', { className: 'text-center' }, [
                    h('div', { className: 'flex items-center justify-center gap-2' }, [
                      h('button', {
                        className: 'btn btn-secondary btn-sm py-1 px-2 text-xs',
                        title: 'Edit student',
                        onClick: () => openEditModal(st)
                      }, '✏️ Edit'),
                      h('button', {
                        className: 'btn btn-danger btn-sm py-1 px-2 text-xs',
                        title: 'Delete student',
                        onClick: () => {
                          if (confirm(`Delete student ${st.name} (${st.id})?`)) {
                            onDeleteStudent(st.id);
                          }
                        }
                      }, '🗑️')
                    ])
                  ])
                ])
              )
        ])
      ])
    ]),

    // Add / Edit Modal
    modalOpen && h('div', { className: 'modal-overlay', onClick: () => setModalOpen(false) }, [
      h('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() }, [
        h('div', { className: 'flex justify-between items-center mb-4 pb-3 border-b border-slate-200' }, [
          h('h3', { className: 'text-lg font-bold text-slate-800' },
            editingStudent ? `Edit Student: ${editingStudent.id}` : 'Add New Student Record'
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
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Student ID *'),
              h('input', {
                type: 'text',
                className: 'form-input uppercase font-mono',
                placeholder: 'e.g., STU021',
                value: formId,
                disabled: !!editingStudent,
                onChange: (e) => setFormId(e.target.value)
              })
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Full Name *'),
              h('input', {
                type: 'text',
                className: 'form-input',
                placeholder: 'e.g., Jane Doe',
                value: formName,
                onChange: (e) => setFormName(e.target.value)
              })
            ])
          ]),

          h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' }, [
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Department'),
              h('select', {
                className: 'form-select',
                value: formDept,
                onChange: (e) => setFormDept(e.target.value)
              }, [
                h('option', { value: 'Computer Science' }, 'Computer Science'),
                h('option', { value: 'Information Technology' }, 'Information Technology'),
                h('option', { value: 'AI & Data Science' }, 'AI & Data Science'),
                h('option', { value: 'Electronics & Comm' }, 'Electronics & Comm'),
                h('option', { value: 'Mathematics & Computing' }, 'Mathematics & Computing')
              ])
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Semester'),
              h('select', {
                className: 'form-select',
                value: formSem,
                onChange: (e) => setFormSem(e.target.value)
              }, [
                h('option', { value: 'Sem 1' }, 'Semester 1'),
                h('option', { value: 'Sem 2' }, 'Semester 2'),
                h('option', { value: 'Sem 3' }, 'Semester 3'),
                h('option', { value: 'Sem 4' }, 'Semester 4'),
                h('option', { value: 'Sem 5' }, 'Semester 5'),
                h('option', { value: 'Sem 6' }, 'Semester 6'),
                h('option', { value: 'Sem 7' }, 'Semester 7'),
                h('option', { value: 'Sem 8' }, 'Semester 8')
              ])
            ]),
            h('div', null, [
              h('label', { className: 'block text-xs font-semibold text-slate-600 mb-1' }, 'Academic Year'),
              h('input', {
                type: 'text',
                className: 'form-input',
                value: formYear,
                onChange: (e) => setFormYear(e.target.value)
              })
            ])
          ]),

          // Registered Subjects Selector
          h('div', null, [
            h('div', { className: 'flex justify-between items-center mb-2' }, [
              h('label', { className: 'text-xs font-semibold text-slate-700' },
                `Select Registered Subjects (${formSubjects.length} selected) *`
              ),
              h('span', { className: 'text-[11px] text-slate-400' }, 'Click to toggle courses')
            ]),
            h('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-2 border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-48 overflow-y-auto' },
              subjects.map((sub) => {
                const isSelected = formSubjects.includes(sub.code);
                return h('div', {
                  key: sub.code,
                  onClick: () => toggleSubject(sub.code),
                  className: `cursor-pointer p-2 rounded-lg border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                  }`
                }, [
                  h('div', { className: 'font-bold' }, sub.code),
                  h('div', { className: `text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}` }, sub.name)
                ]);
              })
            )
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
            }, editingStudent ? 'Save Changes' : 'Add Student')
          ])
        ])
      ])
    ])
  ]);
}

