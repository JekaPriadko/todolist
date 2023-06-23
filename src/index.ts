import './assets/styles/index.scss';

import AuthUser from './assets/ts/auth';
import accordion from './assets/ts/accordion';
import DraggerLayout from './assets/ts/dragger';
import Sidebar from './assets/ts/sidebar';

document.addEventListener('DOMContentLoaded', (event) => {
  new AuthUser();
  accordion();
  new Sidebar();
  new DraggerLayout();
});

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAbiypeRHjkTTIQ56GfJMCUiD1l3LuI0is",
//   authDomain: "todolist-db86d.firebaseapp.com",
//   projectId: "todolist-db86d",
//   storageBucket: "todolist-db86d.appspot.com",
//   messagingSenderId: "88092534664",
//   appId: "1:88092534664:web:6d5a6aa0b3eea5081afc3d"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
