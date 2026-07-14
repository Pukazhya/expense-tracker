const rowsBody = document.querySelector('#expense-rows');
const form = document.querySelector('#expense-batch-form');
const message = document.querySelector('#form-message');
const today = new Date().toISOString().slice(0, 10);

if (!requireAuth()) throw new Error('Authentication required');

function createRow(date = today) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td></td>
    <td><input aria-label="Expense date" class="date-input" type="date" value="${date}" max="${today}" required></td>
    <td><select aria-label="Expense category" class="category-input" required><option value="">Select category</option><option>Food</option><option>Travel</option><option>Shopping</option><option>Entertainment</option><option>Bills</option><option>Education</option><option>Health</option><option>Other</option></select></td>
    <td><input aria-label="Expense amount" class="amount-input" type="number" min="0.01" step="0.01" placeholder="0.00" required></td>
    <td><input aria-label="Expense description" class="description-input" type="text" maxlength="500" placeholder="e.g. Lunch at college canteen"></td>
    <td><button type="button" class="remove-row-btn" aria-label="Remove this expense">−</button></td>`;
  row.querySelector('.remove-row-btn').addEventListener('click', () => {
    if (rowsBody.rows.length === 1) { message.textContent = 'Keep at least one row to add an expense.'; message.className = 'form-message error'; return; }
    row.remove();
  });
  rowsBody.append(row);
}

document.querySelector('#add-row').addEventListener('click', () => createRow());
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const futureDate = [...rowsBody.querySelectorAll('.date-input')].some((input) => input.value > today);
  if (futureDate) {
    message.textContent = 'An expense date cannot be later than today.';
    message.className = 'form-message error';
    return;
  }
  const expenses = [...rowsBody.rows].map((row) => ({
    expenseDate: row.querySelector('.date-input').value,
    category: row.querySelector('.category-input').value,
    amount: Number(row.querySelector('.amount-input').value),
    description: row.querySelector('.description-input').value.trim()
  }));
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Saving…';
  try {
  const existingExpenses =
    JSON.parse(localStorage.getItem('expenses')) || [];

  expenses.forEach(expense => {
    existingExpenses.push({
      _id: Date.now().toString() + Math.random(),
      ...expense
    });
  });

  localStorage.setItem(
    'expenses',
    JSON.stringify(existingExpenses)
  );
    rowsBody.replaceChildren(); createRow();
    message.textContent = `${expenses.length} expense${expenses.length === 1 ? '' : 's'} saved. You can edit them in All expenses.`;
    message.className = 'form-message';
  } catch (error) {
    message.textContent = error.message;
    message.className = 'form-message error';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Save all expenses';
  }
});

createRow();
