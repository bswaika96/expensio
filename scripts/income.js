class Income{
    constructor(id, description, amount, time){
        this.id = id || uuidv4()
        this.description = description || 'Untitled Income'
        this.amount = amount || 0
        this.time = time || moment().valueOf()
    }

    set amount(amount){
        if(amount<0)
            throw new Error('Invalid Data: Amount has to be greater than or equal to 0')
        else
            this._amount = Number(amount)
    }

    get amount(){
        return Number(this._amount)
    }
}