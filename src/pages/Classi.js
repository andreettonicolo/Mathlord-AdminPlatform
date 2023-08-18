import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import ClassList from "../components/ClassList"; // Importa il componente ClassList

const Classi = () => {
  const [role, setRole] = useState(""); // Ruolo di default è "studente"
  const [userEmail, setUserEmail] = useState("");
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserEmail = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setIsUserVerified(user.emailVerified);
      } else {
        setUserEmail("");
        setIsUserVerified(false);
      }
    });
  };

  const fetchUserData = async (email) => {
    const userDocRef = doc(db, "user", email);

    try {
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        setUserData(userDocSnapshot.data());
      }
    } catch (error) {
      console.error("Errore nel recupero dei dati utente:", error);
    }
  };

  useEffect(() => {
    getUserEmail();

    if (isUserVerified) {
      fetchUserData(userEmail);
    }
  }, [isUserVerified, userEmail]);

  return (
    <div className="p-8">
      <div className="max-w-lg mx-auto bg-white rounded p-8 shadow-md">
        <h1 className="text-2xl font-bold mb-4">Pagina Classi</h1>
        {isUserVerified && userData && userData.Role === "insegnante" ? (
          
         
          <div>
               <ClassList schoolCode={userData.SchoolCode} />
               
          </div>
        ) : (
          <p>Non sei un insegnante. Questa pagina è riservata agli insegnanti.</p>
        )}
      </div>
    </div>
  );
};

export default Classi;
