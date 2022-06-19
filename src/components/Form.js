import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Form = ({ closemodal }) => {
  let [user, setuser] = useState(null);
  let [fileurl, setfileurl] = useState(null);
  let [progress, setprogress] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, (userdata) => {
      if (userdata) {
        setuser(userdata);
      } else {
        setuser(null);
      }
    });
  }, []);

  //   uploadpost
  let uploadpost = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "posts"), {
      caption: e.target.textareainput.value,
      postimg: fileurl,
      time: serverTimestamp(),
      userid: user.uid,
      username: user.displayName,
      comment: [],
      likes: [],
      userphoto: user.photoURL,
    });

    console.log("Document written with ID: ", docRef.id);
    closemodal();
  };

  //   uploadfile
  let handlefile = (e) => {
    let filedata = e.target.files[0];

    if (!filedata.type.includes("image")) {
      alert("Uploaded image must be an image");
      return;
    }
    if (filedata.size > 1000000) {
      alert("Uploaded image size must be less than 1MB");
      return;
    }

    if (!filedata) {
      return;
    }

    // Uploadfile
    const storageRef = ref(storage, `post-images/${user.uid}/${filedata.name}`);

    const uploadTask = uploadBytesResumable(storageRef, filedata);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setprogress(progress);

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setfileurl(downloadURL);
          setprogress(0);
        });
      }
    );
  };

  return (
    <div className="addpostcontainer">
      <form className="addpostform" onSubmit={uploadpost}>
        <span onClick={closemodal} className="closemodal">
          X
        </span>
        <h3>ADD POST</h3>
        {fileurl && <img src={fileurl} />}
        <label htmlFor="file">
          {progress > 0 ? "UPLOADING..." : "SELECT A PHOTO"}
        </label>
        {/* {progress > 0 && progress < 100 && (
          <>
            <span>{Math.trunc(progress)} %</span>
            <progress value={progress} max="100"></progress>
          </>
        )} */}
        <input type="file" id="file" onChange={handlefile} required />
        <textarea
          placeholder="Write a caption..."
          name="textareainput"
          required
        ></textarea>
        <button type="submit">POST</button>
      </form>
    </div>
  );
};

export default Form;
