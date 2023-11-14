/* eslint-disable require-jsdoc */
const {getFirestore, doc, runTransaction} = require("firebase/firestore");

const db = getFirestore();

/* Transaction amount of credit Team --> User */
async function transferTeamUser(userName, teamName, amount) {
  const userRef = doc(db, "users", userName);
  const teamRef = doc(db, "teams", teamName);

  return runTransaction(db, async (transaction) => {
    const user = await transaction.get(userRef);
    const team = await transaction.get(teamRef);

    // Check if user exists
    if (!user.exists) {
      throw Error("User does not exist!");
    }
    if (!team.exists) {
      throw Error("Team does not exist!");
    }
    // Check if team has enough deposit
    const teamDeposit = team.data().total_deposit;
    if (teamDeposit < amount) {
      throw Error("Team does not have enough deposit!");
    }

    // Update user deposit
    const userDeposit = user.data().deposits[teamName];
    const newUserDeposit = userDeposit + amount;
    transaction.update(userRef, {[`deposits.${teamName}`]: newUserDeposit});

    // Update team deposit
    const newTeamDeposit = teamDeposit - amount;
    transaction.update(teamRef, {total_deposit: newTeamDeposit});
  }).then(() => {
    console.log("Team --> User Transaction successfully committed!");
    return true;
  }).catch((error) => {
    console.log("Transaction failed: ", error);
    return false;
  });
}
/* Transaction amount of credit User --> Team */
async function transferUserTeam(userName, teamName, amount) {
  const userRef = doc(db, "users", userName);
  const teamRef = doc(db, "teams", teamName);

  return runTransaction(db, async (transaction) => {
    const user = await transaction.get(userRef);
    const team = await transaction.get(teamRef);

    console.log(user, team);

    // Check if user exists
    if (!user.exists) {
      throw new Error("User does not exist!");
    }
    if (!team.exists) {
      throw new Error("Team does not exist!");
    }
    // Check if user has enough deposit
    const userDeposit = user.data().deposits[teamName];
    if (userDeposit < amount) {
      throw new Error("User does not have enough deposit!");
    }

    // Update user deposit
    const newUserDeposit = userDeposit - amount;
    transaction.update(userRef, {[`deposits.${teamName}`]: newUserDeposit});

    // Update team deposit
    const teamDeposit = team.data().total_deposit;
    const newTeamDeposit = teamDeposit + amount;
    transaction.update(teamRef, {total_deposit: newTeamDeposit});
  }).then(() => {
    console.log("Uesr --> Team Transaction successfully committed!");
    return true;
  }).catch((error) => {
    console.log("Transaction failed: ", error);
    return false;
  });
}

module.exports = {transferTeamUser, transferUserTeam};
