// ExamSlot - Navigation Bar Component
const { createElement: h } = React;

export function Navbar({
  activeTab,
  activeAlgorithm,
  totalSlots,
  isConflictFree,
  onResetData,
  onPrintTimetable,
  liveSheetUrl,
  isLiveSyncing,
  onTriggerLiveSync
}) {
  return h('header', { className: 'top-navbar' }, [
    // Left: Breadcrumb / Active View Title
    h('div', { key: 'left', className: 'flex items-center gap-3' }, [
      h('div', { className: 'text-xs uppercase tracking-wider font-semibold text-slate-400' }, 'ExamSlot / Academic Timetabler'),
      h('span', { className: 'text-slate-300' }, '•'),
      h('div', { className: 'text-sm font-bold text-slate-800 capitalize' }, activeTab.replace('-', ' '))
    ]),

    // Right: Status Badges and Quick Actions
    h('div', { key: 'right', className: 'flex items-center gap-3' }, [
      // Live Google Form Sync Button (if linked)
      liveSheetUrl && h('button', {
        className: 'btn btn-sm text-xs bg-emerald-600 text-white hover:bg-emerald-700 font-bold',
        onClick: onTriggerLiveSync,
        disabled: isLiveSyncing,
        title: 'Fetch latest student responses from linked Google Sheet'
      }, [
        h('span', { key: 'i' }, isLiveSyncing ? '⏳' : '🔄'),
        h('span', { key: 't' }, isLiveSyncing ? 'Syncing...' : 'Live Sync Form')
      ]),

      // Active Algorithm Badge
      h('div', {
        className: 'badge badge-info cursor-pointer',
        title: 'Current active timetabling algorithm'
      }, [
        h('span', { key: 'icon', className: 'mr-1' }, '⚙️'),
        h('span', { key: 'label' }, activeAlgorithm === 'welsh-powell' ? 'Welsh-Powell' : activeAlgorithm === 'greedy' ? 'Greedy' : 'Backtracking (Exact)')
      ]),

      // Conflict Free Status Badge
      h('div', {
        className: `badge ${isConflictFree ? 'badge-success' : 'badge-danger'}`,
        title: isConflictFree ? 'No students have simultaneous exams' : 'Exam conflicts detected in schedule'
      }, [
        h('span', { key: 'dot', className: 'mr-1' }, isConflictFree ? '●' : '▲'),
        h('span', { key: 'txt' }, isConflictFree ? `Conflict-Free (${totalSlots} Slots)` : 'Conflict Detected!')
      ]),

      // Action Buttons
      h('button', {
        className: 'btn btn-secondary btn-sm',
        onClick: onPrintTimetable,
        title: 'Print or export schedule to PDF'
      }, [
        h('span', { key: 'picon' }, '🖨️'),
        h('span', { key: 'plabel' }, 'Print Timetable')
      ]),

      h('button', {
        className: 'btn btn-secondary btn-sm text-slate-600',
        onClick: onResetData,
        title: 'Reset to sample 7 subjects & 20 students'
      }, [
        h('span', { key: 'ricon' }, '🔄'),
        h('span', { key: 'rlabel' }, 'Reset Sample Data')
      ])
    ])
  ]);
}

