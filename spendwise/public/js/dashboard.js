window.onload = function () {
    const session = localStorage.getItem("session")
    if (!session) {
        window.location = "login.html"
        return
    }

    const user = JSON.parse(session)
    const usernameDisplay = document.getElementById("username-display")
    if (usernameDisplay) usernameDisplay.innerText = `Welcome, ${user.name}`

    // Add entry animations
    document.querySelectorAll('.form-section, .table-section').forEach(el => {
        el.classList.add('fade-in-up');
    });

    window.loadTransactions = loadTransactions; // Make it global
    loadTransactions()
}

async function loadTransactions() {
    const session = JSON.parse(localStorage.getItem("session"))
    if (!session) return

    const response = await fetch("/api/load")
    const transactions = await response.json()

    const userTransactions = transactions.filter(t => t.userId === session.id)
    const tbody = document.querySelector("#table tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    if (userTransactions.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="4" style="text-align: center; color: var(--text-muted); padding: 3rem; animation: fadeInUp 0.6s ease;">No transactions found. Start by adding one above!</td>`;
        tbody.appendChild(emptyRow);
        return;
    }

    userTransactions.forEach((t, index) => {
        const amount = parseFloat(t.amount)
        const row = document.createElement('tr');
        row.className = 'slide-in-row';
        row.style.animationDelay = `${index * 0.05}s`;
        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.title}</td>
            <td style="color: ${amount >= 0 ? '#4cd137' : '#ff4444'}">${formatCurrency(amount)}</td>
            <td><button class="btn-delete" onclick="deleteTransaction(${t.id})">Delete</button></td>
        `;
        tbody.appendChild(row);
    })
}

async function deleteTransaction(id) {
    if (!confirm("Are you sure you want to delete this transaction?")) return

    try {
        const response = await fetch("/api/load")
        if (!response.ok) throw new Error("Failed to load transactions")

        let transactions = await response.json()
        const initialCount = transactions.length
        transactions = transactions.filter(t => t.id !== id)

        if (transactions.length === initialCount) {
            showToast("Transaction not found", "error")
            return
        }

        const saveResponse = await fetch("/api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactions)
        })

        if (!saveResponse.ok) throw new Error("Failed to save changes")

        showToast("Transaction deleted successfully", "success")
        loadTransactions()
    } catch (err) {
        console.error(err)
        showToast("Error deleting transaction", "error")
    }
}

