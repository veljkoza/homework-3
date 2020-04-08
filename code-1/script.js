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
currentMonthElement.innerHTML = `${currentMonth}`;

//Second section consts
const togglerElement = document.querySelectorAll(".toggler")[0];
const togglerIcons = togglerElement.lastElementChild;
let currentSign = togglerElement.firstElementChild;

const addItemDescription = document.getElementById("item-desc");
const addItemValue = document.getElementById("item-value");
const addItemBtn = document.querySelector(".item-adder-container button");

//Third section consts
const itemPercenteges = document.querySelector(".item-right");
const delBtns = document.querySelectorAll(".delete-button");
let leftUl = document.querySelector(".left");
let rightUl = document.querySelector(".right");
let selectedItemPercenteges = document.querySelectorAll(".item-right .expensePercentege")

//setting local storage for first time on new machine
if (!localStorage.getItem("budget")) {
  localStorage.setItem("budget", 0);
  localStorage.setItem("income", 0);
  localStorage.setItem("expenses", 0);

  let itemArray = []
  localStorage.setItem("items",JSON.stringify(itemArray));
}else{
  repouplateLists();
}

let selectedSign = "+";
(function loadEventListeners() {
  refreshBudget();
  refreshExpenses(0);
  refreshIncome(0);
  refreshExpensePercentage();
  currentExpensePercentege.innerHTML = "0%";

  Array.from(delBtns).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let itemForDelete = e.target.parentElement.parentElement.parentElement;
      rightUl.removeChild(itemForDelete);
    });
  });

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
    if (addItemDescription.value === "" || addItemValue.value === "") {
      alert("That field can't be empty!");
      return;
    }
    let obj = createNewItem();
    let allItems = JSON.parse(localStorage.getItem("items"));
    allItems.push(obj);
    localStorage.setItem("items",JSON.stringify(allItems));
    let amount = parseFloat(obj.amount);
    switch (obj.plus) {
      case true:
        refreshIncome(amount);
        refreshBudget();
        refreshExpensePercentage();
        refreshPercentegeForAll();
        break;

      case false:
        refreshExpenses(amount);
        refreshBudget();
        refreshExpensePercentage();
        refreshPercentegeForAll();
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

  function refreshBudget() {
    let currentIncome = parseFloat(localStorage.getItem("income"));
    let currentExpense = parseFloat(localStorage.getItem("expenses"));
    let currentBudget = currentIncome - currentExpense;

    localStorage.setItem("budget", currentBudget);
    if (currentBudget >= 0) {
      availableBudgetElement.innerHTML = `+${currentBudget}`;
    } else {
      availableBudgetElement.innerHTML = `${currentBudget}`;
    }
  }

  function refreshExpensePercentage() {
    let currentExpense = parseInt(localStorage.getItem("expenses"));
    let currentBudget = parseInt(localStorage.getItem("budget"));
    let percentage = countPercentage(currentExpense, currentBudget);

    if (isNaN(percentage)) {
      currentExpensePercentege.innerHTML = "0%";
    }
    currentExpensePercentege.innerHTML = parseInt(percentage) + "%";
  }
  function refreshPercentegeForAll() {
    selectedItemPercenteges.forEach(percentage => {
      let amount = percentage.parentElement.firstElementChild;
      let intAmount = parseInt(amount.substring(1,amount.length));
      let newPerc = parseInt(countPercentage(intAmount),localStorage.getItem("budget"));
      percentage.innerHTML=`${newPerc}%`;
    })
  }

  function createNewItem() {
    //changed code
    let object = {
      plus: true,
      description: "",
      amount: 0,
    };


    let newItemDesc = addItemDescription.value;
    let newItemValue = addItemValue.value;
    let newLi = document.createElement("li");
    newLi.classList.add("item");

    let newItemDescP = document.createElement("p");
    newItemDescP.innerHTML = newItemDesc;
    newLi.appendChild(newItemDescP);
    let newDivRight = document.createElement("div");
    newDivRight.classList.add("item-right");

    let newDelBtn = document.createElement("button");
    newDelBtn.classList.add("delete-button");

    let newDelIcon = document.createElement("i");
    newDelIcon.classList.add("fas", "fa-trash");

    newDelBtn.appendChild(newDelIcon);

    newDelBtn.addEventListener("click", (e) => {
      let itemForDelete = e.target.parentElement.parentElement.parentElement;
      leftUl.removeChild(itemForDelete)
      rightUl.removeChild(itemForDelete);
    });

    let newItemValueP = document.createElement("p");

    if (selectedSign === "+") {
      object.plus = true;
      object.description = newItemDesc;
      object.amount = newItemValue;


      newItemValue = `+ ${newItemValue}`;
      newItemValueP.innerHTML = newItemValue;
      newDivRight.appendChild(newItemValueP);
      newDivRight.appendChild(newDelBtn);
      newLi.appendChild(newDivRight);
      leftUl.appendChild(newLi);
    } else {
      object.plus = false;
      object.description = newItemDesc
      object.amount = newItemValue;

      let newItemPercentege = countPercentage(newItemValue,parseInt(localStorage.getItem("budget")));

      newItemValue = `- ${newItemValue}`;
      newItemValueP.innerHTML = newItemValue;
      newDivRight.appendChild(newItemValueP);

      let newExpensePercentegeDiv = document.createElement("div");
      newExpensePercentegeDiv.classList.add("expensePercentege");
      
      
      newDelBtn.appendChild(newDelIcon);

      newExpensePercentegeDiv.innerHTML = `${parseInt(newItemPercentege)}%`;
      newDivRight.appendChild(newExpensePercentegeDiv);

      newDivRight.appendChild(newDelBtn)

      newLi.appendChild(newDivRight);
      rightUl.appendChild(newLi);
    }
    console.log(object)
    return object;

  }

  function countPercentage(input, sum) {
    return (input / sum) * 100;
  }
})();
