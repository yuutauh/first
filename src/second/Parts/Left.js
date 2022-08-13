import React, { useState, useContext } from 'react';
import Btn from '../Parts/Btn';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../components/Auth/Auth';
import { ReactComponent as HomeIcon } from "../Icons/HomeIcon.svg";
import { ReactComponent as PersonIcon } from "../Icons/PersonIcon.svg";
import { ReactComponent as FireIcon } from "../Icons/FireIcon.svg";
import { ReactComponent as SearchIcon } from "../Icons/SearchIcon.svg";
import { ReactComponent as HashIcon } from "../Icons/HashIcon.svg";

const Left = () => {
	const { currentUser } = useContext(AuthContext);
	const [index, setIndex] = useState(1)

	const ChangeIndex  = (i) => {
		setIndex(i)
	}

	return (
	    <>
			<div className="sidebar">
				<Link
				onClick={ () => { ChangeIndex(1) }} 
				className={index === 1 ? "menu-item active": "menu-item"}
				to={{
					pathname: '/',
					state: { fromDashboard: true }
				}}>
					<HomeIcon />
					<h3>ホーム</h3>
				</Link>
				<Link 
				onClick={ () => { ChangeIndex(2) }}
				className={index === 2 ? "menu-item active": "menu-item"}
				id="notifications"
				to={{
					pathname: '/',
					state: { fromDashboard: true }
				}}>
					<span>
						<i className="uil uil-bell">
							<small className="notification-count">9+</small>
						</i>
					</span>
					<h3>通知</h3>
					{/* notification popup --------------------*/}
					<div className={index === 2 ? "notification-popup notification": "notification-popup"}>
						<div>
							<div className="profile-photo">
							    <img src="https://source.unsplash.com/random" alt="unsplash" />
							</div>
							<div className="notification-body">
								<b>Yuta Uchiyama</b>フォローされました
								<small className="text-muted">2日前</small>
							</div>
						</div>
						<div>
							<div className="profile-photo">
							    <img src="https://source.unsplash.com/random" alt="unsplash" />
							</div>
							<div className="notification-body">
								<b>Yuta Uchiyama</b>フォローされました
								<small className="text-muted">2日前</small>
							</div>
						</div>
						<div>
							<div className="profile-photo">
							    <img src="https://source.unsplash.com/random" alt="unsplash" />
							</div>
							<div className="notification-body">
								<b>Yuta Uchiyama</b>フォローされました
								<small className="text-muted">2日前</small>
							</div>
						</div>
						<div>
							<div className="profile-photo">
							    <img src="https://source.unsplash.com/random" alt="unsplash" />
							</div>
							<div className="notification-body">
								<b>Yuta Uchiyama</b>フォローされました
								<small className="text-muted">2日前</small>
							</div>
						</div>
						<div>
							<div className="profile-photo">
							    <img src="https://source.unsplash.com/random" alt="unsplash" />
							</div>
							<div className="notification-body">
								<b>Yuta Uchiyama</b>フォローされました
								<small className="text-muted">2日前</small>
							</div>
						</div>
						<div>
							<div className="profile-photo">
							    <img src="https://source.unsplash.com/random" alt="unsplash" />
							</div>
							<div className="notification-body">
								<b>Yuta Uchiyama</b>フォローされました
								<small className="text-muted">2日前</small>
							</div>
						</div>
						<div>
							<div className="profile-photo">
							    <img src="https://source.unsplash.com/random" alt="unsplash" />
							</div>
							<div className="notification-body">
								<b>Yuta Uchiyama</b>フォローされました
								<small className="text-muted">2日前</small>
							</div>
						</div>
					</div>
					{/* notification popup end --------------------*/}
				</Link>
				<Link 
				onClick={ () => { ChangeIndex(3) }}
				className={index === 3 ? "menu-item active": "menu-item"}
				to={{
					pathname: '/',
					state: { fromDashboard: true }
				}}>
					<SearchIcon />
					<h3>検索</h3>
				</Link>
				<Link
				onClick={ () => { ChangeIndex(4) }} 
				className={index === 4 ? "menu-item active": "menu-item"}
				to={{
					pathname: '/trendindex',
					state: { fromDashboard: true }
				}}
				>
					<FireIcon />
					<h3>トレンド</h3>
				</Link>
				<Link
				onClick={ () => { ChangeIndex(5) }}  
				className={index === 5 ? "menu-item active": "menu-item"}
				to={{
					pathname: '/tagindex',
					state: { fromDashboard: true }
				}}
				>
					<HashIcon />
					<h3>話題</h3>
				</Link>
				{currentUser && (
				<Link
				onClick={ () => { ChangeIndex(6) }}  
				className={index === 6 ? "menu-item active": "menu-item"}
				to={{
					pathname: `/profile/${currentUser.uid}`,
					state: { fromDashboard: true }
				}}
				>
					<PersonIcon />
					<h3>プロフィール</h3>
				</Link>
				)}
				<Link
				onClick={ () => { ChangeIndex(7) }}  
				className={index === 7 ? "menu-item active": "menu-item"}
				to={{
					pathname: `/input`,
					state: { fromDashboard: true }
				}}
				>
					<span><i className="uil uil-plus"></i></span>
					<h3>プロフィール</h3>
				</Link>
			</div>
			<Btn word={"投稿する"} />
		</>
	)
}

export default Left
