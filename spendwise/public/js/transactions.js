async function addTransaction() {
    const title = document.getElementById("title").value
    const amount = parseFloat(document.getElementById("amount").value)
    const date = document.getElementById("date").value

    if (!title || isNaN(amount) || !date) {
        showToast("Please fill all fields correctly.", "error")
        return
    }

    if (amount <= 0) {
        showToast("Amount must be greater than 0.", "error")
        return
    }

    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate > today) {
        showToast("Date cannot be in the future.", "error")
        return
    }

    const session = JSON.parse(localStorage.getItem("session"))

    // Fetch current transactions from server
    const response = await fetch("/api/load")
    const transactions = await response.json()

    const t = {
        id: Date.now(),
        userId: session.id,
        title,
        amount,
        date
    }

    transactions.push(t)

    // Save back to server
    await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactions)
    })

    // Clear inputs
    document.getElementById("title").value = ""
    document.getElementById("amount").value = ""
    document.getElementById("date").value = ""

    showToast("Transaction added successfully!")

    loadTransactions()
}
