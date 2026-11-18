const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");
const keys = document.querySelector(".keys");

let current = "0";
let previous = "";
let operator = null;
let shouldReset = false;

function updateDisplay() {
  currentEl.textContent = current;
  previousEl.textContent = previous;
}

function inputNumber(number) {
  if (current === "Error" || shouldReset) {
    current = number;
    shouldReset = false;
  } else {
    current = current === "0" ? number : current + number;
  }
}

function inputDecimal() {
  if (current === "Error" || shouldReset) {
    current = "0.";
    shouldReset = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
}

function chooseOperator(nextOperator) {
  if (current === "Error") return;
  if (operator && !shouldReset) calculate();
  previous = current + " " + nextOperator;
  operator = nextOperator;
  shouldReset = true;
}

function calculate() {
  if (!operator || current === "Error") return;
  const a = Number(previous.split(" ")[0]);
  const b = Number(current);
  let result;

  switch (operator) {
    case "+": result = a + b; break;
    case "−": result = a - b; break;
    case "×": result = a * b; break;
    case "÷":
      if (b === 0) {
        current = "Error";
        previous = "Cannot divide by zero";
        operator = null;
        shouldReset = true;
        return;
      }
      result = a / b;
      break;
  }

  current = String(Number(result.toPrecision(12)));
  previous = "";
  operator = null;
  shouldReset = true;
}

function clearAll() {
  current = "0";
  previous = "";
  operator = null;
  shouldReset = false;
}

function deleteLast() {
  if (current === "Error" || shouldReset) {
    current = "0";
    shouldReset = false;
  } else {
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
  }
}

function percent() {
  if (current !== "Error") {
    current = String(Number(current) / 100);
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) inputNumber(button.dataset.number);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);

  switch (button.dataset.action) {
    case "clear": clearAll(); break;
    case "delete": deleteLast(); break;
    case "decimal": inputDecimal(); break;
    case "percent": percent(); break;
    case "equals": calculate(); break;
  }

  updateDisplay();
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
  else if (event.key === ".") inputDecimal();
  else if (event.key === "+") chooseOperator("+");
  else if (event.key === "-") chooseOperator("−");
  else if (event.key === "*") chooseOperator("×");
  else if (event.key === "/") { event.preventDefault(); chooseOperator("÷"); }
  else if (event.key === "Enter" || event.key === "=") calculate();
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clearAll();
  else return;
  updateDisplay();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

updateDisplay();
