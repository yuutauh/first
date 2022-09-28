import React from "react";
import { db } from "../../firebase";
import Tag from "./Tag";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const TagList = React.memo(
  ({ tags, 
    setTags, 
    onTags, 
    setOnTags, 
    tagError, 
    setTagError,
    onTagDatas,
	  setOnTagDatas 
  }) => {
    const [untags, setUntags] = React.useState([]);
    const [tag, setTag] = React.useState("");
    const [tagList, setTagList] = React.useState([]);
    const [lastDoc, setLastDoc] = React.useState("");
    const [firstDoc, setFirstDoc] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [toggle, setToggle] = React.useState(true);
    const [IsLeft, setIsLeft] = React.useState(false);
    const [IsRight, setIsRight] = React.useState(true);

    const inputUntags = (untags) => {
      inputSearch(tag, untags);
      console.log("inputTags");
    };

    const inputTag = (tag) => {
      setTag(tag);
    };

    const firstload = () => {
      db.collection("tags")
        .orderBy("created", "desc")
        .limit(8)
        .get()
        .then((res) => {
          const items = [];
          const lastDoc = res.docs[res.docs.length - 1];
          const firstDoc = res.docs[0];
          res.forEach((doc) => {
            const IsToggle = onTags.some((ontag) => ontag === doc.data().name);
            items.push({
              data: doc.data(),
              toggle: !IsToggle,
            });
          });
          setTagList(items);
          setLastDoc(lastDoc);
          setFirstDoc(firstDoc);
          setTagError("");
          setIsRight(true);
        });
    };

    React.useEffect(() => {
      db.collection("tags")
        .orderBy("created", "desc")
        .limit(8)
        .get()
        .then((res) => {
          const items = [];
          const lastDoc = res.docs[res.docs.length - 1];
          const firstDoc = res.docs[0];
          res.forEach((doc) => {
            items.push({
              data: doc.data(),
              toggle: toggle,
            });
          });
          setTagList(items);
          setLastDoc(lastDoc);
          setFirstDoc(firstDoc);
        });
    }, []);

    const load = () => {
      if (lastDoc !== "") {
        db.collection("tags")
          .orderBy("created", "desc")
          .startAfter(lastDoc)
          .limit(8)
          .get()
          .then((res) => {
            const size = res.size === 0;
            if (!size) {
              const items = [];
              const lastDoc = res.docs[res.docs.length - 1];
              const firstDoc = res.docs[0];
              res.forEach((doc) => {
                const IsToggle = onTags.some(
                  (ontag) => ontag === doc.data().name
                );
                items.push({
                  data: doc.data(),
                  toggle: !IsToggle,
                });
              });
              setTagList(items);
              setLastDoc(lastDoc);
              setFirstDoc(firstDoc);
              setIsLeft(true);
            } else {
              setIsRight(false);
            }
          });
      }
    };

    const prevload = () => {
      if (lastDoc !== "") {
        db.collection("tags")
          .orderBy("created", "desc")
          .endBefore(firstDoc)
          .limitToLast(8)
          .get()
          .then((res) => {
            const size = res.size <= 7;
            console.log(res.size);
            if (!size) {
              const items = [];
              const lastDoc = res.docs[0];
              const firstDoc = res.docs[0];
              res.forEach((doc) => {
                const IsToggle = onTags.some(
                  (ontag) => ontag === doc.data().name
                );
                items.push({
                  data: doc.data(),
                  toggle: !IsToggle,
                });
              });
              setTagList(items);
              setLastDoc(lastDoc);
              setFirstDoc(firstDoc);
              setIsRight(true);
            } else {
              setIsLeft(false);
            }
          });
      }
    };

    const inputSearch = (tag, untags) => {
      if (tag) {
        db.collection("tags")
          .where("name", "==", tag)
          .get()
          .then((docs) => {
            if (docs.size == 1) {
              const i = [];
              docs.forEach((doc) => {
                i.push({
                  data: doc.data(),
                  toggle: false,
                });
              });
              setTagError("そのタグはすでにあります。検索してみてください");
            } else {
              setTags((prev) => [...prev, tag]);
              setUntags(untags);
              setTagError("");
            }
          });
      } else {
        setUntags(untags);
        setTags(untags);
      }
    };

    const SearchTag = (term) => {
      if (typeof term == "string") {
        const searchTerm = term.toLowerCase();
        const strlength = searchTerm.length;
        const strFrontCode = searchTerm.slice(0, strlength - 1);
        const strEndCode = searchTerm.slice(strlength - 1, searchTerm.length);
        const endCode =
          strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

        if (term == "") {
          firstload();
        } else {
          db.collection("tags")
            .where("name", ">=", searchTerm)
            .where("name", "<", endCode)
            .limit(10)
            .get()
            .then((docs) => {
              if (docs.size == 0) {
                setTagError("該当するタグがありません");
                setTagList([]);
                setIsRight(false);
              } else {
                const items = [];
                docs.forEach((doc) => {
                  const IsToggle = onTags.some(
                    (ontag) => ontag === doc.data().name
                  );
                  items.push({
                    data: doc.data(),
                    toggle: !IsToggle,
                  });
                });
                setTagList(items);
                setTagError("");
              }
            });
        }
      }
    };

    return (
      <div>
        <div className="search-bar">
          <input type="search" placeholder="タグを検索する" value={search}
                 onChange={(e) => { setSearch(e.target.value) }}
          />
          <i className="uil uil-search" onClick={() => SearchTag(search)}></i>
        </div>
        <p className="text-smaller">タグを選択する</p>
        <div className="tags-pagination">
          {IsLeft && <i className="uil uil-angle-left" onClick={prevload}></i>}
          <div className="tags">
            {tagList &&
              tagList.map((tag, i) => (
                <Tag
                  tag={tag}
                  key={i}
                  onTags={onTags}
                  setOnTags={setOnTags}
                  untags={untags}
                  onTagDatas={onTagDatas}
                  setOnTagDatas={setOnTagDatas}
                />
              ))}
          </div>
          {IsRight && <i className="uil uil-angle-right" onClick={load}></i>}
        </div>
        {tagError && <p className="error">{tagError}</p>}
        <p className="text-smaller">新しいタグをつくる</p>
        <TagsInput
          value={untags}
          onChange={inputUntags}
          inputValue={tag}
          onChangeInput={inputTag}
          onlyUnique={true}
          maxTags={5}
          placeholder={"新しいタグをつくる"}
        />
      </div>
    );
  }
);

export default TagList;
