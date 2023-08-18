import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const ClassDetails = ({ selectedClass, schoolCode }) => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);

  useEffect(() => {
    const fetchClassData = async () => {
      if (selectedClass) {
        const classRef = doc(
          db,
          "institutes",
          schoolCode,
          "classes",
          selectedClass
        );
        try {
          const classDocSnapshot = await getDoc(classRef);
          if (classDocSnapshot.exists()) {
            const classData = classDocSnapshot.data();
            setStudents(classData.students || []);
            setTeachers(classData.teachers || []);
          }
        } catch (error) {
          console.error("Errore nel recupero dei dati della classe:", error);
        }
      }
    };

    fetchClassData();
  }, [selectedClass]);

  const handleSearchUser = async () => {
    if (searchEmail) {
      // Replace 'users' with the actual path to your users collection in Firestore
      const userRef = doc(db, "user", searchEmail);
      try {
        const userDocSnapshot = await getDoc(userRef);
        if (userDocSnapshot.exists()) {
          setFoundUser(userDocSnapshot.data());
        } else {
          setFoundUser(null);
          console.log("Utente non trovato.");
        }
      } catch (error) {
        console.error("Errore nella ricerca dell'utente:", error);
      }
    }
  };

  // Aggiungi questa funzione per gestire la rimozione degli studenti
const handleRemoveStudent = async (studentToRemove) => {
  const updatedStudents = students.filter(student => student !== studentToRemove);
  setStudents(updatedStudents);

  const classRef = doc(db, "institutes", schoolCode, "classes", selectedClass);
  try {
    await updateDoc(classRef, { students: updatedStudents });
    console.log("Studente rimosso con successo dal database.");
  } catch (error) {
    console.error("Errore nella rimozione dello studente dal database:", error);
  }
};

  const handleAddStudent = async () => {
    if (foundUser) {
      const updatedStudents = [...students, searchEmail];
      setStudents(updatedStudents);

      const classRef = doc(
        db,
        "institutes",
        schoolCode,
        "classes",
        selectedClass,
        ""
      );
      try {
        students.push(searchEmail);
        await updateDoc(classRef, { students: students });
        console.log("Studente aggiunto con successo al database.");
        setSearchEmail(""); // Clear the search email after successful addition
        setFoundUser(null); // Clear the found user after successful addition
      } catch (error) {
        console.error(
          "Errore nell'aggiunta dello studente al database:",
          error
        );
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-black">
        Dettagli della Classe
      </h2>
      <h3 className="text-lg font-semibold text-black mt-4">Studenti:</h3>
      <ul className="text-black">
        {students.map((student, index) => (
          <li key={index}>
            {student}
            <button
              className="ml-2 text-red-500"
              onClick={() => handleRemoveStudent(student)}
            >
              &#10006;
            </button>
          </li>
        
        ))}
      </ul>
      <div className="flex">
        <input
          type="email"
          placeholder="Inserisci l'indirizzo email dello studente"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border px-2 py-1 rounded mr-2"
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={handleSearchUser}
        >
          Cerca
        </button>
      </div>
      {foundUser && (
        <div className="mt-2">
          <p>Utente trovato: {foundUser.email}</p>
          <button
            className="bg-green-500 text-white px-4 py-1 rounded"
            onClick={handleAddStudent}
          >
            Aggiungi studente
          </button>
        </div>
      )}
      <h3 className="text-lg font-semibold text-black mt-4">Insegnanti:</h3>
      <ul className="text-black">
        {teachers.map((teacher, index) => (
          <li key={index}>{teacher}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClassDetails;
