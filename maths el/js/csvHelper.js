// ExamSlot - CSV Import, Validation, Parsing & Export Helper
// Fully compatible with Google Forms responses exported from Google Sheets,
// Excel CSV exports, and custom registration spreadsheets.

/**
 * Robust CSV Line Parser that handles quotes, escaped commas, and trimmed values
 * @param {string} text - Raw CSV text
 * @returns {Array<Array<string>>} 2D array of rows and columns
 */
export function parseCSV(text) {
  const lines = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote: "" -> "
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentVal.trim());
      if (currentRow.some((field) => field.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  // Last value
  if (currentVal.length > 0 || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some((field) => field.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Detects headers and column mappings for standard format or Google Forms format
 * Google Forms headers commonly look like:
 * "Timestamp", "Student ID", "Full Name", "Department", "Semester", "Academic Year", "Registered Subjects"
 * @param {Array<string>} headers - Header row
 * @returns {Object} Column index mappings
 */
export function detectColumnMapping(headers) {
  const norm = headers.map((h) => h.toLowerCase().trim());

  const findIdx = (patterns) => {
    for (let p of patterns) {
      const idx = norm.findIndex((h) => h.includes(p));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  return {
    idIdx: findIdx(['student id', 'roll no', 'reg no', 'studentid', 'id', 'identifier']),
    nameIdx: findIdx(['name', 'student name', 'full name']),
    deptIdx: findIdx(['department', 'dept', 'branch', 'program']),
    semIdx: findIdx(['semester', 'sem', 'term']),
    yearIdx: findIdx(['academic year', 'year', 'batch', 'session']),
    subjectsIdx: findIdx(['registered subjects', 'subjects', 'courses', 'subject', 'course', 'papers'])
  };
}

/**
 * Validates imported rows against current subjects and student list
 * @param {Array<Array<string>>} rows - Parsed CSV rows (including header)
 * @param {Array} existingSubjects - Array of { code, name, ... }
 * @param {Array} existingStudents - Array of current students
 * @returns {Object} Validation summary, valid records, invalid records, warnings
 */
export function validateImportedData(rows, existingSubjects, existingStudents = []) {
  if (!rows || rows.length < 2) {
    return {
      isValid: false,
      error: 'CSV file must contain a header row and at least one student record.',
      records: []
    };
  }

  const header = rows[0];
  const dataRows = rows.slice(1);
  const mapping = detectColumnMapping(header);

  if (mapping.idIdx === -1 || mapping.subjectsIdx === -1) {
    return {
      isValid: false,
      error: 'Could not detect required columns ("Student ID" and "Registered Subjects"). Please check CSV format.',
      mapping,
      records: []
    };
  }

  const validSubjectCodes = new Set(existingSubjects.map((s) => s.code.toUpperCase()));
  const existingStudentIds = new Set(existingStudents.map((s) => s.id.toUpperCase()));
  const seenBatchIds = new Set();

  const previewRecords = [];
  let validCount = 0;
  let duplicateCount = 0;
  let invalidSubjectCount = 0;

  dataRows.forEach((row, rowIndex) => {
    const rawId = (row[mapping.idIdx] || '').trim();
    const rawName = mapping.nameIdx !== -1 ? (row[mapping.nameIdx] || `Student ${rowIndex + 1}`).trim() : `Student ${rowIndex + 1}`;
    const rawDept = mapping.deptIdx !== -1 ? (row[mapping.deptIdx] || 'General').trim() : 'General';
    const rawSem = mapping.semIdx !== -1 ? (row[mapping.semIdx] || 'Sem 4').trim() : 'Sem 4';
    const rawYear = mapping.yearIdx !== -1 ? (row[mapping.yearIdx] || '2026-2027').trim() : '2026-2027';
    const rawSubjectsStr = (row[mapping.subjectsIdx] || '').trim();

    // Parse subjects (split by commas, semicolons, or slashes)
    const rawSubjectTokens = rawSubjectsStr
      .split(/[,;\/|]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Normalize and match subjects
    const recognizedSubjects = [];
    const unrecognizedTokens = [];

    rawSubjectTokens.forEach((tok) => {
      // Direct code match (e.g., MATH, PY)
      const upperTok = tok.toUpperCase();
      if (validSubjectCodes.has(upperTok)) {
        if (!recognizedSubjects.includes(upperTok)) {
          recognizedSubjects.push(upperTok);
        }
        return;
      }

      // Try matching by subject name (e.g., "Mathematics" -> "MATH")
      const matchedByName = existingSubjects.find(
        (s) => s.name.toLowerCase() === tok.toLowerCase()
      );
      if (matchedByName) {
        if (!recognizedSubjects.includes(matchedByName.code)) {
          recognizedSubjects.push(matchedByName.code);
        }
        return;
      }

      unrecognizedTokens.push(tok);
    });

    const statusFlags = [];
    let isRowValid = true;

    if (!rawId) {
      statusFlags.push('Missing Student ID');
      isRowValid = false;
    } else {
      const upperId = rawId.toUpperCase();
      if (seenBatchIds.has(upperId)) {
        statusFlags.push('Duplicate ID in CSV');
        duplicateCount++;
        isRowValid = false;
      } else if (existingStudentIds.has(upperId)) {
        statusFlags.push('Overwrites Existing Student');
      }
      seenBatchIds.add(upperId);
    }

    if (unrecognizedTokens.length > 0) {
      statusFlags.push(`Unknown Subjects: ${unrecognizedTokens.join(', ')}`);
      invalidSubjectCount++;
    }

    if (recognizedSubjects.length < 1) {
      statusFlags.push('No Valid Subjects');
      isRowValid = false;
    }

    if (isRowValid && statusFlags.length === 0) {
      statusFlags.push('Valid');
      validCount++;
    } else if (isRowValid && statusFlags.every((f) => f.startsWith('Overwrites'))) {
      validCount++;
    }

    previewRecords.push({
      rowIndex: rowIndex + 2, // 1-based, accounting for header
      id: rawId.toUpperCase(),
      name: rawName,
      department: rawDept,
      semester: rawSem,
      academicYear: rawYear,
      subjects: recognizedSubjects,
      unrecognizedSubjects: unrecognizedTokens,
      rawSubjects: rawSubjectsStr,
      isValid: isRowValid && recognizedSubjects.length > 0,
      status: statusFlags.join('; ')
    });
  });

  return {
    isValid: true,
    totalRows: dataRows.length,
    validCount,
    duplicateCount,
    invalidSubjectCount,
    records: previewRecords
  };
}

/**
 * Generates CSV string for Examination Timetable export
 * @param {Object} timetable - Timetable object from generateTimetable
 * @returns {string} Formatted CSV content
 */
export function exportTimetableToCSV(timetable) {
  const headers = [
    'Slot Number',
    'Date',
    'Day',
    'Session',
    'Time Window',
    'Subject Codes',
    'Subject Names',
    'Total Students Writing',
    'Conflict Status'
  ];

  const rows = timetable.rows.map((row) => {
    const codes = row.subjects.map((s) => s.code).join('; ');
    const names = row.subjects.map((s) => s.name).join('; ');
    const conflictStatus = row.hasConflict ? 'CONFLICT DETECTED' : 'CONFLICT-FREE';

    return [
      `Slot ${row.slotNumber}`,
      `"${row.formattedDate}"`,
      `"${row.dayName}"`,
      `"${row.sessionType}"`,
      `"${row.sessionTime}"`,
      `"${codes}"`,
      `"${names}"`,
      row.totalStudents,
      `"${conflictStatus}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Generates sample CSV template for standard student import
 * @returns {string} CSV template
 */
export function generateSampleStudentsCSV() {
  return [
    'Student ID,Full Name,Department,Semester,Academic Year,Registered Subjects',
    'STU101,Anil Kumble,Computer Science,Sem 4,2026-2027,"MATH, PY, COA"',
    'STU102,Smriti Mandhana,Information Technology,Sem 4,2026-2027,"JAVA, DCN, BE"',
    'STU103,Rohit Sharma,Computer Science,Sem 4,2026-2027,"OS, COA, PY"',
    'STU104,Harmanpreet Kaur,AI & Data Science,Sem 4,2026-2027,"MATH, BE, COA"',
    'STU105,Jasprit Bumrah,Information Technology,Sem 4,2026-2027,"JAVA, OS, DCN"'
  ].join('\r\n');
}

/**
 * Generates sample CSV matching Google Forms exported responses
 * @returns {string} CSV content
 */
export function generateGoogleFormsSampleCSV() {
  return [
    'Timestamp,Student ID,Student Name,Department,Semester,Academic Year,Select Registered Subjects',
    '2026-11-01 10:14:22,STU201,Kavita Krishnan,Computer Science,Sem 4,2026-2027,"MATH - Mathematics, PY - Python Programming, COA- Computer Architecture"',
    '2026-11-01 10:15:45,STU202,Devendra Soni,Information Technology,Sem 4,2026-2027,"JAVA - Java Programming, DCN- Data Communication and Networks, BE- Biology for Engineering"',
    '2026-11-01 10:18:10,STU203,Meera Nambiar,AI & Data Science,Sem 4,2026-2027,"OS - Operating Systems, COA- Computer Architecture, PY - Python Programming"',
    '2026-11-01 10:22:30,STU204,Farhan Akhtar,Computer Science,Sem 4,2026-2027,"MATH - Mathematics, OS - Operating Systems, BE- Biology for Engineering"',
    '2026-11-01 10:30:12,STU205,Ritika Sen,Information Technology,Sem 4,2026-2027,"JAVA - Java Programming, DCN- Data Communication and Networks, COA- Computer Architecture"'
  ].join('\r\n');
}

/**
 * Extracts a live fetchable CSV URL from any Google Sheets URL or ID
 * @param {string} input - Google Sheets URL, published URL, or Sheet ID
 * @returns {string} Live CSV endpoint URL
 */
export function extractGoogleSheetCsvUrl(input) {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';

  if (trimmed.includes('pub?output=csv') || trimmed.includes('gviz/tq?tqx=out:csv')) {
    return trimmed;
  }
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv`;
  }
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    return `https://docs.google.com/spreadsheets/d/${trimmed}/gviz/tq?tqx=out:csv`;
  }
  return trimmed;
}

/**
 * Triggers browser download of a text/CSV file
 * @param {string} content - File content
 * @param {string} filename - Target filename
 */
export function downloadFile(content, filename, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

