import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

export const exportDashboardExcel = (
  employees: any[],
  inventory: any[],
  transactions: any[]
) => {

  // WORKBOOK
  const workbook =
    XLSX.utils.book_new();

  // EMPLOYEES SHEET
  const employeeSheet =
    XLSX.utils.json_to_sheet(
      employees
    );

  XLSX.utils.book_append_sheet(
    workbook,
    employeeSheet,
    "Employees"
  );

  // INVENTORY SHEET
  const inventorySheet =
    XLSX.utils.json_to_sheet(
      inventory
    );

  XLSX.utils.book_append_sheet(
    workbook,
    inventorySheet,
    "Inventory"
  );

  // TRANSACTIONS SHEET
  const transactionSheet =
    XLSX.utils.json_to_sheet(
      transactions
    );

  XLSX.utils.book_append_sheet(
    workbook,
    transactionSheet,
    "Transactions"
  );

  // GENERATE BUFFER
  const excelBuffer =
    XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

  // FILE
  const data =
    new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

  saveAs(
    data,
    "amx-erp-report.xlsx"
  );

};

export const exportTransactionsToExcel = (
  transactions: any[]
) => {

  const workbook = XLSX.utils.book_new();

  const sheetData = transactions.map((tx) => ({
    Type: tx.type,
    Amount: Number(tx.amount),
    Account: tx.account?.name || "-",
    Date: new Date(tx.createdAt).toLocaleDateString("en-IN"),
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(sheetData);

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Finance Transactions"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const data = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }
  );

  saveAs(
    data,
    `finance-transactions-${Date.now()}.xlsx`
  );

};