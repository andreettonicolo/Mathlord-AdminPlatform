import React from 'react';

const SummaryAccount = ({ userData, userEmail }) => {
  const { Role, FirstName, LastName, SchoolCode, subscribed } = userData;

  console.log(subscribed)



  return (
    <div>
      <h2 className="text-xl font-semibold text-white">Account Summary</h2>
      <p className="text-white">Role: {Role}</p>
      <p className="text-white">Email: {userEmail}</p>
      
      {Role === 'insegnante' && (
        <div>
          <p className="text-white">First Name: {FirstName}</p>
          <p className="text-white">Last Name: {LastName}</p>
          <p className="text-white">School Code: {SchoolCode}</p>
          
          <p className="text-white">Subscribed Duration: {subscribed && subscribed.Duration}</p> 
          <p className="text-white">Subscribed License: {subscribed && subscribed.license}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryAccount;
