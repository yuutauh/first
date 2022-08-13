import React, { useContext } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { db, fb } from "../../firebase";
import { AuthContext } from "../Auth/Auth";
import { v4 as uuidv4 } from "uuid";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3e9d7;
`;

const P = styled.div`
  font-family: "Sawarabi Mincho";
  letter-spacing: 0.5rem;
  font-size: 1.5rem;
`;

const FormComplete = ({ body, trends, tags, onTags }) => {
  const { currentUser } = useContext(AuthContext);

  const addThread = () => {
    const id = uuidv4();
    if (currentUser === null || currentUser.isAnonymous) {
      return false;
    } else {
      const thread = {
        body: body,
        id: id,
        created: fb.firestore.FieldValue.serverTimestamp(),
        uid: currentUser.uid,
        username: currentUser.displayName,
        userimage: currentUser.photoURL,
        favorites: [],
      };

      db.collection("threads").doc(id).set(thread);

      // trends.forEach((trend) => {
      //   db.collection('trends').add({
      //     name: trend,
      //     created: fb.firestore.FieldValue.serverTimestamp(),
      //     threadId: id,
      //   })
      // })

      onTags.forEach((doc) => {
        db.collection("tags")
          .doc(doc)
          .update({
            threadId: fb.firestore.FieldValue.arrayUnion(id),
          });
      });

      tags.forEach((doc) => {
        const tagId = uuidv4();
        db.collection("tags")
          .doc(tagId)
          .set({
            name: doc,
            id: tagId,
            threadId: fb.firestore.FieldValue.arrayUnion(id),
            created: fb.firestore.FieldValue.serverTimestamp(),
          });
      });
    }
  };
  return (
    <Container>
      <P onClick={addThread}>完了しました。</P>
    </Container>
  );
};

export default FormComplete;
