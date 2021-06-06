const readXlsxFile = require('read-excel-file/node');
const convertToJson = require('read-excel-file/schema');

const studentSchema = {
    'Nombre': {
        prop: 'name',
        type: String,
        required: true
    },
    'Apellido': {
        prop: 'surname',
        type: String,
        required: true
    },
};

const readXlsx = (file) => {
    console.log("Reading excel file");
    try {
        const rows = readXlsxFile(file.path).then((rows) => {
            // `data` is an array of rows, each row being an array of cells.
            // `schema` is a "to JSON" convertion schema
            const objects = convertToJson(rows, studentSchema)
            return objects['rows'];
        })
    }
    catch (err) {
        console.log("Error reading excel file: " + err);
        throw err;
    }
    return rows
}

module.exports.readXlsx = readXlsx;
