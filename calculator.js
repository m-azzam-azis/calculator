let firstNumber = '0';
let operator = '';
let secondNumber = '';
let res;
let negateNext = false;
let isNegative = false;

const resultBox = document.querySelector('.final-result');
resultBox.textContent = 0
const history = document.querySelector('.history')
const container = document.querySelector('.body');

const displayButtons = [
  ['AC',7,4,1, '+/-'],
  ['\u232B', 8, 5, 2, 0],
  ['%',9,6,3,'.'],
  ['÷', '×', '-', '+', '=']
];
const basicOperators = ['÷', '×', '-', '+']
const extraOperators = ['%', '+/-'] 

for (let i = 0; i < 4; i++) {
  const buttonColumn = document.createElement('div');
  buttonColumn.classList.add('button-column')
  for (let j =0; j < 5; j++) {
    const button = document.createElement('button');
    button.textContent = displayButtons[i][j];
    buttonColumn.appendChild(button)
    if (displayButtons[i][j] === '.') {
      button.style.fontWeight = '900'
    } 
    if (i === 3) {
      button.classList.add('right')
    }
    else if (j === 0) {
      button.classList.add('top')
    }
    if (i === 3 && j === 4) {
      button.classList.add('equal-sign');
    }

    button.addEventListener('click', () => {
      let selected = button.textContent;

      if (/^[0-9]*$/.test(selected)) {
        if (!basicOperators.includes(operator) && firstNumber.length < 12) {
          if (firstNumber==='0') {firstNumber=''}
          firstNumber += selected;
          if (negateNext) {
            firstNumber = negateString(firstNumber);
            isNegative = true;
          }
          resultBox.textContent = firstNumber;
        } 
        else if (operator && secondNumber.length < 12){
          if (secondNumber==='0') {secondNumber=''}
          secondNumber += selected;
          if (negateNext) {
            secondNumber = negateString(secondNumber);
            isNegative = true;
          }
          resultBox.textContent = secondNumber;
        }
        negateNext=false;
      } 
      else if (basicOperators.includes(selected)){
        resultBox.textContent = '0';

        if (!firstNumber) {firstNumber='0'}
        if (!secondNumber) {secondNumber='0'}

        if (operator) {
          firstNumber = String(operate(firstNumber, secondNumber, operator))
          secondNumber = '0'

          if (operator != selected) {
            operator = selected
          }
        } 
        else {operator = selected}

        history.textContent=`${firstNumber} ${selected}`;
        
      } 

      else if (extraOperators.includes(selected)) {
        const res = operate(firstNumber, 0, selected)
        if ((firstNumber === '0' || secondNumber === '0') && selected === '+/-') {
          resultBox.textContent = `${isNegative ? '' : '-'}0`;
          negateNext = true;
        }
        else if (!operator) {
          history.textContent = `${firstNumber} ${selected}`;
          firstNumber = String(res);
          resultBox.textContent = res;
        } else if (operator) {
          secondNumber = String(res);
          resultBox.textContent = res;
        }
      }

      else if (selected === 'AC') {
        [firstNumber, secondNumber, operator] = ['0', '', '']
        resultBox.textContent = 0;
        history.textContent = '';
        isNegative = false;
        negateNext = false;
      }

      else if (selected === '\u232B') {

        if (!operator) {
          firstNumber = String(firstNumber).slice(0,-1);
          if (firstNumber === '0' || !firstNumber) {firstNumber = '0'}
          if (firstNumber === '-' || firstNumber ==='0.') {firstNumber = '0'}
          resultBox.textContent = firstNumber;
        }
        else if (operator){
          secondNumber = String(secondNumber).slice(0,-1);

          if (secondNumber === '0' || !secondNumber) {secondNumber = '0'}
          if (secondNumber === '-' || secondNumber ==='0.') {secondNumber = '0'}

          resultBox.textContent = secondNumber;
        }

      }
      else if (selected === '.'){
        if (!operator && !firstNumber.includes('.')) {
          firstNumber += '.'
          resultBox.textContent = firstNumber
        } else if (operator && !secondNumber.includes('.')) {
          secondNumber += '.'
          resultBox.textContent = secondNumber
        }
      }
      if (selected === '=' && secondNumber) {
        let res = operate(firstNumber, secondNumber, operator);

        if (String(res).length > 12) {
          res = res.toExponential(3);
        } 
        resultBox.textContent = res;

        history.textContent = `${firstNumber} ${operator} ${secondNumber}`;

        if (res === 'LOL') {
          [secondNumber, operator] = ['', '']
        } else {
          [firstNumber, secondNumber, operator] = [String(res), '', '']
        } 
      }
      console.log(selected, firstNumber, secondNumber, operator)
    });
  }
  container.appendChild(buttonColumn)
}

function add(a,b) {
  return a+b;
}

function subtract(a,b) {
  return a-b;
}

function multiply (a,b) {
  return a*b;
}

function divide(a,b) {
  return a/b;
}

function percentage(a) {
  return a/100;
}

function negation(a) {
  return a*-1;
}

function operate(a, b , operator) {
  let result;
  a = parseFloat(a)
  b = parseFloat(b)

  if (operator === '+') {
    result = add(a, b);
  } else if (operator === '-') {
    result = subtract(a, b);
  } else if (operator === '÷') {
    if (b === 0) {
      return 'LOL';
    }
    result =  divide(a, b);
  } else if (operator === '×') {
    result =  multiply(a,b);
  } else if (operator === '%') {
    result = percentage(a);
  } else if (operator === '+/-') {
    result = negation(a);
  }

  if (String(result-Math.floor(result)).length > 3) {
    result = Math.floor(result*1000)/1000;
  }
  if (String(result).length > 12) {
    result = Math.floor(result)
  }
  return result;
}

function negateString(a) {
  return String(-1*parseFloat(a))
}
