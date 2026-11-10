# ExamSlot: Automated Examination Timetabling via Graph Coloring Algorithms

[![Project Type](https://img.shields.io/badge/Project-Experiential%20Learning-blue.svg)](#)
[![Domain](https://img.shields.io/badge/Domain-Discrete%20Mathematics%20%26%20Graph%20Theory-purple.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#)
[![Status](https://img.shields.io/badge/Status-100%25%20Functional%20%26%20Tested-emerald.svg)](#)

---

## 1. Executive Summary

**ExamSlot** is a full-stack, modular web application designed for university academic departments and examination cells. It automates the generation of conflict-free examination timetables using **Graph Vertex Coloring** algorithms from discrete mathematics.

In modern university systems with elective courses and cross-departmental registrations, manual examination scheduling frequently produces catastrophic student collisions (where a student is scheduled to write two exams at the exact same hour) or leads to an excessive number of examination days. 

ExamSlot formalizes the examination scheduling problem into an undirected, weighted **Conflict Graph** $G = (V, E, W)$, calculates the chromatic number $\chi(G)$, and allocates conflict-free examination slots using three distinct algorithms:
1. **Welsh-Powell Algorithm** (Degree-ordered greedy heuristic)
2. **Greedy Graph Coloring** (Sequential greedy heuristic)
3. **Backtracking Exact Branch-and-Bound Solver** (Guarantees the absolute optimal chromatic number $\chi(G)$)

---

## 2. Key Features

- **Academic Dashboard**: High-level university metrics, registered students count, course vertex count $|V|$, conflict pairs $|E|$, slot count, exact chromatic number $\chi(G)$, density, and live execution runtime in milliseconds.
- **Student Management**: Full CRUD operations for student records with multi-subject selection, department tags, and search/filter capabilities.
- **Subject Management**: Manage course offerings, credits, semesters, and live vertex degree $d(v)$ indicators.
- **Dynamic Conflict Recalculation**: Graph edges, weights, and conflict matrices recalculate automatically upon every student/subject modification. Zero hardcoding of timetable slots!
- **Interactive Conflict Matrix ($N \times N$)**: Interactive matrix indicating mutual student overlap with clickable cells revealing common student names and IDs.
- **Interactive Physics-based Graph Visualization**: HTML5 Canvas force-directed graph with node drag-and-drop, zoom, pan, vertex degree badges, and inspection panels.
- **Automated Examination Timetable**:
  - Distributes subjects into morning ($09:30\text{ AM} - 12:30\text{ PM}$) and afternoon ($02:00\text{ PM} - 05:00\text{ PM}$) sessions.
  - Automatic date generation with optional Sunday skipping.
  - Interactive manual subject rescheduling with **real-time conflict collision detection alerts**.
  - One-click export to **CSV** and formatted **PDF** with official university verification headers.
- **Google Forms & CSV Import**: Step-by-step workflow guide and robust CSV parser supporting Google Forms checkbox response formats with preview and validation.
- **Analytics & Quantitative Reports**: Chart.js comparisons of slots used, execution times, vertex degrees, and timetable compression efficiency ($>50\%$ day reduction).
- **Zero-Dependency Execution**: Runs natively in any modern web browser without requiring Node.js, Python, or external compilers.

---

## 3. Mathematical Foundations

### 3.1 The Conflict Graph Formalism
Let $V = \{v_1, v_2, \dots, v_n\}$ denote the set of academic subjects (vertices).  
Let $S = \{s_1, s_2, \dots, s_m\}$ denote the set of registered students.  
For each student $s_k \in S$, let $C(s_k) \subseteq V$ denote the subset of subjects student $s_k$ is enrolled in.

An undirected edge $e = (u, v) \in E$ connects vertices $u$ and $v$ if and only if there exists at least one mutual student:
$$\{u, v\} \in E \iff \exists s_k \in S \text{ such that } \{u, v\} \subseteq C(s_k)$$

The edge weight $w(u, v)$ represents the collision severity:
$$w(u, v) = |\{ s_k \in S : u \in C(s_k) \land v \in C(s_k) \}|$$

### 3.2 Vertex Degree and Adjacency Matrix
- **Adjacency Matrix $A$**: An $|V| \times |V|$ symmetric matrix where:
  $$A_{ij} = \begin{cases} w(v_i, v_j) & \text{if } (v_i, v_j) \in E \\ 0 & \text{otherwise} \end{cases}$$
- **Vertex Degree $d(v)$**: Number of conflicting courses incident to vertex $v$:
  $$d(v) = \sum_{u \in V, u \ne v} \mathbb{I}[(u, v) \in E]$$
- **Graph Density $D$**:
  $$D = \frac{2|E|}{|V|(|V| - 1)}$$

### 3.3 Proper Vertex Coloring & Chromatic Number $\chi(G)$
A proper $k$-coloring of graph $G$ is a mapping $c: V \to \{1, 2, \dots, k\}$ such that:
$$\forall (u, v) \in E \implies c(u) \ne c(v)$$
Each color integer $k \in \{1, 2, \dots\}$ represents an examination time slot. The constraint guarantees that no student is ever double-booked for two exams at the same time.

The **Chromatic Number $\chi(G)$** is the minimal number of colors needed:
$$\chi(G) = \min \{ k : G \text{ is } k\text{-colorable} \}$$

**Theoretical Bounds:**
$$\omega(G) \le \chi(G) \le \Delta(G) + 1$$
Where:
- $\omega(G)$ is the size of the Maximum Clique (computed in ExamSlot via the Bron-Kerbosch algorithm).
- $\Delta(G) = \max_{v \in V} d(v)$ is the maximum vertex degree.
- By Brooks' Theorem, $\chi(G) \le \Delta(G)$ for any connected graph that is neither an odd cycle nor a complete graph.

---

## 4. Graph Coloring Algorithms Implemented

| Algorithm | Category | Time Complexity | Optimality Guarantee |
| :--- | :--- | :--- | :--- |
| **Welsh-Powell** | Degree-Ordered Heuristic | $O(V \log V + V^2)$ | Near-optimal heuristic (No guarantee) |
| **Greedy Coloring** | Sequential Heuristic | $O(V^2 + E)$ | Sensitive to vertex permutation |
| **Backtracking Exact** | Branch-and-Bound | $O(k^V)$ [Pruned] | **Mathematically Guaranteed Minimum $\chi(G)$** |

### 4.1 Welsh-Powell Algorithm
1. Calculate the degree $d(v)$ for all $v \in V$.
2. Sort vertices in descending order of degree: $d(v_1) \ge d(v_2) \ge \dots \ge d(v_n)$.
3. Assign Color 1 to the first uncolored vertex $v_1$.
4. Traverse down the sorted list and assign Color 1 to any uncolored vertex that is **non-adjacent** to every vertex already colored with Color 1.
5. Repeat with Color 2, 3, etc., until all vertices are colored.

> **Why it is a heuristic:** Welsh-Powell orders nodes purely by local degree. For certain graph topologies (e.g., Crown graphs or Mycielski graphs), degree-ordering does not reveal the global structure and may use $\chi(G) + 1$ or more colors.

### 4.2 Backtracking Exact Chromatic Solver
To guarantee the optimal timetable size, ExamSlot implements a recursive branch-and-bound solver:
- Lower bound initialized with Maximum Clique size $\omega(G)$ found via Bron-Kerbosch.
- Upper bound initialized with Welsh-Powell output.
- Symmetry-breaking pruning: At each state, if a color has never been used, only the first unused color index is explored, pruning isomorphic branches.

---

## 5. Sample Dataset

ExamSlot is pre-populated with **7 subjects** matching your examination questionnaire and **20 realistic students**:

### Subjects:
- `MATH`: Mathematics (Credits: 4, Sem 4)
- `PY`: Python Programming (Credits: 3, Sem 4)
- `JAVA`: Java Programming (Credits: 3, Sem 4)
- `OS`: Operating Systems (Credits: 4, Sem 4)
- `COA`: Computer Architecture (Credits: 4, Sem 4)
- `BE`: Biology for Engineering (Credits: 3, Sem 4)
- `DCN`: Data Communication and Networks (Credits: 3, Sem 4)

### 20 Students:
Enrolled in varying combinations of 2 to 4 subjects across Computer Science, Information Technology, and Basic Sciences departments. Conflicts are dynamically derived from their registrations.

---

## 6. Project Architecture

```
maths el/
├── index.html                  # Main Web Application Entry Point
├── package.json                # Project Metadata & Run Scripts
├── start.bat                   # 1-Click Windows Launcher (Starts server & opens browser)
├── serve.ps1                   # Zero-dependency PowerShell HTTP Server (built-in .NET)
├── css/
│   └── styles.css              # Academic styling, tables, badges, modals, print layout
├── js/
│   ├── bundle.js               # Unified production application bundle (Zero-CORS)
│   ├── app.js                  # Main React orchestrator & state manager
│   ├── sampleData.js           # Initial 8 subjects, 20 students, color palette, settings
│   ├── conflictDetector.js     # Conflict graph builder, adjacency matrix, overlap tracker
│   ├── graphAlgorithms.js      # Welsh-Powell, Greedy, Backtracking, Bron-Kerbosch, metrics
│   ├── timetableGenerator.js   # Slot assignment, date & session distributor, move validator
│   ├── csvHelper.js            # CSV parser, validator, Google Forms mapper, exporter
│   ├── pdfExport.js            # jsPDF & printable timetable generator
│   └── components/
│       ├── Navbar.js           # Top header with status badges & actions
│       ├── Sidebar.js          # Academic sidebar with 10 navigation views
│       ├── DashboardView.js    # Metric cards, quick actions, distribution charts
│       ├── StudentsView.js     # Student table, add/edit/delete modal, filters
│       ├── SubjectsView.js     # Subject cards, degrees, conflict lists
│       ├── ImportView.js       # Google Forms walkthrough, CSV dropzone, validator preview
│       ├── ConflictView.js     # Interactive NxN conflict matrix & conflict pairs table
│       ├── GraphView.js        # Interactive SVG/Canvas force graph with pan/zoom/drag
│       ├── AlgorithmsView.js   # Side-by-side benchmark & step-by-step trace
│       ├── TimetableView.js    # Morning/Afternoon timetable, manual move with clash alerts
│       ├── AnalysisView.js     # Theoretical metrics, formulas, efficiency comparisons
│       └── AboutView.js        # Mathematical documentation & theory
├── sample-data/
│   ├── sample_students.csv     # Pre-made CSV ready for test importing
│   └── google_forms_sample.csv # Google Forms format CSV for demonstration
└── tests/
    ├── test-runner.html        # Browser-based automated test suite (7 test suites)
    └── run-verification.ps1    # Automated file integrity and health script
```

---

## 7. How to Run the Application

You can run ExamSlot using **any** of the following methods:

### Method 1: Instant 1-Click Launch (Recommended for Windows)
Simply double-click:
```
start.bat
```
*This launches the built-in PowerShell web server at `http://localhost:3000` and automatically opens your default web browser.*

### Method 2: Direct Browser Launch (Zero-Setup)
Double-click `index.html` in Windows Explorer or open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari:
```
file:///c:/Users/HP/Downloads/maths%20el/index.html
```
*The app is engineered with zero CORS dependencies and will run immediately.*

### Method 3: PowerShell CLI
Open PowerShell in the project directory and run:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

### Method 4: Node.js / npx (Optional)
If Node.js is installed on your machine:
```bash
npx serve .
```

---

## 8. Google Forms Integration Guide

To collect student registrations via Google Forms and import them into ExamSlot:

1. **Create Google Form**:
   - Question 1 (Short Answer): `Student ID` (e.g., `STU001`)
   - Question 2 (Short Answer): `Full Name`
   - Question 3 (Dropdown): `Department`
   - Question 4 (Dropdown): `Semester`
   - Question 5 (Checkboxes): `Select Registered Subjects` (List all available subjects: Mathematics, Python Programming, Java, etc.)
2. **Link to Google Sheets**:
   - Go to the **Responses** tab in Google Forms.
   - Click the green **Link to Sheets** icon.
3. **Export CSV**:
   - In Google Sheets, navigate to: `File → Download → Comma Separated Values (.csv)`.
4. **Upload into ExamSlot**:
   - Navigate to the **Import Data** module in ExamSlot.
   - Drag and drop your `.csv` file.
   - Review the validation preview (detects duplicates, unknown course codes, and missing IDs).
   - Click **Commit Import**. The conflict graph and timetable update instantaneously!

---

## 9. Automated Testing & Verification

ExamSlot includes a comprehensive automated test suite testing:
- **Small Datasets**: 3 subjects, 2 conflicts ($A-B, B-C$) $\implies \chi = 2$.
- **Dense Complete Graphs**: $K_5$ ($5$ subjects, $10$ edges) $\implies \chi = 5$.
- **Sparse Disconnected Graphs**: Isolated vertices with 0 conflicts $\implies \chi = 1$.
- **Bipartite Graphs**: Even cycle $C_4$ ($4$ edges) $\implies \chi = 2$.
- **Sample Dataset Invariant**: Verifies all 3 algorithms produce valid colorings with 0 clashing edges.
- **CSV Parser Resilience**: Verifies duplicate student ID detection and invalid subject code flagging.
- **Empty Dataset Handling**: Confirms graceful zero-vertex execution without crashing.

### To Run the Automated Tests:
1. Open `tests/test-runner.html` in your web browser.
2. Or execute the PowerShell verification script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\tests\run-verification.ps1
   ```

---

## 10. Demonstration Walkthrough for Faculty Evaluation

1. **Dashboard Overview**: Show the 6 summary cards, graph density, and slot savings vs naive scheduling.
2. **Interactive Graph**:
   - Click and drag subject vertices.
   - Click on `MATH` to reveal incident conflict edges, degree $d(v)$, and student enrollment count.
   - Switch active algorithm from Welsh-Powell to Backtracking to observe node recoloring.
3. **Conflict Detection**:
   - Inspect the $N \times N$ Conflict Matrix.
   - Click a highlighted red cell (e.g., `MATH` and `DBMS`) to show the common students causing the conflict.
4. **Timetable & Manual Adjustment**:
   - Show the generated Morning and Afternoon session dates.
   - Click **Reschedule** on a course and attempt to move it to a conflicting slot: observe the immediate **Red Conflict Collision Alert** with student details!
   - Click **Export PDF** to preview the official university examination schedule.
5. **Add/Edit Student**:
   - Add a student with both `AI` and `CS`.
   - Show how the conflict edge between `AI` and `CS` is created dynamically.
6. **Import Module**:
   - Download the sample Google Forms CSV and re-import it to demonstrate CSV parsing and validation.

---

## 11. Authors & Academic Credits

- **Course**: Advanced Experiential Learning in Discrete Mathematics & Computer Science
- **Project**: ExamSlot – Automated Examination Timetabling via Graph Coloring
- **Academic Year**: 2026-2027

