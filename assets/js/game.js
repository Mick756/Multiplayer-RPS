let firebaseConfig = {
    apiKey: "AIzaSyDtS5bBbyl6-6_DW5wRuSpEcp6JBbINvb0",
    authDomain: "rock-paper-scissors-402db.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-402db.firebaseio.com/",
    projectId: "rock-paper-scissors-402db",
    storageBucket: "rock-paper-scissors-402db.appspot.com",
    messagingSenderId: "71324869487",
    appId: "1:71324869487:web:49ea66fe7aa93b14"
};
firebase.initializeApp(firebaseConfig);

displayJoinButton();

let database = firebase.database();
let users = 0;
let joined = false;
let username;
let enemy = -1;
let selecting = true;
let selection = "N";
let wins = 0;
let losses = 0;

database.ref('game-data').on("value", function(snapshot) {
    let $playersConnected = $(".players-connected");
    if (snapshot.child("users").exists()) {
        users = snapshot.val().users;
        $playersConnected.text("Players Connected: " + users);
    } else {
        $playersConnected.text("Players Connected: " + users);
    }
});

database.ref('players').on("value", function(snapshot) {
    if (enemy === -1 && joined) {
        snapshot.forEach(snap => {
            let val = snap.val();
            if (val.playing === true && val.name !== username) {
                enemy = val.name;
                console.log(enemy);
            }
        });
    } else if (enemy !== -1 && joined) {
        snapshot.forEach(snap => {
            let val = snap.val();
            if (val.name === enemy) {
                if (val.selection !== "N" && selection !== "N") {
                    let result = getWinner(selection.toLowerCase(), val.selection.toLowerCase());
                    if (result === 0) {
                        alert("It was a tie!");
                        selecting = true;
                        selection = "N";
                    } else if (result === 1) {
                        alert("You won that round!");
                        selecting = true;
                        selection = "N";
                        wins += 1;
                    } else if (result === 2) {
                        alert("You lost that round!");
                        selecting = true;
                        selection = "N";
                        losses += 1;
                    }
                    database.ref('players/' + username).update({
                        selection: selection,
                        wins: wins,
                        losses: losses,
                    });
                }
            }
        });
    }
});

window.onbeforeunload = function() {
    if (joined) {
        users -= 1;
        database.ref('game-data').update({
            users: users,
        });

        database.ref('players/' + username).update({
            playing: false,
            selection: "N"
        });
    }
};

$(document).on("click", ".joinButton", function() {
    if (users < 2) {
        $(this).hide();
        displayGame();
        username = prompt("What will your username be?") || "Noob";
        users += 1;
        joined = true;
        database.ref('game-data').set({
            users: users,
        });
        database.ref('players/' + username).once("value", function(snapshot) {
            if (!snapshot.exists()) {
                database.ref('players/' + username).set({
                    name: username,
                    playing: true,
                    selection: "N",
                    wins: 0,
                    losses: 0,
                });
            } else {
                database.ref('players/' + username).update({
                    playing: true,
                    selection: "N",
                });
                alert("Welcome back!");
            }
            snapshot.forEach(snap => {
                let val = snap.val();
                if (snap.name === username) {
                    selection = val.selection;
                    wins = val.wins;
                    losses = val.losses;
                }
            });
        });
        findEnemy();
    } else {
        alert("Sorry, two players are already connected! Wait for one to leave.")
    }
});

$(document).on("click", ".option", function() {
    if (selecting) {
        selecting = false;
        let newSelection = $(this).attr("choice");
        selection = newSelection;
        console.log(selection);
        database.ref('players/' + username).update({
            selection: selection,
        });
        alert("You chose: " + (newSelection === "R" ? "Rock" : (newSelection === "P" ? "Paper" : (newSelection === "S" ? "Scissors" : ""))) + "!");
    }
});

function findEnemy() {
    database.ref('players').once("value", function(snapshot) {
        if (enemy === -1 && joined) {
            snapshot.forEach(snap => {
                let val = snap.val();
                if (val.playing === true && val.name !== username) {
                    enemy = val.name;
                    console.log(enemy);
                }
            });
            if (enemy === -1) {
                alert("No enemy found. Sorry.")
            }
        }
    });
}

// 0=tie 1=player1 2=player2
function getWinner(playerChoice1, playerChoice2) {
    if (playerChoice1 === 'r') {
        if (playerChoice2 === 'r') {
            return 0;
        } else if (playerChoice2 === 'p') {
            return 2;
        } else if (playerChoice2 === 's') {
            return 1;
        }
    } else if (playerChoice1 === 'p') {
        if (playerChoice2 === 'r') {
            return 1;
        } else if (playerChoice2 === 'p') {
            return 0;
        } else if (playerChoice2 === 's') {
            return 2;
        }
    } else if (playerChoice1 === 's') {
        if (playerChoice2 === 'r') {
            return 2;
        } else if (playerChoice2 === 'p') {
            return 1;
        } else if (playerChoice2 === 's') {
            return 0;
        }
    }
    return 0;
}

function displayJoinButton() {
    let $button = $("<button>");
    $button.addClass("joinButton");
    $button.text("Join the game!");
    $(".game").append($button);
}

function displayGame() {
    let $rock = $("<img>").attr("src", "assets/images/Rock.png").addClass("choicePicture");
    let $paper = $("<img>").attr("src", "assets/images/Paper.jpg").addClass("choicePicture");
    let $scissors = $("<img>").attr("src", "assets/images/Scissors.png").addClass("choicePicture");
    let $rockButton = $("<button>").addClass("option").attr("choice", "R").append($rock);
    let $paperButton = $("<button>").addClass("option").attr("choice", "P").append($paper);
    let $scissorsButton = $("<button>").addClass("option").attr("choice", "S").append($scissors);
    // let $chatbox = $("<div>").addClass("chatbox");
    // let $chatInputContainer = $("<div>");
    // let $chatInput = $("<input>").addClass("chatInput");
    // let $chatInputButton = $("<button>").addClass("chatInputButton").text("Send Chat");
    //$(".game").append($rockButton, $paperButton, $scissorsButton, $chatbox, $chatInputContainer.append($chatInput, $chatInputButton));
    $(".game").append($rockButton, $paperButton, $scissorsButton);
}
