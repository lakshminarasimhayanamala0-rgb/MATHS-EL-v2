// ExamSlot - Academic Sidebar Component
const { createElement: h } = React;

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: null },
  { id: 'students', label: 'Students', icon: '👨‍🎓', badge: 'students' },
  { id: 'subjects', label: 'Subjects', icon: '📚', badge: 'subjects' },
  { id: 'import', label: 'Import Data', icon: '📥', badge: 'Forms' },
  { id: 'conflicts', label: 'Conflict Detection', icon: '⚡', badge: 'conflicts' },
  { id: 'graph', label: 'Graph Visualization', icon: '🕸️', badge: null },
  { id: 'algorithms', label: 'Graph Coloring', icon: '🎨', badge: '3 Alg' },
  { id: 'timetable', label: 'Examination Timetable', icon: '🗓️', badge: 'slots' },
  { id: 'analysis', label: 'Analysis & Reports', icon: '📈', badge: null },
  { id: 'about', label: 'About Project', icon: '📖', badge: null }
];

export function Sidebar({
  activeTab,
  onSelectTab,
  studentCount,
  subjectCount,
  conflictCount,
  slotCount
}) {
  return h('aside', { className: 'sidebar' }, [
    // Header Branding
    h('div', { key: 'header', className: 'sidebar-header' }, [
      h('div', { className: 'flex items-center gap-3' }, [
        h('div', {
          className: 'w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl font-bold border border-white/20'
        }, 'Ω'),
        h('div', null, [
          h('h1', { className: 'text-base font-bold tracking-tight text-white leading-tight' }, 'ExamSlot'),
          h('p', { className: 'text-xs text-blue-200 opacity-90' }, 'Automated Timetabling')
        ])
      ]),
      h('div', { className: 'mt-3 text-[11px] text-blue-200/80 uppercase tracking-wider font-semibold' }, 'Experiential Learning System')
    ]),

    // Navigation Menu
    h('nav', { key: 'nav', className: 'sidebar-nav' }, [
      MENU_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        let badgeVal = null;

        if (item.badge === 'students') badgeVal = studentCount;
        else if (item.badge === 'subjects') badgeVal = subjectCount;
        else if (item.badge === 'conflicts') badgeVal = conflictCount;
        else if (item.badge === 'slots') badgeVal = `${slotCount} slots`;
        else if (item.badge) badgeVal = item.badge;

        return h('div', {
          key: item.id,
          className: `nav-item ${isActive ? 'active' : ''}`,
          onClick: () => onSelectTab(item.id)
        }, [
          h('span', { key: 'icon', className: 'nav-icon' }, item.icon),
          h('span', { key: 'label', className: 'flex-1' }, item.label),
          badgeVal !== null && h('span', {
            key: 'badge',
            className: `text-[10px] px-2 py-0.5 rounded-full font-bold ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600'
            }`
          }, badgeVal)
        ]);
      })
    ]),

    // Sidebar Footer
    h('div', { key: 'footer', className: 'p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center' }, [
      h('div', { className: 'font-semibold text-slate-700' }, 'Graph Theory Engine v2.0'),
      h('div', { className: 'mt-0.5 text-slate-400' }, 'Academic Timetable Generator')
    ])
  ]);
}

