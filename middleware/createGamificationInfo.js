// createGamificationInfo.js

const createGamificationInfo = (studentId) => {

    let gamificationInfo = {
        id_student: studentId,
        score: 0,
        level: 1
    }
    return gamificationInfo;
}

module.exports.createGamificationInfo = createGamificationInfo;