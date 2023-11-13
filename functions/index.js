/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
// const {onDocumentCreated} = require("firebase-functions/v2/firestore");s

// The Firebase Admin SDK to access Firestore.
// const { initializeApp } = require("firebase-admin/app");
// const {getFirestore} = require("firebase-admin/firestore");
// const {getAuth} = require("firebase-admin/auth");

const { initializeApp } = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyDgXIlbNj-LheKdER9a29ZDJO20Ik6lCOw",
    authDomain: "achievalab-hifi.firebaseapp.com",
    databaseURL: "https://achievalab-hifi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "achievalab-hifi",
    storageBucket: "achievalab-hifi.appspot.com",
    messagingSenderId: "862067171806",
    appId: "1:862067171806:web:185cca6c85fb0bb81dbd4f",
    measurementId: "G-DBKZ3NHNCL"
};
const app = initializeApp(firebaseConfig);


const { handleSignUp, handleSignIn } = require("./achievelab_modules/Signup");
const { newTeam, joinTeam } = require("./achievelab_modules/Teams");
const { addProgressMapping } = require("./achievelab_modules/Progress");
const { ranking, getTeamRanking, getTopNRanking } = require("./achievelab_modules/Ranking");
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("hahaha!!");
});

// Signup

exports.handleSignUp = onRequest((request, response) => {
    // Extract the email and password from the POST request.
    console.log(request.body);
    const email = request.body.email;
    const password = request.body.password;
    const name = request.body.name;
    // Call the `handleSignUp` function from the `Signup` module.
    handleSignUp(email, password, name);
    // Return a JSON response.
    response.json({ result: "success" });
});

exports.handleSignIn = onRequest((request, response) => {
    // Extract the email and password from the POST request.
    console.log(request.body);
    const email = request.body.email;
    const password = request.body.password;
    // Call the `handleSignUp` function from the `Signup` module.
    handleSignIn(email, password);
    // Return a JSON response.
    response.json({ result: "success" });
});

exports.newTeam = onRequest((request, response) => {
    // Extract the email and password from the POST request.
    console.log(request.body);
    const userName = request.body.userName;
    const teamName = request.body.teamName;
    const rules = request.body.rules;
    const description = request.body.description;
    const entry_deposit = request.body.entry_deposit;
    // Call the `handleSignUp` function from the `Signup` module.
    newTeam(userName, teamName, rules, description, entry_deposit);
    // Return a JSON response.
    response.json({ result: "success" });
});

exports.joinTeam = onRequest((request, response) => {
    // Extract the email and password from the POST request.
    console.log(request.body);
    const userName = request.body.userName;
    const teamName = request.body.teamName;
    // Call the `handleSignUp` function from the `Signup` module.
    joinTeam(userName, teamName);
    // Return a JSON response.
    response.json({ result: "success" });
});


/* Ranking and progress */

exports.addProgressMapping = onRequest((request, response) => {
    const userName = request.body.userName;
    const date = request.body.date; // new Date().toISOString().split('T')[0]
    const teamName = request.body.teamName;
    const result = request.body.result; // 'success' or 'failure'

    addProgressMapping(userName, date, teamName, result);
    response.json({ add_progress: "success" });
})

exports.ranking = onRequest((request, response) => {
    const teamName = request.body.teamName;
    response.json({ in_team_ranking: ranking(teamName) });
})

exports.getTeamRanking = onRequest((request, response) => {
    const teamName = request.body.teamName;
    response.json({ team_ranking: getTeamRanking(teamName) });
})

exports.getTopNRanking = onRequest((request, response) => {
    const numTeams = request.body.numTeams;
    response.json({ topNranking: getTopNRanking(numTeams) });
})

