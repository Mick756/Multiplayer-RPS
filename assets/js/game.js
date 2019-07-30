var firebaseConfig = {
    apiKey: "AIzaSyDtS5bBbyl6-6_DW5wRuSpEcp6JBbINvb0",
    authDomain: "rock-paper-scissors-402db.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-402db.firebaseio.com/",
    projectId: "rock-paper-scissors-402db",
    storageBucket: "rock-paper-scissors-402db.appspot.com",
    messagingSenderId: "71324869487",
    appId: "1:71324869487:web:49ea66fe7aa93b14"
};
firebase.initializeApp(firebaseConfig);

let database = firebase.database();
let username = "Mick756";
let playerSlot = 1;

if (localStorage.getItem("rps-wins") === null) {
    localStorage.setItem("rps-wins", "0");
}
if (localStorage.getItem("rps-losses") === null) {
    localStorage.setItem("rps-losses", "0");
}
