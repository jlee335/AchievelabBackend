

// 이미 signup 되어있음
// signUp("jhjhjhjh@gmail.com", "jh31471375@", "jh")
// signUp("cmcmcmcmcmcmcm@gmail.com", "jh31471375@", "cm")
// signUp("jhjhjhjhjhjhjhjh@gmail.com", "jh31471375@", "hj")


/*
테스트 방법
1. firestore 들어가서
    - teams collection 전부 삭제
    - users collection 들어가서 progress, team_refs 필드 삭제
2. 아래 코드 주석해제하고 실행 (js만 따로 실행하는 법을 몰라서 index.html 새로고침으로 했습니다..)
*/

// await newTeam("jh", "crazy running", ["rule 1", "rule 2"], "this is crazy running");
// await newTeam("cm", "extreme running", ["extreme rule 1", "extreme rule 2"], "this is");
// await newTeam("hj", "running running", ["rule 1", "rule 2"], "hahaha");
// await joinTeam("jh", "extreme running");
// await joinTeam("cm", "crazy running");
// await joinTeam("hj", "crazy running");
// await addProgressMapping('jh', '2023-11-01', 'crazy running', 'success');
// await addProgressMapping('jh', '2023-11-02', 'crazy running', 'success');
// await addProgressMapping('jh', '2023-11-03', 'crazy running', 'fail');
// await addProgressMapping('jh', '2023-11-04', 'crazy running', 'success');
// await addProgressMapping('jh', '2023-11-05', 'crazy running', 'success');
// await addProgressMapping('jh', '2023-11-06', 'crazy running', 'fail');
// await addProgressMapping('jh', '2023-11-07', 'crazy running', 'success');
// await addProgressMapping('cm', '2023-11-01', 'crazy running', 'success');
// await addProgressMapping('cm', '2023-11-02', 'crazy running', 'success');
// await addProgressMapping('cm', '2023-11-03', 'crazy running', 'fail');
// await addProgressMapping('cm', '2023-11-04', 'crazy running', 'success');
// await addProgressMapping('hj', '2023-11-01', 'crazy running', 'success');
// await addProgressMapping('hj', '2023-11-02', 'crazy running', 'success');
// await addProgressMapping('hj', '2023-11-03', 'crazy running', 'success');
// await addProgressMapping('hj', '2023-11-04', 'crazy running', 'success');
// await addProgressMapping('jh', '2023-11-01', 'extreme running', 'success');
// await addProgressMapping('cm', '2023-11-01', 'extreme running', 'success');
// await addProgressMapping('hj', '2023-11-01', 'running running', 'success');

// const rankingResult = await ranking('crazy running')
// console.log(rankingResult)
// const crazyRanking = await getTeamRanking('crazy running');
// const top2Ranking = await getTopNRanking(2);
// console.log(crazyRanking);
// console.log(top2Ranking);
