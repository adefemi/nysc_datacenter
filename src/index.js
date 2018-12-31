import React from 'react';
import ReactDom from 'react-dom';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import './assets/css/style.css';

import Router from './js/components/router';
import RootReducer from './js/redux/reducer/RootReducer'

const Store = createStore(RootReducer, applyMiddleware(thunk));

class Index extends React.Component{
    render(){
        return(
            <Provider store={Store}>
                <Router />
            </Provider>
        )
    }
}

ReactDom.render(<Index/>, wrapper);