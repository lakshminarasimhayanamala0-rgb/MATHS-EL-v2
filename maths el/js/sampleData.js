// ExamSlot - Sample Dataset Definition
// Exactly 7 Subjects as configured in Google Forms:
// 1. MATH - Mathematics
// 2. PY - Python Programming
// 3. JAVA - Java Programming
// 4. OS - Operating Systems
// 5. COA - Computer Architecture
// 6. BE - Biology for Engineering
// 7. DCN - Data Communication and Networks

export const DATASET_VERSION = 'v2_7subjects';

export const INITIAL_SUBJECTS = [
  { code: 'MATH', name: 'Mathematics', department: 'Mathematics & Computing', semester: 'Sem 4', credits: 4 },
  { code: 'PY', name: 'Python Programming', department: 'Computer Science', semester: 'Sem 4', credits: 3 },
  { code: 'JAVA', name: 'Java Programming', department: 'Computer Science', semester: 'Sem 4', credits: 3 },
  { code: 'OS', name: 'Operating Systems', department: 'Computer Science', semester: 'Sem 4', credits: 4 },
  { code: 'COA', name: 'Computer Architecture', department: 'Computer Science', semester: 'Sem 4', credits: 4 },
  { code: 'BE', name: 'Biology for Engineering', department: 'Basic Sciences & Engineering', semester: 'Sem 4', credits: 3 },
  { code: 'DCN', name: 'Data Communication and Networks', department: 'Information Technology', semester: 'Sem 4', credits: 3 }
];

export const INITIAL_STUDENTS = [
  { id: 'STU001', name: 'Aarav Sharma', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'PY', 'COA'] },
  { id: 'STU002', name: 'Priya Patel', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'JAVA', 'OS'] },
  { id: 'STU003', name: 'Rohan Verma', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['COA', 'DCN', 'BE'] },
  { id: 'STU004', name: 'Sneha Reddy', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['JAVA', 'DCN', 'MATH'] },
  { id: 'STU005', name: 'Vikram Singh', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'OS', 'BE'] },
  { id: 'STU006', name: 'Ananya Iyer', department: 'AI & Data Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'BE', 'COA'] },
  { id: 'STU007', name: 'Rahul Nair', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'JAVA', 'DCN'] },
  { id: 'STU008', name: 'Pooja Gupta', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['COA', 'OS', 'BE'] },
  { id: 'STU009', name: 'Aditya Joshi', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'COA', 'DCN'] },
  { id: 'STU010', name: 'Kavya Menon', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['JAVA', 'OS', 'BE'] },
  { id: 'STU011', name: 'Siddharth Rao', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'PY', 'DCN'] },
  { id: 'STU012', name: 'Neha Kulkarni', department: 'AI & Data Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['COA', 'BE', 'JAVA'] },
  { id: 'STU013', name: 'Karthik Bhat', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['JAVA', 'COA', 'OS'] },
  { id: 'STU014', name: 'Divya Pillai', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'JAVA', 'BE'] },
  { id: 'STU015', name: 'Varun Deshmukh', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'OS', 'DCN'] },
  { id: 'STU016', name: 'Riya Sen', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['DCN', 'BE', 'MATH'] },
  { id: 'STU017', name: 'Manish Pandey', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'COA', 'DCN'] },
  { id: 'STU018', name: 'Tanvi Shah', department: 'AI & Data Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['PY', 'JAVA', 'DCN', 'BE'] },
  { id: 'STU019', name: 'Arjun Mehta', department: 'Information Technology', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['OS', 'DCN', 'COA'] },
  { id: 'STU020', name: 'Ishita Bose', department: 'Computer Science', semester: 'Sem 4', academicYear: '2026-2027', subjects: ['MATH', 'PY', 'OS', 'COA'] }
];

export const COLOR_PALETTE = [
  { slot: 1, name: 'Emerald', hex: '#10b981', light: '#d1fae5', text: '#065f46' },
  { slot: 2, name: 'Royal Blue', hex: '#3b82f6', light: '#dbeafe', text: '#1e40af' },
  { slot: 3, name: 'Amber', hex: '#f59e0b', light: '#fef3c7', text: '#92400e' },
  { slot: 4, name: 'Purple', hex: '#8b5cf6', light: '#ede9fe', text: '#5b21b6' },
  { slot: 5, name: 'Rose', hex: '#f43f5e', light: '#ffe4e6', text: '#9f1239' },
  { slot: 6, name: 'Cyan', hex: '#06b6d4', light: '#cffafe', text: '#155e75' },
  { slot: 7, name: 'Orange', hex: '#f97316', light: '#ffedd5', text: '#9a3412' },
  { slot: 8, name: 'Teal', hex: '#14b8a6', light: '#ccfbf1', text: '#115e59' },
  { slot: 9, name: 'Indigo', hex: '#6366f1', light: '#e0e7ff', text: '#3730a3' },
  { slot: 10, name: 'Lime', hex: '#84cc16', light: '#ecfccb', text: '#3f6212' },
  { slot: 11, name: 'Pink', hex: '#ec4899', light: '#fce7f3', text: '#831843' },
  { slot: 12, name: 'Slate', hex: '#64748b', light: '#f1f5f9', text: '#1e293b' }
];

export const DEFAULT_EXAM_SETTINGS = {
  startDate: '2026-11-16',
  morningSession: {
    name: 'Morning Session',
    time: '09:30 AM - 12:30 PM'
  },
  afternoonSession: {
    name: 'Afternoon Session',
    time: '02:00 PM - 05:00 PM'
  },
  skipSundays: true,
  universityName: 'APEX INSTITUTE OF TECHNOLOGY & ADVANCED STUDIES',
  examTitle: 'END SEMESTER EXAMINATIONS - AUTUMN 2026'
};
