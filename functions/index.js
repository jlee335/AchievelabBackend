/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { handleSignUp, handleSignIn } = require("./achievelab_modules/Signup");


// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
// const {onDocumentCreated} = require("firebase-functions/v2/firestore");s

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
// const {getFirestore} = require("firebase-admin/firestore");
// const {getAuth} = require("firebase-admin/auth");

initializeApp();

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