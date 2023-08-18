// Import delle funzioni e degli oggetti necessari per l'autenticazione con Firebase
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Modulo firebase.js nella cartella superiore
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  OAuthProvider,
  sendEmailVerification ,
} from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore"; //documenti firebase

// Creazione del contesto per l'autenticazione
const AuthContext = createContext();

// Componente provider del contesto, gestisce lo stato dell'utente, le funzioni di autenticazione e la gestione dei documenti
export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({}); // Stato dell'utente, inizialmente vuoto
  

  //Login e registrazione con account Apple

  async function logInWithApple() {
    const auth = getAuth();
    const provider = new OAuthProvider("apple.com");

    // Opzionalmente, puoi configurare il provider con le opzioni per l'autenticazione con Apple
    // Ad esempio, puoi impostare il prompt come "login" o "consent" a seconda delle tue esigenze.
    provider.setCustomParameters({ prompt: "login" });

    // Effettua il login o la registrazione con account Apple
    return signInWithPopup(auth, provider);
  }

  //Login e registrazione con account google
 async function logInWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    // Puoi personalizzare eventualmente le opzioni per l'autenticazione con Google
    provider.setCustomParameters({ prompt: "select_account" });
    
    return signInWithPopup(auth, provider);
  }

  // Funzione per registrare un nuovo utente, crea l'account in Firebase e salva un documento nel database
  async function createDoc(email) {
    const userDocRef = doc(db, "user", email);
  
    // Controlla se il documento esiste già
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        // Il documento esiste già, non fare nulla
        return;
      }
    } catch (error) {
      console.log("Errore durante il controllo del documento:", error);
      return;
    }
  
    // Se il documento non esiste, crea un nuovo documento
    try {
      await setDoc(userDocRef, {
        FirstName: "",
        LastName: "",
        Role: "",
        subscribed: {
          license: "none", // Puoi impostare il valore iniziale desiderato
          Duration: ""     // Puoi impostare il valore iniziale desiderato
        },
        playerData: {
          TotalXP: 0, // XP base a 0
          PlayerProgresses: [],
          MaffyEnergy: "",
          PlayerPerformanceOverTime: []
        }
      });
    } catch (error) {
      console.log("Errore durante la creazione del documento:", error);
    }
  }
  


  
async function updateUserDoc(firstName, lastName, role, schoolCode) {
    const userDocRef = doc(db, "user", user.email); // user.email è l'email dell'utente autenticato

    try {
      await updateDoc(userDocRef, {
        FirstName: firstName,
        LastName: lastName,
        Role: role,
        SchoolCode: schoolCode
      });
      console.log("Documento utente aggiornato con successo nel database.");
    } catch (error) {
      console.error("Errore durante l'aggiornamento del documento utente:", error);
      // Puoi gestire l'errore qui, ad esempio mostrando un messaggio di errore all'utente
    }
  }









  // Funzione per effettuare il login dell'utente, restituisce una promise con le informazioni dell'utente
  function logIn(email, password) {
    const persistence = browserSessionPersistence; // Quando si chiude la sessione, ci si slogga

    return setPersistence(auth, persistence).then(() =>
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Controlla se l'utente ha verificato l'email
        const { user } = userCredential;
        if (user && !user.emailVerified) {
          // Invia un'email di verifica all'utente
          sendEmailVerification(user)
            .then(() => {
              console.log("Email di verifica inviata con successo");
            })
            .catch((error) => {
              console.log("Errore nell'invio dell'email di verifica:", error);
            });
        }
        return userCredential;
      })
    );
  }

  // Funzione per effettuare il logout dell'utente, restituisce una promise
  function logOut() {
    return signOut(auth);
  }

  // Hook useEffect per gestire le informazioni sull'autenticazione dell'utente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Callback che riceve le informazioni sull'utente autenticato
      setUser(currentUser);
    });
    return () => {
      unsubscribe(); // Cleanup della sottoscrizione all'evento di autenticazione
    };
  }, []);


  // Fornisce lo stato dell'utente e le funzioni di autenticazione attraverso il contesto
  return (
    <AuthContext.Provider
      value={{ createDoc, logIn, logOut, logInWithGoogle, logInWithApple, updateUserDoc, user }}
    >
      {children} {/*Rende disponibili le informazioni ai componenti figli*/}
    </AuthContext.Provider>
  );
}

// Hook useContext per accedere al contesto dell'autenticazione da qualsiasi componente figlio
export function UserAuth() {
  return useContext(AuthContext);
}
