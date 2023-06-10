const transactionUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionAmount = document.querySelector("#amount")
const inputTransactionName = document.querySelector("#text")

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []


const removeTransaction = ID => {
  transactions = transactions.filter(transaction => transaction.id !== ID)
  updateLocalStorage()
  init()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+'
  const CSSClass = amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement('li')
  li.classList.add(CSSClass)
  li.innerHTML = `
    ${name}
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button> 
  `
  transactionUl.append(li)
}

const getExpenses = transactionAmounts => Math.abs(transactionAmounts.filter(transaction => transaction < 0).reduce((acc, transaction) => acc + transaction, 0)).toFixed(2)

const getIncome = transactionAmounts => transactionAmounts.filter(transaction => transaction > 0).reduce((acc, transaction) => acc + transaction, 0).toFixed(2)

const getTotal = transactionAmounts => transactionAmounts.reduce((acc, transaction) => acc + transaction, 0).toFixed(2)



const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(({ amount }) => amount)

  const total = getTotal(transactionAmounts)
  const income = getIncome(transactionAmounts)
  const expense = getExpenses(transactionAmounts)


  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`

}

const init = () => {
  transactionUl.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generatedId = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({ id: generatedId(), name: transactionName, amount: Number(transactionAmount) });
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

  if (isSomeInputEmpty) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, preencha tanto o nome quanto o valor da transação!',
    })
    cleanInputs();
    return
  }

  addToTransactionsArray(transactionName, transactionAmount)

  init()
  updateLocalStorage();
  cleanInputs()



}


form.addEventListener('submit', handleFormSubmit)

// const parseDate = dateString => {
//   const parts = dateString.split(" ");
//   const date = parts[0];
//   const time = parts[1];

//   const dateParts = date.split("/");
//   const day = parseInt(dateParts[0], 10);
//   const month = parseInt(dateParts[1], 10) - 1; // Os meses em JavaScript são baseados em zero (0 - janeiro, 1 - fevereiro, etc.)
//   const year = parseInt(dateParts[2], 10);

//   const timeParts = time.split(":");
//   const hours = parseInt(timeParts[0], 10);
//   const minutes = parseInt(timeParts[1], 10);
//   const seconds = parseInt(timeParts[2], 10);

//   const formattedDate = new Date(year, month, day, hours, minutes, seconds);
//   return formattedDate;
// }

// // Exemplo de uso da função
// const dataString = "12/05/2023 10:43:15";
// const dataInicio = parseDate(dataString);

// console.log(dataInicio);

