import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDb8Ww7e8Wge8iGZbJiHQNbzQ-hfmN9FRw",
    authDomain: "strandbags-99511.firebaseapp.com",
    projectId: "strandbags-99511",
    storageBucket: "strandbags-99511.appspot.com",
    messagingSenderId: "777291477542",
    appId: "1:777291477542:web:a7f69e365485365c6eece7"
};

console.log(firebase);

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();