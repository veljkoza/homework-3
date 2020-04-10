const tasksUl = document.getElementById("tasksUl");
const submitBtn = document.getElementById("submitBtn");
const textInput = document.getElementById("textInput");
const saveBtn = document.getElementById("saveBtn");
let blobId = "";

submitBtn.addEventListener("click", addLi);
saveBtn.addEventListener("click", save);

loadItems();

function createElementsForLi(text, checked) {
  let li = document.createElement("li");
  let textNode = document.createTextNode(text);
  li.appendChild(textNode);
  let checkBox = document.createElement("input");
  checkBox.addEventListener("click", () => {
    li.classList.toggle("linethrough");
  });
  checkBox.type = "checkbox";
  if (checked) {
    checkBox.checked = true;
    li.classList.add("lineThrough");
  }
  li.appendChild(checkBox);
  return li;
}

function addLi(e) {
  e.preventDefault();
  let text = textInput.value;
  if (text.length <= 3) {
    return;
  }
  let li = createElementsForLi(text, false);
  tasksUl.appendChild(li);
}

function loadItems() {
  let jsonServerId = localStorage.getItem("jsonServerId");
  if (jsonServerId) {
    fetchTasks(jsonServerId);
  }
}

function fetchTasks(id) {
  fetch(`https://jsonblob.com/api/${id}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to retrieve tasks");
      }
    })
    .then((data) => {
      data.forEach((task) => {
        let li = createElementsForLi(task.text, task.complete);
        tasksUl.appendChild(li);
      });
    });
}

function save() {
  let items = [];
  let allItems = tasksUl.children;

  [...allItems].forEach((element) => {
    let item = {};
    let text = element.textContent;
    let complete = element.lastElementChild.checked;

    item.text = text;
    item.complete = complete;
    items.push(item);
  });

  fetch(`https://jsonblob.com/api/jsonBlob`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items),
  }) //have to iterate through headers!!!
    .then((response) => {
      response.headers.forEach((header) => {
        blobId = header;
      });

      localStorage.setItem("jsonServerId", blobId);
      return blobId;
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
