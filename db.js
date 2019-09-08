const { Client } = require("pg");
const config = require("config");
const format = require("pg-format");
const { INSERT_QUERY, BATCH_SIZE, FETCH_QUERY } = require("./constants");

const dbConfig = config.get("DB");

exports.client = db =>
  new Client({
    database: db || dbConfig.DB_NAME,
    host: dbConfig.DB_HOST,
    port: dbConfig.DB_PORT,
    user: dbConfig.DB_USER
  });

exports.insertData = function(client, valsArr) {
  return new Promise(async (resolve, reject) => {
    if (client && valsArr && valsArr.length > 0) {
      try {
        const promiseArr = [];
        while (valsArr.length > 0) {
          let elemToInsert = valsArr.splice(0, BATCH_SIZE);
          let query = format(INSERT_QUERY, elemToInsert);
          promiseArr.push(client.query(query));
        }
        await Promise.all(promiseArr);
        resolve();
      } catch (err) {
        reject("Error from DB while executing the query");
      }
    } else {
      reject("Invalid arguments recieved");
    }
  });
};

exports.searchData = function(client, word) {
  return new Promise((resolve, reject) => {
    if (!word || !client) {
      reject("Invalid arguments recieved");
      return;
    }
    let query = format(FETCH_QUERY, word);
    client
      .query(query)
      .then(data => {
        if (data.rows && data.rows.length > 0) {
          resolve(true);
          return;
        }
        resolve(false);
      })
      .catch(err => {
        console.error(err);
        reject("Error from DB while executing the query");
      });
  });
};
