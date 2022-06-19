import Navbar from "../components/Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Posts from "../components/Posts";

const Home = () => {
  let [posts, setposts] = useState(null);
  let [loading, setloading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts"), (doc) => {
      let postsdata = [];

      doc.forEach((doc) => {
        postsdata.push({ ...doc.data(), docid: doc.id });
      });

      setposts(postsdata);
      setloading(true);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="homepage">
      <Navbar />
      {posts?.map((post) => {
        return (
          <Posts
            username={post.username}
            postimg={post.postimg}
            likes={post.likes}
            comment={post.comment}
            userphoto={post.userphoto}
            docid={post.docid}
            caption={post.caption}
            userid={post.userid}
            key={post.docid}
          />
        );
      })}
    </div>
  );
};

export default Home;
