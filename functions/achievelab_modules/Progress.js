const { getFirestore, doc, collection, getDoc, updateDoc } = require("firebase/firestore");
const admin = require("firebase-admin");

const db = getFirestore();

const { setTier } = require("./SetTier");


const doesMappingExist = async (userName, date, teamName) => {
    const userRef = doc(db, 'users', userName);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        const progressMap = userDoc.data().progress || {};
        const dateMap = progressMap[date] || {};
        return (dateMap[teamName] != undefined);
    } else {
        console.error(`${userName} does not exist`)
    }
}

async function addProgressMapping(userName, date, teamName, result) {
    try {
        const userRef = doc(db, 'users', userName);
        const teamRef = doc(db, 'teams', teamName);
        const userDoc = await getDoc(userRef);
        const teamDoc = await getDoc(teamRef);
        const MappingExist = await doesMappingExist(userName, date, teamName);
        if (MappingExist) {
            console.error("same mapping already exists");
        } else {
            if (userDoc.exists() && teamDoc.exists()) {
                const progress = userDoc.data().progress || {};
                const dateMap = progress[date] || {};
                dateMap[teamName] = result;

                // Update the user document with the new progress map
                await updateDoc(userRef, { [`progress.${date}`]: dateMap });

                console.log(`Progress mapping added successfully for user ${userName} on ${date} for team ${teamName}.`);
                const teamPts = await teamDoc.data().team_points[userName];
                const increment = await teamDoc.data().increment;
                const decrement = await teamDoc.data().decrement;
                const totalPoints = await teamDoc.data().total_points;
                if (result == 'success') {
                    await updateDoc(teamRef, {
                        [`team_points.${userName}`]: teamPts + increment,
                        total_points: totalPoints + increment,
                    })
                    await updateDoc(userRef, {
                        [`team_points.${teamName}`]: teamPts + increment,
                    })
                } else {
                    const current_deposit = userDoc.data().deposits[teamName];
                    const deduction_deposit = teamDoc.data().deduction_deposit;
                    if (current_deposit < deduction_deposit) {
                        console.log("OUT !!!!!!!!!!!!!!!!!!!!");
                        await updateDoc(userRef, {
                            [`deposits.${teamName}`]: 0,
                            [`team_points.${teamName}`]: teamPts - decrement,
                        })
                        await updateDoc(teamRef, {
                            [`team_points.${userName}`]: teamPts - decrement,
                            total_points: totalPoints - decrement,
                        })
                    } else {
                        await updateDoc(userRef, {
                            [`deposits.${teamName}`]: current_deposit - deduction_deposit,
                            [`team_points.${teamName}`]: teamPts - decrement,
                        })
                        await updateDoc(teamRef, {
                            [`team_points.${userName}`]: teamPts - decrement,
                            total_points: totalPoints - decrement,
                        })
                    }
                }
                setTier(userName);
            } else {
                console.log(`User ${userName} does not exist.`);
            }
        }
    } catch (error) {
        console.error('Error adding progress mapping:', error);
    }
}

module.exports = { setTier, doesMappingExist, addProgressMapping };