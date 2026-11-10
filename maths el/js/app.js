// ExamSlot - Main Application Controller & State Orchestrator
const { createElement: h, useState, useMemo, useEffect } = React;

import { INITIAL_SUBJECTS, INITIAL_STUDENTS, DEFAULT_EXAM_SETTINGS, DATASET_VERSION } from './sampleData.js';
import { buildConflictGraph } from './conflictDetector.js';
import { runWelshPowell, runGreedyColoring, runBacktrackingColoring, calculateGraphMetrics } from './graphAlgorithms.js';
import { generateTimetable } from './timetableGenerator.js';
import { exportTimetableToPDF } from './pdfExport.js';
import { extractGoogleSheetCsvUrl, parseCSV, validateImportedData } from './csvHelper.js';

import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { DashboardView } from './components/DashboardView.js';
import { StudentsView } from './components/StudentsView.js';
import { SubjectsView } from './components/SubjectsView.js';
import { ImportView } from './components/ImportView.js';
import { ConflictView } from './components/ConflictView.js';
import { GraphView } from './components/GraphView.js';
import { AlgorithmsView } from './components/AlgorithmsView.js';
import { TimetableView } from './components/TimetableView.js';
import { AnalysisView } from './components/AnalysisView.js';
import { AboutView } from './components/AboutView.js';

export function App() {
  // 1. Data State with LocalStorage Persistence & Version Check
  const [subjects, setSubjects] = useState(() => {
    try {
      const savedVersion = localStorage.getItem('examslot_version');
      if (savedVersion !== DATASET_VERSION) {
        localStorage.setItem('examslot_version', DATASET_VERSION);
        localStorage.setItem('examslot_subjects', JSON.stringify(INITIAL_SUBJECTS));
        localStorage.setItem('examslot_students', JSON.stringify(INITIAL_STUDENTS));
        return INITIAL_SUBJECTS;
      }
      const saved = localStorage.getItem('examslot_subjects');
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch (e) {
      return INITIAL_SUBJECTS;
    }
  });

  const [students, setStudents] = useState(() => {
    try {
      const savedVersion = localStorage.getItem('examslot_version');
      if (savedVersion !== DATASET_VERSION) {
        return INITIAL_STUDENTS;
      }
      const saved = localStorage.getItem('examslot_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch (e) {
      return INITIAL_STUDENTS;
    }
  });

  const [examSettings, setExamSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('examslot_settings');
      return saved ? JSON.parse(saved) : DEFAULT_EXAM_SETTINGS;
    } catch (e) {
      return DEFAULT_EXAM_SETTINGS;
    }
  });

  // Google Forms Live Sync State
  const [liveSheetUrl, setLiveSheetUrl] = useState(() => {
    try {
      return localStorage.getItem('examslot_live_sheet_url') || '';
    } catch (e) {
      return '';
    }
  });
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Navigation and Algorithm Selection
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAlgorithm, setActiveAlgorithm] = useState('welsh-powell');
  const [manualColoring, setManualColoring] = useState(null);

  // Sync to LocalStorage
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

  // Live Sync Fetcher
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

  // 2. Dynamic Graph & Algorithms Computation
  // Automatically updates on ANY student or subject registration changes!
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

  // Effective Coloring (manual overrides take precedence if set)
  const effectiveColoring = useMemo(() => {
    if (manualColoring) {
      // Ensure all current subjects have a color
      const merged = { ...activeResult.coloring, ...manualColoring };
      return merged;
    }
    return activeResult.coloring;
  }, [manualColoring, activeResult]);

  // Timetable computation
  const timetable = useMemo(() => {
    return generateTimetable(effectiveColoring, conflictGraph, examSettings);
  }, [effectiveColoring, conflictGraph, examSettings]);

  // Graph Metrics computation
  const metrics = useMemo(() => {
    return calculateGraphMetrics(conflictGraph);
  }, [conflictGraph]);

  // 3. Handlers
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
    // Clean up student registrations
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
      // Merge by student ID
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
      return {
        ...current,
        [subjectCode]: targetSlot
      };
    });
  };

  const handleResetManualAdjustments = () => {
    setManualColoring(null);
  };

  // 4. Render Active View
  let activeViewComponent = null;

  switch (activeTab) {
    case 'dashboard':
      activeViewComponent = h(DashboardView, {
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
      activeViewComponent = h(StudentsView, {
        students,
        subjects,
        onAddStudent: handleAddStudent,
        onUpdateStudent: handleUpdateStudent,
        onDeleteStudent: handleDeleteStudent,
        onResetStudents: handleRestoreDefaults
      });
      break;

    case 'subjects':
      activeViewComponent = h(SubjectsView, {
        subjects,
        graph: conflictGraph,
        onAddSubject: handleAddSubject,
        onUpdateSubject: handleUpdateSubject,
        onDeleteSubject: handleDeleteSubject
      });
      break;

    case 'import':
      activeViewComponent = h(ImportView, {
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
      activeViewComponent = h(ConflictView, {
        graph: conflictGraph,
        onNavigateTab: setActiveTab
      });
      break;

    case 'graph':
      activeViewComponent = h(GraphView, {
        graph: conflictGraph,
        subjects,
        activeAlgorithm,
        activeResult,
        onSelectAlgorithm: setActiveAlgorithm,
        onNavigateTab: setActiveTab
      });
      break;

    case 'algorithms':
      activeViewComponent = h(AlgorithmsView, {
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
      activeViewComponent = h(TimetableView, {
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
      activeViewComponent = h(AnalysisView, {
        graph: conflictGraph,
        subjects,
        allResults,
        metrics,
        timetable
      });
      break;

    case 'about':
      activeViewComponent = h(AboutView);
      break;

    default:
      activeViewComponent = h(DashboardView, {
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
    // Sidebar Navigation
    h(Sidebar, {
      key: 'sidebar',
      activeTab,
      onSelectTab: setActiveTab,
      studentCount: students.length,
      subjectCount: subjects.length,
      conflictCount: conflictGraph.totalEdges,
      slotCount: timetable.slotCount
    }),

    // Main Content
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
      h('div', { key: 'body', className: 'content-body' }, activeViewComponent)
    ])
  ]);
}

