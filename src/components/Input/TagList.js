import React from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import Tag from "./Tag";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; 

const Form = styled.div`
position: relative;
height: 30px;
border: #e0e0e0 solid 2px;
border-radius: 10px;

input {
  position: absolute;
  width: 70%;
  height: 100%;
  outline: none;
  border: none;
  left: 40px;
}

button {
  position: absolute;
  top: 50%;
  right: 7px;
  transform: translateY(-50%);
  background-color: #e0e0e0;
  font-family: inherit;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
`;

const Span = styled.span`
position: absolute;
top: 50%;
left: 7px;
transform: translateY(-50%)
`;

const Button = styled.button`
  background-color: #e0e0e0;
  font-family: inherit;
  border-radius: 10px;
  border: none;
  cursor: pointer;
`;

const TagList = React.memo(({ tags ,setTags, onTags, setOnTags }) => {
  const [untags, setUntags] = React.useState([]);
  const [tag, setTag] = React.useState("");
  const [tagList, setTagList] = React.useState([]);
  const [lastDoc, setLastDoc] = React.useState("");
  const [firstDoc, setFirstDoc] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [toggle, setToggle] = React.useState(true);
  const ref = React.useRef()

  const inputUntags = (untags) => {
    inputSearch(tag, untags)
    console.log("inputTags")
  }

  const inputTag = (tag) => { setTag(tag)}

  const firstload = () => {
    db.collection("tags")
    .orderBy("created", "desc")
    .limit(4)
    .get()
    .then((res) => {
      const items = [];
      const lastDoc = res.docs[res.docs.length - 1];
      const firstDoc = res.docs[0]
      res.forEach((doc) => {
        const IsToggle =  onTags.some((ontag) =>  ontag === doc.data().name)
        items.push({
          data: doc.data(),
          toggle: !IsToggle,
        });
      });
      setTagList(items);
      setLastDoc(lastDoc);
      setFirstDoc(firstDoc)
    });
  }

  React.useEffect(() => {
    db.collection("tags")
      .orderBy("created", "desc")
      .limit(4)
      .get()
      .then((res) => {
        const items = [];
        const lastDoc = res.docs[res.docs.length - 1];
        const firstDoc = res.docs[0]
        res.forEach((doc) => {
          items.push({
            data: doc.data(),
            toggle: toggle,
          });
        });
        setTagList(items);
        setLastDoc(lastDoc);
        setFirstDoc(firstDoc)
      });
  }, []);

  const load = () => {
    if (lastDoc !== "") {
      db.collection("tags")
        .orderBy("created", "desc")
        .startAfter(lastDoc)
        .limit(4)
        .get()
        .then((res) => {
          const size = res.size === 0;
          if (!size) {
            const items = [];
            const lastDoc = res.docs[res.docs.length - 1];
            const firstDoc = res.docs[0]
            res.forEach((doc) => {
              const IsToggle =  onTags.some((ontag) =>  ontag === doc.data().name)
              items.push({
                data: doc.data(),
                toggle: !IsToggle,
              });
            });
            setTagList(items);
            setLastDoc(lastDoc);
            setFirstDoc(firstDoc)
          } else {
            firstload()
          }
        });
    }
  };

  const prevload = () => {
    if (lastDoc !== "") {
      db.collection("tags")
        .orderBy("created", "desc")
        .endBefore(firstDoc)
        .limitToLast(4)
        .get()
        .then((res) => {
          const size = res.size === 0;
          if (!size) {
            const items = [];
            const lastDoc = res.docs[0];
            const firstDoc = res.docs[0]
            res.forEach((doc) => {
              const IsToggle =  onTags.some((ontag) =>  ontag === doc.data().name)
              items.push({
                data: doc.data(),
                toggle: !IsToggle,
              });
            });
            setTagList(items);
            setLastDoc(lastDoc);
            setFirstDoc(firstDoc)
          } else {
            firstload()
          }
        });
    }
  };
  
  const inputSearch = (tag, untags) => {
    if(tag){
    db
    .collection('tags')
    .where('name', '==', tag)
    .get()
    .then((docs) => { 
      if(docs.size == 1) {
        const i = []
        docs.forEach((doc) => {
          i.push({
            data: doc.data(),
            toggle: false
          })
        })
        console.log(i[0])
      } else {
        setTags(prev => [...prev, tag])
        setUntags(untags) 
        console.log(untags)
      }
    })
    } else {
      setUntags(untags)
      setTags(untags)
    }
  }

  const SearchTag = (term) => {
    if(typeof term == "string") {
      const searchTerm = term.toLowerCase();
      const strlength = searchTerm.length;
      const strFrontCode = searchTerm.slice(0, strlength-1);
      const strEndCode = searchTerm.slice(strlength-1, searchTerm.length);
      // This is an important bit..
      const endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
      console.log(`front: ${strFrontCode}, end: ${strEndCode} endCode: ${endCode}`)
      
      db
      .collection('tags')
      .where('name', '>=', searchTerm)
      .where('name', '<', endCode)
      .limit(10)
      .get()
      .then((docs) => {
        if(docs.size == 0){
          return
        } else{
          const items = []
          docs.forEach((doc) => {
            const IsToggle =  onTags.some((ontag) =>  ontag === doc.data().name) 
            items.push({
              data: doc.data(),
              toggle: !IsToggle
          })})
          setTagList(items)
        }
      })
    } 
  }

  return (
    <div>
      <p>検索ワード: {search}</p>
	  <Form>
		<input 
    type="text" 
    placeholder="入力したら検索ボタンをおしてください"
    value={search}
    onChange={(e) => {setSearch(e.target.value)}} 
    />
		<Span className="material-icons">search</Span>
		<button onClick={() => SearchTag(search)}>検索</button>
	  </Form>
      {tagList &&
        tagList
          .map((tag, i) => (
            <Tag 
            tag={tag} 
            key={i} 
            onTags={onTags} 
            setOnTags={setOnTags}
            untags={untags}
             />
          ))}
      <Button onClick={prevload}>前の４件</Button>
      <Button onClick={load}>次の４件</Button>
      <p>新しいタグをつくる</p>
      <TagsInput
      ref={ref}
      value={untags} 
      onChange={inputUntags}
      inputValue={tag}
      onChangeInput={inputTag}
      onlyUnique={true}
      maxTags={5}
      />
    </div>
  );
});

export default TagList;
