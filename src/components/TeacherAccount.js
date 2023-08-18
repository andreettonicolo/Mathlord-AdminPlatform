import React, { useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import ModalRefresh from "../components/ModalRefresh"; // Assicurati di avere il percorso corretto per il tuo componente ModalAggiornamento

const TeacherAccount = ({ handleSubmit, email }) => {
  // Stati del componente
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [endTimestamp, setEndTimestamp] = useState("");
  const [key, setKey] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isKeyVerified, setIsKeyVerified] = useState(false);
  const { updateUserDoc } = UserAuth();
  const [showRefreshModal, setShowRefreshModal] = useState(false); //MODAL DA IMPLEMENTARE PER RICHIEDERE IL REFRESH

  // Funzione per verificare il codice meccanografico dell'istituto
  const checkSchoolCode = async () => {
    const db = getFirestore(); // Ottieni un'istanza del database Firestore
    const instituteRef = doc(db, "institutes", schoolCode); // Riferimento al documento dell'istituto

    try {
      const docSnapshot = await getDoc(instituteRef); // Ottieni lo snapshot del documento
      
      if (docSnapshot.exists()) {
        setConfirmationMessage("Codice meccanografico corretto");
        setIsCodeVerified(true); // Imposta il flag di verifica del codice
        setSchoolCode(schoolCode); // Imposta il codice meccanografico

        const schoolData = docSnapshot.data();
      if (schoolData.end) {
        const end_timestamp = schoolData.end;
        const milliseconds =
        end_timestamp.seconds * 1000 + end_timestamp.nanoseconds / 1000000;
        const date = new Date(milliseconds);
        setEndTimestamp(date)
        console.log(endTimestamp); // This will log the converted date
      }





      } else {
        setConfirmationMessage("Codice meccanografico non valido");
        setIsCodeVerified(false); // Imposta il flag di verifica del codice
      }
    } catch (error) {
      console.error("Errore nella ricerca del codice meccanografico:", error);
    }
  };

  // Funzione per verificare la chiave
  const checkKey = async () => {
    if (isCodeVerified) {
      const db = getFirestore(); // Ottieni un'istanza del database Firestore
      const keyDocRef = doc(db, "institutes", schoolCode, "keys", key); // Riferimento al documento della chiave

      try {
        const keyDocSnapshot = await getDoc(keyDocRef); // Ottieni lo snapshot del documento

        if (keyDocSnapshot.exists()) {
          // La chiave è valida, procedi con l'aggiornamento del documento
          const userDocRef = doc(db, "user", email); // Suppongo che tu abbia l'email dell'utente

          try {
            await updateDoc(userDocRef, {
              "subscribed.license": "teach",
              "subscribed.Duration": endTimestamp,
            });

            await deleteDoc(keyDocRef); // Elimina il documento della chiave

            setConfirmationMessage("Codice key corretto. Licenza attivata.");
            setIsKeyVerified(true); // Imposta il flag di verifica della chiave
          } catch (error) {
            console.error("Errore nell'aggiornamento del documento:", error);
          }
        } else {
          setConfirmationMessage("Codice key non valido");
          setIsKeyVerified(false); // Imposta il flag di verifica della chiave
        }
      } catch (error) {
        console.error("Errore nella ricerca del codice key:", error);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito dell'evento submit del form

    await checkSchoolCode(); // Verifica il codice meccanografico
    await checkKey(); // Verifica la chiave

    // Se sia il codice meccanografico che la chiave sono verificati
    if (isCodeVerified && isKeyVerified) {
      // Aggiorna il documento utente con i dati forniti
      updateUserDoc(firstName, lastName, "insegnante", schoolCode);

      // Show the refresh modal
      setShowRefreshModal(true);
    }
  };

  return (
    <>
      <div className="w-full text-white">
        <div className="top-[20%] p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Teacher Account
          </h1>

          <form onSubmit={handleFormSubmit}>
            <div className="my-4">
              <label htmlFor="firstName" className="text-white">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full bg-black rounded border border-white py-2 px-3 text-white placeholder-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="my-4">
              <label htmlFor="lastName" className="text-white">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full bg-black rounded border border-white py-2 px-3 text-white placeholder-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="my-4">
              <label htmlFor="schoolCode" className="text-white">
                School Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="schoolCode"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  className="block w-full bg-black rounded border border-white py-2 px-3 text-white placeholder-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={checkSchoolCode}
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                  Submit meccanografico
                </button>
              </div>
            </div>
            <div className="my-4">
              <label htmlFor="key" className="text-white">
                Key
              </label>
              <input
                type="text"
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className={`block w-full bg-black rounded border border-white py-2 px-3 text-white placeholder-white focus:outline-none focus:border-red-500 ${
                  !isCodeVerified ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isCodeVerified}
              />
              <button
                type="button"
                onClick={checkKey}
                className={`bg-blue-500 text-white px-4 py-2 rounded ml-2 ${
                  !isCodeVerified ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isCodeVerified}
              >
                Submit Key
              </button>
            </div>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
            {confirmationMessage && (
              <p className="text-green-500">{confirmationMessage}</p>
            )}
          </form>
        </div>
      </div>
      {showRefreshModal && (
        <ModalRefresh closeModal={() => setShowRefreshModal(false)} />
      )}
    </>
  );
};

export default TeacherAccount;
