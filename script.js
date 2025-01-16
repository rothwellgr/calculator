const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

let state = {
    leftOperand: NaN,
    rightOperand: NaN,
    operator: null,
    calculation: NaN,
    percentage: NaN
}

const add = function() {
    return +state.leftOperand + +state.rightOperand;
}
  
const subtract = function() {
    return +state.leftOperand - +state.rightOperand;
}

const divide = function() {
    if (+state.leftOperand == 0 || +state.rightOperand == 0) {
        return "Pffft...";
    }
    return +state.leftOperand / +state.rightOperand;
}

const multiply = function() {
    return +state.leftOperand * +state.rightOperand;
}

const mapOperationToFunction = function() {
    const expr = state.operator;
    switch (expr) {
        case '+':
            return add();
        case '-':
            return subtract();
        case '/':
            return divide();
        case '*':
            return multiply();
        default:
            console.log('Function not found for operation.');
    }
}

const calculatePercentage = function() {

    state.percentage = +state.leftOperand * +state.rightOperand / 100;
    display.innerHTML = state.percentage;

    return state.operator == '+' ? +state.leftOperand + +state.percentage : +state.leftOperand - +state.percentage;
}

const resetCalculatorState = function() {
    state.leftOperand = NaN;
    state.rightOperand = NaN;
    state.operator = null;
    state.calculation = NaN;
    state.percentage = NaN;
}

const displayValue = function(value) {
    let valueString = value.toString();
    valueString.length >= 9 ? console.log('More than 9 characters input - doing nothing.') : display.innerHTML = valueString;
}

const displayCalculation = function(calculation) {
    let calcString = calculation.toString();
    calcString.length > 9 ? display.innerHTML = calcString.slice(0, 8) + '+' : display.innerHTML = calcString;
}

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        switch (true) {
            case button.value == 'CE' && !isNaN(state.leftOperand) && !isNaN(state.rightOperand):
                state.rightOperand = NaN;
                display.innerHTML = '0';
                break;
            case button.value == 'CE' && !isNaN(state.leftOperand) && isNaN(state.rightOperand):
                state.leftOperand = NaN;
                display.innerHTML = '0';
                break;
            case button.value == 'C':
                resetCalculatorState();
                display.innerHTML = '0';
                break;
            case button.value == '.' && display.innerHTML.includes('.'):
                console.log('Decimal point already input - doing nothing.');
                break;
            case (/[0-9.]/.test(button.value)) && state.operator != null:
                isNaN(state.rightOperand) ? state.rightOperand = button.value : state.rightOperand += button.value;
                displayValue(state.rightOperand);
                break;
            case (/[0-9.]/.test(button.value)) && state.operator == null:
                isNaN(state.leftOperand) ? state.leftOperand = button.value : state.leftOperand += button.value;
                displayValue(state.leftOperand);
                break;
            case button.value == '=' && !isNaN(state.percentage):
                state.calculation = calculatePercentage();
                displayCalculation(state.calculation);
                resetCalculatorState();
                break;
            case button.value == '=' && !isNaN(state.leftOperand) && !isNaN(state.rightOperand):
                state.calculation = mapOperationToFunction();
                displayCalculation(state.calculation);
                break;
            case (/^(\+|-|\*|\/)$/.test(button.value)) && !isNaN(state.percentage):
                displayCalculation(state.percentage);
                state.leftOperand = state.calculation;
                state.rightOperand = NaN;
                state.operator = button.value;
                state.percentage = NaN;  
                break;         
            case (/^(\+|-|\*|\/)$/.test(button.value)) && !isNaN(state.leftOperand) && !isNaN(state.rightOperand):
                state.calculation = mapOperationToFunction();
                state.leftOperand = state.calculation;
                state.rightOperand = NaN;
                state.operator = button.value;
                state.percentage = NaN;
                displayCalculation(state.calculation);
                break;
            case button.value == '%' && (state.operator == '+' || state.operator == '-'):
                state.calculation = calculatePercentage();
                state.percentage = state.calculation;
                break;
            case !isNaN(state.leftOperand) && isNaN(state.rightOperand):
                state.operator = button.value;
                break;
            default:
                console.log('Input with current state not accounted for. If unexpected, this is likely an issue.');
        }
    });
});