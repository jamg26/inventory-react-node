import React from 'react';
import ReactDOM from 'react-dom';
import RoutesController from './routes/routes';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';


function saveToLocalStorage(state) {
    try {
        const serializeState = JSON.stringify(state);
        localStorage.setItem('shop-mern-state', serializeState)
    } catch (e) {
        console.log(e)
    }
}

function loadFromLocalStorage() {
    try {
        const serializeState = localStorage.getItem('shop-mern-state')
        if (serializeState === null) {
            return undefined;
        }
        return JSON.parse(serializeState)
    } catch (e) {
        console.log(e);
        return undefined;
    }
}
const persistedState = loadFromLocalStorage();
const store = createStore(reducers, persistedState);


store.subscribe(() => saveToLocalStorage(store.getState()))
ReactDOM.render(
    <Provider store={store}><RoutesController /></Provider>,
    document.getElementById('root')
);
