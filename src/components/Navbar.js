import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const db = getFirestore();
  const { user, logOut } = UserAuth();
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [isUserVerified, setIsUserVerified] = useState(false);

  const getUserEmail = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setIsUserVerified(user.emailVerified);
      } else {
        setUserEmail('');
        setIsUserVerified(false);
      }
    });
  };

  const getUserRole = async () => {
    if (user?.email) {
      const userDocRef = doc(db, "user", user.email);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserRole(userData?.Role);
      }
    }
  };


  useEffect(() => {
    getUserEmail();
    getUserRole();
  }, [db, user]);

  const isVerifiedTeacher = userRole === "insegnante";


  return (
    <div className="flex items-center justify-between p-4 z-[100] w-full absolute">
      <Link to="/">
        <h1 className="text-red-600 text-4xl font-bold cursor-pointer">
          Mathlord
        </h1>
      </Link>
      <div>
        {user?.email ? (
          <>
            {isVerifiedTeacher && (
              <Link to="/classi">
                <button className="text-white cursor-pointer pr-4">Classi</button>
              </Link>
            )}
            <Link to="/account">
              <button className="text-white cursor-pointer pr-4">Account</button>
            </Link>
            <Link to="/">
              <button
                className="bg-red-600 cursor-pointer px-6 py-2 rounded text-white"
                onClick={() => logOut()}
              >
                Log out
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="text-white cursor-pointer pr-4">Log In</button>
            </Link>
            <Link to="/signup">
              <button className="bg-red-600 cursor-pointer px-6 py-2 rounded text-white">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
