const expenseForm = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const expenseList = document.getElementById("expenseList");
const totalElement = document.getElementById("total");
const expenseIdInput = document.getElementById("expenseId");

amountInput.addEventListener("wheel", (e) => {
  e.preventDefault();
});

amountInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
  }
});

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

renderExpenses();

expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);

  if (!title || amount <= 0) return;

  const id = expenseIdInput.value;

  if (id) {
    updateExpense(id, title, amount);
  } else {
    addExpense(title, amount);
  }

  expenseForm.reset();
  expenseIdInput.value = "";
});

function addExpense(title, amount) {
  const expense = {
    id: Date.now().toString(),
    title,
    amount,
  };

  expenses.push(expense);

  saveToLocalStorage();
  renderExpenses();
}

function editExpense(id) {
  const expense = expenses.find((item) => item.id === id);

  titleInput.value = expense.title;
  amountInput.value = expense.amount;
  expenseIdInput.value = expense.id;
}

function updateExpense(id, title, amount) {
  expenses = expenses.map((expense) => {
    if (expense.id === id) {
      return {
        ...expense,
        title,
        amount,
      };
    }

    return expense;
  });

  saveToLocalStorage();
  renderExpenses();
}

function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);

  saveToLocalStorage();
  renderExpenses();
}

function renderExpenses() {
  expenseList.innerHTML = "";

  expenses.forEach((expense) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.title}</td>
      <td>₹${expense.amount}</td>
      <td>
        <button
          class="btn btn-warning btn-sm"
          onclick="editExpense('${expense.id}')"
        >
          Edit
        </button>

        <button
          class="btn btn-danger btn-sm"
          onclick="deleteExpense('${expense.id}')"
        >
          Delete
        </button>
      </td>
    `;

    expenseList.appendChild(row);
  });

  calculateTotal();
}

function calculateTotal() {
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  totalElement.textContent = total;
}

function saveToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
