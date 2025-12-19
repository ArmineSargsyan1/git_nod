import { getTotalSpending, getSpendingByCategory, getMonthlySummary } from '../models/analytics.js';
import { getMonthName } from '../helpers/utils.js';


export const totalSpending = async (req, res) => {

  const { start_date, end_date } = req.query;
  const total = await getTotalSpending(req.userId, start_date, end_date);

  res.json({
    success: true,
    total_spending: Number(total),
    period: { start_date: start_date || null, end_date: end_date || null }
  });
};


export const spendingByCategory = async (req, res) => {
  const { start_date, end_date } = req.query;
  const data = await getSpendingByCategory(req.userId, start_date, end_date);

  res.json({ success: true, spending_by_category: data });
};


export const monthlySummary = async (req, res) => {

  const year = req.query.year ? parseInt(req.query.year) : undefined;
  const { year: selectedYear, monthly_summary } = await getMonthlySummary(req.userId, year);

  const summaryWithMonthNames = monthly_summary.map((item) => ({
    ...item,
    month_name: getMonthName(item.month)
  }));

  res.json({ success: true, year: selectedYear, monthly_summary: summaryWithMonthNames });
};
