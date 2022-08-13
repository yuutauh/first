import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../Auth/Auth';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { ReactComponent as ProfileEditIcon } from "../../Icons/ProfileEdit.svg";
import { ReactComponent as StarIcon } from "../../Icons/StarIcon.svg";
import { ReactComponent as UnfollowIcon } from "../../Icons/UnfollowIcon.svg";
import { ReactComponent as StackIcon } from "../../Icons/StackIcon.svg";
import { ReactComponent as GroupIcon } from "../../Icons/GroupIcon.svg";
import { ReactComponent as LoveIcon } from "../../Icons/LoveIcon.svg";
import './Profile.css';
import Hash from '../../Parts/Hash'
import Following from './Following';
import Followed from './Followed';
import UserBodyList from './UserBodyList';
import FavoriteBodyList from './FavoriteBodyList';

const Container = styled.div`
width: 95%;
padding: 20px 5%;
margin: 0 auto;
background-color: white;
`;

const Wrapper = styled.div`
display: flex;
align-items: center;
margin: 10px 0;
`;

const TWrapper = styled.div`
display: flex;
align-items: center;
margin-top: 20px ;
`;

const IWrapper = styled.div`
display: flex;
align-items: center;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 1rem;
  border-radius: 50%;
  object-fit: cover;
  padding: 2px;
  border: #e0e0e0 solid;
`;

const StackSVG = styled(StackIcon)`
width: 20px;
height: 20px;
`;

const StarSVG = styled(StarIcon)`
width: 20px;
height: 20px;
`;

const UnfollowSVG = styled(UnfollowIcon)`
width: 20px;
height: 20px;
`;

const GroupSVG = styled(GroupIcon)`
width: 20px;
height: 20px;
`;

const LoveSVG = styled(LoveIcon)`
width: 20px;
height: 20px;
`;

const EditIcon = styled(ProfileEditIcon)`
width: 20px;
height: 20px;
margin-right: 0.25rem;
`;

const Button = styled.button`
margin-left: auto;
display: flex;
align-items: center;
font-family: inherit;
padding: 5px 10px;
border: none ;
border-radius: 10px;
cursor: pointer;
`;

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
      setReorder({order: "created", by: "desc"})
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
        <Button onClick={unfollow}>
          <UnfollowSVG />
          <div>フォロー解除</div>
        </Button>
      ) : (
        <Button onClick={follow} >
          <StarSVG />
          <div>フォローする</div>
        </Button>
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
    <Container>
      <Wrapper>
			  <Avatar src={displayUser.photoURL} />
		    <p style={{marginRight: '1rem'}}>{displayUser.displayName}</p>
          {IsCurrentUser ? (
                <Link 
                to={{
                  pathname: `${id}/edit`
                }}
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  marginLeft: 'auto'
                }}>
                  <Button>
                    <EditIcon />
                    プロフィール設定
                  </Button>
                </Link>
            
          ) : (
            <>
              {show()}
            </>
          )}
      </Wrapper>
      <Wrapper>
          <div
          onClick={() => ChangeIndex(3)}
          style={{marginRight: '0.5rem', cursor: 'pointer'}}>
            フォロー
          </div>
          {following && 
				  <div 
          onClick={() => ChangeIndex(3)}
          style={{ marginRight: '1rem', 
                   fontSize: '1.1rem', 
                   cursor: 'pointer'
          }}>
            {following.length}
          </div>}
					<div
          onClick={() => ChangeIndex(4)} 
          style={{marginRight: '0.5rem', cursor: 'pointer'}}>
            フォロワー
          </div>
          {followed &&
				  <div
          onClick={() => ChangeIndex(4)} 
          style={{fontSize: '1.1rem', cursor: 'pointer'}}>
            {followed.length}
          </div>
          }
      </Wrapper>
      {displayUser.profile && <p>{displayUser.profile}</p>}
      <Wrapper>
      {tags &&
       tags.map((tag, i) => (
         <Hash key={i} tag={tag} />
       ))}
      </Wrapper>
			<TWrapper>
        　<div 
          className={index === 1 ? 'tab_active' : 'tab'} 
          onClick={() => {ChangeIndex(1)}}>
            <StackSVG />
          </div>
          <div 
            className={index == 2 ? 'tab_active' : 'tab'} 
            onClick={() => {ChangeIndex(2)}}>
              <LoveSVG />
          </div>
          <div 
            className={index === 3 ? 'tab_active' : 'tab'} 
            onClick={() => {ChangeIndex(3)}}>
              <StarSVG />
          </div>
          <div 
            className={index === 4 ? 'tab_active' : 'tab'} 
            onClick={() => {ChangeIndex(4)}}>
              <GroupSVG />
          </div>
			</TWrapper>
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
    </Container>
    ) : (
      <p>sorry! no user</p>
    )} 
  </>
	)
}

export default Profile
