# AchieveLab Backend
This is the backend implementation for Achievelab App. 
Firebase-functions is used to handle complex logic, or periodic events.

### Structure Overview

**Achievelab Modules**
* Chat.js : Backend related to chatroom feature
* Infos.js : Contains helper functions
* Payback.js : Contains logic related to payback events after challenge is over
* Ranking.js : Contains logic related to user ranking
* reset.js : Contains logic related to re-setting team state after challenge ends.
* SetTier.js : Helper function w.r.t tier system
* Signup.js : Signup-related functions
* Teams.js : Join/Make team related functions

**Main**
* index.js : Main entrypoint for firebase functions. 

### Deployment
Deployment to the firebase function can be done by the instruction below:
```
firebase deploy --only functions
```