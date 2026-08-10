const API_BASE = "http://localhost:3001/api";
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
    if (data.user.role !== "Admin")
      throw new Error("This account is not an admin.");

    errorMsg.classList.remove("show");
    successMsg.classList.add("show");
    setTimeout(() => {
      window.location.href =
        "admin.html?token=" + encodeURIComponent(data.token);
    }, 600);
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.add("show");
    successMsg.classList.remove("show");
  }
});
