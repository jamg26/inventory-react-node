import { combineReducers } from 'redux';


const tokenReducer = (token = null, action) =>{
    //console.log(action);
    if(action.type=== 'AUTH_TOKEN'){
        return action.payload;
    }
    return token;
}
const userReducer = ( user = [] , action) => {
    if(action.type=== 'USER_INFO'){
        return action.payload;
    }
    return user;
}
const companySettingReducer = ( setting = [] , action) => {
    if(action.type=== 'COMPANY_SETTING'){
        return action.payload;
    }
    return setting;
}
const salesSettingReducer = ( setting = [] , action) => {
    if(action.type=== 'SALES_SETTING'){
        return action.payload;
    }
    return setting;
}
const expensesSettingReducer = ( setting = [] , action) => {
    if(action.type=== 'EXPENSE_SETTING'){
        return action.payload;
    }
    return setting;
}
const numberingSettingReducer = ( setting = [] , action) => {
    if(action.type=== 'NUMBERING_SETTING'){
        return action.payload;
    }
    return setting;
}
const advanceSettingReducer = ( setting = [] , action) => {
    if(action.type=== 'ADVANCE_SETTING'){
        return action.payload;
    }
    return setting;
}
const bankReducer = ( setting = [] , action) => {
    if(action.type=== 'ADD_BANK'){
        return action.payload;
    }
    return setting;
}
const journalReducer = ( list = [], action ) =>{
    if(action.type=='JOURNAL_ENTRY_LIST'){
        return action.payload;
    }
    return list;
}
const SalesReducer = ( list = [], action ) =>{
    if(action.type=='SALES_TRANSACTION_LIST'){
        return action.payload;
    }
    return list;
}
const ExpenseTransactionReducer = ( list = [], action ) =>{
    if(action.type=='EXPENSE_TRANSACTION_LIST'){
        return action.payload;
    }
    return list;
}
const PendingExpenseTransactionReducer = ( list = [], action ) =>{
    if(action.type=='PENDING_EXPENSE_TRANSACTION_LIST'){
        return action.payload;
    }
    return list;
}
const PayBillsReducer = ( list = [], action ) =>{
    if(action.type=='PAY_BILL_LIST'){
        return action.payload;
    }
    return list;
}
export default combineReducers({
    token : tokenReducer,
    user_info : userReducer,
    company_setting : companySettingReducer,
    sales_setting : salesSettingReducer,
    expenses_setting : expensesSettingReducer,
    numbering_setting : numberingSettingReducer,
    advance_setting : advanceSettingReducer,
    bank_list : bankReducer,
    journal_list : journalReducer,
    sales_transaction_list : SalesReducer,
    expense_transaction_list_redux : ExpenseTransactionReducer,
    pending_expense_transaction_list_redux : PendingExpenseTransactionReducer,
    pay_bill_list_redux : PayBillsReducer,
})