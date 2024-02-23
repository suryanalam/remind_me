const mainBg = document.getElementById("main-bg");
const reminderCard = document.getElementById("reminder-card");

const addForm = document.getElementById("add-form");
const updateForm = document.getElementById("update-form");
const updateFormId = document.getElementById("update-id");
const updateFormText = document.getElementById("update-text");
const updateFormDate = document.getElementById("update-date");
const updateFormTime = document.getElementById("update-time");

let reminders;

// Close the add reminder model
function handleCloseModel(id) {
  document.getElementById(id).style.display = "none";
}

// Open the add reminder model
function handleOpenModel(id) {
  document.getElementById(id).style.display = "flex";
}

// Convert time of 24 hrs format into 12 hrs format along with AM/PM
function formatTime(time) {
  let [hour, minute] = time.split(":");
  if (hour > 12) {
    formattedHour = hour % 12;
    return `${formattedHour}:${minute} PM`;
  }
  return `${time} AM`;
}

// DOM manipulation for rendering all reminder cards
function renderReminderCards() {
  mainBg.innerHTML = "";

  // Create a h4 tag if no reminders found
  if (reminders.length == 0) {
    let emptyNote = document.createElement("h4");
    emptyNote.innerText = "No Reminders Found";
    mainBg.appendChild(emptyNote);
  }

  // Create a reminder card for each reminder
  reminders.forEach((reminder) => {
    let formattedTime = formatTime(reminder.reminder_time);

    let text = document.createElement("p");
    text.classList.add("reminder-text");
    text.innerText = `${reminder.reminder_text}`;

    let timestamp = document.createElement("p");
    timestamp.classList.add("reminder-timestamp");
    timestamp.innerHTML = `📆 ${reminder.reminder_date} &nbsp; 🕛 ${formattedTime}`;

    let details_div = document.createElement("section");
    details_div.classList.add("details-div");
    details_div.appendChild(text);
    details_div.appendChild(timestamp);

    let edit_icon = document.createElement("span");
    edit_icon.classList.add("reminder-edit-icon");
    edit_icon.id = "edit-icon";
    edit_icon.value = `${reminder.id}`;
    edit_icon.innerText = `✏️`;

    let delete_icon = document.createElement("span");
    delete_icon.classList.add("reminder-delete-icon");
    delete_icon.id = "delete-icon";
    delete_icon.value = `${reminder.id}`;
    delete_icon.innerText = `❌`;

    let actions_div = document.createElement("section");
    actions_div.classList.add("actions-div");
    actions_div.appendChild(edit_icon);
    actions_div.appendChild(delete_icon);

    let card = document.createElement("section");
    card.classList.add("reminder-card");
    card.id = "reminder-card";
    card.append(details_div);
    card.append(actions_div);

    mainBg.append(card);
  });
}

// Fetch all reminders from json file:
(async () => {
  try {
    let resp = await fetch("./reminders.json");
    reminders = await resp.json();
    console.log("Reminders from response: ", reminders);
    reminders && renderReminderCards();
  } catch (err) {
    console.log("error while fetching reminders data: ", err);
  }
})();

// Logic to add a reminder
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let reminder = {};

  //Generating a unique alphanumeric string
  reminder["id"] = Math.random().toString(36).slice(2);

  const form_data = new FormData(addForm);
  const values = [...form_data.entries()];

  values.forEach((entry) => {
    if (!entry[1]) {
      alert("Please fill all the required details !!")
      return;
    };
    reminder[entry[0]] = entry[1];
  });

  if (!reminder) {
    alert("Error while adding a reminder !!");
    return;
  }

  if (reminders.length == 0) {
    reminders.push(reminder);
  } else {
    reminders = [...reminders, reminder];
  }

  console.log("After adding new reminder: ", reminders);

  addForm.reset();
  handleCloseModel("add-model");
  renderReminderCards();
});

// Logic to update a reminder
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let reminder = {};
  let reminderId;

  const form_data = new FormData(updateForm);
  const values = [...form_data.entries()];

  values.forEach((entry) => {
    // if (entry[0] != "update_id") {
    //   reminder[entry[0]] = entry[1];
    // } else {
    //   reminderId = entry[1];
    // }
    if (!entry[1]) {
      alert("Please fill all the required details !!")
      return;
    };

    entry[0] == "update_id"
      ? (reminderId = entry[1])
      : (reminder[entry[0]] = entry[1]);
  });

  if(!reminder){
    alert("Error while updating a reminder !!");
    return;
  }

  reminders.forEach((item) => {
    if (item.id == reminderId) {
      item.reminder_text = reminder.update_text;
      item.reminder_date = reminder.update_date;
      item.reminder_time = reminder.update_time;
    }
  });

  console.log("After updating a reminder: ", reminders);

  updateForm.reset();
  handleCloseModel("update-model");
  renderReminderCards();
});

// Logic to set input fields of edit form and deletion of a reminder
mainBg.addEventListener("click", (e) => {
  if (e.target.id === "edit-icon") {
    handleOpenModel("update-model");
    let data = reminders.find((reminder) => reminder.id == e.target.value);

    // set form input values
    updateFormId.value = data.id;
    updateFormText.value = data.reminder_text;
    updateFormDate.value = data.reminder_date;
    updateFormTime.value = data.reminder_time;
  } else if (e.target.id === "delete-icon") {
    if(!confirm('Press "OK" to delete the reminder or "Cancel" it !!')){
      return;
    }
    reminders = reminders.filter((reminder) => reminder.id != e.target.value);
    console.log("After deleting a reminder: ", reminders);
    renderReminderCards();
  }
});
