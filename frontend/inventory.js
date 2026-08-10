const API_BASE = "https://inventoryiq-frontend.onrender.com";

// Token comes from the URL (set by login.html on redirect) and is kept in memory for this page only.
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
if (!token) window.location.href = "login.html";
document.getElementById("adminLink").href =
  "admin.html?token=" + encodeURIComponent(token);

const tbody = document.getElementById("tbody");
const emptyMsg = document.getElementById("emptyMsg");

const money = (n) => "$" + Number(n).toFixed(2);

function authHeaders(extra = {}) {
  return { Authorization: "Bearer " + token, ...extra };
}

async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: authHeaders({
      "Content-Type": "application/json",
      ...(options.headers || {}),
    }),
  });
  if (res.status === 401) {
    window.location.href = "login.html";
    return;
  }
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function updateStats(items) {
  document.getElementById("statItems").textContent = items.length;
  document.getElementById("statUnits").textContent = items.reduce(
    (s, i) => s + i.qty,
    0,
  );
  document.getElementById("statLow").textContent = items.filter(
    (i) => i.qty <= i.threshold,
  ).length;
  emptyMsg.style.display = items.length ? "none" : "block";
}

function addRow(item) {
  const tr = document.createElement("tr");
  tr.dataset.id = item.id;
  const low = item.qty <= item.threshold;
  tr.innerHTML = `
    <td>${item.name}</td>
    <td class="num"><input type="number" min="0" value="${item.qty}" class="qtyInput" style="width:70px; padding:5px; text-align:right;"></td>
    <td class="num">${money(item.price)}</td>
    <td class="num valueCell">${money(item.qty * item.price)}</td>
    <td><span class="tag ${low ? "low" : "ok"}">${low ? "Low stock" : "In stock"}</span></td>
    <td class="row-actions"><button class="del">Delete</button></td>
  `;
  tbody.appendChild(tr);
}

async function loadItems() {
  const items = await api("/items");
  tbody.innerHTML = "";
  items.forEach(addRow);
  updateStats(items);
}

// Event delegation: one listener handles every row's qty change and delete click.
tbody.addEventListener("change", async (e) => {
  if (!e.target.classList.contains("qtyInput")) return;
  const tr = e.target.closest("tr");
  const id = tr.dataset.id;
  const qty = Math.max(0, Number(e.target.value) || 0);

  const updated = await api(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify({ qty }),
  });
  e.target.value = updated.qty;
  tr.querySelector(".valueCell").textContent = money(
    updated.qty * updated.price,
  );
  const tag = tr.querySelector(".tag");
  const low = updated.qty <= updated.threshold;
  tag.textContent = low ? "Low stock" : "In stock";
  tag.className = "tag " + (low ? "low" : "ok");
  loadItems();
});

tbody.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("del")) return;
  const tr = e.target.closest("tr");
  await api(`/items/${tr.dataset.id}`, { method: "DELETE" });
  loadItems();
});

document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  if (!name) return;

  await api("/items", {
    method: "POST",
    body: JSON.stringify({
      name,
      qty: Number(document.getElementById("qty").value) || 0,
      threshold: Number(document.getElementById("threshold").value) || 5,
      price: Number(document.getElementById("price").value) || 0,
    }),
  });
  e.target.reset();
  loadItems();
});

loadItems();
