import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../components/Auth/Auth';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import './Profile.css';
import Btn from '../Parts/Btn';
import Following from './Following';
import Followed from './Followed';
import UserBodyList from '../../components/User/UserBodyList';
import FavoriteBodyList from '../../components/User/FavoriteBodyList';

const Profile = () => {
  const [displayUser, setDisplayUser] = useState({});
  const [threads, setThreads] = useState([]);
  const [lastDoc, setLastDoc] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [IsFollowing, setIsFollowing] = useState(false);
  const [IsCurrentUser, setIsCurrentUser] = useState(false);
  const [index, setIndex] = useState(1);
  const [tags, setTags] = useState([]);
  const [favoriteIndex, setFavoriteIndex] = useState({});
  const { currentUser }  = useContext(AuthContext);
  let id = window.location.pathname.split('/profile/')[1]
  const uid = currentUser ? currentUser.uid : "";

  const useLocalStorage = (localItem) => {
    const [loc, setState] = useState(JSON.parse(localStorage.getItem(localItem)));
    const setLoc = (newItem) => {
      localStorage.setItem(localItem, JSON.stringify(newItem));
      setState(newItem);
    };
    return [loc, setLoc];
  };

  const [reorder, setReorder] = useLocalStorage("profile");

  const [element, setElement] = useState(null);
  const observer = React.useRef(
	new IntersectionObserver((entries) => {
		const first = entries[0];
		if(first.isIntersecting) {
			fetcher.current()
		}
	})
  )

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;
    
    if(currentElement) {
      currentObserver.observe(currentElement)
    }
    
    return () => {
      if(currentElement) {
        currentObserver.unobserve(currentElement)
      }
    } 
  }, [element,reorder])

  useEffect(() => {
    db.collection('users').doc(id).get()
      .then((doc) => setDisplayUser(doc.data()))

    if(id === uid) {
      setIsCurrentUser(true)
    } else {
      setIsCurrentUser(false)
    }

    db.collection('tags').where('userId', 'array-contains', id)
      .get()
      .then((docs) => {
        const i = []
        docs.forEach((doc) => i.push(doc.data()))
        setTags(i)
      })

    db.collection('followings').where('following', '==', id)
      .get().then((docs) => {
      const items = []
      docs.forEach((doc) => {
            items.push(doc.data())
      })
      setFollowing(items)
    })

    db.collection('followings').where('followed', '==', id)
        .onSnapshot((docs) => {
            const items = []
            const size = docs.size
            docs.forEach((doc) => {
              items.push(doc.data())
              if(doc.data().following === uid) {
                setIsFollowing(true)
              }
            })
          setFollowed(items)
    })
    setIndex(1)
  }, [id])

  useEffect(() => {
    if(reorder === null){
      setReorder({order: "created", by: "asc"})
    }
    db.collection('threads')
      .where('uid', '==', id)
      .orderBy(reorder.order,reorder.by)
      .limit(3) 
      .get().then((docs) => {
        const items = []
        const lastDoc = docs.size === 0 ? '' : docs.docs[docs.docs.length - 1];
        docs.forEach((doc) => {
          items.push(doc.data())
        })
        setThreads(items)
        setLastDoc(lastDoc);
    })
  }, [id, reorder])
    
  const load = () => {
    if(reorder === null){
      setReorder({order: "created", by: "desc"})
    }
    if(lastDoc !== "") {
      db.collection('threads')
        .where('uid', '==', id)
        .orderBy(reorder.order, reorder.by)
        .startAfter(lastDoc)
        .limit(3)
        .get()
			  .then((res) => {
				const size = res.size === 0;
				if(!size){
					const items = [];
					const lastDoc = res.docs[res.docs.length - 1]
					res.forEach((doc) => {
						items.push(doc.data())
					})
					setThreads(prev => [...prev, ...items])
					setLastDoc(lastDoc)
				} else {
					setIsEmpty(true)
		  	}
		   	})
    }
  }

  const follow = () => {
    if(currentUser == null) {
      return false
    }
    db.collection('followings').doc(`${id}` + `${uid}`).set({
      following: uid,
      followed: id
    })
  }

  const unfollow = () => {
    if(currentUser == null) {
      return false
    }
    db.collection('followings').doc(`${id}` + `${uid}`).delete()
  }

  const show = () => {
    return(
      <>
      {IsFollowing ? (
		    <Btn word={"フォロー解除"}  onClick={unfollow} />
      ) : (
        <Btn word={"フォローする"} onClick={follow} />
      )}
      </>
    )
  }

  const fetcher = React.useRef(load);


  React.useEffect(() => {
			fetcher.current = load
  }, [load])
  
  const ChangeIndex = (i) => {
	  setIndex(i)
	}
	
	return (
		<>
    {displayUser ? (
		<div>
	    <div className="profile-container">
			<div className="profile-photo display-image">
				<img src={displayUser.photoURL} alt="unsplash" />
			</div>
			<h3>{displayUser.displayName}</h3>
			<p className="text-muted profile-text">{displayUser.profile}</p>
			{IsCurrentUser ? (
				<Link to={{pathname: `${id}/edit`}}>
            <span><i className="uil uil-edit"></i></span>
				</Link>
			) : (
				<>
				{show()}
				</>
			)}
			<div className="follow">
				{following && 
				<div onClick={() => ChangeIndex(3)}>
					<h2>
					{following.length}
					</h2>
					<p>following</p>
				</div>}
				{followed &&
				<div onClick={() => ChangeIndex(4)}>
					<h2>
						{followed.length}
					</h2>
					<p>follower</p>
				</div>}
			</div>
      <div className="tags">
				{tags && tags.map((tag,i) => (
					<Link 
					key={i}
					to={{
						pathname: `/tags/${tag.name}`,
						state: { fromDashboard: true }
					}}>
					   <div className="tag">{tag.name}</div>
					</Link>
				))}
			</div>
      <div className="action-button">
			<div 
			className={index === 1 ? 'tab_active' : 'tab'} 
			onClick={() => {ChangeIndex(1)}}>
				<span><i className="uil uil-table"></i></span>
				<small>一覧</small>
			</div>
			<div 
			className={index == 2 ? 'tab_active' : 'tab'} 
			onClick={() => {ChangeIndex(2)}}>
				<span><i className="uil uil-heart"></i></span>
				<small>おきにいり</small>
			</div>
		</div>
		</div>
   
    {index == 1 &&
      <UserBodyList
        name={displayUser.displayName} 
        threads={threads} 
        isEmpty={isEmpty} 
        lastDoc={lastDoc}
        setElement={setElement} 
        setReorder={setReorder}
        setFavoriteIndex={setFavoriteIndex}
      />
    }
    {index == 2 &&
      <FavoriteBodyList name={displayUser.displayName} id={id} />
    }
    {index == 3 &&
      <Following id={id} name={displayUser.displayName} following={following} />
    }
    {index == 4 &&
      <Followed id={id} name={displayUser.displayName} followed={followed} /> 
    }
    </div>
    ) : (
      <p>sorry! no user</p>
    )} 
  </>
	)
}

export default Profile
