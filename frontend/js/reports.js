const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
async function renderReports() {
const expenses =
  JSON.parse(localStorage.getItem('expenses')) || [];
const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
const dates = new Set(expenses.map((expense) => expense.expenseDate).filter(Boolean));
const highest = expenses.reduce((max, expense) => Math.max(max, Number(expense.amount || 0)), 0);
const categories = expenses.reduce((result, expense) => {
  const category = expense.category || 'Other';
  result[category] = (result[category] || 0) + Number(expense.amount || 0);
  return result;
}, {});
const categoryEntries = Object.entries(categories).sort((a, b) => b[1] - a[1]);

if (expenses.length === 0) {
  document.querySelector('#total-expense').textContent = currency.format(0);
  document.querySelector('#daily-average').textContent = currency.format(0);
  document.querySelector('#highest-expense').textContent = currency.format(0);
  document.querySelector('#transaction-count').textContent = '0';
  document.querySelector('#report-period').textContent =
    'No expenses recorded yet.';
  return;
}

document.querySelector('#total-expense').textContent = currency.format(total);
document.querySelector('#daily-average').textContent = currency.format(dates.size ? total / dates.size : 0);
document.querySelector('#highest-expense').textContent = currency.format(highest);
document.querySelector('#transaction-count').textContent = expenses.length;

if (expenses.length) {
  const sortedDates = [...dates].sort();
  const first = new Date(`${sortedDates[0]}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const last = new Date(`${sortedDates.at(-1)}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  document.querySelector('#report-period').textContent = `Based on ${expenses.length} saved transaction${expenses.length === 1 ? '' : 's'} from ${first}${first === last ? '' : ` to ${last}`}.`;
  document.querySelector('#chart-empty').hidden = true;
  document.querySelector('#summary-empty').hidden = true;
  document.querySelector('#category-chart').hidden = false;
  document.querySelector('#category-table').hidden = false;
  const max = categoryEntries[0][1];
  document.querySelector('#category-chart').innerHTML = categoryEntries.map(([category, amount]) => `<div class="bar-box"><div class="bar-value">${currency.format(amount)}</div><div class="bar" style="height:${Math.max(4, amount / max * 100)}%"></div><span class="bar-label" title="${category}">${category}</span></div>`).join('');
  document.querySelector('#category-summary').innerHTML = categoryEntries.map(([category, amount]) => `<tr><td>${category}</td><td>${currency.format(amount)}</td></tr>`).join('');
}
}

if (requireAuth()) renderReports().catch((error) => { document.querySelector('#report-period').textContent = error.message; });
