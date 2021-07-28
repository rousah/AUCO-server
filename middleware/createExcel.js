var xl = require('excel4node');

const createExcel = async (students) => {
    console.log("Attempting to create excel file with student information");

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1');

    // Add titles to cells A1-D1
    ws.cell(1, 1).string('Nombre');
    ws.cell(1, 2).string('Apellidos');
    ws.cell(1, 3).string('Usuario');
    ws.cell(1, 4).string('Contraseña');

    for (let i = 0; i < students.length; i++) {
        ws.cell(i + 2, 1).string(students[i].name);
        ws.cell(i + 2, 2).string(students[i].surname);
        ws.cell(i + 2, 3).string(students[i].username);
        ws.cell(i + 2, 4).string(students[i].openPassword);
    }

    console.log("Attempting to save excel file with student information");

    wb.write('resources/Students.xlsx');
}

module.exports.createXlsxWithStudents = createExcel;
