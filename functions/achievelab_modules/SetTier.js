const { getFirestore, doc, collection, getDocs, getDoc, setDoc, addDoc,
    updateDoc, increment, arrayUnion, query, where,
    orderBy, limit } = require("firebase/firestore");


const db = getFirestore();


async function setTier(userName) {
    const userRef = doc(collection(db, 'users'), userName);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        let score = userDoc.data().social_credit;
        for (const [team, deposit] of Object.entries(userDoc.data().deposits)) {
            score += deposit;
        }
        let tier;
        if (score <= 100) tier = 'Iron';
        else if (score <= 200) tier = 'Bronze';
        else if (score <= 400) tier = 'Silver';
        else if (score <= 600) tier = 'Gold';
        else if (score <= 800) tier = 'Platinum';
        else if (score <= 1000) tier = 'Emerald';
        else if (score <= 1200) tier = 'Diamond';
        else if (score <= 1400) tier = 'Master';
        else if (score <= 1600) tier = 'GrandMaster';
        else tier = 'Challenger';
        await updateDoc(userRef, { tier: tier });;
    }
    else {
        console.error(`no user named ${userName}`)
    }
}
module.exports = { setTier };