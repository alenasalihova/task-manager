require('dotenv').config();
const mysql = require('mysql2');
// Create the connection to the database
const connection = mysql.createConnection(process.env.DATABASE_URL);
// simple query
connection.query(`
    CREATE TABLE tasks (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR (250),
        completed BOOLEAN DEFAULT false,
        PRIMARY KEY (id)
    )
`);
connection.end();