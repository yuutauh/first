import React, { useEffect } from 'react';
import './App.css';
import './SecondApp.css'
import { Auth } from './components/Auth/Auth';
import { BrowserRouter, Route, Switch} from "react-router-dom";
import Home from './second/Home/Home';
import Nav from './second/Nav/Nav';
import Login from './second/Login/Login';
import {InputRouter, Input } from './second/Input/Input';
import ScrollToTop from './second/Parts/ScrollToTop';
import ErrorPage from './second/Parts/ErrorPage';
import LoginMsg from './second/Login/LoginMsg';


const App = () => {
	
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Auth>
                <Switch>
                    <InputRouter path="/input" component={Input} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/login/:loginmsg" component={LoginMsg} />
                    <Route path="/" component={Home} />
                    <Route component={ErrorPage} />
                </Switch>
            </Auth>
        </BrowserRouter>
    );
}

export default App;
