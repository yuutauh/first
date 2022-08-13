import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../../firebase';
import { ReactComponent as TimeIcon } from "../../../Icons/TimeIcon.svg";
import { ReactComponent as LoveIcon } from "../../../Icons/LoveIcon.svg";
import { ReactComponent as BadIcon } from "../../../Icons/BadIcon.svg";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const Wrapper = styled.div`
display: flex;
align-items: center;
margin: 10px 0;
padding: 0.5rem 0;
border-bottom: #aaa solid 1px;
`;

const Flex = styled.div`
display: flex;
align-items: center;

  .time{
	  display: flex;
	  align-items: center;
	  margin-left: auto;
	  color: rgb(83, 100, 113);
  }
`;

const Avator = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  padding: 2px;
  border: #e0e0e0 solid;
  margin-right: 20px ;
`;

const TimeSVG = styled(TimeIcon)`
width: 12px;
height: 12px;
margin-right: 3px ;
`;

const LoveSVG = styled(LoveIcon)`
width: 16px;
height: 16px;
margin-right: 0.3rem;
fill: ${({isfavorites}) => isfavorites == 0 ? 'red' : 'white'};
`;

const BadSVG = styled(BadIcon)`
width: 20px;
height: 20px;
margin-right: 0.3rem;
fill: ${({isbad}) => isbad == 0 ? '#f3aa1f' : 'white'};
`;

const Comment = React.memo(({ c, thread, currentUser }) => {
  const [isFavorites, setisFavorites] = useState(1);
  const [isBads, setIsBads] = useState(1);

  useEffect(() => {
    if(currentUser) {
      const iF = c.favorites.some((favorite) => favorite === currentUser.uid )
      const iB = c.bads.some((bad) => bad === currentUser.uid ) 
      setisFavorites(iF ? 0 : 1)
      setIsBads(iB? 0 : 1)
    }
  }, [])

  const onFavorites = () => {
		if(currentUser === null) {
			return null
		} else  {
      const count = c.favoriteCount + 1
			const f = { 
        favorites: [ currentUser.uid , ...c.favorites],
        favoriteCount: count 
      }
			db.collection('threads')
			  .doc(thread.id)
			  .collection('comments')
			  .doc(c.id)
			  .update(f)
        .then(() => {
          setisFavorites(0)
        })
		}   
	}

  const offFavorites = () => {
    if(currentUser === null) {
      return null
    } else {
      const count = c.favoriteCount - 1
      const f = c.favorites.filter((favorite) => favorite !== currentUser.uid)
      const fs = { 
        favorites: f,
        favoriteCount: count 
      }
      db.collection('threads')
        .doc(thread.id)
        .collection('comments')
        .doc(c.id)
        .update(fs)
        .then(() => {
          setisFavorites(1)
        })
      }
    }

    const onBads = () => {
      if(currentUser === null) {
        return null
      } else  {
        const count = c.badCount + 1
        const b = { 
          bads: [ currentUser.uid , ...c.bads],
          badCount: count 
        }
        db.collection('threads')
          .doc(thread.id)
          .collection('comments')
          .doc(c.id)
          .update(b)
          .then(() => {
            setIsBads(0)
          })
      }   
    }

    const offBads = () => {
      if(currentUser === null) {
        return null
      } else {
        const count = c.badCount - 1
        const f = c.bads.filter((bad) => bad !== currentUser.uid)
        const fs = { 
          bads: f,
          badCount: count 
        }
        db.collection('threads')
          .doc(thread.id)
          .collection('comments')
          .doc(c.id)
          .update(fs)
          .then(() => {
            setIsBads(1)
          })
        }
    }

	return (
    <Wrapper>
      <Avator src={c.userimage} alt="image" />
      <div style={{width: '100%'}}>
        <Flex>
          <div>
            {c.username}
          </div>
          {c.created && 
            <div className="time">
              <TimeSVG />
              {format(c.created.toDate(), "yyyy-MM-dd HH:mm", { locale: ja })}
            </div>
          }
        </Flex>
        <div style={{marginBottom: "10px"}}>
          {c.comment}
        </div>
        <Flex>
          {isFavorites == 0 && 
            <><LoveSVG isfavorites={isFavorites} onClick={offFavorites} />{c.favorites.length}</>
          }
          {isFavorites == 1 &&
            <><LoveSVG isfavorites={isFavorites} onClick={onFavorites} />{c.favorites.length}</>
          }
          {isBads == 0 && 
            <><BadSVG isbad={isBads} onClick={offBads} />{c.bads.length}</>
          }
          {isBads == 1 && 
            <><BadSVG isbad={isBads} onClick={onBads} />{c.bads.length}</>
          }
        </Flex>
      </div>
  </Wrapper>
	)
})

export default Comment
