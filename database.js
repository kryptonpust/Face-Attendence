var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.0",
  user: "face_user",
  password: "#ice",
  database: "face_db",
  charset : 'utf8mb4',
});

//INSERT INTO Users (ID, token, created_at) VALUES (NULL, '54545454544', current_timestamp());
getclassname = function(callback) {
  pool.getConnection(function(err, connection) {
    if (err) throw(err);
    connection.query(
      "SELECT * FROM classes",
      values,
      function(error, results, fields) {
        connection.release();
        if (error) throw(error);
        callback(results);
      }
    );
  });
};
createclass =function(callback, values) {
  pool.getConnection(function(err, connection) {
    if (err) throw(err);
    connection.query(
      "INSERT INTO `classes` (`id`, `name`, `date`) VALUES (NULL, ?, CURRENT_DATE());",
      values,
      function(error, results, fields) {
        connection.release();
        if (error) throw(error);
        callback(results);
      }
    );
  });
};

module.exports = {
  
};
