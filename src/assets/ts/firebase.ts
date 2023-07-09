import { initializeApp } from 'firebase/app';

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAbiypeRHjkTTIQ56GfJMCUiD1l3LuI0is',
  authDomain: 'todolist-db86d.firebaseapp.com',
  projectId: 'todolist-db86d',
  storageBucket: 'todolist-db86d.appspot.com',
  messagingSenderId: '88092534664',
  appId: '1:88092534664:web:6d5a6aa0b3eea5081afc3d',
};

// Initialize Firebase
export default initializeApp(firebaseConfig);
