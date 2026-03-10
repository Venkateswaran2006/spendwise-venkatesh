function formatCurrency(amount) {

    return "₹" + parseFloat(amount).toFixed(2)

}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function logout() {
    localStorage.removeItem("session")
    window.location = "login.html"
}

window.showToast = showToast;
window.logout = logout;