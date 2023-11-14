const { getFirestore } = require("firebase/firestore");
const { getDatabase } = require('firebase/database');

const database = getDatabase();
function addChat(userName, teamName, message) {
    const chatRef = database.ref(`chats/${teamName}`);
    chatRef.push({
        user: userName,
        message: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}
function getChats(teamName, callback) {
    const chatRef = database.ref(`chats/${teamName}`);

    chatRef.on('value', (snapshot) => {
        const chats = [];
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const chat = [data.user, data.message];
            chats.push(chat);
        });
        callback(chats);
    });
}

// addChat("user1", "teamA", "Hello, team A!");

// getChats("teamA", (chats) => {
//   console.log(chats);
// });

module.exports = { addChat, getChats };