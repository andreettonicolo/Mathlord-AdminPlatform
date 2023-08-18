import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, addDoc, setDoc, doc } from "firebase/firestore";
import ClassDetails from "./ClassDetails";

const ClassList = ({ schoolCode }) => {
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      const classesRef = collection(db, "institutes", schoolCode, "classes");
      const q = query(classesRef);

      try {
        const querySnapshot = await getDocs(q);
        const classes = querySnapshot.docs.map((doc) => doc.id);
        setClassList(classes);
      } catch (error) {
        console.error("Errore nel recupero delle classi:", error);
      }
    };

    if (schoolCode) {
      fetchClasses();
    }
  }, [schoolCode]);

  const handleClassSelect = (event) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);
  };

  const handleAddClass = () => {
    setIsAddingClass(true);
  };

  const handleConfirmAddClass = async () => {
    if (newClassName.trim() === "") {
        return;
      }
    
      const classesRef = collection(db, "institutes", schoolCode, "classes");
    
      try {
        const newClassRef = doc(classesRef, newClassName);
    
        await setDoc(newClassRef, {
          year: new Date().getFullYear(),
        });
    
        // Reset input field
        setNewClassName("");
      } catch (error) {
        console.error("Errore durante la creazione della classe:", error);
      }
    };
  
  

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Lista delle Classi</h2>
      <select
        className="text-black p-2 rounded"
        value={selectedClass}
        onChange={handleClassSelect}
      >
        <option value="">Seleziona una classe</option>
        {classList.map((className, index) => (
          <option key={index} value={className}>
            {className}
          </option>
        ))}
      </select>
      {selectedClass && <ClassDetails selectedClass={selectedClass} schoolCode={schoolCode} />} {/* Aggiunta della componente ClassDetails */}
      
      {/* Bottone per aggiungere nuova classe */}
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddClass}>
        Aggiungi nuova classe
      </button>
      
      {/* Modale per aggiungere nuova classe */}
      {isAddingClass && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Aggiungi nuova classe</h3>
            <input
              type="text"
              placeholder="Nome della classe"
              className="border rounded p-2 w-full mb-2"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleConfirmAddClass}>
              Conferma
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded ml-2" onClick={() => setIsAddingClass(false)}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassList;
