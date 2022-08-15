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



const Home = () => {
  
	return (
		<>
		<Nav />
		<main>
			<BrowserRouter>
			<div className="container">
				<div className="left">
				    <Left />
				</div>
				<div className="middle">
					    <ScrollToTop />
						<Switch>
							<Route path="/body/:body">
								<ShowFeed />
							</Route>
							<Route path="/tags/:tag">
								<Tags />
							</Route>
							<Route path="/trends/:tag">
								<Trends />
							</Route>
							<Route path="/profile">
								<Profile />
							</Route>
							{/* <Route path="/trendindex">
								 <TrendIndex /> 
							</Route> */}
							<Route path="/tagindex">
								<TagIndex />
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
			</BrowserRouter>
		</main>
		</>
	)
}

export default Home

 