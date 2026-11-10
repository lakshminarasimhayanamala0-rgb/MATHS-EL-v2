// ExamSlot - Examination Timetable Generator
// Generates conflict-free timetable schedules from graph-coloring results,
// manages morning/afternoon sessions, handles dates, and validates manual adjustments.

import { COLOR_PALETTE, DEFAULT_EXAM_SETTINGS } from './sampleData.js';
import { checkSlotConflict } from './conflictDetector.js';

/**
 * Generates dates for exam slots, skipping Sundays if configured
 * @param {string} startDateStr - YYYY-MM-DD
 * @param {number} totalSlots - Number of examination slots
 * @param {boolean} skipSundays - Whether to avoid scheduling on Sundays
 * @returns {Array} Array of { slot, date, dayName, sessionType, sessionTime }
 */
export function generateSlotSchedules(startDateStr, totalSlots, settings = DEFAULT_EXAM_SETTINGS) {
  const schedules = [];
  const start = new Date(startDateStr);

  let currentDate = new Date(start);
  let slotIndex = 1;
  let isMorning = true;

  while (slotIndex <= totalSlots) {
    // If skipping Sundays and current day is Sunday (0), increment date
    if (settings.skipSundays && currentDate.getDay() === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const isoDate = currentDate.toISOString().split('T')[0];

    const sessionType = isMorning ? 'Morning' : 'Afternoon';
    const sessionTime = isMorning
      ? settings.morningSession.time
      : settings.afternoonSession.time;

    schedules.push({
      slot: slotIndex,
      isoDate,
      formattedDate,
      dayName,
      sessionType,
      sessionTime
    });

    slotIndex++;

    // Toggle session: After afternoon, move to next day
    if (!isMorning) {
      currentDate.setDate(currentDate.getDate() + 1);
      isMorning = true;
    } else {
      isMorning = false;
    }
  }

  return schedules;
}

/**
 * Builds the complete examination timetable
 * @param {Object} coloring - Map of subjectCode -> slotNumber
 * @param {Object} graph - Conflict graph
 * @param {Object} settings - Exam settings (dates, titles)
 * @returns {Object} Timetable structure
 */
export function generateTimetable(coloring, graph, settings = DEFAULT_EXAM_SETTINGS) {
  const slotCount = Math.max(...Object.values(coloring), 0);
  const slotSchedules = generateSlotSchedules(settings.startDate, slotCount, settings);

  // Group subjects by slot
  const slotsMap = {};
  for (let s = 1; s <= slotCount; s++) {
    slotsMap[s] = [];
  }

  const subjectMetaMap = {};
  graph.subjects.forEach((subj) => {
    subjectMetaMap[subj.code] = subj;
  });

  Object.entries(coloring).forEach(([code, slot]) => {
    if (!slotsMap[slot]) {
      slotsMap[slot] = [];
    }
    const meta = subjectMetaMap[code] || { code, name: code, department: 'N/A' };
    const enrolledCount = graph.enrollmentMap[code] || 0;

    slotsMap[slot].push({
      code,
      name: meta.name,
      department: meta.department,
      semester: meta.semester || 'N/A',
      credits: meta.credits || 3,
      enrolledCount,
      colorInfo: COLOR_PALETTE[(slot - 1) % COLOR_PALETTE.length]
    });
  });

  // Calculate timetable rows with conflict verification
  const rows = slotSchedules.map((schedule) => {
    const subjectsInSlot = slotsMap[schedule.slot] || [];
    const totalStudentsInSlot = subjectsInSlot.reduce((sum, s) => sum + s.enrolledCount, 0);

    // Verify intra-slot conflict: does any pair in this slot have an edge in the graph?
    let hasIntraConflict = false;
    const conflictingPairs = [];

    for (let i = 0; i < subjectsInSlot.length; i++) {
      for (let j = i + 1; j < subjectsInSlot.length; j++) {
        const u = subjectsInSlot[i].code;
        const v = subjectsInSlot[j].code;
        const edge = graph.edges.find(
          (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
        );
        if (edge && edge.weight > 0) {
          hasIntraConflict = true;
          conflictingPairs.push({
            sub1: u,
            sub2: v,
            weight: edge.weight,
            commonStudents: edge.commonStudents
          });
        }
      }
    }

    return {
      ...schedule,
      slotNumber: schedule.slot,
      colorInfo: COLOR_PALETTE[(schedule.slot - 1) % COLOR_PALETTE.length],
      subjects: subjectsInSlot,
      totalStudents: totalStudentsInSlot,
      hasConflict: hasIntraConflict,
      conflictingPairs
    };
  });

  const totalConflictsInTimetable = rows.reduce(
    (acc, row) => acc + (row.conflictingPairs ? row.conflictingPairs.length : 0),
    0
  );

  return {
    rows,
    slotsMap,
    slotCount,
    totalConflicts: totalConflictsInTimetable,
    isConflictFree: totalConflictsInTimetable === 0,
    settings
  };
}

/**
 * Validates moving a subject to a target slot
 * @param {string} subjectCode - Subject to move
 * @param {number} targetSlot - Target slot number
 * @param {Object} currentColoring - Current coloring map
 * @param {Object} graph - Conflict graph
 * @returns {Object} Validation result { allowed: boolean, conflicts: Array }
 */
export function validateSubjectSlotMove(subjectCode, targetSlot, currentColoring, graph) {
  // Find subjects currently in targetSlot
  const existingInTarget = Object.entries(currentColoring)
    .filter(([code, slot]) => slot === targetSlot && code !== subjectCode)
    .map(([code]) => code);

  const conflicts = [];
  existingInTarget.forEach((otherCode) => {
    const edge = graph.edges.find(
      (e) => (e.source === subjectCode && e.target === otherCode) ||
             (e.source === otherCode && e.target === subjectCode)
    );
    if (edge && edge.weight > 0) {
      conflicts.push({
        targetSubject: otherCode,
        weight: edge.weight,
        commonStudents: edge.commonStudents
      });
    }
  });

  return {
    isAllowed: conflicts.length === 0,
    conflicts
  };
}

