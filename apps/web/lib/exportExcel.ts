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