// NewClassForm.js

import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc,setDoc, doc } from "firebase/firestore";

const NewClassForm = ({ schoolCode }) => {
  const [className, setClassName] = useState("");

  const handleCreateClass = async () => {
    if (className.trim() === "") {
      return;
    }
  
    const classesRef = collection(db, "institutes", schoolCode, "classes");
  
    try {
      const newClassRef = doc(classesRef, className);
  
      await setDoc(newClassRef, {
        year: new Date().getFullYear(),
      });
  
      // Reset input field
      setClassName("");
    } catch (error) {
      console.error("Errore durante la creazione della classe:", error);
    }
  };
  

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-white mb-2">Crea nuova classe</h3>
      <input
        type="text"
        placeholder="Nome classe"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        className="block w-full bg-black rounded border border-white py-2 px-3 text-white placeholder-white focus:outline-none focus:border-red-500"
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        onClick={handleCreateClass}
      >
        Crea
      </button>
    </div>
  );
};

export default NewClassForm;
