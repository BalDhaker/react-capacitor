import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FirebaseAuthentication, User } from '@capacitor-firebase/authentication';
import { initializeApp } from 'firebase/app';
function App() {

  initializeApp({
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  })
  const [user, setUser] = useState<User | null>(null);
  const [errMsg, setErrMsg] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState("");
  const signInWithGoogle = async () => {
    const result = await FirebaseAuthentication.signInWithGoogle();
    setUser(result.user);
    console.log(user);
    return result.user;
  };

  

  const signInWithPhoneNumber = async () => {
    return new Promise(async (resolve) => {
      // Attach `phoneCodeSent` listener to be notified as soon as the SMS is sent
      await FirebaseAuthentication.addListener('phoneCodeSent', async event => {
        // Ask the user for the SMS code
        const verificationCode: string = window.prompt(
          'Please enter the verification code that was sent to your mobile device.',
        ) ?? '';
        // Confirm the verification code
        const result = await FirebaseAuthentication.confirmVerificationCode({
          verificationId: event.verificationId,
          verificationCode,
        });
        setUser(result.user);
        resolve(result.user);
      });
      // Attach `phoneVerificationCompleted` listener to be notified if phone verification could be finished automatically
      await FirebaseAuthentication.addListener(
        'phoneVerificationCompleted',
        async event => {
          setUser(event.user);
          resolve(event.user);
        },
      );
      await FirebaseAuthentication.addListener(
        'phoneVerificationFailed',
        async event => {
          setErrMsg(event.message);
          console.log(event.message)
        },
      );
      // Start sign in with phone number and send the SMS
      await FirebaseAuthentication.signInWithPhoneNumber({
        phoneNumber: phoneNumber,
      });
    });
  };
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p>Capacitor Firebase Authentication</p>
      <div className="card">
        <button onClick={signInWithGoogle}>
          Sing in with Google
        </button>

        <h2>Phone Authentication</h2>
        <input
        type="tel"
        placeholder="Enter Phone No."
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        
      />
      <p>Write mobile with country code. +91</p>
      <button 
        onClick={signInWithPhoneNumber} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Sign in with {phoneNumber ?? 'Phone Number'}
      </button>

      </div>

      {(user ? <div className="card">
          <p style={{color: 'red'}}>{errMsg}</p>
          <p>name: {user?.displayName}</p>
          <p>email: {user?.email}</p>
          <p>phone: {user?.phoneNumber}</p>
          <p>creationTime: {user?.metadata.creationTime}</p>
          <p>lastSignInTime: {user?.metadata.lastSignInTime}</p>
          <p>{user?.uid}</p>
      </div> : '')}

    </>
  )
}

export default App
