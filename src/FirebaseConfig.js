import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCpazfz92YtB4GJF8FstlaISQpESLiqp-Q',
    authDomain: 'list-project-72696.firebaseapp.com',
    databaseURL: 'https://list-project-72696-default-rtdb.firebaseio.com',
    projectId: 'list-project-72696',
    storageBucket: 'list-project-72696.appspot.com',
    messagingSenderId: '898539254457',
    appId: '1:898539254457:web:ae8fa9768d1af21083a168',
    measurementId: 'G-08SCE11N4X'
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = getAuth(app);
const functions = getFunctions();

export { database, auth, functions };
