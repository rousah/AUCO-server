
const calculateSociograph = (students, studentNames) => {
    console.log("Attempting to calculate sociogram from student responses");

    let nodes = [];
    let links = [];

    students.forEach((element, index) => {
        nodes.push({
            "id": studentNames[index].name + " " + studentNames[index].surname,
            "radius": 8,
            "depth": 1,
            "color": "rgb(253, 191, 77)"
        })
        // Find responses of sociograph questionnaire
        element.responses.forEach(response => {
            if (response.id_questionnaire == '60e176e5f30af506b843fa9c') {
                // Same error as always
                response = JSON.parse(JSON.stringify(response));

                // Delete other info of answer
                delete response._id;
                delete response.id_questionnaire;
                delete response.id_student;

                for (const indexQ in response) {
                    console.log(`${indexQ}: ${response[indexQ]}`);
                    // For positive questions: uneven numbers
                    if (indexQ % 2 != 0) {
                        if (response[indexQ][0] != null) {
                            links.push({
                                "source": studentNames[index].name + " " + studentNames[index].surname,
                                "target": response[indexQ][0],
                                "distance": 3
                            })
                        }
                        if (response[indexQ][1] != null) {
                            links.push({
                                "source": studentNames[index].name + " " + studentNames[index].surname,
                                "target": response[indexQ][1],
                                "distance": 2
                            })
                        }
                        if (response[indexQ][2] != null) {
                            links.push({
                                "source": studentNames[index].name + " " + studentNames[index].surname,
                                "target": response[indexQ][2],
                                "distance": 1
                            })
                        }
                    }
                    // For negative questions: even numbers
                    else {
                        if (response[indexQ][0] != null) {
                            links.push({
                                "source": studentNames[index].name + " " + studentNames[index].surname,
                                "target": response[indexQ][0],
                                "distance": -3
                            })
                        }
                        if (response[indexQ][1] != null) {
                            links.push({
                                "source": studentNames[index].name + " " + studentNames[index].surname,
                                "target": response[indexQ][1],
                                "distance": -2
                            })
                        }
                        if (response[indexQ][2] != null) {
                            links.push({
                                "source": studentNames[index].name + " " + studentNames[index].surname,
                                "target": response[indexQ][2],
                                "distance": -1
                            })
                        }
                    }
                }
            }
        });
    });

    let relationships = {
        "nodes": nodes,
        "links": links
    }

    return relationships;
}

module.exports.calculateSociograph = calculateSociograph;
