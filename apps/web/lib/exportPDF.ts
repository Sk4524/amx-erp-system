import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

export const exportDashboardPDF = (
  employees: any[],
  inventory: any[],
  transactions: any[],
  analytics: any
) => {

  const doc = new jsPDF();

  // TITLE
  doc.setFontSize(22);

  doc.text(
    "AMX ERP Dashboard Report",
    14,
    20
  );

  // ANALYTICS
  doc.setFontSize(12);

  doc.text(
    `Employees: ${analytics?.employees || 0}`,
    14,
    40
  );

  doc.text(
    `Products: ${analytics?.inventory || 0}`,
    14,
    50
  );

  doc.text(
    `Income: ₹${analytics?.income || 0}`,
    14,
    60
  );

  doc.text(
    `Expense: ₹${analytics?.expense || 0}`,
    14,
    70
  );

  // EMPLOYEE TABLE
  autoTable(doc, {

    startY: 90,

    head: [[
      "Employee",
      "Position",
      "Salary"
    ]],

    body: employees.map((e) => [
      e.name,
      e.position,
      `₹${e.salary}`,
    ]),
  });

  // INVENTORY TABLE
  autoTable(doc, {

    startY:
      (doc as any)
        .lastAutoTable.finalY + 20,

    head: [[
      "Product",
      "SKU",
      "Quantity",
      "Price"
    ]],

    body: inventory.map((i) => [
      i.productName,
      i.sku,
      i.quantity,
      `₹${i.price}`,
    ]),
  });

  // SAVE
  doc.save(
    "amx-erp-dashboard-report.pdf"
  );
};