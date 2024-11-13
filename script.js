document.getElementById("addBtn").addEventListener("click", addTask);

function addTask() {
    const subject = document.getElementById("subject").value;
    const dueDate = document.getElementById("dueDate").value;
    const importance = document.getElementById("importance").value;

    // Validate the form inputs
    if (!subject || !dueDate || !importance) {
        alert("Please fill out all fields.");
        return;
    }

    // Create a new task row
    const tableBody = document.querySelector("#todoTable tbody");
    const newRow = document.createElement("tr");

    // Add checkmark, subject, due date, and importance to the row
    newRow.innerHTML = `
        <td><input type="checkbox" class="checkmark" onclick="toggleCompletion(this)"></td>
        <td>${subject}</td>
        <td>${dueDate}</td>
        <td>${importance}</td>
        <td><button onclick="removeTask(this)">Delete</button></td>
    `;

    // Append the row to the table
    tableBody.appendChild(newRow);

    // Clear the input fields
    document.getElementById("subject").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("importance").value = "Low";
}

function toggleCompletion(checkbox) {
    const row = checkbox.closest("tr");
    row.classList.toggle("completed", checkbox.checked);
}

function removeTask(button) {
    const row = button.closest("tr");
    row.remove();
}
