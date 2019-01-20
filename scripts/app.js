const incomeFilter = {
    searchPhrase : '',
    from: moment(0).valueOf(),
    to: moment().add(1,'d').valueOf()
}

const expenseFilter = {
    searchPhrase : '',
    from: moment(0).valueOf(),
    to: moment().add(1,'d').valueOf()
}

const statementFilter = {
    searchPhrase : '',
    from: moment(0).valueOf(),
    to: moment().add(1,'d').valueOf()
}

initDateTimePickers()

const myAccount = init()

hideAll()
show('display-home-screen')

renderName(myAccount.name)
renderAccountSummary(myAccount.incomes.total, myAccount.expenses.total, myAccount.balance)
renderList('#income-list', myAccount.incomes.details,'i', incomeFilter)
renderList('#expense-list', myAccount.expenses.details,'e', expenseFilter)
renderList('#statement-list', constructTransactions(myAccount.incomes.details, myAccount.expenses.details), undefined, statementFilter)

document.querySelector('#save-name').addEventListener('click', function(e){
    const name = document.querySelector('#name-input').value
    if(name){
        document.querySelector('#name-input').value = ''
        myAccount.name = name
        save('accountName', name)
        renderName(myAccount.name)
    }
})

document.querySelector('#save-home-income').addEventListener('click', function(e){
    const desc = document.querySelector('#home-income-description-input').value
    const amount = document.querySelector('#home-income-amount-input').value
    
    if(desc && amount){
        document.querySelector('#home-income-description-input').value = ''
        document.querySelector('#home-income-amount-input').value = ''
        myAccount.add('i',desc,amount)
        save('incomes', myAccount.incomes.details)
        renderAccountSummary(myAccount.incomes.total, myAccount.expenses.total, myAccount.balance)
    }
})

document.querySelector('#save-income').addEventListener('click', function(e){
    const desc = document.querySelector('#income-description-input').value
    const amount = document.querySelector('#income-amount-input').value
    
    if(desc && amount){
        document.querySelector('#income-description-input').value = ''
        document.querySelector('#income-amount-input').value = ''
        myAccount.add('i',desc,amount)
        save('incomes', myAccount.incomes.details)
        renderAccountSummary(myAccount.incomes.total, myAccount.expenses.total, myAccount.balance)
    }
})

document.querySelector('#income-search-filter').addEventListener('input', function(e){
    incomeFilter.searchPhrase = this.value
    renderList('#income-list', myAccount.incomes.details,'i', incomeFilter)
})

document.querySelector('#income-from-filter').addEventListener('change', function(e){
    if(this.value === '')
        incomeFilter.from = moment(0).valueOf()
    else
        incomeFilter.from = moment(this.value).valueOf()
    renderList('#income-list', myAccount.incomes.details,'i', incomeFilter)
})

document.querySelector('#income-to-filter').addEventListener('change', function(e){
    if(this.value === '')
        incomeFilter.to = moment().valueOf()
    else
        incomeFilter.to = moment(this.value).add(1,'d').valueOf()
    renderList('#income-list', myAccount.incomes.details,'i', incomeFilter)
})

document.querySelector('#save-home-expense').addEventListener('click', function(e){
    const desc = document.querySelector('#home-expense-description-input').value
    const amount = document.querySelector('#home-expense-amount-input').value
    
    if(desc && amount){
        document.querySelector('#home-expense-description-input').value = ''
        document.querySelector('#home-expense-amount-input').value = ''
        myAccount.add('e',desc,amount)
        save('expenses', myAccount.expenses.details)
        renderAccountSummary(myAccount.incomes.total, myAccount.expenses.total, myAccount.balance)
    }
})

document.querySelector('#save-expense').addEventListener('click', function(e){
    const desc = document.querySelector('#expense-description-input').value
    const amount = document.querySelector('#expense-amount-input').value
    
    if(desc && amount){
        document.querySelector('#expense-description-input').value = ''
        document.querySelector('#expense-amount-input').value = ''
        myAccount.add('e',desc,amount)
        save('expenses', myAccount.expenses.details)
        renderAccountSummary(myAccount.incomes.total, myAccount.expenses.total, myAccount.balance)
        renderList('#expense-list', myAccount.expenses.details,'e', expenseFilter)
    }
})

document.querySelector('#expense-search-filter').addEventListener('input', function(e){
    expenseFilter.searchPhrase = this.value
    renderList('#expense-list', myAccount.expenses.details,'e', expenseFilter)
})

document.querySelector('#expense-from-filter').addEventListener('change', function(e){
    if(this.value === '')
        expenseFilter.from = moment(0).valueOf()
    else
        expenseFilter.from = moment(this.value).valueOf()
    renderList('#expense-list', myAccount.expenses.details,'e', expenseFilter)
})

document.querySelector('#expense-to-filter').addEventListener('change', function(e){
    if(this.value === '')
        expenseFilter.to = moment().valueOf()
    else
        expenseFilter.to = moment(this.value).add(1,'d').valueOf()
    renderList('#expense-list', myAccount.expenses.details,'e', expenseFilter)
})

document.querySelector('#statement-search-filter').addEventListener('input', function(e){
    statementFilter.searchPhrase = this.value
    renderList('#statement-list', constructTransactions(myAccount.incomes.details, myAccount.expenses.details), undefined, statementFilter)
})

document.querySelector('#statement-from-filter').addEventListener('change', function(e){
    if(this.value === '')
        statementFilter.from = moment(0).valueOf()
    else
        statementFilter.from = moment(this.value).valueOf()
    renderList('#statement-list', constructTransactions(myAccount.incomes.details, myAccount.expenses.details), undefined, statementFilter)
    
})

document.querySelector('#statement-to-filter').addEventListener('change', function(e){
    if(this.value === '')
        statementFilter.to = moment().valueOf()
    else
        statementFilter.to = moment(this.value).add(1,'d').valueOf()
    renderList('#statement-list', constructTransactions(myAccount.incomes.details, myAccount.expenses.details), undefined, statementFilter)    
})

document.querySelector('#home-screen a').addEventListener('click', function(e){
    e.preventDefault()
    deactivateAll()
    hideAll()
    activate('home-screen')
    show('display-home-screen')
    renderAccountSummary(myAccount.incomes.total, myAccount.expenses.total, myAccount.balance)
})

document.querySelector('#income-screen a').addEventListener('click', function(e){
    e.preventDefault()
    deactivateAll()
    hideAll()
    activate('income-screen')
    show('display-income-screen')
    renderList('#income-list', myAccount.incomes.details,'i', incomeFilter)
})

document.querySelector('#expense-screen a').addEventListener('click', function(e){
    e.preventDefault()
    deactivateAll()
    hideAll()
    activate('expense-screen')
    show('display-expense-screen')
    renderList('#expense-list', myAccount.expenses.details,'e', expenseFilter)
})

document.querySelector('#statement-screen a').addEventListener('click', function(e){
    e.preventDefault()
    deactivateAll()
    hideAll()
    activate('statement-screen')
    show('display-statement-screen')
    renderList('#statement-list', constructTransactions(myAccount.incomes.details, myAccount.expenses.details), undefined, statementFilter)
})