//First section consts
const currentMonthElement = document.getElementById("monthSpan");
const availableBudgetElement = document.getElementsByClassName(
  "available-budget"
)[0];
const currentIncomeElement = document.querySelectorAll("#income p")[1];
const currentExpensesElement = document.querySelectorAll("#expenses p")[1];
const currentExpensePercentege = document.querySelectorAll(
  "#expenses .expensePercentege"
);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let currentDate = new Date();
let currentMonth = months[currentDate.getMonth()];
console.log(currentMonth);
currentMonthElement.innerHTML = `${currentMonth}`;

//Second section consts
const togglerElement = document.querySelectorAll(".toggler")[0];
const togglerIcons = togglerElement.lastElementChild;
let currentSign = togglerElement.firstElementChild;

const addItemDescription = document.getElementById("item-desc");
const addItemValue = document.getElementById("item-value");
const addItemBtn = document.querySelector(".item-adder-container button");

let currentBudget = availableBudgetElement.textContent.split(
  1,
  availableBudgetElement.textContent.length
);

let selectedSign = "+";
(function loadEventListeners() {
  togglerIcons.addEventListener("click", (e) => {
    if (currentSign.textContent === "+") {
      currentSign.innerHTML = "-";
      selectedSign = "-";
    } else {
      currentSign.innerHTML = "+";
      selectedSign = "+";
    }
  });

  addItemBtn.addEventListener("click", addItem);

  function addItem() {
    createNewItem();
  }

  function createNewItem() {
    let leftUl = document.querySelector(".left");
    let rightUl = document.querySelector(".right");
    let newItemDesc = addItemDescription.value;
    let newItemValue = addItemValue.value;

    let newLi = document.createElement("li");
    newLi.classList.add("item");

    let newItemDescP = document.createElement("p");
    newItemDescP.innerHTML = newItemDesc;
    newLi.appendChild(newItemDescP);

    let newItemValueP = document.createElement("p");

    if (selectedSign === "+") {
      newItemValue = `+ ${newItemValue}`;
      newItemValueP.innerHTML = newItemValue;

      newLi.appendChild(newItemValueP);
      leftUl.appendChild(newLi);
    } else {
      let newDivRight = document.createElement("div");
      newItemValue = `- ${newItemValue}`;
      newItemValueP.innerHTML = newItemValue;
      newDivRight.classList.add("item-right");
      newDivRight.appendChild(newItemValueP);

      let newExpensePercentegeDiv = document.createElement("div");
      newExpensePercentegeDiv.classList.add("expensePercentege");

      let newDelBtn = document.createElement("button");
      newDelBtn.classList.add("delete-button");

      let newDelIcon = document.createElement("i");
      newDelIcon.classList.add("fas", "fa-trash");

      newDelBtn.appendChild(newDelIcon);

      newDivRight.appendChild(newExpensePercentegeDiv);
      newDivRight.appendChild(newDelBtn);

      newLi.appendChild(newDivRight);
      rightUl.appendChild(newLi);
    }
  }

  function countPercentage(input, sum) {
    return input / sum;
  }
})();
