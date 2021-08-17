const themeSelector = document.querySelector(".theme-selector");
const body = document.querySelector("body");

themeSelector.addEventListener("change", function () {
  switch (themeSelector.value) {
    case "1":
      body.classList.remove("theme-2");
      body.classList.remove("theme-3");
      break;
    case "2":
      body.classList.add("theme-2");
      body.classList.remove("theme-3");
      break;
    case "3":
      body.classList.remove("theme-2");
      body.classList.add("theme-3");
      break;
  }
});

const numberBtns = document.querySelectorAll("[data-number]");
const operatorBtns = document.querySelectorAll("[data-operator]");
const deleteBtn = document.querySelector("[data-delete]");
const resetBtn = document.querySelector("[data-reset]");
const equalBtn = document.querySelector("[data-equal]");
const displayTopText = document.querySelector("[data-displayTop]");
const displayBottomText = document.querySelector("[data-displayBottom]");

class Calculator {
  constructor(displayTopText, displayBottomText) {
    this.displayTopText = displayTopText;
    this.displayBottomText = displayBottomText;
    this.arrayNumber = [];
    this.reset();
  }

  reset() {
    this.prevNumber = "";
    this.currentNumber = "";
    this.operator = undefined;
    this.result = "";
  }

  delete() {
    if (this.displayTopText.innerText.includes("=")) {
      this.operator = undefined;
      this.currentNumber = this.currentNumber;
    } else {
      this.currentNumber = this.currentNumber.toString().slice(0, -1);
    }
    if (this.prevNumber !== "") {
      this.arrayNumber.push(this.currentNumber);
    }
  }

  appendNumber(number) {
    if (number === "." && (this.currentNumber == 0 || this.arrayNumber.length == 1)) {
      this.currentNumber = "0.";
    }
    if (number === "." && this.currentNumber.toString().includes(".")) return;
    if (this.currentNumber === this.prevNumber) {
      this.currentNumber = number.toString()
    } else {
      this.currentNumber = this.currentNumber.toString() + number.toString();
    }
    if (this.displayTopText.innerText.includes("=")) {
      if (number === ".") {
        this.currentNumber = "0.";
      } else {
        this.currentNumber = number.toString();
      }
      this.prevNumber = "";
      this.operator = undefined;
    }
    if (this.arrayNumber.length === 1) {
      this.arrayNumber.push(number);
    }
  }

  selectOperator(operator) {
    if (this.currentNumber == 0) {
      this.currentNumber = "0";
    }
    if (this.currentNumber === "") return;
    if (this.displayTopText.innerText.includes("=")) {
      this.prevNumber = this.currentNumber;
      this.operator = "";
    }
    if (this.arrayNumber.length <= 1) {
      this.operator = operator;
    } else {
      this.compute();
      this.arrayNumber = [];
    }
    if (this.currentNumber === Infinity) {
      this.prevNumber = this.prevNumber;
    } else {
      this.prevNumber = this.currentNumber;
    }
    if (this.prevNumber !== "" && this.arrayNumber.length === 0) {
      this.arrayNumber.push(this.currentNumber);
    }
    this.operator = operator;
  }

  compute() {
    let computation;
    const firstNumber = parseFloat(this.prevNumber);
    const secondNumber = parseFloat(this.currentNumber);
    this.result = secondNumber;

    if (isNaN(firstNumber) || isNaN(secondNumber)) return;
    switch (this.operator) {
      case "+":
        computation = firstNumber + secondNumber;
        break;
      case "-":
        computation = firstNumber - secondNumber;
        break;
      case "x":
        computation = firstNumber * secondNumber;
        break;
      case "/":
        computation = firstNumber / secondNumber;
        break;
      default:
        return;
    }
    this.currentNumber = computation;
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits !== undefined) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay(isEqual) {
    displayBottomText.classList.remove("smallerText");
    this.displayBottomText.innerText = this.getDisplayNumber(this.currentNumber);

    if (this.operator !== undefined) {
      this.displayTopText.innerText = `${this.getDisplayNumber(this.prevNumber)} ${this.operator}`;
    } else {
      this.displayTopText.innerText = "";
    }
    if (isEqual && this.prevNumber !== "") {
      this.displayTopText.innerText = `${this.getDisplayNumber(this.prevNumber)} ${this.operator} ${this.getDisplayNumber(this.result)} =`;
    }
    if (this.currentNumber === "") {
      this.displayBottomText.innerText = 0;
    }
    if (this.currentNumber === Infinity) {
      this.displayTopText.innerText = `${this.getDisplayNumber(this.prevNumber)} / ${this.getDisplayNumber(this.result)} =`;
      this.displayBottomText.innerText = "Cannot divide by zero";
      displayBottomText.classList.add("smallerText");
      this.prevNumber = "";
      this.currentNumber = "";
      this.operator = undefined;
    }
    if (isNaN(this.currentNumber)) {
      this.displayTopText.innerText = `0 / 0 =`;
      this.displayBottomText.innerText = "Result is undefined";
      displayBottomText.classList.add("smallerText");
      this.prevNumber = "";
      this.currentNumber = "";
      this.operator = undefined;
    }
  }

}

const calculator = new Calculator(displayTopText, displayBottomText);

numberBtns.forEach((numberBtn) => {
  numberBtn.addEventListener("click", function () {
    calculator.appendNumber(numberBtn.innerText);
    calculator.updateDisplay();
  });
});

operatorBtns.forEach((operatorBtn) => {
  operatorBtn.addEventListener("click", function () {
    calculator.selectOperator(operatorBtn.innerText);
    calculator.updateDisplay();
  });
});

resetBtn.addEventListener("click", function () {
  calculator.reset();
  calculator.updateDisplay();
});

equalBtn.addEventListener("click", function () {
  calculator.compute();
  calculator.updateDisplay(equalBtn.innerText);
});

deleteBtn.addEventListener("click", function () {
  calculator.delete();
  calculator.updateDisplay();
});
