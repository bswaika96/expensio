const init = () => {
    const accountNameJSON = localStorage.getItem('accountName')
    const incomesJSON = localStorage.getItem('incomes')
    const expensesJSON = localStorage.getItem('expenses')
    return new Account(parse(accountNameJSON), parse(incomesJSON), parse(expensesJSON))
}

const parse = (json) => JSON.parse(json)

const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}


const initDateTimePickers = () => {
    const options = {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    }
    flatpickr('#income-from-filter', options)
    flatpickr('#income-to-filter', options)
    flatpickr('#expense-from-filter', options)
    flatpickr('#expense-to-filter', options)
    flatpickr('#statement-from-filter', options)
    flatpickr('#statement-to-filter', options)    
}

const hideAll = () => {
    document.querySelectorAll('section').forEach((item) => {
        item.classList.add('hide')
    })
}

const sortOrder = function(a, b){
    return b.time-a.time
}

const show = (id) => {
    document.querySelector(`section#${id}`).classList.remove('hide')
}

const deactivateAll = () => {
    document.querySelectorAll('header nav ul li').forEach((item) => {
        if(item.classList.contains('uk-active'))
            item.classList.remove('uk-active')
    })
}

const activate = (id) => {
    document.querySelector(`li#${id}`).classList.add('uk-active')
}

const renderName = (name) => {
    const displayName = document.querySelector('#display-name')
    displayName.innerHTML = `<span class="uk-margin-small-right" uk-icon="icon:user"></span>${name} <span id="change-name" class="pointer uk-margin-small-left" uk-icon="icon:pencil" uk-toggle="target: #change-name-modal"></span>`
    document.querySelector('#name-input').placeholder = name
}

const renderAccountSummary = (income, expense, balance) => {
    document.querySelector('#display-account-balance').textContent = `Balance : Rs. ${balance.toFixed(2)}`
    renderProgressBar('#income-bar', income, income+expense)
    renderProgressBar('#expense-bar', expense, income+expense)
    document.querySelector('#display-total-income').textContent = `Income : Rs. ${income.toFixed(2)}`
    document.querySelector('#display-total-expense').textContent = `Expense : Rs. ${expense.toFixed(2)}`
}

const renderProgressBar = (id, value, maxValue) => {
    const bar = document.querySelector(id)
    UIkit.util.ready(function () {
        setTimeout(() => {
            if(maxValue!=0){
                bar.value = Math.floor((value / maxValue) * 100)
            }else{
                bar.value=0
            }
        }, 1000)
    });
}

const renderList = (target, l, type, filter) => {
    const list = document.querySelector(target)
    list.innerHTML = ''
    l.sort(sortOrder).filter((item) => {
        return item.description.toLowerCase().includes(filter.searchPhrase.toLowerCase()) && item.time >= filter.from && item.time <= filter.to
    }).forEach((i) => {
        if(type === undefined)
            list.appendChild(renderItem(i, i.type))
        else
            list.appendChild(renderItem(i, type))
        document.querySelector(`#button-${i.id}-delete`).addEventListener('click', function(e){
            myAccount.remove(type, i.id)
            if(type === 'i' || i.type === 'i'){
                save('incomes', myAccount.incomes.details)
            }else if(type === 'e' || i.type === 'i'){
                save('expenses', myAccount.expenses.details)
            }
            renderAccountSummary(myAccount.incomes.total, myAccount.expenses.total, myAccount.balance)
            renderList('#income-list', myAccount.incomes.details,'i', incomeFilter)
            renderList('#expense-list', myAccount.expenses.details,'e', expenseFilter)
            renderList('#statement-list', constructTransactions(myAccount.incomes.details, myAccount.expenses.details), undefined, statementFilter)
        })
        document.querySelector(`#button-${i.id}-edit`).addEventListener('click', function(e){
            let d = e.target.parentElement.querySelector(`#description-${i.id}-input`).value
            if(!d)
                d=i.description
            let a = e.target.parentElement.querySelector(`#amount-${i.id}-input`).value
            if(!a)
                a=i.amount
            myAccount.edit(type, i.id, d, a)
            if(type === 'i' || i.type === 'i'){
                save('incomes', myAccount.incomes.details)
            }else if(type === 'e' || i.type === 'i'){
                save('expenses', myAccount.expenses.details)
            }
            renderAccountSummary(myAccount.incomes.total, myAccount.expenses.total, myAccount.balance)
            renderList('#income-list', myAccount.incomes.details,'i', incomeFilter)
            renderList('#expense-list', myAccount.expenses.details,'e', expenseFilter)
            renderList('#statement-list', constructTransactions(myAccount.incomes.details, myAccount.expenses.details), undefined, statementFilter)
        })

    })
}

