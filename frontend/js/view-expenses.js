const expenseList = document.querySelector('#expense-list');
const emptyState = document.querySelector('#empty-expenses');
const search = document.querySelector('#expense-search');
let expenses = [];

function escapeHtml(value) { const element = document.createElement('div'); element.textContent = value; return element.innerHTML; }
function render() {
  const term = search.value.trim().toLowerCase();
  const filtered = expenses.filter((expense) => `${expense.category} ${expense.description}`.toLowerCase().includes(term));
  emptyState.hidden = filtered.length > 0;
  expenseList.innerHTML = filtered.map((expense) => `<tr><td>${new Date(`${expense.expenseDate}T00:00:00`).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td><td>${escapeHtml(expense.category)}</td><td>₹${Number(expense.amount).toFixed(2)}</td><td>${escapeHtml(expense.description || '—')}</td><td><button class="edit-btn" data-edit="${expense._id}">Edit</button> <button class="delete-btn" data-delete="${expense._id}">Delete</button></td></tr>`).join('');
}
async function loadExpenses() {
  expenses =
    JSON.parse(localStorage.getItem('expenses')) || [];

  render();
}
expenseList.addEventListener('click', async (event) => {
  const id = event.target.dataset.edit || event.target.dataset.delete;
  if (!id) return;
  const expense = expenses.find((item) => item._id === id);
  try {
    if (event.target.dataset.delete) {
      if (!confirm('Delete this expense?')) return;
      expenses = expenses.filter(item => item._id !== id);

localStorage.setItem(
  'expenses',
  JSON.stringify(expenses)
);
    } else {
      const amount = prompt('Amount', expense.amount); if (amount === null) return;
      const category = prompt('Category', expense.category); if (category === null || !category.trim()) return;
      const description = prompt('Description', expense.description); if (description === null) return;
      if (!Number(amount) || Number(amount) <= 0) { alert('Enter a valid amount.'); return; }
      expense.amount = Number(amount);
expense.category = category.trim();
expense.description = description.trim();

localStorage.setItem(
  'expenses',
  JSON.stringify(expenses)
);
    }
    await loadExpenses();
  } catch (error) { alert(error.message); }
});
search.addEventListener('input', render);
if (requireAuth()) loadExpenses();
