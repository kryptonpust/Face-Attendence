var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const path = require("path");
const fs = require("fs");
var http = require("http").Server(app);

var mysql = require("mysql");

var hat = require("hat").rack();

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "172.17.0.2",
  user: "face_user",
  password: "#ice",
  database: "face_db",
  charset: "utf8mb4",
  timezone: "utc"
});

app.use(bodyParser.json({ limit: "50MB" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use(express.static(path.join(__dirname, 'node_modules/face-api.js/dist')))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/dist/index.html");
});

app.get("/detect", function(req, res) {
  res.sendFile(__dirname + "/views/detect.html");
});

app.post("/api/deleteclass", function(req, res) {
  var id = req.body.id;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query("DELETE FROM `classes` WHERE `id`=?;", [id], function(
      error,
      results,
      fields
    ) {
      connection.release();
      if (error) throw error;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          title: "Deleted",
          type: "success",
          message: "Class deleted"
        })
      );
    });
  });
});
app.post("/api/class", function(req, res) {
  var name = req.body.name;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(
      "INSERT INTO `classes` (`id`, `name`, `date`) VALUES (NULL, ?, CURRENT_DATE());",
      [name],
      function(error, results, fields) {
        connection.release();
        if (error) throw error;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            title: "Created",
            type: "success",
            message: "New class created"
          })
        );
      }
    );
  });
});

app.post("/api/result", function(req, res) {
  var c_id = req.body.cid;
  var s_id = req.body.sid;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(
      "SELECT * FROM `present` WHERE `class_id` = ? AND `student_id` =?;",
      [c_id, s_id],
      function(error, results, fields) {
        connection.release();
        if (error) throw error;
        if (results.length == 0) {
          pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
              "INSERT INTO `present`(`id`, `class_id`, `student_id`) VALUES (NULL,?,?)",
              [c_id, s_id],
              function(error, results, fields) {
                connection.release();
                if (error) throw error;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    title: "Created",
                    type: "success",
                    message: "Successfully registered"
                  })
                );
              }
            );
          });
        } else {
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              title: "Exist",
              type: "warn",
              message: "Already registered"
            })
          );
        }
      }
    );
  });
});
app.get("/api/class", function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query("SELECT * FROM `classes`;", function(
      error,
      results,
      fields
    ) {
      connection.release();
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(results));
    });
  });
});
app.get("/api/students", function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query("SELECT * FROM `students`;", function(
      error,
      results,
      fields
    ) {
      connection.release();
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(results));
    });
  });
});

app.get("/api/present/:studentid", function(req, res) {
  var id = req.params.studentid;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(
      "SELECT * FROM `present` WHERE student_id=?;",
      [id],
      function(error, results, fields) {
        connection.release();
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(results));
      }
    );
  });
});

var root = __dirname + "/public";
app.post("/upload", function(req, res) {
  console.log("Updating.....madel");
  var name = req.body.name;
  var imgs = req.body.imgs;
  console.log(name);
  res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({text:"bla"}));
  if (!fs.existsSync(root + "/models/" + name)) {
    fs.mkdirSync(root + "/models/" + name);
  }
  insertname(name);
  imgs.forEach((element, index) => {
    if (element.includes("image/")) {
      let mime = element.substring(
        "data:image/".length,
        element.indexOf(";base64")
      );
      if (mime.includes("+")) {
        mime = mime.substring(0, mime.indexOf("+"));
      }
      let base64Image = element.split(";base64,").pop();
      var dbname = "/models/" + name + "/" + hat() + "." + mime;
      insertdb(name, dbname);
      fs.writeFile(root + dbname, base64Image, { encoding: "base64" }, function(
        err
      ) {
        console.log("File creation successful");
      });
    }
  });
});
insertname = function(name) {
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(
      "SELECT id FROM `students` WHERE `name` =?;",
      [name],
      function(error, results, fields) {
        connection.release();
        if (error) throw error;
        if (!results.length) {
          pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
              "INSERT INTO `students` (`id`, `name`) VALUES (NULL, ?);",
              [name],
              function(error, results, fields) {
                connection.release();
                if (error) throw error;
                console.log("name added to db");
              }
            );
          });
        }
      }
    );
  });
};
insertdb = function(name, url) {
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(
      "INSERT INTO `images` (`id`, `name`,`url`) VALUES (NULL, ?,?);",
      [name, url],
      function(error, results, fields) {
        connection.release();
        if (error) throw error;
        console.log("image added to db");
      }
    );
  });
};

app.get("/api/images/:studentname", function(req, res) {
  var id = req.params.studentname;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query("SELECT `url` FROM `images` WHERE name=?;", [id], function(
      error,
      results,
      fields
    ) {
      connection.release();
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(results));
    });
  });
});

http.listen(4000, function() {
  console.log("listening on 4000");
});
