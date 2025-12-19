export const buildExpenseFilters = (filters = {}) => {
  let conditions = [];
  let values = [];

  if (filters.category) {
    conditions = [...conditions, "category = ?"];
    values = [...values, filters.category];
  }

  if (filters.start_date) {
    conditions = [...conditions, "date >= ?"];
    values = [...values, filters.start_date];
  }

  if (filters.end_date) {
    conditions = [...conditions, "date <= ?"];
    values = [...values, filters.end_date];
  }

  const filterSql = conditions.length ? " AND " + conditions.join(" AND ") : "";

  return { filterSql, values };
};


export const getMonthName = (monthNumber) => {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  return months[monthNumber - 1] || "";
};
