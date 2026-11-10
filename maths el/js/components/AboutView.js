// ExamSlot - About Project & Mathematical Theory Documentation
const { createElement: h } = React;

export function AboutView() {
  return h('div', { className: 'space-y-6 max-w-5xl mx-auto' }, [
    // Header Hero
    h('div', { className: 'card p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white mb-0' }, [
      h('div', { className: 'inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 border border-blue-400/20 mb-3' },
        'Experiential Learning Project • Department of Mathematics & Computer Science'
      ),
      h('h2', { className: 'text-2xl font-black text-white tracking-tight' },
        'Mathematical Foundations of Examination Timetabling'
      ),
      h('p', { className: 'text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed' },
        'A comprehensive formalization of automated scheduling using Graph Theory, Vertex Coloring heuristics, and Exact Branch-and-Bound algorithms.'
      )
    ]),

    // Section 1: Graph Theory Fundamentals
    h('div', { className: 'card p-6 space-y-4' }, [
      h('h3', { className: 'text-lg font-bold text-slate-900 border-b border-slate-200 pb-2' },
        '1. Graph Theory Fundamentals: The Conflict Graph Model'
      ),
      h('p', { className: 'text-xs text-slate-700 leading-relaxed' },
        'In university examination scheduling, we model the problem as an undirected, weighted graph G = (V, E, W):'
      ),
      h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-xs' }, [
        h('div', { className: 'p-3 bg-slate-50 rounded-lg border border-slate-200' }, [
          h('div', { className: 'font-bold text-blue-800 mb-1' }, 'Vertices (V)'),
          h('p', { className: 'text-slate-600' },
            'Each vertex v ∈ V represents a unique academic subject or course offering (e.g., MATH, DBMS, OS).'
          )
        ]),
        h('div', { className: 'p-3 bg-slate-50 rounded-lg border border-slate-200' }, [
          h('div', { className: 'font-bold text-blue-800 mb-1' }, 'Edges (E)'),
          h('p', { className: 'text-slate-600' },
            'An edge e = (u, v) ∈ E exists if and only if at least one student is enrolled in both subject u and subject v.'
          )
        ]),
        h('div', { className: 'p-3 bg-slate-50 rounded-lg border border-slate-200' }, [
          h('div', { className: 'font-bold text-blue-800 mb-1' }, 'Edge Weights (W)'),
          h('p', { className: 'text-slate-600' },
            'The weight w(u, v) equals the exact count of shared students enrolled in both u and v simultaneously.'
          )
        ])
      ]),

      h('div', { className: 'p-4 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 space-y-2' }, [
        h('div', { className: 'font-bold text-slate-900' }, 'Formal Conflict Predicate:'),
        h('div', null, 'Let S be the set of registered students. For each student s ∈ S, let C(s) ⊆ V be s\'s registered courses.'),
        h('div', null, 'Edge (u, v) ∈ E ⟺ ∃ s ∈ S such that {u, v} ⊆ C(s)'),
        h('div', null, 'Edge Weight w(u, v) = |{ s ∈ S : u ∈ C(s) ∧ v ∈ C(s) }|')
      ])
    ]),

    // Section 2: Mathematical Formulations
    h('div', { className: 'card p-6 space-y-4' }, [
      h('h3', { className: 'text-lg font-bold text-slate-900 border-b border-slate-200 pb-2' },
        '2. Graph Metrics & Matrices'
      ),
      h('div', { className: 'space-y-3 text-xs text-slate-700' }, [
        h('div', { className: 'p-3 border border-slate-200 rounded-lg' }, [
          h('h4', { className: 'font-bold text-slate-900 mb-1' }, 'Adjacency Matrix A:'),
          h('p', { className: 'text-slate-600' },
            'An |V| × |V| symmetric square matrix where A[i][j] = w(vi, vj) if (vi, vj) ∈ E, and 0 otherwise. A[i][i] = 0 (no self-loops).'
          )
        ]),
        h('div', { className: 'p-3 border border-slate-200 rounded-lg' }, [
          h('h4', { className: 'font-bold text-slate-900 mb-1' }, 'Vertex Degree d(v):'),
          h('p', { className: 'text-slate-600' },
            'The degree d(v) of vertex v is the number of incident edges: d(v) = |{ u ∈ V : (u, v) ∈ E }|. Vertices with higher degree have more conflicts and must be prioritized.'
          )
        ]),
        h('div', { className: 'p-3 border border-slate-200 rounded-lg' }, [
          h('h4', { className: 'font-bold text-slate-900 mb-1' }, 'Graph Density D:'),
          h('p', { className: 'text-slate-600 font-mono' },
            'D = (2 · |E|) / (|V| · (|V| - 1))'
          ),
          h('p', { className: 'text-slate-500 mt-1' },
            'Measures the fraction of possible conflict edges present. D = 0 implies completely independent courses; D = 1 implies a complete graph K_n.'
          )
        ])
      ])
    ]),

    // Section 3: Proper Vertex Coloring & Chromatic Number
    h('div', { className: 'card p-6 space-y-4' }, [
      h('h3', { className: 'text-lg font-bold text-slate-900 border-b border-slate-200 pb-2' },
        '3. Proper Graph Coloring & Chromatic Number χ(G)'
      ),
      h('p', { className: 'text-xs text-slate-700 leading-relaxed' },
        'A proper k-vertex coloring of graph G is an assignment of k colors c: V → {1, 2, ..., k} such that:'
      ),
      h('div', { className: 'p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono text-blue-900 font-bold text-center' },
        '∀ (u, v) ∈ E ⟹ c(u) ≠ c(v)'
      ),
      h('p', { className: 'text-xs text-slate-700 leading-relaxed' },
        'In the examination timetabling context, each color represents a distinct non-overlapping examination time slot. The constraint ensures no student ever has two conflicting exams scheduled simultaneously.'
      ),
      h('div', { className: 'p-3 border border-slate-200 rounded-lg bg-slate-50 text-xs text-slate-700' }, [
        h('div', { className: 'font-bold text-slate-900 mb-1' }, 'Chromatic Number χ(G):'),
        h('p', null,
          'The chromatic number χ(G) is the minimum number of colors needed to properly color G. Mathematically, it represents the absolute minimum number of examination time slots needed to conduct all examinations without any student conflict.'
        ),
        h('div', { className: 'mt-2 font-mono text-[11px] text-slate-600' },
          'Theoretical Bounds: ω(G) ≤ χ(G) ≤ Δ(G) + 1  (Brooks\' Theorem: χ(G) ≤ Δ(G) unless G is complete or an odd cycle)'
        )
      ])
    ]),

    // Section 4: Algorithms Explained
    h('div', { className: 'card p-6 space-y-4' }, [
      h('h3', { className: 'text-lg font-bold text-slate-900 border-b border-slate-200 pb-2' },
        '4. Algorithmic Implementations in ExamSlot'
      ),

      // Welsh-Powell
      h('div', { className: 'p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2' }, [
        h('div', { className: 'flex justify-between items-center' }, [
          h('h4', { className: 'font-bold text-slate-900 text-sm' }, 'A. Welsh-Powell Algorithm (1967)'),
          h('span', { className: 'badge badge-info' }, 'O(V log V + V²)')
        ]),
        h('p', { className: 'text-slate-600' },
          'A greedy heuristic that orders vertices by degree to minimize color sprawl.'
        ),
        h('ol', { className: 'list-decimal list-inside space-y-1 text-slate-700 font-mono text-[11px] pl-2' }, [
          h('li', null, 'Calculate degree d(v) for all v ∈ V.'),
          h('li', null, 'Sort vertices in descending order of degree: d(v₁) ≥ d(v₂) ≥ ... ≥ d(vₙ).'),
          h('li', null, 'Assign Color 1 to the first uncolored vertex v₁.'),
          h('li', null, 'Traverse down the list and assign Color 1 to any uncolored vertex that has no edge to any vertex already colored with Color 1.'),
          h('li', null, 'Repeat with Color 2, 3, ... until all vertices are colored.')
        ])
      ]),

      // Greedy Coloring
      h('div', { className: 'p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2' }, [
        h('div', { className: 'flex justify-between items-center' }, [
          h('h4', { className: 'font-bold text-slate-900 text-sm' }, 'B. Greedy Graph Coloring'),
          h('span', { className: 'badge badge-neutral' }, 'O(V² + E)')
        ]),
        h('p', { className: 'text-slate-600' },
          'Considers vertices in arbitrary or input order. For each vertex v, scans the colors already assigned to its neighbors and assigns the lowest available color index.'
        ),
        h('p', { className: 'text-amber-800 font-semibold' },
          'Note: Greedy coloring is highly sensitive to vertex ordering. An adversarial ordering can use up to V/2 colors even on bipartite graphs (where χ=2).'
        ])
      ]),

      // Backtracking Exact Solver
      h('div', { className: 'p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2' }, [
        h('div', { className: 'flex justify-between items-center' }, [
          h('h4', { className: 'font-bold text-slate-900 text-sm' }, 'C. Backtracking Branch-and-Bound Exact Solver'),
          h('span', { className: 'badge badge-warning' }, 'O(k^V) [Branch & Bound]')
        ]),
        h('p', { className: 'text-slate-600' },
          'Computes the exact chromatic number χ(G). It determines whether G is k-colorable by searching a state space tree:'
        ),
        h('ul', { className: 'list-disc list-inside space-y-1 text-slate-700 text-[11px] pl-2' }, [
          h('li', null, 'Lower Bound Initialization: Uses Maximum Clique size ω(G) found via Bron-Kerbosch.'),
          h('li', null, 'Upper Bound Initialization: Uses Welsh-Powell heuristic output.'),
          h('li', null, 'Symmetry Breaking: At each branch, only considers colors up to (max_color_used + 1) to eliminate isomorphic color permutations.'),
          h('li', null, 'Guaranteed to find the true mathematical minimum time slots.')
        ])
      ])
    ]),

    // Project Info & Team
    h('div', { className: 'card p-6 text-xs text-slate-600 space-y-2 text-center' }, [
      h('div', { className: 'font-bold text-slate-800 text-sm' }, 'ExamSlot – Automated Timetabling System'),
      h('div', null, 'Built for Experiential Learning in Discrete Mathematics and Graph Theory.'),
      h('div', { className: 'text-slate-400 text-[11px]' }, 'React • Chart.js • Graph Theory • HTML5 Canvas • jsPDF • LocalStorage')
    ])
  ]);
}

