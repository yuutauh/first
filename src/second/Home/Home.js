import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ScrollToTop from '../Parts/ScrollToTop';
import Left from '../Parts/Left';
import Nav from '../Nav/Nav';
import RightTrends from '../../components/Trends/RightTrends';
import Tags from '../Tag/Tags';
import Feeds from '../Feed/Feeds';
import ShowFeed from '../Feed/ShowFeed';
import Profile from '../Profile/Profile';
import TrendIndex from '../Trend/TrendIndex';
import TagIndex from '../Tag/TagIndex';
import Trends from '../Trend/Trends';
import {Input, InputRouter} from '../Input/Input';
import ShowBubble from '../Feed/ShowBubble';
import Login from '../Login/Login';
import LoginMsg from '../Login/LoginMsg';
import Search from '../Search/Search';
import Tos from '../Info/Tos';
import Privacy from '../Info/Privacy';


const Home = () => {
  
	return (
		<>
		<BrowserRouter>
		<Nav />
		<main>
			<div className="container">
				<div className="left">
				    {/* <Left /> */}
				</div>
				<div className="middle">
					    <ScrollToTop />
						<Switch>
							<Route path="/body/:body">
								<ShowBubble />
							</Route>
							<Route path="/tags/:tag">
								<Tags />
							</Route>
							<Route exact path="/profile/:profile">
								<Profile />
							</Route>
							<Route path="/search">
								 <Search /> 
							</Route>
							<Route path="/tagindex">
								<TagIndex />
							</Route>
							<Route exact path="/login">
                                 <Login />
							</Route>
							<Route exact path="/login/:login">
								<LoginMsg />
							</Route>
							<Route exact path="/tos">
								<Tos />
							</Route>
							<Route exact path="/privacy">
								<Privacy />
							</Route>
							<InputRouter path="/input" component={Input} />
							<Route path="/">
								<Feeds />
							</Route>
						</Switch>
				</div>
				<div className="right">
				    {/* <RightTrends /> */}
				</div>
			</div>
		</main>
		</BrowserRouter>
		</>
	)
}

export default Home

 