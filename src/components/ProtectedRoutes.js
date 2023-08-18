// Import delle dipendenze necessarie
import React, { Children } from "react";
import { auth } from "../firebase"; // Modulo di autenticazione (presumibilmente)
import { UserAuth } from "../context/AuthContext"; // Contesto di autenticazione
import { Navigate } from "react-router-dom"; // Componente di reindirizzamento

// Definizione del componente ProtectedRoutes
const ProtectedRoutes = ({ children }) => {
  // Estrapolazione dello stato di autenticazione dell'utente utilizzando il contesto
  const { user } = UserAuth();

  // Controllo se l'utente è autenticato
  if (!user) {
    // Se l'utente non è autenticato, esegue un reindirizzamento alla rotta "/"
    // Questo significa che le rotte protette saranno accessibili solo da utenti autenticati
    // In altre parole, se l'utente non ha effettuato l'accesso, verrà reindirizzato alla pagina di login o a un'altra pagina pubblica.
    return <Navigate to="/" />;
  } else {
    // Se l'utente è autenticato, restituisce il contenuto dei componenti nidificati
    // Questo significa che i componenti nidificati saranno renderizzati solo se l'utente è autenticato.
    return children;
  }
};

export default ProtectedRoutes;
