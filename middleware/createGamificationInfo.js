// createGamificationInfo.js

const createGamificationInfo = (studentId) => {
    console.log("createGamificationInfo()");

    let gamificationInfo = {
        id_student: studentId,
        score: 0,
        level: 1
    }
    return gamificationInfo;
}

module.exports.createGamificationInfo = createGamificationInfo;