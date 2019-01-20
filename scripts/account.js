class Account{
    constructor(name, income, expense){
        if(income)
            this.incomes = income
        else
            this.incomes = []
        if(expense)
            this.expenses = expense
        else
            this.expenses = []
        this.name = name || 'Anonymous'
        this.balance = this.incomes.total-this.expenses.total
    }

    set incomes(income){
        this._incomes = {}
        this._incomes.total = 0
        this._incomes.details = []
        income.forEach((i) => {
            this.addIncome(i.id, i.description, Number(i._amount), i.time)
        })
    }

    get incomes(){
        return this._incomes
    }

    set expenses(expense){
        this._expenses = {}
        this._expenses.total = 0
        this._expenses.details = []
        expense.forEach((e) => {
            this.addExpense(e.id, e.description, Number(e._amount), e.time)
        })
    }

    get expenses(){
        return this._expenses
    }

    addIncome(id, description, amount, time){
        try{
            const income = new Income(id, description, amount, time)
            this._incomes.details.push(income)
            this._incomes.total += income.amount
        }catch(err){
            throw err
        }
    }

    addExpense(id, description, amount, time){
        try{
            const expense = new Expense(id, description, amount, time)
            this._expenses.details.push(expense)
            this._expenses.total += expense.amount
        }catch(err){
            throw err
        }
    }

    editIncome(id, description, amount){
        const income = this.find(id, this.incomes.details)
        if(income){
            income.description = description
            try{
                this.incomes.total -= income.amount
                income.amount = amount
                this.incomes.total += income.amount
            }catch(err){
                throw err
            }
        }
    }

    editExpense(id, description, amount){
        const expense = this.find(id, this.expenses.details)
        if(expense){
            expense.description = description
            try{
                this.expenses.total -= expense.amount
                expense.amount = amount
                this.expenses.total += expense.amount
            }catch(err){
                throw err
            }
        }
    }

    removeIncome(id){
        const incomeIndex = this.findIndex(id,this.incomes.details)
        if(incomeIndex >= 0){
            this.incomes.total -= this.incomes.details[incomeIndex].amount
            this.incomes.details.splice(incomeIndex,1)
        }
    }

    removeExpense(id){
        const expenseIndex = this.findIndex(id,this.expenses.details)
        if(expenseIndex >= 0){
            this.expenses.total -= this.expenses.details[expenseIndex].amount
            this.expenses.details.splice(expenseIndex,1)
        }
    }

    calculateBalance(){
        this.balance = this.incomes.total - this.expenses.total
    }

    add(mode, description, amount){
        try{
            if(mode === 'i'){
                this.addIncome(undefined, description, amount)
            }else if(mode === 'e'){
                this.addExpense(undefined, description, amount)
            }
            this.calculateBalance();
        }catch(err){
            throw err
        }
    }

    edit(mode, id, description, amount){
        try{
            if(mode === 'i'){
                this.editIncome(id, description,amount)
            }else if(mode === 'e'){
                this.editExpense(id, description,amount)
            }
            this.calculateBalance();
        }catch(err){
            throw err
        }        
    }

    remove(mode, id){
        if(mode === 'i'){
            this.removeIncome(id)
        }else if(mode === 'e'){
            this.removeExpense(id)
        }
        this.calculateBalance();
    }

    reset(){
        this.incomes = []
        this.expenses = []
        this.balance = this.incomes.total-this.expenses.total
    }

    find(id, array){
        return array.find((item) => item.id === id)
    }

    findIndex(id, array){
        return array.findIndex((item) => item.id === id)
    }
}