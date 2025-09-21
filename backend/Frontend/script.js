const form = document.getElementById("contactForm");
const list = document.getElementById("contactList");

async function fetchContacts() {
  const res = await fetch("http://localhost:5000/contacts");
  const contacts = await res.json();
  list.innerHTML = "";
  contacts.forEach((c) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${c.name}</strong> - ${c.email} - ${c.phone}
      <button onclick="deleteContact(${c.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  if (!/^\d{10}$/.test(phone)) {
    alert("Phone must be 10 digits");
    return;
  }
  await fetch("http://localhost:5000/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone }),
  });
  form.reset();
  fetchContacts();
});

async function deleteContact(id) {
  await fetch(`http://localhost:5000/contacts/${id}`, { method: "DELETE" });
  fetchContacts();
}

fetchContacts();
