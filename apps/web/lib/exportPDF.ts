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

export const exportTransactionsPDF = (
  transactions: any[]
) => {

  const doc = new jsPDF();

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const profit = income - expense;

  doc.setFontSize(22);
  doc.text("AMX ERP Finance Report", 14, 20);

  doc.setFontSize(11);

  doc.text(
    `Generated: ${new Date().toLocaleString("en-IN")}`,
    14,
    32
  );

  doc.text(
    `Revenue : ₹${income.toLocaleString()}`,
    14,
    45
  );

  doc.text(
    `Expenses : ₹${expense.toLocaleString()}`,
    14,
    55
  );

  doc.text(
    `Net Profit : ₹${profit.toLocaleString()}`,
    14,
    65
  );

  autoTable(doc, {

    startY: 80,

    head: [[
      "Type",
      "Amount",
      "Account",
      "Date",
    ]],

    body: transactions.map((tx) => [

      tx.type,

      `₹${Number(tx.amount).toLocaleString()}`,

      tx.account?.name || "-",

      new Date(tx.createdAt)
        .toLocaleDateString("en-IN"),

    ]),

  });

  doc.save(
    `finance-report-${Date.now()}.pdf`
  );

};