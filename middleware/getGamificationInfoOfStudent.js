const Class = require('../models/Class');

const getGamificationInfoOfStudent = async (studentId) => {

    // Query for student
    const query = { "students.id_student": studentId };

    // Return only student with this studentid
    const projection = { _id: 0, "students": { $elemMatch: { "id_student": studentId } } };

    // Gettings student
    const aStudent = await Class.find(query, projection);

    if (aStudent) {
        student = aStudent[0].students[0];
        console.log("Found student gamification for " + studentId);
        return student;
    }
    else {
        console.log("No student gamification found");
        return res.status(400).send("No student gamification for this studentId");
    }
}

module.exports.getGamificationInfoOfStudent = getGamificationInfoOfStudent;