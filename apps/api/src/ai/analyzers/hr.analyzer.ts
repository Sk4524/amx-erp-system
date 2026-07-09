export function hrAnalyzer(
  employees: any[],
  revenue: number
) {

  const totalEmployees =
    employees.length;

  const totalSalary =
    employees.reduce(
      (sum, emp) =>
        sum + (emp.salary || 0),
      0
    );

  const averageSalary =
    totalEmployees > 0
      ? Math.round(
          totalSalary /
          totalEmployees
        )
      : 0;

  const highestPaid =
    employees.length > 0
      ? employees.reduce(
          (a, b) =>
            (a.salary || 0) >
            (b.salary || 0)
              ? a
              : b
        )
      : null;

  const lowestPaid =
    employees.length > 0
      ? employees.reduce(
          (a, b) =>
            (a.salary || 0) <
            (b.salary || 0)
              ? a
              : b
        )
      : null;

  const salaryRevenueRatio =
    revenue > 0
      ? Number(
          (
            (totalSalary / revenue) *
            100
          ).toFixed(2)
        )
      : 0;

  let workforceHealth =
    "Excellent";

  if (
    salaryRevenueRatio > 70
  ) {

    workforceHealth =
      "Critical";

  } else if (
    salaryRevenueRatio > 50
  ) {

    workforceHealth =
      "Warning";

  } else if (
    salaryRevenueRatio > 30
  ) {

    workforceHealth =
      "Healthy";
  }

  return {

    totalEmployees,

    totalSalary,

    averageSalary,

    salaryRevenueRatio,

    workforceHealth,

    highestPaid,

    lowestPaid,

  };

}