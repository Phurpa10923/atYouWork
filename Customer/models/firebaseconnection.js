const firebase=require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyCJCDVwBYkSiR4hZ1e_jEDSusIgVKjn2Hg",
    authDomain: "atyourdoor-2182d.firebaseapp.com",
    databaseURL: "https://atyourdoor-2182d-default-rtdb.firebaseio.com",
    projectId: "atyourdoor-2182d",
    storageBucket: "gs://atyourdoor-2182d.appspot.com",
    messagingSenderId: "146734259860",
    appId: "1:146734259860:web:3223036ea0524c95f21e81"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  
module.exports=firebase;