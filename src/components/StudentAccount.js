import React, { useEffect, useState } from 'react';
import { UserAuth } from "../context/AuthContext";

const StudentAccount = () => {
  const { updateUserDoc } = UserAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');


  // Funzione chiamata quando l'utente invia il form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);

    updateUserDoc(firstName, lastName, 'studente'); //aggiorno i dati del utente nel documento
  };

  return (
    <>
      <div className='w-full text-white'>
       
        <div className=' fixed top- left-0 w-full h-[550px]'></div>
        <div className='absolute top-[80%] p-4 md:p-8'>
          
          

          <form onSubmit={handleSubmit}>
            <div className="my-4">
              <label htmlFor="firstName" className="text-white">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full bg-black rounded border border-white py-2 px-3 text-white placeholder-white focus:outline-none focus:border-red-500"
                
              />
            </div>
            <div className="my-4">
              <label htmlFor="lastName" className="text-white">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full bg-black rounded border border-white py-2 px-3 text-white placeholder-white focus:outline-none focus:border-red-500"
                
              />
            </div>
            <button type="submit" className={`bg-red-500 text-white px-4 py-2 rounded'}`}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentAccount;
