import Navbar from "../components/Navbar";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Posts from "../components/Posts";

const Home = () => {
  let [posts, setposts] = useState(null);
  let [loading, setloading] = useState(false);

  // query(citiesRef, orderBy("name"), limit(3));

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "posts"), orderBy("time", "desc")),
      (doc) => {
        let postsdata = [];

        doc.forEach((doc) => {
          postsdata.push({ ...doc.data(), docid: doc.id });
        });

        setposts(postsdata);
        setloading(true);
      }
    );

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
            timeposted={post.time}
          />
        );
      })}
    </div>
  );
};

export default Home;
