import React, { useEffect } from 'react';
import './App.css';
import { Auth } from './components/Auth/Auth';
import { BrowserRouter, Route, Switch} from "react-router-dom";   
import {InputRouter, Input } from './components/Input/Input';
import Navbarbar from './components/Hambarger/Navbarabar';
import BodyList from './components/Body/BodyList';
import BodyShow from './components/Body/BodyShow';
import Profile from './components/User/Profile';
import Login from './components/Auth/Login';
import Trends from './components/Trends/TrendsTable';
import TrendBody from './components/Trends/TrendBody';
import TagListPage from './components/Tag/TagListPage';
import TagBodyList from './components/Tag/TagBodyList';
import Tos from './components/Info/Tos';
import Privacy from './components/Info/Privacy';
import About from './components/Info/About';
import ContactForm from './components/Info/ContactForm';
import ReactGA from 'react-ga';
import ProfileEdit from './components/User/ProfileEdit';
import TagRatingList from './components/Tag/TagRatingList';
import TrendsTwitter from './components/Trends/TrendsTwitter';

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_CODE)


const App = () => {
    // useEffect(() => {
    //     ReactGA.pageview(window.location.pathname + window.location.search)
    // })
    return (
        <BrowserRouter>
            <Auth>
                <Navbarbar />
                <div style={{ height: "10vh"}}></div>
                <Switch>
                    <Route exact path="/" component={BodyList} />
                    <Route path={"/body/:body"} exact component={BodyShow} />
                    <Route exact path="/profile/:profile" component={Profile} />
                    <InputRouter path="/input" component={Input} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/trends" component={Trends} />
                    <Route exact path="/twittertrends" component={TrendsTwitter} />
                    <Route exact path="/trends/:trends" component={TrendBody} />
                    <Route exact path="/tags" component={TagListPage} />
                    <Route exact path="/tags/:tag" component={TagBodyList} />
                    <Route exact path="/tos" component={Tos} />
                    <Route exact path="/privacy" component={Privacy} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/contact" component={ContactForm} />
                    <Route exact path="/profile/:profile/edit" component={ProfileEdit} />
                    <Route exact path="/tagsrecommend" component={TagRatingList} />
                </Switch>
            </Auth>
        </BrowserRouter>
    );
}

export default App;
