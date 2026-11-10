// ExamSlot - CSV & Google Forms Import Component
const { createElement: h, useState } = React;
import {
  parseCSV,
  validateImportedData,
  generateSampleStudentsCSV,
  generateGoogleFormsSampleCSV,
  downloadFile
} from '../csvHelper.js';

export function ImportView({
  subjects,
  students,
  onCommitImport,
  onRestoreDefaults,
  liveSheetUrl = '',
  onUpdateLiveSheetUrl,
  isLiveSyncing = false,
  autoSyncEnabled = false,
  onToggleAutoSync,
  onTriggerLiveSync,
  lastSyncTime = null
}) {
  const [activeTab, setActiveTab] = useState('live-sync'); // 'live-sync' | 'upload' | 'google-forms-guide'
  const [importMode, setImportMode] = useState('replace'); // 'merge' | 'replace'
  const [previewResult, setPreviewResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [inputUrl, setInputUrl] = useState(liveSheetUrl || '');

  const handleFileUpload = (file) => {
    setErrorMsg('');
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMsg('Please upload a valid .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rows = parseCSV(text);
        const result = validateImportedData(rows, subjects, students);

        if (!result.isValid) {
          setErrorMsg(result.error || 'Failed to parse CSV file.');
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

    const validRecords = previewResult.records
      .filter((r) => r.isValid)
      .map((r) => ({
        id: r.id,
        name: r.name,
        department: r.department,
        semester: r.semester,
        academicYear: r.academicYear,
        subjects: r.subjects
      }));

    if (validRecords.length === 0) {
      alert('No valid student records found to import.');
      return;
    }

    onCommitImport(validRecords, importMode);
    alert(`Successfully imported ${validRecords.length} student records (${importMode === 'replace' ? 'replaced existing list' : 'merged with existing list'}).`);
    setPreviewResult(null);
  };

  return h('div', { className: 'space-y-6' }, [
    // Header & Tabs
    h('div', { className: 'card p-5 mb-0' }, [
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
        h('div', null, [
          h('h2', { className: 'text-xl font-bold text-slate-800' }, 'Data Import & Google Forms Integration'),
          h('p', { className: 'text-xs text-slate-500 mt-0.5' },
            'Batch import student subject registrations from spreadsheets or Google Forms exports with comprehensive pre-validation.'
          )
        ]),
        h('div', { className: 'flex flex-wrap gap-2' }, [
          h('button', {
            className: `btn btn-sm ${activeTab === 'live-sync' ? 'btn-primary' : 'btn-secondary'}`,
            onClick: () => setActiveTab('live-sync')
          }, '⚡ Live Google Sheet Sync'),
          h('button', {
            className: `btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`,
            onClick: () => setActiveTab('upload')
          }, '📤 Upload CSV File'),
          h('button', {
            className: `btn btn-sm ${activeTab === 'google-forms-guide' ? 'btn-primary' : 'btn-secondary'}`,
            onClick: () => setActiveTab('google-forms-guide')
          }, '📋 Google Forms Guide')
        ])
      ])
    ]),

    // TAB 0: Live Google Sheet Sync
    activeTab === 'live-sync' && h('div', { className: 'space-y-6' }, [
      h('div', { className: 'card p-6 border-2 border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 shadow-sm' }, [
        h('div', { className: 'flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200' }, [
          h('div', null, [
            h('div', { className: 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-2' }, [
              h('span', { className: 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' }),
              'REAL-TIME GOOGLE FORMS INTEGRATION'
            ]),
            h('h3', { className: 'text-lg font-bold text-slate-900' }, 'Live Google Sheets Response Sync'),
            h('p', { className: 'text-xs text-slate-600 mt-1' },
              'Link your Google Form responses spreadsheet directly. When students submit the form, ExamSlot automatically detects new registrations and updates the conflict graph!'
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

        // URL Input Row
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

          // Setup Guide Tip Card
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

          // Connection status
          lastSyncTime && h('div', { className: 'flex items-center gap-2 text-xs text-slate-600 pt-1' }, [
            h('span', { className: 'text-emerald-600 font-bold' }, '✓ Connected:'),
            h('span', null, `Last successfully synced at ${lastSyncTime}. (${students.length} student registrations currently loaded).`)
          ])
        ])
      ]),

      // Sample dataset quick restore card
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

    // TAB 1: Upload and Validation
    activeTab === 'upload' && h('div', { className: 'space-y-6' }, [
      // Dropzone and Template Downloads
      h('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' }, [
        // Dropzone
        h('div', { className: 'lg:col-span-2' }, [
          h('div', {
            className: `border-2 border-dashed rounded-xl p-8 text-center transition-all bg-white ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
            }`,
            onDragOver: (e) => {
              e.preventDefault();
              setIsDragging(true);
            },
            onDragLeave: () => setIsDragging(false),
            onDrop: (e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }
          }, [
            h('div', { className: 'text-4xl mb-3' }, '📁'),
            h('h3', { className: 'text-base font-bold text-slate-800 mb-1' }, 'Drag & drop student registration CSV here'),
            h('p', { className: 'text-xs text-slate-500 mb-4' },
              'Supports standard registration CSV files and Google Sheets CSV exports. Automatic column header detection.'
            ),
            h('label', { className: 'btn btn-primary btn-sm cursor-pointer' }, [
              h('span', null, 'Browse Local File'),
              h('input', {
                type: 'file',
                accept: '.csv',
                className: 'hidden',
                onChange: (e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }
              })
            ])
          ]),

          errorMsg && h('div', { className: 'mt-3 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200' },
            `⚠️ ${errorMsg}`
          )
        ]),

        // Template Downloads Card
        h('div', { className: 'card p-5 flex flex-col justify-between' }, [
          h('div', null, [
            h('h3', { className: 'font-bold text-slate-800 text-sm mb-2' }, 'Download Sample Templates'),
            h('p', { className: 'text-xs text-slate-500 mb-4 leading-relaxed' },
              'Use these pre-formatted templates to test importing with valid and multi-subject student records.'
            ),
            h('div', { className: 'space-y-2.5' }, [
              h('button', {
                className: 'btn btn-secondary btn-sm w-full text-xs justify-start',
                onClick: () => downloadFile(generateSampleStudentsCSV(), 'sample_students_template.csv')
              }, [
                h('span', { key: 'i' }, '📄'),
                h('span', { key: 't' }, 'Download Standard CSV Template')
              ]),
              h('button', {
                className: 'btn btn-secondary btn-sm w-full text-xs justify-start',
                onClick: () => downloadFile(generateGoogleFormsSampleCSV(), 'google_forms_responses_sample.csv')
              }, [
                h('span', { key: 'i' }, '📊'),
                h('span', { key: 't' }, 'Download Google Forms Sample CSV')
              ])
            ])
          ]),

          h('div', { className: 'mt-4 pt-3 border-t border-slate-100' }, [
            h('button', {
              className: 'btn btn-secondary btn-sm w-full text-xs text-slate-600',
              onClick: () => {
                if (confirm('Reset to the initial 8 subjects and 20 students dataset?')) {
                  onRestoreDefaults();
                }
              }
            }, '🔄 Restore Default 20-Student Dataset')
          ])
        ])
      ]),

      // Preview Table (Shown after CSV uploaded)
      previewResult && h('div', { className: 'card p-5 space-y-4' }, [
        h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200' }, [
          h('div', null, [
            h('h3', { className: 'font-bold text-slate-800 text-base' }, 'Data Import Preview & Validation'),
            h('div', { className: 'flex items-center gap-3 text-xs text-slate-500 mt-1' }, [
              h('span', null, `Total Records: ${previewResult.totalRows}`),
              h('span', null, '•'),
              h('span', { className: 'text-emerald-600 font-semibold' }, `Valid: ${previewResult.validCount}`),
              h('span', null, '•'),
              h('span', { className: 'text-amber-600 font-semibold' }, `Duplicates: ${previewResult.duplicateCount}`),
              h('span', null, '•'),
              h('span', { className: 'text-rose-600 font-semibold' }, `Unrecognized: ${previewResult.invalidSubjectCount}`)
            ])
          ]),

          // Import Options & Commit Button
          h('div', { className: 'flex items-center gap-3' }, [
            h('div', { className: 'flex items-center gap-2 bg-slate-100 p-1 rounded-lg text-xs' }, [
              h('label', { className: 'flex items-center gap-1 cursor-pointer px-2 py-1' }, [
                h('input', {
                  type: 'radio',
                  name: 'mode',
                  checked: importMode === 'merge',
                  onChange: () => setImportMode('merge')
                }),
                h('span', null, 'Merge & Update')
              ]),
              h('label', { className: 'flex items-center gap-1 cursor-pointer px-2 py-1' }, [
                h('input', {
                  type: 'radio',
                  name: 'mode',
                  checked: importMode === 'replace',
                  onChange: () => setImportMode('replace')
                }),
                h('span', null, 'Replace All')
              ])
            ]),

            h('button', {
              className: 'btn btn-primary btn-sm',
              onClick: handleCommit
            }, `Commit Import (${previewResult.validCount} Students)`)
          ])
        ]),

        // Preview Table
        h('div', { className: 'table-container max-h-96' }, [
          h('table', { className: 'data-table' }, [
            h('thead', null, [
              h('tr', null, [
                h('th', { style: { width: '60px' } }, 'Row'),
                h('th', { style: { width: '110px' } }, 'Student ID'),
                h('th', null, 'Student Name'),
                h('th', null, 'Department & Sem'),
                h('th', null, 'Recognized Subjects'),
                h('th', null, 'Validation Status')
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
                      r.subjects.map((sub) =>
                        h('span', { key: sub, className: 'badge badge-info text-[10px]' }, sub)
                      )
                    ),
                    r.unrecognizedSubjects && r.unrecognizedSubjects.length > 0 &&
                      h('div', { className: 'text-[10px] text-amber-700 mt-1' },
                        `Unknown: ${r.unrecognizedSubjects.join(', ')}`
                      )
                  ]),
                  h('td', null, [
                    h('span', {
                      className: `badge text-[10px] ${
                        r.isValid ? 'badge-success' : 'badge-danger'
                      }`
                    }, r.status || (r.isValid ? 'Valid' : 'Invalid'))
                  ])
                ])
              )
            )
          ])
        ])
      ])
    ]),

    // TAB 2: Google Forms Guide
    activeTab === 'google-forms-guide' && h('div', { className: 'space-y-6' }, [
      h('div', { className: 'card p-6' }, [
        h('h3', { className: 'text-base font-bold text-slate-800 mb-2' }, 'Step-by-Step Google Forms Integration Workflow'),
        h('p', { className: 'text-xs text-slate-600 mb-6 leading-relaxed' },
          'Google Forms is the industry standard for surveying student course preferences and semester registrations. Follow these 4 easy steps to capture student data and import it directly into ExamSlot with zero Google API credentials required.'
        ),

        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6' }, [
          // Step 1
          h('div', { className: 'p-4 rounded-xl border border-blue-200 bg-blue-50/50' }, [
            h('div', { className: 'w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-3' }, '1'),
            h('h4', { className: 'font-bold text-sm text-slate-900 mb-1' }, 'Create Google Form'),
            h('p', { className: 'text-xs text-slate-600 leading-relaxed' },
              'Add Short Answer for "Student ID" and "Full Name", Dropdowns for "Department" & "Semester", and a Checkbox Question: "Registered Subjects" listing all courses.'
            )
          ]),

          // Step 2
          h('div', { className: 'p-4 rounded-xl border border-indigo-200 bg-indigo-50/50' }, [
            h('div', { className: 'w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-3' }, '2'),
            h('h4', { className: 'font-bold text-sm text-slate-900 mb-1' }, 'Link to Google Sheet'),
            h('p', { className: 'text-xs text-slate-600 leading-relaxed' },
              'In the Google Forms "Responses" tab, click the green "Link to Sheets" icon. Responses will automatically populate in a spreadsheet.'
            )
          ]),

          // Step 3
          h('div', { className: 'p-4 rounded-xl border border-purple-200 bg-purple-50/50' }, [
            h('div', { className: 'w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs mb-3' }, '3'),
            h('h4', { className: 'font-bold text-sm text-slate-900 mb-1' }, 'Download CSV'),
            h('p', { className: 'text-xs text-slate-600 leading-relaxed' },
              'In Google Sheets, navigate to: File → Download → Comma Separated Values (.csv). The CSV saves directly to your computer.'
            )
          ]),

          // Step 4
          h('div', { className: 'p-4 rounded-xl border border-emerald-200 bg-emerald-50/50' }, [
            h('div', { className: 'w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-3' }, '4'),
            h('h4', { className: 'font-bold text-sm text-slate-900 mb-1' }, 'Upload to ExamSlot'),
            h('p', { className: 'text-xs text-slate-600 leading-relaxed' },
              'Drop the downloaded CSV file into ExamSlot. ExamSlot automatically parses multiple subjects, maps titles to codes, and verifies conflict pairs.'
            )
          ])
        ]),

        // Expected Columns Table
        h('div', { className: 'border border-slate-200 rounded-lg p-4 bg-slate-50' }, [
          h('h4', { className: 'font-bold text-xs uppercase tracking-wider text-slate-700 mb-3' }, 'Expected Field Header Formats in CSV'),
          h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs' }, [
            h('div', { className: 'bg-white p-2.5 rounded border border-slate-200' }, [
              h('div', { className: 'font-bold text-slate-800' }, 'Student ID'),
              h('div', { className: 'text-slate-500 text-[11px]' }, 'Accepts: Student ID, Roll No, Reg No, ID')
            ]),
            h('div', { className: 'bg-white p-2.5 rounded border border-slate-200' }, [
              h('div', { className: 'font-bold text-slate-800' }, 'Student Name'),
              h('div', { className: 'text-slate-500 text-[11px]' }, 'Accepts: Student Name, Full Name, Name')
            ]),
            h('div', { className: 'bg-white p-2.5 rounded border border-slate-200' }, [
              h('div', { className: 'font-bold text-slate-800' }, 'Department & Sem'),
              h('div', { className: 'text-slate-500 text-[11px]' }, 'Accepts: Department, Branch, Semester')
            ]),
            h('div', { className: 'bg-white p-2.5 rounded border border-slate-200' }, [
              h('div', { className: 'font-bold text-slate-800' }, 'Registered Subjects'),
              h('div', { className: 'text-slate-500 text-[11px]' }, 'Comma-separated codes or full names (e.g., "MATH, PY, DBMS")')
            ])
          ])
        ])
      ])
    ])
  ]);
}

