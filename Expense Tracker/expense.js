document.addEventListener('DOMContentLoaded', function () {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const formatter = new Intl.NumberFormat("en-US", {
        // style: "currency",
        // currency: "ZAR",
        signDisplay: "always",
    });

    const list = document.getElementById("transactionList");
    const form = document.getElementById("transactionForm");
    const status = document.getElementById("status");
    const balance = document.getElementById("balance");
    const income = document.getElementById("income");
    const expense = document.getElementById("expense");

    form.addEventListener("submit", addTransaction);
    window.deleteTransaction = deleteTransaction;

    function updateTotal() {
        const incomeTotal = transactions
            .filter((trx) => trx.type === "income")
            .reduce((total, trx) => total + trx.amount, 0);

        const expenseTotal = transactions
            .filter((trx) => trx.type === "expense")
            .reduce((total, trx) => total + trx.amount, 0);

        const balanceTotal = incomeTotal - expenseTotal;

        balance.textContent = formatter.format(balanceTotal).substring(1);
        income.textContent = formatter.format(incomeTotal);
        expense.textContent = formatter.format(expenseTotal * -1);
    }

    function renderList() {
        list.innerHTML = "";

        status.textContent = "";
        if (transactions.length === 0) {
            status.textContent = "No transactions.";
            return;
        }

        transactions.forEach(({ id, name, amount, date, type, image, location }) => {
            const sign = "income" === type ? 1 : -1;

            const li = document.createElement("li");

          li.innerHTML = `
      <div class="name">
      <h4>${name}</h4>
      <p>${new Date(date).toLocaleDateString()}</p>
    </div>

    <div class="amount ${type}">
      <span>${formatter.format(amount * sign)}</span>
    </div>
  
    <div class="action">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  `;

            list.appendChild(li);
        });
    }

    renderList();
    updateTotal();

    function deleteTransaction(id) {
        const index = transactions.findIndex((trx) => trx.id === id);
        transactions.splice(index, 1);
      
        updateTotal();
        saveTransactions();
        renderList();
        renderCardList();
      }
    

    // Function to add a new transaction
    function addTransaction(e) {
        e.preventDefault();

        const formData = new FormData(this);

        const file = formData.get("image");
        const reader = new FileReader();

        reader.onloadend = function () {
            const imageData = reader.result; // Convert image to data URL
            transactions.push({
                id: transactions.length + 1,
                name: formData.get("name"),
                amount: parseFloat(formData.get("amount")),
                date: new Date(formData.get("date")),
                type: "on" === formData.get("type") ? "income" : "expense",
                image: imageData,
                location: formData.get("loc"),
            });

            updateTotal();
            saveTransactions();
            renderList();
            renderCardList();
        };

        if (file) {
            reader.readAsDataURL(file); // Read image as data URL
        } else {
            // If no image is selected
            transactions.push({
                id: transactions.length + 1,
                name: formData.get("name"),
                amount: parseFloat(formData.get("amount")),
                date: new Date(formData.get("date")),
                type: "on" === formData.get("type") ? "income" : "expense",
                image: "", // No image
                location: formData.get("loc"),
            });

            updateTotal();
            saveTransactions();
            renderList();
            renderCardList();
        }

        this.reset();
    }

    // Function to save transactions to local storage
    function saveTransactions() {
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }


    // Render transactions in the right content
    const cardContainer = document.querySelector(".card__container");
    renderCardList();

    function renderCardList() {
        cardContainer.innerHTML = "";

        if (transactions.length === 0) {
            return;
        }

        transactions.forEach(({ name, amount, date, image, location }) => {
            const sign = amount >= 0 ? "+" : "-"; // Determine if the amount is positive or negative

            const cardArticle = document.createElement("article");
            cardArticle.classList.add("card__article");

            cardArticle.innerHTML = `
                <img src="${image}" alt="Transaction Image" class="card__img">
                <div class="card__data">
                    <h2 class="card__title">${name}</h2>
                    <span class="card__description">
                        <p>Amount: ${formatter.format(amount)}</p>
                        <p>Date: ${new Date(date).toLocaleDateString()}</p>
                        <p>Location: ${location}</p>
                        <div class="quantity-control">
                            <!-- Add quantity control buttons here if needed -->
                        </div>
                    </span>
                    <!-- Add any other buttons or links here if needed -->
                </div>
            `;

            cardContainer.appendChild(cardArticle);
        });
    }
});

