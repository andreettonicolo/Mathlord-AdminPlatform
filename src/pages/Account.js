import React, { useEffect, useState } from "react";
import StudentAccount from "../components/StudentAccount";
import TeacherAccount from "../components/TeacherAccount";
import SummaryAccount from "../components/SummaryAccount";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";
import { auth, db } from "../firebase"; // Modulo firebase.js nella cartella superiore
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const Account = () => {
  const [role, setRole] = useState("studente"); // Ruolo di default è "studente"
  const [userEmail, setUserEmail] = useState("");
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [userData, setUserData] = useState(null); // Definisci lo stato userData qui

  // Funzione per ottenere l'email dell'utente loggato
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

  // Effettua la chiamata per ottenere l'email dell'utente al caricamento del componente
  useEffect(() => {
    getUserEmail();

    if (isUserVerified) {
      fetchUserData(userEmail);
    }

    //console.log(userData)
  }, [isUserVerified, userEmail]);

  return (
    <div className="w-full text-white">
      <img
        className="w-full h-[400px] object-cover"
        src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
        alt="/"
      />
      <div className="bg-black/60 fixed top-0 left-0 w-full h-[550px]"></div>
      <div className="absolute top-[20%] p-4 md:p-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white">My Shows</h1>

        {userEmail && (
          <p className="text-lg text-white">Logged in as: {userEmail}</p>
        )}
        {isUserVerified ? (
          <p className="text-green-500">Email verified</p>
        ) : (
          <p className="text-red-500">
            Verifica il tuo account nella mail di verifica inviata per
            continuare!
          </p>
        )}

        {isUserVerified &&
          userData && ( // Aggiunta della condizione userData
            <div>
              <div className="my-4">
                <label htmlFor="role" className="text-white">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full bg-black rounded border border-white py-2 px-3 text-white placeholder-white focus:outline-none focus:border-red-500"
                >
                  <option value="studente">Studente</option>
                  <option value="insegnante">Insegnante</option>
                </select>
              </div>
              {role === "studente" && <StudentAccount email={userEmail} />}
              {role === "insegnante" && <TeacherAccount email={userEmail} />}
              
              <SummaryAccount userData={userData} userEmail={userEmail}/>
              {/* Aggiunta del componente SummaryAccount */}
            </div>
          )}
      </div>
    </div>
  );
};

export default Account;
