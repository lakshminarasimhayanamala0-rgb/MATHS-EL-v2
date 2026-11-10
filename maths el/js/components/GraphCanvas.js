// ExamSlot - Interactive Force-Directed Graph Visualization Component
// Uses HTML5 Canvas / SVG with interactive physics, node dragging, zoom/pan,
// degree badges, slot coloring, and detailed inspection.

export function createGraphCanvas({
  container,
  graph,
  coloring,
  palette,
  onSelectNode,
  onSelectEdge
}) {
  let width = container.clientWidth || 800;
  let height = container.clientHeight || 550;

  // Canvas setup
  const canvas = document.createElement('canvas');
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.display = 'block';
  canvas.style.cursor = 'grab';
  container.innerHTML = '';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  // Transform state (Pan & Zoom)
  let zoom = 1.0;
  let panX = width / 2;
  let panY = height / 2;
  let isPanning = false;
  let startPanX = 0;
  let startPanY = 0;

  // Node & Edge data structures for simulation
  const nodes = graph.subjectCodes.map((code, idx) => {
    // Distribute around circle initially
    const angle = (idx / (graph.subjectCodes.length || 1)) * 2 * Math.PI;
    const r = Math.min(width, height) * 0.32;
    return {
      id: code,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      vx: 0,
      vy: 0,
      radius: 28,
      degree: graph.degrees[code] || 0
    };
  });

  const nodeMap = new Map();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const edges = graph.edges.map((e) => ({
    source: nodeMap.get(e.source),
    target: nodeMap.get(e.target),
    weight: e.weight,
    rawEdge: e
  })).filter((e) => e.source && e.target);

  // Interaction State
  let draggedNode = null;
  let selectedNode = null;
  let selectedEdge = null;
  let hoveredNode = null;
  let isRunning = true;

  // Force simulation parameters
  const repulsion = 4500;
  const springLength = 140;
  const springK = 0.045;
  const damping = 0.88;
  const centerGravity = 0.035;

  function tick() {
    if (!isRunning) return;

    // Repulsion between all pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        let dx = n2.x - n1.x;
        let dy = n2.y - n1.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < 400) {
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          n1.vx -= fx;
          n1.vy -= fy;
          n2.vx += fx;
          n2.vy += fy;
        }
      }
    }

    // Spring forces along edges
    edges.forEach((e) => {
      const dx = e.target.x - e.source.x;
      const dy = e.target.y - e.source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const delta = dist - springLength;
      const force = delta * springK;

      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      e.source.vx += fx;
      e.source.vy += fy;
      e.target.vx -= fx;
      e.target.vy -= fy;
    });

    // Center gravity & update positions
    nodes.forEach((n) => {
      if (n === draggedNode) return;

      n.vx -= n.x * centerGravity;
      n.vy -= n.y * centerGravity;

      n.vx *= damping;
      n.vy *= damping;

      n.x += n.vx;
      n.y += n.vy;
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Draw grid background
    drawGrid();

    // Draw Edges
    edges.forEach((e) => {
      const isHighlighted =
        (selectedNode && (e.source.id === selectedNode.id || e.target.id === selectedNode.id)) ||
        (selectedEdge && selectedEdge === e.rawEdge);

      const isDimmed = selectedNode && !isHighlighted;

      ctx.beginPath();
      ctx.moveTo(e.source.x, e.source.y);
      ctx.lineTo(e.target.x, e.target.y);

      if (isHighlighted) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = Math.min(2 + e.weight * 1.5, 7);
      } else if (isDimmed) {
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.35)';
        ctx.lineWidth = 1;
      } else {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = Math.min(1.5 + e.weight * 0.8, 5);
      }
      ctx.stroke();

      // Draw weight label on edge if zoomed in or highlighted
      if (isHighlighted || zoom > 0.85) {
        const midX = (e.source.x + e.target.x) / 2;
        const midY = (e.source.y + e.target.y) / 2;
        
        ctx.fillStyle = isHighlighted ? '#b91c1c' : '#475569';
        ctx.font = 'bold 10px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Edge weight pill
        ctx.beginPath();
        ctx.arc(midX, midY, 9, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = isHighlighted ? '#ef4444' : '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = isHighlighted ? '#b91c1c' : '#334155';
        ctx.fillText(e.weight.toString(), midX, midY);
      }
    });

    // Draw Nodes
    nodes.forEach((n) => {
      const isSelected = selectedNode && selectedNode.id === n.id;
      const isHovered = hoveredNode && hoveredNode.id === n.id;
      const isNeighbor =
        selectedNode &&
        (graph.adjList[selectedNode.id] || []).some((item) => item.neighbor === n.id);
      const isDimmed = selectedNode && !isSelected && !isNeighbor;

      const slot = coloring ? coloring[n.id] : null;
      const colorEntry = slot ? palette[(slot - 1) % palette.length] : null;
      const nodeFill = colorEntry ? colorEntry.hex : '#3b82f6';

      // Halo for selection
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 6, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(100, 116, 139, 0.2)';
        ctx.fill();
      }

      // Main Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, 2 * Math.PI);
      ctx.fillStyle = isDimmed ? '#e2e8f0' : nodeFill;
      ctx.fill();

      ctx.strokeStyle = isSelected ? '#1e40af' : '#ffffff';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Node text label (Subject Code)
      ctx.fillStyle = isDimmed ? '#94a3b8' : '#ffffff';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.id, n.x, n.y - (slot ? 2 : 0));

      // Slot badge label below code
      if (slot && !isDimmed) {
        ctx.font = '8px -apple-system, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(`Slot ${slot}`, n.x, n.y + 11);
      }

      // Degree Badge (top right of vertex)
      const badgeX = n.x + n.radius * 0.72;
      const badgeY = n.y - n.radius * 0.72;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 9, 0, 2 * Math.PI);
      ctx.fillStyle = isDimmed ? '#94a3b8' : '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(`d:${n.degree}`, badgeX, badgeY);
    });

    ctx.restore();
  }

  function drawGrid() {
    const size = 60;
    const count = 25;
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = -count * size; x <= count * size; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, -count * size);
      ctx.lineTo(x, count * size);
      ctx.stroke();
    }
    for (let y = -count * size; y <= count * size; y += size) {
      ctx.beginPath();
      ctx.moveTo(-count * size, y);
      ctx.lineTo(count * size, y);
      ctx.stroke();
    }
  }

  // Animation Loop
  let animId;
  function loop() {
    tick();
    render();
    animId = requestAnimationFrame(loop);
  }
  loop();

  // Mouse & Touch Interaction Helpers
  function getMouseGraphCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const graphX = (mouseX - panX) / zoom;
    const graphY = (mouseY - panY) / zoom;
    return { graphX, graphY, mouseX, mouseY };
  }

  function findNodeAt(x, y) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = n.x - x;
      const dy = n.y - y;
      if (dx * dx + dy * dy <= (n.radius + 4) * (n.radius + 4)) {
        return n;
      }
    }
    return null;
  }

  function findEdgeAt(x, y) {
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const p1 = e.source;
      const p2 = e.target;
      const l2 = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
      if (l2 === 0) continue;
      let t = ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / l2;
      t = Math.max(0, Math.min(1, t));
      const projX = p1.x + t * (p2.x - p1.x);
      const projY = p1.y + t * (p2.y - p1.y);
      const dist = Math.hypot(x - projX, y - projY);
      if (dist < 10) {
        return e.rawEdge;
      }
    }
    return null;
  }

  // Event Listeners
  canvas.addEventListener('mousedown', (e) => {
    const { graphX, graphY, mouseX, mouseY } = getMouseGraphCoords(e);
    const clickedNode = findNodeAt(graphX, graphY);

    if (clickedNode) {
      draggedNode = clickedNode;
      selectedNode = clickedNode;
      selectedEdge = null;
      if (onSelectNode) onSelectNode(clickedNode.id);
      canvas.style.cursor = 'grabbing';
    } else {
      const clickedEdge = findEdgeAt(graphX, graphY);
      if (clickedEdge) {
        selectedEdge = clickedEdge;
        selectedNode = null;
        if (onSelectEdge) onSelectEdge(clickedEdge);
      } else {
        // Start panning
        isPanning = true;
        startPanX = mouseX - panX;
        startPanY = mouseY - panY;
        selectedNode = null;
        selectedEdge = null;
        if (onSelectNode) onSelectNode(null);
        if (onSelectEdge) onSelectEdge(null);
        canvas.style.cursor = 'move';
      }
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (draggedNode) {
      const { graphX, graphY } = getMouseGraphCoords(e);
      draggedNode.x = graphX;
      draggedNode.y = graphY;
      draggedNode.vx = 0;
      draggedNode.vy = 0;
    } else if (isPanning) {
      const rect = canvas.getBoundingClientRect();
      panX = e.clientX - rect.left - startPanX;
      panY = e.clientY - rect.top - startPanY;
    } else {
      const { graphX, graphY } = getMouseGraphCoords(e);
      const node = findNodeAt(graphX, graphY);
      if (node !== hoveredNode) {
        hoveredNode = node;
        canvas.style.cursor = node ? 'pointer' : 'grab';
      }
    }
  });

  window.addEventListener('mouseup', () => {
    draggedNode = null;
    isPanning = false;
    canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
  });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const newZoom = Math.max(0.3, Math.min(3.5, zoom * zoomFactor));

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    panX = mouseX - (mouseX - panX) * (newZoom / zoom);
    panY = mouseY - (mouseY - panY) * (newZoom / zoom);
    zoom = newZoom;
  });

  // Resize handler
  function handleResize() {
    width = container.clientWidth || 800;
    height = container.clientHeight || 550;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  window.addEventListener('resize', handleResize);

  // Return controls
  return {
    zoomIn: () => {
      zoom = Math.min(3.5, zoom * 1.2);
    },
    zoomOut: () => {
      zoom = Math.max(0.3, zoom * 0.8);
    },
    resetView: () => {
      zoom = 1.0;
      panX = width / 2;
      panY = height / 2;
    },
    togglePhysics: () => {
      isRunning = !isRunning;
      return isRunning;
    },
    selectNode: (code) => {
      selectedNode = nodeMap.get(code) || null;
      selectedEdge = null;
    },
    destroy: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    }
  };
}

