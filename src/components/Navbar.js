import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import instagram from "../images/instagram.png";
import { FiSearch } from "react-icons/fi";
import { CgProfile, CgLogOut } from "react-icons/cg";
import { AiOutlinePlusCircle, AiOutlineHome } from "react-icons/ai";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Form from "./Form";

const Navbar = () => {
  let [user, setuser] = useState(null);
  let [modalstate, setmodalstate] = useState(false);
  let [showdropdownstate, setshowdropdownstate] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (userdata) => {
      if (userdata) {
        setuser(userdata);
      } else {
        setuser(null);
      }
    });
  }, []);

  let showdropdown = () => {
    setshowdropdownstate((prev) => {
      return !prev;
    });
  };

  let modalstatehandler = () => {
    setmodalstate((prev) => {
      return !prev;
    });
  };

  return (
    <>
      {/* <Form closemodal={modalstatehandler} /> */}
      {modalstate && <Form closemodal={modalstatehandler} />}
      <div className="navbar">
        <img src={instagram} className="logo" />
        <label>
          <FiSearch />
          <input type="text" className="search" placeholder="Search" />
        </label>

        <div className="profiledropdown">
          <Link to="/" className="addpost">
            <AiOutlineHome />
          </Link>
          <span className="addpost" onClick={modalstatehandler}>
            <AiOutlinePlusCircle />
          </span>

          <img
            src={user?.photoURL}
            className="profilepic"
            onClick={showdropdown}
          />
          {showdropdownstate && (
            <div className="profiledropdownlinks">
              <Link to="/profile">
                <CgProfile /> Profile
              </Link>
              <button
                onClick={() => {
                  signOut(auth)
                    .then(() => {
                      // Sign-out successful.
                    })
                    .catch((error) => {
                      // An error happened.
                    });
                }}
              >
                <CgLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
