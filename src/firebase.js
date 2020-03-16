import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBoiq3GIescqOQZelaE2OvwV849BOgfWws",
    authDomain: "nba-practise-98108.firebaseapp.com",
    databaseURL: "https://nba-practise-98108.firebaseio.com",
    projectId: "nba-practise-98108",
    storageBucket: "nba-practise-98108.appspot.com",
    messagingSenderId: "220002054162",
    appId: "1:220002054162:web:831ef0d9b8c5c3bb9c68cb",
    measurementId: "G-SRTHBF32SG"
  };

  firebase.initializeApp(firebaseConfig);

  const firebaseDB=firebase.database();
  const firebaseArticles=firebaseDB.ref('articles');
  const firebaseTeams=firebaseDB.ref('teams');
  const firebaseVideos=firebaseDB.ref('videos');

  const firebaseLooper=(snapshot)=>{
    
            const data=[];
            snapshot.forEach((childSnapshot)=>{
                data.push({
                    ...childSnapshot.val(),
                    id:childSnapshot.key
                })
            });
            return data;
  }

  export {
      firebase,
      firebaseDB,
      firebaseArticles,
      firebaseVideos,
      firebaseTeams,
      firebaseLooper
  }