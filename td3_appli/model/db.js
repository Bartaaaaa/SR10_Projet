var mysql = require("mysql");
var pool = mysql.createPool({
host: "tuxa.sme.utc", //ou localhost
user: "sr10p021",
password: "U5y8qUq0VYuC",
database: "sr10p021"
});
module.exports = pool;
