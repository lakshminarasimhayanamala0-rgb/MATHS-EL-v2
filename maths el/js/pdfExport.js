// ExamSlot - Examination Timetable PDF & Printable Report Generator
// Provides high-definition university examination schedule export

/**
 * Exports the timetable using jsPDF and autoTable if available,
 * or triggers a dedicated, beautifully styled printable window.
 * @param {Object} timetable - Timetable object from generateTimetable
 * @param {Object} graph - Conflict graph
 */
export function exportTimetableToPDF(timetable, graph) {
  // Check if jsPDF is available on window
  if (window.jspdf && window.jspdf.jsPDF) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });

      const primaryColor = [30, 64, 175]; // Royal blue
      const darkColor = [30, 41, 59];

      // University Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(...primaryColor);
      doc.text(timetable.settings.universityName || 'APEX INSTITUTE OF TECHNOLOGY', 420, 40, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(...darkColor);
      doc.text(timetable.settings.examTitle || 'END SEMESTER EXAMINATIONS TIMETABLE', 420, 58, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const generatedAt = new Date().toLocaleString();
      doc.text(`Generated on: ${generatedAt}  |  Algorithm: Graph Coloring  |  Status: ${timetable.isConflictFree ? '100% CONFLICT-FREE' : 'WARNING: CONFLICTS PRESENT'}`, 420, 72, { align: 'center' });

      // Build Table Data
      const tableRows = [];
      timetable.rows.forEach((row) => {
        const subjectDetails = row.subjects
          .map((s) => `${s.code} - ${s.name} (${s.enrolledCount} students)`)
          .join('\n');

        tableRows.push([
          `Slot ${row.slotNumber}`,
          `${row.formattedDate}\n(${row.dayName})`,
          `${row.sessionType}\n${row.sessionTime}`,
          row.subjects.map((s) => s.code).join(', '),
          subjectDetails,
          row.totalStudents,
          row.hasConflict ? 'CONFLICT' : 'OK'
        ]);
      });

      if (doc.autoTable) {
        doc.autoTable({
          startY: 85,
          head: [['Slot', 'Date & Day', 'Session / Time', 'Codes', 'Subjects & Enrollments', 'Students', 'Status']],
          body: tableRows,
          theme: 'grid',
          headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
          },
          columnStyles: {
            0: { halign: 'center', cellWidth: 50, fontStyle: 'bold' },
            1: { halign: 'center', cellWidth: 90 },
            2: { halign: 'center', cellWidth: 110 },
            3: { halign: 'center', cellWidth: 80, fontStyle: 'bold' },
            4: { cellWidth: 280 },
            5: { halign: 'center', cellWidth: 60 },
            6: { halign: 'center', cellWidth: 60 }
          },
          styles: {
            fontSize: 9,
            cellPadding: 5
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          }
        });

        // Footer & Signatures
        const finalY = doc.lastAutoTable.finalY + 35;
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text('Prepared by: Timetabling Committee (ExamSlot Engine)', 60, finalY);
        doc.text('Verified by: Head of Examination Cell', 420, finalY, { align: 'center' });
        doc.text('Approved by: Controller of Examinations', 760, finalY, { align: 'right' });

        doc.save(`Exam_Timetable_${new Date().toISOString().slice(0, 10)}.pdf`);
        return;
      }
    } catch (err) {
      console.warn('jsPDF error, falling back to print dialog:', err);
    }
  }

  // Fallback: Open dedicated printable report window
  openPrintableTimetableWindow(timetable, graph);
}

/**
 * Creates and prints an elegant university timetable in a popup window
 * @param {Object} timetable 
 * @param {Object} graph 
 */
export function openPrintableTimetableWindow(timetable, graph) {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) {
    alert('Please allow popups to print/export the timetable as PDF.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${timetable.settings.examTitle || 'Examination Timetable'}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 40px; color: #1e293b; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 24px; }
        .univ-name { font-size: 22px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px; }
        .exam-title { font-size: 16px; font-weight: 600; color: #334155; margin-top: 4px; }
        .meta-info { font-size: 12px; color: #64748b; margin-top: 6px; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; }
        .badge-success { background: #dcfce7; color: #15803d; }
        .badge-danger { background: #fee2e2; color: #b91c1c; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; vertical-align: top; }
        th { background: #1e40af; color: white; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .slot-badge { background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-weight: bold; display: inline-block; }
        .subject-tag { display: inline-block; background: #e2e8f0; color: #0f172a; padding: 2px 8px; border-radius: 4px; margin: 2px 4px 2px 0; font-size: 12px; font-weight: 500; }
        .footer { margin-top: 60px; display: flex; justify-content: space-between; font-size: 12px; color: #475569; }
        .sig-box { text-align: center; width: 220px; border-top: 1px solid #94a3b8; padding-top: 8px; }
        @media print {
          body { margin: 15mm; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div style="text-align: right; margin-bottom: 12px;">
        <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">
          Print / Save as PDF
        </button>
      </div>
      <div class="header">
        <div class="univ-name">${timetable.settings.universityName}</div>
        <div class="exam-title">${timetable.settings.examTitle}</div>
        <div class="meta-info">
          Generated: ${new Date().toLocaleString()} | Total Examination Slots: ${timetable.slotCount} | 
          Status: <span class="badge ${timetable.isConflictFree ? 'badge-success' : 'badge-danger'}">
            ${timetable.isConflictFree ? '100% Conflict-Free' : 'Contains Conflicts'}
          </span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 70px;">Slot</th>
            <th style="width: 140px;">Date & Day</th>
            <th style="width: 170px;">Session / Time</th>
            <th>Scheduled Subjects</th>
            <th style="width: 90px; text-align: center;">Students</th>
          </tr>
        </thead>
        <tbody>
          ${timetable.rows
            .map(
              (r) => `
            <tr>
              <td style="text-align: center;"><span class="slot-badge">Slot ${r.slotNumber}</span></td>
              <td><strong>${r.formattedDate}</strong><br><span style="color:#64748b; font-size:11px;">${r.dayName}</span></td>
              <td><strong>${r.sessionType}</strong><br><span style="color:#64748b; font-size:11px;">${r.sessionTime}</span></td>
              <td>
                ${r.subjects
                  .map(
                    (s) => `
                  <div style="margin-bottom: 4px;">
                    <span class="subject-tag"><strong>${s.code}</strong></span>
                    <span>${s.name}</span>
                    <span style="color: #64748b; font-size: 11px;">(${s.enrolledCount} enrolled)</span>
                  </div>
                `
                  )
                  .join('')}
              </td>
              <td style="text-align: center; font-weight: bold;">${r.totalStudents}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        <div class="sig-box">ExamSlot System Administrator</div>
        <div class="sig-box">Head of Department / Verification</div>
        <div class="sig-box">Controller of Examinations</div>
      </div>

      <script>
        // Auto print after render
        window.onload = function() {
          setTimeout(function() { window.print(); }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

