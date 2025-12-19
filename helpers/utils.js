export const buildTaskQuery = ({ userId, search, completed, startDate, endDate }) => {
  let query = `WHERE userId = ?`;
  let params = [userId];

  if (search) {
    query += ` AND (title LIKE ? OR description LIKE ?)`;
    params = [...params, `%${search}%`, `%${search}%`];
  }

  if (completed !== null) {
    query += ` AND completed = ?`;
    params = [...params, completed ? 1 : 0];
  }

  if (startDate) {
    query += ` AND taskDate >= ?`;
    params = [...params, startDate];
  }

  if (endDate) {
    query += ` AND taskDate <= ?`;
    params = [...params, endDate];
  }

  return { query, params };
};
