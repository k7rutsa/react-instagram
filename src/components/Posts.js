import { onAuthStateChanged } from "firebase/auth";
import {
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { AiFillDelete, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { auth, db } from "../firebase";
import Moment from "react-moment";

const Posts = ({
  username,
  postimg,
  likes,
  comment,
  userphoto,
  docid,
  caption,
  userid,
  timeposted,
}) => {
  let [likestate, setlikestate] = useState(false);
  let [user, setuser] = useState(null);
  let deletepost = async (docid) => {
    await deleteDoc(doc(db, "posts", docid));
  };

  let textarea = useRef();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setuser(user);
      } else {
        setuser(null);
      }
    });
  }, []);

  let hearthandle = async (id) => {
    await updateDoc(doc(db, "posts", id), {
      likes: arrayUnion(user.uid),
    });
  };

  let hearthandledelete = async (id) => {
    await updateDoc(doc(db, "posts", id), {
      likes: arrayRemove(user.uid),
    });
  };

  let handlecomments = async (docid) => {
    await updateDoc(doc(db, "posts", docid), {
      comment: arrayUnion({
        commenttext: textarea.current.value,
        username: user?.displayName,
        userid: user?.uid,
        commendid: Math.random(),
      }),
    });
  };

  let deletecomment = async (docid, c) => {
    await updateDoc(doc(db, "posts", docid), {
      comment: arrayRemove(c),
    });
  };

  return (
    <div className="posts">
      <div className="posts_container">
        <div className="post_header">
          <div className="post_header-left">
            <img src={userphoto} />
            <div className="span">{username}</div>
          </div>
          <div className="post_header-right">
            {user?.uid == userid && (
              <AiFillDelete onClick={() => deletepost(docid)} />
            )}
          </div>
        </div>
        <img src={postimg} className="postimage" />

        <div className="heart_container">
          <span className="heart">
            {likes.includes(user?.uid) ? (
              <AiFillHeart
                onClick={() => hearthandledelete(docid)}
                style={{ fill: "#F94C66" }}
              />
            ) : (
              <AiOutlineHeart onClick={() => hearthandle(docid)} />
            )}
            <p className="likescount">{likes.length} Likes</p>
          </span>

          <Moment fromNow className="timeago">
            {timeposted?.toDate()}
          </Moment>
        </div>

        <p>
          "<strong>{caption}</strong>"
        </p>

        <ul className="comments">
          {comment.map((c) => {
            return (
              <li key={c.commendid} style={{ marginBottom: "5px" }}>
                <strong>@{c.username}</strong> {c.commenttext}{" "}
                {c.userid == user?.uid && (
                  <AiFillDelete
                    onClick={() => deletecomment(docid, c)}
                    style={{ cursor: "pointer", verticalAlign: "text-top" }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <textarea
          ref={textarea}
          name="textarea"
          placeholder="Write a comment.."
          style={{
            width: "100%",
            padding: "1rem",
            marginTop: "1rem",
          }}
        ></textarea>
        <button
          style={{
            width: "100%",
            padding: ".7rem",
            cursor: "pointer",
            backgroundColor: "#1363DF",
            border: "none",
            color: "#fff",
          }}
          onClick={() => handlecomments(docid, userid)}
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default Posts;
