class Calculator{
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.resetDisplay = false;
        this.additionalContent = 'NULL';
        this.isPercent = false;
    }

    updateDisplay(){
        const mainDisplay = document.querySelector(".display-main");
        const additionalDisplay = document.querySelector(".display-additional");

        let currentText = this.currentOperand;
        if (this.isPercent && this.currentOperand !== '') {
            currentText = this.currentOperand + '%';
        }

        if (this.operation !== null && this.previousOperand !== '') {
            if (this.resetDisplay) {
                mainDisplay.textContent = this.previousOperand + ' ' + this.operation;
            } else {
                mainDisplay.textContent = this.previousOperand + ' ' + this.operation + ' ' + currentText;
            }
        } else {
            mainDisplay.textContent = currentText;
        }
        additionalDisplay.textContent = this.additionalContent;
        if (this.additionalContent === "NULL"){
            additionalDisplay.classList.add("visually-hidden");
        } else {
            additionalDisplay.classList.remove("visually-hidden");
        }
    }

    handleOperator(operator){
        this.isPercent = false;
        if (this.previousOperand !== '' && this.operation !== null) {
            this.compute();
        }
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.resetDisplay = true;
        this.additionalContent = "NULL";
    }

    handleAction(action){
        switch(action){
            case "clear":
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = null;
                this.resetDisplay = false;
                this.additionalContent = 'NULL';
                this.isPercent = false;
                break;
            case "backspace":
                case "backspace":
                    this.isPercent = false;

                    if (this.operation !== null && this.previousOperand !== '' && this.resetDisplay) {
                        this.operation = null;
                        this.currentOperand = this.previousOperand;
                        this.previousOperand = '';
                        this.resetDisplay = false;
                        this.additionalContent = "NULL";
                        break;
                    }

                    if (this.currentOperand !== "0"){
                        if (this.currentOperand.length > 1){
                            this.currentOperand = this.currentOperand.slice(0, -1);
                        } else {
                            if (this.previousOperand !== ""){
                                if (this.currentOperand === ""){
                                    this.operation = null;
                                    this.currentOperand = this.previousOperand;
                                    this.previousOperand = '';
                                } else { 
                                    this.currentOperand = "";
                                }
                            } else {
                                this.currentOperand = "0";
                            }
                        }
                    }
                    this.additionalContent = "NULL";
                    break;
            case "percent":
                if (this.currentOperand !== ''){
                    this.isPercent = true;
                }
                this.additionalContent = "NULL";
                break;
            case "equals":
                if (this.previousOperand !== '' && this.operation !== null && this.currentOperand !== ''){
                    this.compute();
                } else if (this.isPercent && this.currentOperand !== '') {
                    const curr = parseFloat(this.currentOperand);
                    if (!isNaN(curr)){
                        const result = curr / 100;
                        this.additionalContent = this.currentOperand + '%';
                        this.currentOperand = this.formatNumber(result);
                    }
                    this.isPercent = false;
                }
                break;
            case "toggle-sign":
                if (this.currentOperand.includes("-")){
                    this.currentOperand = this.currentOperand.slice(-1);
                } else {
                    this.currentOperand = "-" + this.currentOperand;
                }
                this.additionalContent = "NULL";
                break;
            case "decimal":
                if (!this.currentOperand.includes('.')) {
                    this.currentOperand += '.';
                }
                this.additionalContent = "NULL";
                break;
            default: 
                console.log("Действие", action);
        }
    }
    
    handleDigit(digit){ 
        if (this.isPercent) {
            this.isPercent = false;
        }
        if (this.currentOperand === "0" || this.resetDisplay){
            this.currentOperand = digit;
            this.resetDisplay = false;
        } else {
            if (this.currentOperand.length < 15){
                this.currentOperand += digit;
            }
        }
    }

    compute(){
        const prev = parseFloat(this.previousOperand);
        let curr = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(curr)) return;

        if (this.isPercent) {
            curr = prev * curr / 100;
        }

        let result = null;

        switch(this.operation){
            case '+':
                result = prev + curr;
                break;
            case '-':
                result = prev - curr;
                break;
            case '*':
                result = prev * curr;
                break;
            case '/':
                if (curr !== 0){
                    result = prev / curr;
                } else {
                    alert("Деление на ноль!");
                    return;
                }
                break;
            default: 
                return;
        }

        if (this.isPercent) {
            this.additionalContent = this.previousOperand + ' ' + this.operation + ' ' + this.currentOperand + '%';
        } else {
            this.additionalContent = this.previousOperand + ' ' + this.operation + ' ' + this.currentOperand;
        }
        this.currentOperand = this.formatNumber(result);
        this.previousOperand = '';
        this.operation = null;
        this.isPercent = false;
    }

    formatNumber(value){
        const precision = 8; 
        if (!isFinite(value)) {
            return value.toString();
        }
        const fixed = value.toFixed(precision);
        return fixed.replace(/\.?0+$/, '');
    }
}

const calculator = new Calculator();
const buttons = document.querySelector(".buttons");

buttons.addEventListener("click", function(event){

    const button = event.target.closest(".button");
    if (!button) return;

    const type = button.dataset.type;
    const value = button.dataset.value;

    switch(type){
        case "digit":
            calculator.handleDigit(value);
            break;
        case "action":
            calculator.handleAction(value);
            break;
        case "operator":
            calculator.handleOperator(value);
            break;
        default:
            console.warn("Неизвестная кнопка", type);
    }
    calculator.updateDisplay();
});