const renderItem = (i, type) => {
    const item = document.createElement('li')
    if(type === 'i')
        item.innerHTML = `<strong><span class="uk-margin-small-right uk-margin-small-left" uk-icon="icon:arrow-up; ratio:2" style="color:#6bdeb3;"></span></strong>Earned <strong>Rs. ${i.amount}</strong> from <strong>${i.description}</strong> on <strong>${moment(i.time).format('MMMM Do, YYYY')}</strong>.
        <div id="modal-${i.id}-edit" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title" style="font-size: 16px; text-transform: uppercase">Edit Income</h2>
            <div class="uk-flex uk-margin">
                <div class="uk-inline uk-width-2-3">
                    <span class="uk-form-icon" uk-icon="icon: comment"></span>
                    <input class="uk-input" type="text" id="description-${i.id}-input" placeholder="${i.description}">
                </div>
                <div class="uk-inline uk-width-1-3 uk-margin-small-left">
                    <span class="uk-form-icon" uk-icon="icon: hashtag"></span>
                    <input class="uk-input" type="text" id="amount-${i.id}-input" placeholder="${i.amount}">
                </div>
            </div>
            <button class="uk-modal-close-default" type="button" uk-close></button>
            <button class="uk-modal-close uk-button uk-button-primary" id="button-${i.id}-edit" type="button">Save</button>
        </div>
    </div>
    <div id="modal-${i.id}-delete" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title" style="font-size: 16px; text-transform: uppercase">Delete Income</h2>
            <div class="uk-margin uk-width-1-1">
                Confirm deleting this item?
                <div uk-alert>Earned <strong>Rs. ${i.amount}</strong> from <strong>${i.description}</strong> on <strong>${moment(i.time).format('MMMM Do, YYYY')}</strong>.</div>
            </div>
            <button class="uk-modal-close-default" type="button" uk-close></button>
            <button class="uk-modal-close uk-button uk-button-danger" id="button-${i.id}-delete" type="button">Delete</button>
        </div>
    </div>`
    else if(type === 'e')
        item.innerHTML = `<strong><span class="uk-margin-small-right uk-margin-small-left" uk-icon="icon:arrow-down; ratio:2" style="color:#f0506e;"></span></strong>Spent <strong>Rs. ${i.amount}</strong> for <strong>${i.description}</strong> on <strong>${moment(i.time).format('MMMM Do, YYYY')}</strong>.
        <div id="modal-${i.id}-edit" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title" style="font-size: 16px; text-transform: uppercase">Edit Expense</h2>
            <div class="uk-flex uk-margin">
                <div class="uk-inline uk-width-2-3">
                    <span class="uk-form-icon" uk-icon="icon: comment"></span>
                    <input class="uk-input" type="text" id="description-${i.id}-input" placeholder="${i.description}">
                </div>
                <div class="uk-inline uk-width-1-3 uk-margin-small-left">
                    <span class="uk-form-icon" uk-icon="icon: hashtag"></span>
                    <input class="uk-input" type="text" id="amount-${i.id}-input" placeholder="${i.amount}">
                </div>
            </div>
            <button class="uk-modal-close-default" type="button" uk-close></button>
            <button class="uk-modal-close uk-button uk-button-primary" id="button-${i.id}-edit" type="button">Save</button>
        </div>
    </div>
    <div id="modal-${i.id}-delete" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title" style="font-size: 16px; text-transform: uppercase">Delete Expense</h2>
            <div class="uk-margin uk-width-1-1">
                Confirm deleting this item?
                <div uk-alert>Spent <strong>Rs. ${i.amount}</strong> for <strong>${i.description}</strong> on <strong>${moment(i.time).format('MMMM Do, YYYY')}</strong>.</div>
            </div>
            <button class="uk-modal-close-default" type="button" uk-close></button>
            <button class="uk-modal-close uk-button uk-button-danger" id="button-${i.id}-delete" type="button">Delete</button>
        </div>
    </div>`

    const editItem = document.createElement('a')
    editItem.classList.add('uk-icon-button')
    editItem.classList.add('uk-margin-small-left')
    editItem.classList.add('uk-margin-small-right')
    editItem.setAttribute('uk-icon', 'pencil')
    editItem.setAttribute('uk-toggle', `target: #modal-${i.id}-edit`)
    item.appendChild(editItem)
    const deleteItem = document.createElement('a')
    deleteItem.classList.add('uk-icon-button')
    deleteItem.setAttribute('uk-icon', 'trash')
    deleteItem.setAttribute('uk-toggle', `target: #modal-${i.id}-delete`)
    item.appendChild(deleteItem)

    return item
}

const constructTransactions = (incomes, expenses) => {
    const transactions = []
    incomes.forEach((income) => {
        income.type = 'i'
        transactions.push(income)
    })
    expenses.forEach((expense) => {
        expense.type = 'e'
        transactions.push(expense)
    })
    return transactions
}