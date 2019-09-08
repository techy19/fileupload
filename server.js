const express = require("express");
const fs = require("fs");
const fse = require("fs-extra");
const multer = require("multer");
const readline = require("readline");
const OutStream = require("stream");
const { beautifyElem } = require("./constants");
const { client, insertData, searchData } = require("./db");
const app = express();

let pgClient;
let server;

!fse.existsSync("uploads") && fse.mkdirSync("uploads");
fse.emptyDirSync("uploads");

var uploadHandler = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "uploads");
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

app.get("/search", async (req, res) => {
  try {
    const result = await searchData(pgClient, req.query.word);
    res.send({ message: result });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error occurred while searching for word" });
  }
});

app.post("/file", uploadHandler.single("file"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    console.log("File not found");
    res.status(500).send({ error: "File not found in request" });
    return;
  }

  const readStream = fs.createReadStream(file.path);
  const stream = new OutStream();
  const rLine = readline.createInterface(readStream, stream);

  let dataMap = {};
  rLine.on("line", data => {
    try {
      rLine.pause();
      data.split(" ").forEach(elem => {
        if (elem) {
          beautifyElem(elem, dataMap);
        }
      });
      rLine.resume();
    } catch (err) {
      dataMap = undefined;
    }
  });
  rLine.on("close", async () => {
    let success = false;
    try {
      if (dataMap) {
        const vals = Object.values(dataMap);
        await insertData(pgClient, vals);
        success = true;
      }
    } catch (err) {
      console.log(err);
    } finally {
      success
        ? res.send({ message: "File uploaded successully" })
        : res.status(500).send({ error: "File upload errored" });
    }
  });
});

app.use(function(req, res, next) {
  throw new Error("Route not defined");
});

app.use(function(error, req, res, next) {
  res.status(500).json({ error: error.message });
});

pgClient = client();
pgClient
  .connect()
  .then(() => {
    server = app.listen("5001", () => {
      console.log(`Server started at port 5001`);
      app.emit("started");
    });
  })
  .catch(err => {
    console.log(err);
    console.log("Error occurred while starting ");
  });

module.exports = { server: () => server, pgClient };
