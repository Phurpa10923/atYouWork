const sql = require("mysql");

var sqlConnection = sql.createConnection({

    host: "sql6.freemysqlhosting.net",
    user: "sql6438077",
    password: "z9DqFTgiPy",
    database: "sql6438077",
    multipleStatements: true
});

sqlConnection.connect((err) => {

    if (!err) {
        console.log("Mysql Database Server running");
    } else console.log("Mysql Connection Failed");
});

module.exports = sqlConnection;