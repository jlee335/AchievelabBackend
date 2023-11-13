const { getFirestore, doc, collection, getDocs, getDoc, setDoc, addDoc,
    updateDoc, increment, arrayUnion, query, where,
    orderBy, limit } = require("firebase/firestore");

const db = getFirestore();

async function userCredit(userName) {
    const userRef = doc(collection(db, "users"), userName);
    const userDoc = await getDoc(userRef);

    try {
        return userDoc.data().social_credit
    } catch (error) {
        return "error"
    }
}

async function userTeamPoints(userName, teamName) {
    const userRef = doc(collection(db, "users"), userName);
    const userDoc = await getDoc(userRef);

    try {
        return userDoc.data().team_points[teamName];
    } catch (error) {
        return "error"
    }
}

async function userDeposits(userName, teamName){
    const userRef = doc(collection(db, "users"), userName);
    const userDoc = await getDoc(userRef);

    try {
        return userDoc.data().deposits[teamName];
    } catch (error) {
        return "error"
    }
}

async function teamPoints(teamName) {
    const teamRef = doc(collection(db, "teams"), teamName);
    const teamDoc = await getDoc(teamRef);

    try {
        return teamDoc.data().total_points;
    } catch (error) {
        return "error"
    }
}

module.exports = { userCredit, userTeamPoints, userDeposits, teamPoints };