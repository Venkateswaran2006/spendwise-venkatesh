function register() {

    let name = document.getElementById("name").value.trim()
    let email = document.getElementById("email").value.trim()
    let password = document.getElementById("password").value

    if (!name || !email || !password) {
        showToast("Please fill in all fields", "error")
        return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address", "error")
        return
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters long", "error")
        return
    }

    let users = JSON.parse(localStorage.getItem("users")) || []

    if (users.some(u => u.email === email)) {
        showToast("Email already registered", "error")
        return
    }

    let user = {
        id: Date.now(),
        name,
        email,
        password: btoa(password)
    }

    users.push(user)

    localStorage.setItem("users", JSON.stringify(users))

    showToast("Registered Successfully!")

    setTimeout(() => {
        window.location = "login.html"
    }, 1500)

}

function login() {

    let email = document.getElementById("email").value.trim()
    let passwordInput = document.getElementById("password").value

    if (!email || !passwordInput) {
        showToast("Please enter email and password", "error")
        return
    }

    let password = btoa(passwordInput)

    let users = JSON.parse(localStorage.getItem("users")) || []

    let user = users.find(u => u.email === email && u.password === password)

    if (user) {

        localStorage.setItem("session", JSON.stringify(user))

        showToast("Login successful! Redirecting...")

        setTimeout(() => {
            window.location = "dashboard.html"
        }, 1000)

    } else {

        showToast("Invalid email or password", "error")

    }

}