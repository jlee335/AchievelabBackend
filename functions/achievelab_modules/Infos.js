/* eslint-disable require-jsdoc */
const {getFirestore, doc, collection, getDocs, getDoc, setDoc, addDoc,
  updateDoc, increment, arrayUnion, query, where,
  orderBy, limit} = require("firebase/firestore");

const db = getFirestore();

function extractTeamNames(references) {
  return references.map((ref) => {
    // Split the reference string and get the last part (team name)
    const parts = ref.split("/");
    return parts[parts.length - 1];
  });
}

function extractUserNames(references) {
  return references.map((ref) => {
    // Split the reference string and get the last part (team name)
    const parts = ref.split("/");
    return parts[parts.length - 1];
  });
}

async function getUserInfo(userName) {
  const userRef = doc((collection(db, "users"), userName));
  const userDoc = await getDoc(userRef);
  const data = userDoc.data();
  return {
    "name": data.name,
    "progress": data.progress,
    "deposits": data.deposits,
    "social_credit": data.social_credit,
    "teams": extractTeamNames(data.team_refs),
  };
}

async function getTeamInfo(teamName) {
  const teamRef = doc((collection(db, "teams"), teamName));
  const teamDoc = await getDoc(teamRef);
  const data = teamDoc.data();
  return {
    "name": teamDoc.id,
    "description": data.description,
    "duration_start": data.duration_start,
    "members": extractUserNames(data.user_refs),
    "ranking": data.team_ranking,
    "total_points": data.total_points,
  };
}

async function userCredit(userName) {
  const userRef = doc(collection(db, "users"), userName);
  const userDoc = await getDoc(userRef);

  try {
    return userDoc.data().social_credit;
  } catch (error) {
    return "error";
  }
}

async function userTeamPoints(userName, teamName) {
  const userRef = doc(collection(db, "users"), userName);
  const userDoc = await getDoc(userRef);

  try {
    return userDoc.data().team_points[teamName];
  } catch (error) {
    return "error";
  }
}

async function userDeposits(userName, teamName) {
  const userRef = doc(collection(db, "users"), userName);
  const userDoc = await getDoc(userRef);

  try {
    return userDoc.data().deposits[teamName];
  } catch (error) {
    return "error";
  }
}

async function teamPoints(teamName) {
  const teamRef = doc(collection(db, "teams"), teamName);
  const teamDoc = await getDoc(teamRef);

  try {
    return teamDoc.data().total_points;
  } catch (error) {
    return "error";
  }
}

module.exports = {userCredit, userTeamPoints, userDeposits, teamPoints, getUserInfo, getTeamInfo};
