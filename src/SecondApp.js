import React from 'react';
import './App.css';
import './SecondApp.css'
import { Auth } from './components/Auth/Auth';
import { BrowserRouter, Route, Switch} from "react-router-dom";
import Home from './second/Home/Home';
import {InputRouter, Input } from './second/Input/Input';
import ScrollToTop from './second/Parts/ScrollToTop';
import ErrorPage from './second/Parts/ErrorPage';


const App = () => {
	
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Auth>
                <Switch>
                    <Route path="/" component={Home} />
                    <Route component={ErrorPage} />
                </Switch>
            </Auth>
        </BrowserRouter>
    );
}

export default App;
