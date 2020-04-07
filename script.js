//First section consts
const currentMonthElement = document.getElementById("monthSpan");
const availableBudgetElement = document.getElementsByClassName(
  "available-budget"
)[0];
const currentIncomeElement = document.querySelectorAll("#income p")[1];
const currentExpensesElement = document.querySelectorAll("#expenses p")[1];
const currentExpensePercentege = document.querySelectorAll(
  "#expenses .expensePercentege"
)[0];

console.log(currentExpensePercentege)

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



let budget = localStorage.getItem("budget");
let income = localStorage.getItem("income");
let expenses = localStorage.getItem("expenses");


currentIncomeElement.innerHTML = `+${income}`;
currentExpensesElement.innerHTML = `-${expenses}`;

let selectedSign = "+";
(function loadEventListeners() {
    refreshExpensePercentage();

  togglerIcons.addEventListener("click", (e) => {
    if (currentSign.textContent === "+") {
      currentSign.innerHTML = "-";
      selectedSign = "-";
    } else {
      currentSign.innerHTML = "+";
      selectedSign = "+";
    }
  });

  let previousDesc = "";
  addItemDescription.addEventListener("keyup", (e) => {
    let currentValue = addItemDescription.value;
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      console.log(addItemDescription);

      addItemDescription.value = previousDesc;
    } else {
      addItemDescription.value = currentValue;
      previousDesc = currentValue;
    }
  });

  function setInputFilter(textbox, inputFilter) {
    [
      "input",
      "keydown",
      "keyup",
      "mousedown",
      "mouseup",
      "select",
      "contextmenu",
      "drop",
    ].forEach(function (event) {
      textbox.addEventListener(event, function () {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      });
    });
  }

  setInputFilter(addItemValue, function (value) {
    return /^-?\d*[.,]?\d{0,2}$/.test(value);
  });

  addItemBtn.addEventListener("click", addItem);

  function addItem() {
    let obj = createNewItem();
    let amount = parseFloat(obj.amount);
    switch (obj.plus) {
      case true:
        refreshIncome(amount);
        refreshBudget();
        refreshExpensePercentage();
        break;

      case false:
          console.log("Test")
        refreshExpenses(amount);
        refreshBudget();
        refreshExpensePercentage();
        break;
      //localStorage.setItem("income",newIncome)
    }
  }

  function refreshIncome(amount) {
    oldIncome = parseFloat(localStorage.getItem("income"));
    newIncome = oldIncome + amount;
    localStorage.setItem("income", newIncome);
    currentIncomeElement.innerHTML = `+${newIncome}`;
  }

  function refreshExpenses(amount) {
    oldExpenses = parseFloat(localStorage.getItem("expenses"));
    newExpenses = oldExpenses + amount;
    localStorage.setItem("expenses", newExpenses);
    currentExpensesElement.innerHTML = `-${newExpenses}`;
  }

  function refreshBudget(){
      let currentIncome = parseFloat(localStorage.getItem("income"));
      let currentExpense = parseFloat(localStorage.getItem("expenses"));
      let currentBudget = currentIncome - currentExpense;

    localStorage.setItem("budget",currentBudget)
    if (currentBudget >= 0) {
        availableBudgetElement.innerHTML = `+${currentBudget}`;
      } else {
        availableBudgetElement.innerHTML = `-${currentBudget}`;
      }

  }

  function refreshExpensePercentage(){
      let currentExpense = parseInt(localStorage.getItem("expenses"));
      let currentBudget = parseInt(localStorage.getItem("budget"));
      let percentage = countPercentage(currentExpense,currentBudget);

      currentExpensePercentege.innerHTML = parseInt(percentage) + "%"
  }

  function createNewItem() {
    let leftUl = document.querySelector(".left");
    let rightUl = document.querySelector(".right");
    //changed code
    let object = {
      plus: true,
      amount: 0,
    };
    let newItemDesc = addItemDescription.value;
    let newItemValue = addItemValue.value;

    let newLi = document.createElement("li");
    newLi.classList.add("item");

    let newItemDescP = document.createElement("p");
    newItemDescP.innerHTML = newItemDesc;
    newLi.appendChild(newItemDescP);

    let newItemValueP = document.createElement("p");

    if (selectedSign === "+") {
      object.plus = true;
      object.amount = newItemValue;
      newItemValue = `+ ${newItemValue}`;
      newItemValueP.innerHTML = newItemValue;

      newLi.appendChild(newItemValueP);
      leftUl.appendChild(newLi);
    } else {
      object.plus = false;
      object.amount = newItemValue;

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
    return object;
  }

  function countPercentage(input, sum) {
    return input / sum * 100;
  }
})();
