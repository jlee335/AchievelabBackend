/* eslint-disable require-jsdoc */
const {getFirestore, getDoc,
  doc, runTransaction} = require("firebase/firestore");

const db = getFirestore();

async function makeUserRecord(
    teamName,
    beginDate,
    endDate,
    entryDeposit,
    finalDeposit,
    userTeamPointContr,
) {
  const userRecord = {
    "teamName": teamName,
    "beginDate": beginDate,
    "endDate": endDate,
    "entryDeposit": entryDeposit,
    "finalDeposit": finalDeposit,
    "userTeamPointContr": userTeamPointContr,
  };
  return userRecord;
}

/*
Add record of users weekly result

NOTE: Please call this before actual payback function occurance
*/
async function addUserRecord(userRef, teamRef, transaction) {
  const userDoc = await getDoc(userRef);
  const teamDoc = await getDoc(teamRef);

  const teamName = teamDoc.data().name;
  const beginDateString = teamDoc.data().duration_start;
  const duration = teamDoc.data().duration;


  // Make endDate, which is beginDate + duration, as string
  const endDate = new Date(beginDateString);
  endDate.setDate(endDate.getDate() + duration);
  const endDateString = endDate.toISOString().slice(0, 10); // TODO: verify

  const entryDeposit = teamDoc.data().entry_deposit;
  const finalDeposit = userDoc.data().deposits[teamName];

  const userTeamPointContr = userDoc.data().team_points[teamName];
  const userRecord = await makeUserRecord(
      teamName,
      beginDateString,
      endDateString,
      entryDeposit,
      finalDeposit,
      userTeamPointContr,
  );

  // get existing user record list
  // If field does not exist, create empty list
  const userRecordList = userDoc.data().userRecord || [];

  // Add new record to the list
  userRecordList.push(userRecord);

  // Update user record list
  transaction.update(userRef, {
    "userRecord": userRecordList,
  });
}


/*
This function hanldles deposit payback from Team to User.
Data to consider
* users -> user -> deposits -> teamName  : 유저가 팀에게서 돌려받을 보증금
* users -> user -> team_points -> teamName : 보너스로 환산받을 팀 포인트
TODO: As this function works as transaction, get
TODO: transaction object as parameter and use it

*/
async function payBackTeam(teamRef, transaction) {
  const teamDoc = await getDoc(teamRef);
  const teamName = teamDoc.data().name;
  const teamMembers = teamDoc.data().team_refs;
  for (const memberRef of teamMembers) {
    const memberDoc = await getDoc(memberRef);
    const userDeposit = memberDoc.data().deposits[teamName];
    const teamPointsByUser = memberDoc.data().team_points[teamName];
    const socialCredit = memberDoc.data().social_credit;

    // Reset deposit to 0
    // Reset team points to 0
    // Pay back social credit

    transaction.update(memberRef, {
      social_credit: socialCredit + userDeposit + 10 * teamPointsByUser,
      [`deposits.${teamName}`]: 0, // TODO: User will pay back '100'...soon
      [`team_points.${teamName}`]: 0, // Team Point reset as well
      // TODO:
    });
  }
}

/*
* payBackTeam 직후에 불러짐
* User pays 100 social credit to team
*/
async function reAssignTeam(teamRef, transaction) {
  const shameList = [];

  const teamDoc = await getDoc(teamRef);
  const teamName = teamDoc.data().name;
  const teamMembers = teamDoc.data().team_refs;
  for (const memberRef of teamMembers) {
    const memberDoc = await getDoc(memberRef);
    const socialCredit = memberDoc.data().social_credit;

    // For users with social credits less than 100,
    // List of names will be returned by parent fn
    let resSocialCredit = socialCredit - 100;
    if (resSocialCredit < 0) {
      shameList.push(memberDoc.data().name);
      resSocialCredit = 0;
    }

    // Decrement social credit
    // Add deposit
    transaction.update(memberRef, {
      resSocialCredit,
      [`deposits.${teamName}`]: 100,
    });
  }
  return shameList;
}


async function resetTeam(teamName) {
  // Begin transaction
  const teamRef = doc(db, "teams", teamName);
  /* Run payback and reassignment */
  const shameList = await runTransaction(db, async (transaction) => {
    // For each user, add record of weekly result
    const teamDoc = await getDoc(teamRef);
    const teamMembers = teamDoc.data().team_refs;
    for (const memberRef of teamMembers) {
      await addUserRecord(memberRef, teamRef, transaction);
    }

    await payBackTeam(teamRef, transaction);
    const shameList = await reAssignTeam(teamRef, transaction);
    // Set team point to 0
    transaction.update(teamRef, {
      total_points: 0,
    });
    return shameList;
  });
  // TODO: Think about how we use this info..
  console.log(shameList);
}

module.exports = {
  resetTeam,
};
