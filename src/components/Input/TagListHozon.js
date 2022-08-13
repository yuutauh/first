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
    setUntags(untags) 
    inputSearch(tag)
  }
  const inputTag = (tag) => { setTag(tag)}

  const add = (e) => {
     ref.current.addTag(e)
  }

  const clear = () => {
    ref.current.clearInput()
 }

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
        const IsToggle =  onTags.some((ontag) =>  ontag.data.name === doc.data().name)
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
              const IsToggle =  onTags.some((ontag) =>  ontag.data.name === doc.data().name)
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
              const IsToggle =  onTags.some((ontag) =>  ontag.data.name === doc.data().name)
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

  const toggleTag = (tag) => {
    tag.toggle = false
    setOnTags(prev => [...prev, tag])
  }

  const offtoggleTag = (tag) => {
    setOnTags(onTags.filter((ontag) => ontag.data.name !== tag))
  }
  
  const inputSearch = (tag) => {
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
        toggleTag(i[0])
      } else {
        setTags(prev => [...prev, tag])
      }
    })
    }
  }
  
  function defaultRenderTag (props) {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props
    const i = tags.filter((t) => t !== tag)
    const IsOnTags = onTags.some(on => on.data.name == tag)
    const remove = () => {
      if(IsOnTags) {
        offtoggleTag(tag)
        onRemove(key)
      } else {
        onRemove(key)
        setTags(i)
      }
    }
    
    return (
      <>
      {IsOnTags ? (
        <span key={key} {...other} >
          {getTagDisplayValue(tag)}
          {!disabled &&
            <a className={classNameRemove} onClick={remove} />
          }
        </span>
      ) : (
        <span key={key} {...other} >
          {getTagDisplayValue(tag)}
          {!disabled &&
            <a className={classNameRemove} onClick={remove} />
          }
        </span>
      )}
      </>
    )
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
		{/* <button onClick={inputSearch}>検索</button> */}
	  </Form>
      {tagList &&
        tagList
          .filter(
            ({ data }) =>
              data.name.toLowerCase().search(search.toLowerCase()) !== -1
          )
          .map((tag, i) => (
            <Tag 
            tag={tag} 
            key={i} 
            onTags={onTags} 
            setOnTags={setOnTags}
            add={add}
            clear={clear}
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
      renderTag={defaultRenderTag}
      />
    </div>
  );
});

export default TagList;
