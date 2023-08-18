import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { auth, db } from "../firebase"; // Modulo firebase.js nella cartella superiore
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorType, setErrorType] = useState("");
  const { user, signUp, createDoc, logInWithGoogle, logInWithApple } =
    UserAuth();
  const [error, setError] = useState("");
  const [regattempt, setRegattempt] = useState(false);



  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      navigate("/account");
      // Invia la mail di verifica all'utente
      await sendEmailVerification(userCredential.user);

      console.log("Creato giustamente");

      setError(false);
      setRegattempt(true);
      createDoc(email);
    } catch (error) {
      console.log("Non creato");
      setError(true);
      setErrorType(error);
      setRegattempt(true);
    }
  };

  const handleAppleSignUp = () => {
    logInWithApple()
      .then(async (result) => {
        // L'utente si è registrato o ha effettuato l'accesso con successo con Apple
        setError(false);
        setRegattempt(true);
        navigate("/account");
        await sendEmailVerification(result.user); // Invia la mail di verifica all'utente
        createDoc(result.user.email);
      })
      .catch((error) => {
        // Gestisci gli errori se la registrazione con Apple fallisce
        console.log("Non registrato o loggato con Apple");
        console.log(error);
        setError(true);
        setRegattempt(true);
      });
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await logInWithGoogle();
      // L'utente si è registrato o ha effettuato l'accesso con successo con Google
      console.log("Creato giustamente");
      setError(false);
      setRegattempt(true);
      navigate("/account");
     
      createDoc(result.user.email); // Utilizza result.user.email invece di email
    } catch (error) {
      // Gestisci gli errori se l'accesso con Google fallisce
      console.log("Non creato");
      setError(true);
      setRegattempt(true);
      // ..
    }
  };

  return (
    <>
      <div className="w-full h-screen">
        <img
          className="hidden sm:block absolute w-full h-full object-cover"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
          alt="/"
        />
        <div className="bg-black/60 fixed top-0 left-0 w-full h-screen"></div>
        <div className="fixed w-full px-4 py-24 z-50">
          <div className="max-w-[450px] h-[600px] mx-auto bg-black/75 text-white">
            <div className="max-w-[320px] mx-auto py-16">
              <h1 className="text-3xl font-bold">Sign Up</h1>

              {error ? <p>{error}</p> : <p></p>}

              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col py-4"
              >
                <input
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="p-3 my-2 bg-gray-700 rouded"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                />
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="p-3 my-2 bg-gray-700 rouded"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <button className="bg-red-600 py-3 my-6 rounded font-bold">
                  Sign Up
                </button>
                <button
                  onClick={handleGoogleSignUp}
                  className="bg-blue-600 py-3 my-6 rounded font-bold"
                >
                  Sign Up with Google
                </button>

                <button
                  onClick={handleAppleSignUp}
                  className="bg-green-600 py-3 my-6 rounded font-bold"
                >
                  Sign Up with Apple
                </button>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <p>
                    <input className="mr-2" type="checkbox" />
                    Remember me
                  </p>
                  <p>Need Help?</p>
                </div>
                <p className="py-8">
                  <span className="text-gray-600">
                    Already subscribed to Netflix?
                  </span>{" "}
                  <Link to="/login">Sign In</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
