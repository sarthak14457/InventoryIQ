const API_BASE = "https://inventoryiq-1-w22g.onrender.com/api";

const params = new URLSearchParams(window.location.search);
const token = params.get("token");
if (!token) window.location.href = "admin-login.html";

const tbody = document.getElementById("tbody");
const emptyMsg = document.getElementById("emptyMsg");
const statUsers = document.getElementById("statUsers");
const statAdmins = document.getElementById("statAdmins");
const statSuspended = document.getElementById("statSuspended");

async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    window.location.href = "admin-login.html";
    return;
  }
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function updateStats(users) {
  statUsers.textContent = users.length;
  statAdmins.textContent = users.filter((u) => u.role === "Admin").length;
  statSuspended.textContent = users.filter(
    (u) => u.status === "Suspended",
  ).length;
  emptyMsg.style.display = users.length ? "none" : "block";
}

function addRow(user) {
  const tr = document.createElement("tr");
  tr.dataset.id = user.id;
  const active = user.status === "Active";
  tr.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>
      <select class="roleSelect">
        <option value="Staff" ${user.role === "Staff" ? "selected" : ""}>Staff</option>
        <option value="Admin" ${user.role === "Admin" ? "selected" : ""}>Admin</option>
      </select>
    </td>
    <td><span class="tag ${active ? "active" : "suspended"}">${user.status}</span></td>
    <td class="row-actions">
      <button class="toggle">${active ? "Suspend" : "Reactivate"}</button>
      <button class="del">Delete</button>
    </td>
  `;
  tbody.appendChild(tr);
}

async function loadUsers() {
  const users = await api("/users");
  tbody.innerHTML = "";
  users.forEach(addRow);
  updateStats(users);
}

// Event delegation for role change, suspend/reactivate, and delete.
tbody.addEventListener("change", async (e) => {
  if (!e.target.classList.contains("roleSelect")) return;
  const id = e.target.closest("tr").dataset.id;
  await api(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify({ role: e.target.value }),
  });
  loadUsers();
});

tbody.addEventListener("click", async (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;
  const id = tr.dataset.id;

  if (e.target.classList.contains("toggle")) {
    const status =
      tr.querySelector(".tag").textContent === "Active"
        ? "Suspended"
        : "Active";
    await api(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    loadUsers();
  }
  if (e.target.classList.contains("del")) {
    await api(`/users/${id}`, { method: "DELETE" });
    loadUsers();
  }
});

document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  if (!name || !email || !password) return;

  try {
    await fetch(API_BASE + "/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create user");
    });
    e.target.reset();
    loadUsers();
  } catch (err) {
    alert(err.message);
  }
});

loadUsers();
