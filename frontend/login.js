const API_BASE = "https://inventoryiq-1-w22g.onrender.com/api";
const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    errorMsg.classList.remove("show");
    successMsg.classList.add("show");
    setTimeout(() => {
      window.location.href =
        "index.html?token=" + encodeURIComponent(data.token);
    }, 600);
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.add("show");
    successMsg.classList.remove("show");
  }
});
