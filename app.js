// Interactive SVG Mind Map & Inorganic Chemistry Relationship App

(function () {
  const svg = document.getElementById("diagramSvg");
  const viewport = document.getElementById("svgViewport");
  const canvasPane = document.getElementById("canvasPane");
  const inspectorPane = document.getElementById("inspectorPane");
  const tablePane = document.getElementById("tablePane");
  const propertiesPane = document.getElementById("propertiesPane");
  const propertiesGrid = document.getElementById("propertiesGrid");
  const legendBar = document.getElementById("legendBar");
  const extendedToggleWrap = document.getElementById("extendedToggleWrap");
  const toggleExtended = document.getElementById("toggleExtended");

  const inspectorBadge = document.getElementById("inspectorBadge");
  const inspectorTitle = document.getElementById("inspectorTitle");
  const inspectorBody = document.getElementById("inspectorBody");

  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");
  const searchResults = document.getElementById("searchResults");

  const zoomLabel = document.getElementById("zoomLabel");
  const tableFilterSelect = document.getElementById("tableFilterSelect");
  const tableContent = document.getElementById("tableContent");

  let currentTab = "relation"; // 'relation' | 'salt' | 'table'
  let showExtended = true;
  let activeSelection = null; // { type: 'link'|'node'|'method'|'branch', id: string }

  // Pan & Zoom state
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let startPanX = 0;
  let startPanY = 0;

  // --- 1. Uniqueness Verification ---
  function normalizeEq(raw) {
    const [lhs, rhs] = raw.split("->");
    const normSide = (s) =>
      s
        .split("+")
        .map((x) => x.trim().replace(/\s+/g, ""))
        .sort()
        .join("+");
    return normSide(lhs) + "->" + normSide(rhs);
  }

  function verifyUniqueEquations() {
    const seen = new Map();
    const duplicates = [];
    let total = 0;

    RELATION_DIAGRAM.links.forEach((link) => {
      link.equations.forEach((eq) => {
        total++;
        const key = normalizeEq(eq.raw);
        if (seen.has(key)) {
          duplicates.push({ eq: eq.raw, first: seen.get(key), second: link.title });
        } else {
          seen.set(key, link.title);
        }
      });
    });

    SALT_MINDMAP.branches.forEach((branch) => {
      branch.methods.forEach((method) => {
        method.equations.forEach((eq) => {
          total++;
          const key = normalizeEq(eq.raw);
          if (seen.has(key)) {
            duplicates.push({ eq: eq.raw, first: seen.get(key), second: method.title });
          } else {
            seen.set(key, method.title);
          }
        });
      });
    });

    const badge = document.getElementById("uniquenessBadge");
    const text = document.getElementById("uniquenessText");
    if (duplicates.length === 0) {
      badge.classList.remove("error");
      text.textContent = `${total}/${total} PTHH duy nhất (0 trùng lặp)`;
    } else {
      badge.classList.add("error");
      text.textContent = `Phát hiện ${duplicates.length} PTHH trùng!`;
    }
  }

  // --- SVG Helpers ---
  function svgEl(tag, attrs = {}, textContent = null) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
    if (textContent !== null) el.textContent = textContent;
    return el;
  }

  function applyTransform() {
    const g = svg.querySelector("#panZoomLayer");
    if (g) {
      g.setAttribute("transform", `translate(${panX}, ${panY}) scale(${zoom})`);
    }
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function resetView() {
    zoom = 1;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  // --- 2. Render Diagram 1: Relationship Map ---
  function renderRelationDiagram() {
    svg.innerHTML = "";
    const vb = RELATION_DIAGRAM.viewBox;
    svg.setAttribute("viewBox", `0 0 ${vb.width} ${vb.height}`);

    const defs = svgEl("defs");
    // Arrowhead markers
    const colors = ["#d97706", "#7c3aed", "#059669", "#e11d48", "#4f46e5", "#2563eb", "#0d9488", "#64748b"];
    colors.forEach((c) => {
      const id = "arrow-" + c.replace("#", "");
      const marker = svgEl("marker", {
        id,
        viewBox: "0 0 10 10",
        refX: "8",
        refY: "5",
        markerWidth: "7",
        markerHeight: "7",
        orient: "auto-start-reverse"
      });
      marker.appendChild(svgEl("path", { d: "M 0 1.5 L 9 5 L 0 8.5 z", fill: c }));
      defs.appendChild(marker);
    });
    svg.appendChild(defs);

    const rootLayer = svgEl("g", { id: "panZoomLayer" });
    svg.appendChild(rootLayer);

    const visibleNodes = RELATION_DIAGRAM.nodes.filter((n) => showExtended || !n.extended);
    const nodeMap = new Map(visibleNodes.map((n) => [n.id, n]));
    const visibleLinks = RELATION_DIAGRAM.links.filter(
      (l) => (showExtended || !l.extended) && nodeMap.has(l.from) && nodeMap.has(l.to)
    );

    const linksLayer = svgEl("g", { id: "linksLayer" });
    const nodesLayer = svgEl("g", { id: "nodesLayer" });
    rootLayer.appendChild(linksLayer);
    rootLayer.appendChild(nodesLayer);

    const NODE_W = 166;
    const NODE_H = 64;

    function getEdgePoint(cx, cy, tx, ty) {
      const dx = tx - cx;
      const dy = ty - cy;
      if (dx === 0 && dy === 0) return { x: cx, y: cy };
      const hw = NODE_W / 2 + 6;
      const hh = NODE_H / 2 + 6;
      const scaleX = Math.abs(dx) > 0.001 ? hw / Math.abs(dx) : Infinity;
      const scaleY = Math.abs(dy) > 0.001 ? hh / Math.abs(dy) : Infinity;
      const s = Math.min(scaleX, scaleY);
      return { x: cx + dx * s, y: cy + dy * s };
    }

    visibleLinks.forEach((link) => {
      const fromNode = nodeMap.get(link.from);
      const toNode = nodeMap.get(link.to);
      const strokeColor = fromNode.color;
      const markerId = `url(#arrow-${strokeColor.replace("#", "")})`;

      const g = svgEl("g", {
        class: "svg-link-group",
        "data-link-id": link.id,
        "data-from": link.from,
        "data-to": link.to
      });

      let pathD = "";
      let labelX = 0;
      let labelY = 0;

      if (link.isSelfLoop) {
        // Loop below Salt node
        const x1 = fromNode.x - 36;
        const y1 = fromNode.y + NODE_H / 2 + 4;
        const x2 = fromNode.x + 36;
        const y2 = fromNode.y + NODE_H / 2 + 4;
        pathD = `M ${x1} ${y1} C ${x1 - 30} ${y1 + 95}, ${x2 + 30} ${y2 + 95}, ${x2} ${y2}`;
        labelX = fromNode.x;
        labelY = y1 + 68;
      } else if (link.isBridgeToSalt) {
        // Bridge between Oxide base and Oxide acid, pointing down to Salt
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2 - 42;
        const saltNode = nodeMap.get("salt");
        const start = getEdgePoint(fromNode.x, fromNode.y, midX, midY);
        const rightStart = getEdgePoint(toNode.x, toNode.y, midX, midY);
        const endSalt = getEdgePoint(saltNode.x, saltNode.y, midX, midY);

        pathD = `M ${start.x} ${start.y} Q ${midX} ${midY} ${rightStart.x} ${rightStart.y} M ${midX} ${midY + 21} L ${endSalt.x} ${endSalt.y}`;
        labelX = midX;
        labelY = midY + 4;
      } else {
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const offset = link.curveOffset || 0;

        const ctrlX = (fromNode.x + toNode.x) / 2 + nx * offset * 1.8;
        const ctrlY = (fromNode.y + toNode.y) / 2 + ny * offset * 1.8;

        const p1 = getEdgePoint(fromNode.x, fromNode.y, ctrlX, ctrlY);
        const p2 = getEdgePoint(toNode.x, toNode.y, ctrlX, ctrlY);

        pathD = `M ${p1.x} ${p1.y} Q ${ctrlX} ${ctrlY} ${p2.x} ${p2.y}`;
        // Midpoint of quadratic Bezier at t=0.5
        labelX = 0.25 * p1.x + 0.5 * ctrlX + 0.25 * p2.x;
        labelY = 0.25 * p1.y + 0.5 * ctrlY + 0.25 * p2.y;
      }

      const hitPath = svgEl("path", { d: pathD, class: "svg-link-hit" });
      const visPath = svgEl("path", {
        d: pathD,
        class: "svg-link-path",
        stroke: strokeColor,
        "marker-end": link.isBridgeToSalt ? "url(#arrow-4f46e5)" : markerId
      });

      g.appendChild(hitPath);
      g.appendChild(visPath);

      // Pill badge on link
      const textStr = `${link.num}. ${link.label}`;
      const badgeW = Math.max(66, textStr.length * 6.8 + 18);
      const badgeH = 24;
      const badgeRect = svgEl("rect", {
        x: labelX - badgeW / 2,
        y: labelY - badgeH / 2,
        width: badgeW,
        height: badgeH,
        rx: 12,
        fill: "#ffffff",
        stroke: strokeColor,
        "stroke-width": "1.6",
        class: "svg-badge-bg"
      });
      const badgeText = svgEl(
        "text",
        {
          x: labelX,
          y: labelY + 4,
          "text-anchor": "middle",
          "font-size": "11.5",
          "font-weight": "700",
          fill: strokeColor
        },
        textStr
      );

      g.appendChild(badgeRect);
      g.appendChild(badgeText);

      g.addEventListener("click", (e) => {
        e.stopPropagation();
        selectLink(link);
      });

      linksLayer.appendChild(g);
    });

    // Draw nodes
    visibleNodes.forEach((node) => {
      const g = svgEl("g", {
        class: "svg-node",
        "data-node-id": node.id
      });

      const rect = svgEl("rect", {
        x: node.x - NODE_W / 2,
        y: node.y - NODE_H / 2,
        width: NODE_W,
        height: NODE_H,
        rx: 14,
        fill: node.bg,
        stroke: node.color,
        "stroke-width": "2.4"
      });

      const title = svgEl(
        "text",
        {
          x: node.x,
          y: node.y - 4,
          "text-anchor": "middle",
          "font-size": "15.5",
          "font-weight": "700",
          fill: node.color
        },
        node.label
      );

      const sub = svgEl(
        "text",
        {
          x: node.x,
          y: node.y + 15,
          "text-anchor": "middle",
          "font-size": "11.5",
          "font-weight": "500",
          fill: "#475569"
        },
        node.sublabel
      );

      g.appendChild(rect);
      g.appendChild(title);
      g.appendChild(sub);

      g.addEventListener("click", (e) => {
        e.stopPropagation();
        selectRelationNode(node);
      });

      nodesLayer.appendChild(g);
    });

    applyTransform();
  }

  // --- 3. Render Diagram 2: Salt Preparation Mind Map ---
  function renderSaltMindmap() {
    svg.innerHTML = "";
    const W = 1420;
    const H = 900;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const rootLayer = svgEl("g", { id: "panZoomLayer" });
    svg.appendChild(rootLayer);

    const linksLayer = svgEl("g");
    const nodesLayer = svgEl("g");
    rootLayer.appendChild(linksLayer);
    rootLayer.appendChild(nodesLayer);

    const cx = W / 2;
    const cy = H / 2;

    const leftBranches = SALT_MINDMAP.branches.filter((b) => b.side === "left");
    const rightBranches = SALT_MINDMAP.branches.filter((b) => b.side === "right");

    function layoutSide(branches, dir) {
      const totalMethods = branches.reduce((acc, b) => acc + b.methods.length, 0);
      const topMargin = 48;
      const bottomMargin = 48;
      const usableH = H - topMargin - bottomMargin;
      const stepY = usableH / Math.max(1, totalMethods - 1);

      let methodIdx = 0;
      const branchX = cx + dir * 270;
      const leafX = cx + dir * 525;

      branches.forEach((branch) => {
        const methodYs = [];
        branch.methods.forEach(() => {
          methodYs.push(topMargin + methodIdx * stepY);
          methodIdx++;
        });
        const branchY = (methodYs[0] + methodYs[methodYs.length - 1]) / 2;

        // Curve from center to branch
        const c1x = cx + dir * 130;
        const pathCenter = `M ${cx} ${cy} C ${c1x} ${cy}, ${c1x} ${branchY}, ${branchX} ${branchY}`;
        linksLayer.appendChild(
          svgEl("path", {
            d: pathCenter,
            fill: "none",
            stroke: branch.color,
            "stroke-width": "3.2",
            opacity: "0.75"
          })
        );

        // Curves from branch to each method leaf
        branch.methods.forEach((method, idx) => {
          const my = methodYs[idx];
          const mx1 = branchX + dir * 120;
          const pathLeaf = `M ${branchX} ${branchY} C ${mx1} ${branchY}, ${mx1} ${my}, ${leafX} ${my}`;
          linksLayer.appendChild(
            svgEl("path", {
              d: pathLeaf,
              fill: "none",
              stroke: branch.color,
              "stroke-width": "2",
              opacity: "0.65"
            })
          );

          // Leaf Node
          const leafW = 246;
          const leafH = 38;
          const lx = dir === -1 ? leafX - leafW : leafX;
          const lg = svgEl("g", { class: "svg-node", "data-method-id": method.id });

          lg.appendChild(
            svgEl("rect", {
              x: lx,
              y: my - leafH / 2,
              width: leafW,
              height: leafH,
              rx: 10,
              fill: "#ffffff",
              stroke: branch.color,
              "stroke-width": "1.8"
            })
          );

          lg.appendChild(
            svgEl(
              "text",
              {
                x: lx + 12,
                y: my + 4.5,
                "font-size": "12.5",
                "font-weight": "600",
                fill: "#0f172a"
              },
              method.title
            )
          );

          // 2 PTHH pill
          lg.appendChild(
            svgEl("rect", {
              x: lx + leafW - 54,
              y: my - 10,
              width: 46,
              height: 20,
              rx: 10,
              fill: branch.bg
            })
          );
          lg.appendChild(
            svgEl(
              "text",
              {
                x: lx + leafW - 31,
                y: my + 3.5,
                "text-anchor": "middle",
                "font-size": "10.5",
                "font-weight": "700",
                fill: branch.color
              },
              "2 PTHH"
            )
          );

          lg.addEventListener("click", (e) => {
            e.stopPropagation();
            selectSaltMethod(branch, method);
          });
          nodesLayer.appendChild(lg);
        });

        // Branch Node
        const bW = 196;
        const bH = 44;
        const bg = svgEl("g", { class: "svg-node", "data-branch-id": branch.id });
        bg.appendChild(
          svgEl("rect", {
            x: branchX - bW / 2,
            y: branchY - bH / 2,
            width: bW,
            height: bH,
            rx: 12,
            fill: branch.bg,
            stroke: branch.color,
            "stroke-width": "2.4"
          })
        );
        bg.appendChild(
          svgEl(
            "text",
            {
              x: branchX,
              y: branchY + 5,
              "text-anchor": "middle",
              "font-size": "13.5",
              "font-weight": "700",
              fill: branch.color
            },
            branch.title
          )
        );
        bg.addEventListener("click", (e) => {
          e.stopPropagation();
          selectSaltBranch(branch);
        });
        nodesLayer.appendChild(bg);
      });
    }

    layoutSide(leftBranches, -1);
    layoutSide(rightBranches, 1);

    // Center Node
    const cW = 230;
    const cH = 74;
    const cg = svgEl("g", { class: "svg-node" });
    cg.appendChild(
      svgEl("rect", {
        x: cx - cW / 2,
        y: cy - cH / 2,
        width: cW,
        height: cH,
        rx: 18,
        fill: "#4f46e5",
        stroke: "#312e81",
        "stroke-width": "3"
      })
    );
    cg.appendChild(
      svgEl(
        "text",
        {
          x: cx,
          y: cy - 4,
          "text-anchor": "middle",
          "font-size": "16",
          "font-weight": "800",
          fill: "#ffffff"
        },
        SALT_MINDMAP.center.title
      )
    );
    cg.appendChild(
      svgEl(
        "text",
        {
          x: cx,
          y: cy + 17,
          "text-anchor": "middle",
          "font-size": "11.5",
          "font-weight": "500",
          fill: "#e0e7ff"
        },
        SALT_MINDMAP.center.subtitle
      )
    );
    nodesLayer.appendChild(cg);

    applyTransform();
  }

  // --- 4. Inspector Selection Handlers ---
  function renderEquationCards(equations) {
    return equations
      .map(
        (eq, idx) => `
      <div class="eq-card">
        <div class="eq-card-header">
          <span class="eq-num">Ví dụ ${idx + 1}</span>
          <span class="eq-cond">${eq.cond}</span>
        </div>
        <div class="eq-formula">${eq.html}</div>
        <div class="eq-note">${eq.note}</div>
      </div>
    `
      )
      .join("");
  }

  function highlightRelationSelection(linkId, nodeId) {
    svg.querySelectorAll(".svg-link-group").forEach((el) => {
      el.classList.remove("active", "dimmed");
      if (linkId) {
        if (el.getAttribute("data-link-id") === linkId) el.classList.add("active");
        else el.classList.add("dimmed");
      } else if (nodeId) {
        const f = el.getAttribute("data-from");
        const t = el.getAttribute("data-to");
        if (f === nodeId || t === nodeId) el.classList.add("active");
        else el.classList.add("dimmed");
      }
    });
  }

  function selectLink(link) {
    activeSelection = { type: "link", id: link.id };
    highlightRelationSelection(link.id, null);

    inspectorBadge.textContent = `LIÊN KẾT #${link.num}`;
    inspectorTitle.textContent = link.title;
    inspectorBody.innerHTML = `
      <div class="rule-box">${link.rule}</div>
      <div class="eq-section-title">2 Ví dụ minh họa bằng PTHH</div>
      ${renderEquationCards(link.equations)}
    `;
  }

  function selectRelationNode(node) {
    activeSelection = { type: "node", id: node.id };
    highlightRelationSelection(null, node.id);

    const connected = RELATION_DIAGRAM.links.filter(
      (l) => (showExtended || !l.extended) && (l.from === node.id || l.to === node.id)
    );

    inspectorBadge.textContent = "LOẠI CHẤT";
    inspectorTitle.textContent = `${node.label} (${node.sublabel})`;
    inspectorBody.innerHTML = `
      <div class="rule-box">${node.desc}</div>
      <div class="eq-section-title">Các liên kết trực tiếp (${connected.length})</div>
      <div class="connected-list">
        ${connected
          .map(
            (l) => `
          <button class="connected-btn" data-jump-link="${l.id}">
            <div class="connected-btn-title">${l.num}. ${l.title}</div>
            <div class="connected-btn-sub">${l.equations[0].html} &nbsp;|&nbsp; ${l.equations[1].html}</div>
          </button>
        `
          )
          .join("")}
      </div>
    `;

    inspectorBody.querySelectorAll("[data-jump-link]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = RELATION_DIAGRAM.links.find((x) => x.id === btn.getAttribute("data-jump-link"));
        if (target) selectLink(target);
      });
    });
  }

  function selectSaltMethod(branch, method) {
    activeSelection = { type: "method", id: method.id };
    inspectorBadge.textContent = branch.title.toUpperCase();
    inspectorTitle.textContent = method.title;
    inspectorBody.innerHTML = `
      <div class="rule-box">${method.rule}</div>
      <div class="eq-section-title">2 Ví dụ minh họa bằng PTHH</div>
      ${renderEquationCards(method.equations)}
    `;
  }

  function selectSaltBranch(branch) {
    activeSelection = { type: "branch", id: branch.id };
    inspectorBadge.textContent = "NHÓM PHƯƠNG PHÁP";
    inspectorTitle.textContent = branch.title;
    inspectorBody.innerHTML = `
      <div class="rule-box">Gồm <strong>${branch.methods.length} phương pháp</strong> điều chế muối vô cơ (${branch.methods.length * 2} PTHH duy nhất).</div>
      <div class="eq-section-title">Chi tiết từng phương pháp</div>
      <div class="connected-list">
        ${branch.methods
          .map(
            (m) => `
          <button class="connected-btn" data-jump-method="${m.id}">
            <div class="connected-btn-title">${m.title}</div>
            <div class="connected-btn-sub">${m.equations[0].html} &nbsp;|&nbsp; ${m.equations[1].html}</div>
          </button>
        `
          )
          .join("")}
      </div>
    `;

    inspectorBody.querySelectorAll("[data-jump-method]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = branch.methods.find((x) => x.id === btn.getAttribute("data-jump-method"));
        if (target) selectSaltMethod(branch, target);
      });
    });
  }

  // --- 5. Summary Table View ---
  function renderSummaryTable(filter) {
    let html = "";

    if (filter === "all" || filter === "relation") {
      html += `<h3 class="summary-group-title">Phần 1: Sơ đồ mối quan hệ giữa các hợp chất vô cơ (18 liên kết × 2 = 36 PTHH)</h3>`;
      html += `<table class="summary-table">
        <thead>
          <tr>
            <th style="width:54px">STT</th>
            <th style="width:220px">Liên kết</th>
            <th style="width:280px">Quy tắc / Điều kiện</th>
            <th>2 Phương trình hóa học minh họa (Không trùng lặp)</th>
          </tr>
        </thead>
        <tbody>
          ${RELATION_DIAGRAM.links
            .map(
              (l) => `
            <tr>
              <td><strong>${l.num}</strong></td>
              <td><strong>${l.title}</strong></td>
              <td>${l.rule}</td>
              <td>
                <div class="summary-eq-list">
                  ${l.equations
                    .map(
                      (eq, i) =>
                        `<div class="summary-eq-item">${i + 1}) ${eq.html} <span class="summary-eq-cond">(${eq.cond})</span></div>`
                    )
                    .join("")}
                </div>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>`;
    }

    if (filter === "all" || filter === "salt") {
      html += `<h3 class="summary-group-title">Phần 2: Sơ đồ tư duy điều chế muối vô cơ đầy đủ (17 phương pháp × 2 = 34 PTHH)</h3>`;
      html += `<table class="summary-table">
        <thead>
          <tr>
            <th style="width:170px">Nhánh chính</th>
            <th style="width:210px">Phương pháp</th>
            <th style="width:260px">Quy tắc / Điều kiện</th>
            <th>2 Phương trình hóa học minh họa (Không trùng lặp)</th>
          </tr>
        </thead>
        <tbody>
          ${SALT_MINDMAP.branches
            .map((b) =>
              b.methods
                .map(
                  (m, idx) => `
              <tr>
                ${idx === 0 ? `<td rowspan="${b.methods.length}"><strong>${b.title}</strong></td>` : ""}
                <td><strong>${m.title}</strong></td>
                <td>${m.rule}</td>
                <td>
                  <div class="summary-eq-list">
                    ${m.equations
                      .map(
                        (eq, i) =>
                          `<div class="summary-eq-item">${i + 1}) ${eq.html} <span class="summary-eq-cond">(${eq.cond})</span></div>`
                      )
                      .join("")}
                  </div>
                </td>
              </tr>
            `
                )
                .join("")
            )
            .join("")}
        </tbody>
      </table>`;
    }

    tableContent.innerHTML = html;
  }

  // --- 6. Search Logic ---
  function runSearch(q) {
    const query = q.trim().toLowerCase();
    clearSearch.hidden = query.length === 0;
    if (!query) {
      searchResults.hidden = true;
      return;
    }

    const hits = [];
    RELATION_DIAGRAM.links.forEach((l) => {
      l.equations.forEach((eq) => {
        const hay = `${l.title} ${l.rule} ${eq.raw} ${eq.note}`.toLowerCase();
        if (hay.includes(query)) {
          hits.push({ tab: "relation", title: `Sơ đồ 1 • ${l.title}`, eqHtml: eq.html, item: l });
        }
      });
    });

    SALT_MINDMAP.branches.forEach((b) => {
      b.methods.forEach((m) => {
        m.equations.forEach((eq) => {
          const hay = `${b.title} ${m.title} ${m.rule} ${eq.raw} ${eq.note}`.toLowerCase();
          if (hay.includes(query)) {
            hits.push({
              tab: "salt",
              title: `Sơ đồ 2 • ${m.title}`,
              eqHtml: eq.html,
              branch: b,
              method: m
            });
          }
        });
      });
    });

    if (hits.length === 0) {
      searchResults.innerHTML = `<div class="search-item"><div class="search-item-eq">Không tìm thấy kết quả phù hợp.</div></div>`;
    } else {
      searchResults.innerHTML = hits
        .slice(0, 15)
        .map(
          (h, i) => `
        <div class="search-item" data-hit="${i}">
          <div class="search-item-title">${h.title}</div>
          <div class="search-item-eq">${h.eqHtml}</div>
        </div>
      `
        )
        .join("");

      searchResults.querySelectorAll("[data-hit]").forEach((el) => {
        el.addEventListener("click", () => {
          const h = hits[Number(el.getAttribute("data-hit"))];
          searchResults.hidden = true;
          if (h.tab === "relation") {
            switchTab("relation");
            if (h.item.extended && !showExtended) {
              showExtended = true;
              toggleExtended.checked = true;
              renderRelationDiagram();
            }
            selectLink(h.item);
          } else {
            switchTab("salt");
            selectSaltMethod(h.branch, h.method);
          }
        });
      });
    }
    searchResults.hidden = false;
  }

  // --- 6b. Salt Properties View ---
  function renderSaltProperties() {
    if (!propertiesGrid || typeof SALT_PROPERTIES === "undefined") return;
    propertiesGrid.innerHTML = SALT_PROPERTIES.map((prop) => {
      const examplesHtml = prop.examples
        .map(
          (ex, idx) => `
          <div class="prop-example-item">
            <div class="prop-eq"><span class="prop-eq-num">${idx + 1}</span><span>${ex.html}</span></div>
            <div class="prop-phenom">💡 ${ex.phenomenon}</div>
          </div>`
        )
        .join("");

      return `
        <article class="prop-card" style="--prop-color: ${prop.color}; --prop-bg: ${prop.bgSoft};">
          <div class="prop-card-header">
            <div class="prop-icon" aria-hidden="true">${prop.icon}</div>
            <div>
              <span class="prop-num">TÍNH CHẤT ${prop.number}</span>
              <h3>${prop.title}</h3>
            </div>
          </div>
          <div class="prop-formula">${prop.formula}</div>
          <div class="prop-condition">
            <strong>Điều kiện:</strong> ${prop.condition}
          </div>
          <div class="prop-examples">
            <div class="prop-examples-title">Ví dụ minh họa (${prop.examples.length} PTHH):</div>
            ${examplesHtml}
          </div>
        </article>`;
    }).join("");
  }

  // --- 7. Tab Switching & Events ---
  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll(".tab-btn").forEach((b) => {
      const active = b.getAttribute("data-tab") === tab;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (tab === "table") {
      canvasPane.hidden = true;
      inspectorPane.hidden = true;
      propertiesPane.hidden = true;
      tablePane.hidden = false;
      renderSummaryTable(tableFilterSelect.value);
    } else if (tab === "salt-properties") {
      canvasPane.hidden = true;
      inspectorPane.hidden = true;
      tablePane.hidden = true;
      propertiesPane.hidden = false;
      renderSaltProperties();
    } else {
      canvasPane.hidden = false;
      inspectorPane.hidden = false;
      tablePane.hidden = true;
      propertiesPane.hidden = true;
      resetView();

      if (tab === "relation") {
        extendedToggleWrap.style.display = "flex";
        legendBar.style.display = "flex";
        renderRelationDiagram();
        selectLink(RELATION_DIAGRAM.links[0]);
      } else {
        extendedToggleWrap.style.display = "none";
        legendBar.style.display = "none";
        renderSaltMindmap();
        selectSaltBranch(SALT_MINDMAP.branches[0]);
      }
    }
  }

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.getAttribute("data-tab")));
  });

  toggleExtended.addEventListener("change", () => {
    showExtended = toggleExtended.checked;
    document.querySelectorAll(".extended-legend").forEach((el) => {
      el.style.display = showExtended ? "flex" : "none";
    });
    renderRelationDiagram();
  });

  tableFilterSelect.addEventListener("change", () => renderSummaryTable(tableFilterSelect.value));

  searchInput.addEventListener("input", () => runSearch(searchInput.value));
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    runSearch("");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box") && !e.target.closest(".search-results")) {
      searchResults.hidden = true;
    }
  });

  // Zoom & Pan controls
  document.getElementById("zoomIn").addEventListener("click", () => {
    zoom = Math.min(2.4, zoom + 0.15);
    applyTransform();
  });
  document.getElementById("zoomOut").addEventListener("click", () => {
    zoom = Math.max(0.45, zoom - 0.15);
    applyTransform();
  });
  document.getElementById("zoomReset").addEventListener("click", resetView);

  viewport.addEventListener("mousedown", (e) => {
    if (e.target.closest(".svg-node") || e.target.closest(".svg-link-group")) return;
    isPanning = true;
    startPanX = e.clientX - panX;
    startPanY = e.clientY - panY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isPanning) return;
    panX = e.clientX - startPanX;
    panY = e.clientY - startPanY;
    applyTransform();
  });

  window.addEventListener("mouseup", () => {
    isPanning = false;
  });

  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      zoom = Math.min(2.4, Math.max(0.45, zoom + delta));
      applyTransform();
    },
    { passive: false }
  );

  // Print button switches to table view cleanly before printing
  document.getElementById("btnPrint").addEventListener("click", () => {
    renderSummaryTable("all");
    window.print();
  });

  // Init
  verifyUniqueEquations();
  switchTab("relation");
})();
