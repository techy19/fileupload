const { expect } = require("chai");
const { testData } = require("./testconstants");
const { client, insertData, searchData } = require("../db");

var pgClient;

before(done => {
  pgClient = client();
  pgClient
    .connect()
    .then(() => {
      pgClient.query("delete from dictionary").then(() => done());
    })
    .catch(console.log);
});

describe("Test DB  operations", () => {
  it("Should insert data into DB", async () => {
    await insertData(pgClient, testData.splice(0, 9));
    const result = await pgClient.query("Select * from dictionary");
    expect(result.rows.length).to.equal(9);
  });

  it("Should return true for given word", async () => {
    const result = await searchData(pgClient, "fox");
    expect(result).to.equal(true);
  });

  it("Should return false for given word", async () => {
    const result = await searchData(pgClient, "foxi");
    expect(result).to.equal(false);
  });

  it("Should throw error when client or data not not passed", async () => {
    try {
      await insertData(pgClient, []);
    } catch (err) {
      expect(err).to.equal("Invalid arguments recieved");
    }
  });

  it("Should throw error when client to data is not passed", async () => {
    try {
      await searchData(pgClient);
    } catch (err) {
      expect(err).to.equal("Invalid arguments recieved");
    }
  });

  it("Should throw error when there is an error from DB at insert", async () => {
    const localClient = client("postgres");
    try {
      await localClient.connect();
      await insertData(localClient, [["fox"]]);
    } catch (err) {
      expect(err).to.equal("Error from DB while executing the query");
    } finally {
      localClient.end();
    }
  });

  it("Should throw error when client to data is not passed", async () => {
    const localClient = client("postgres");
    try {
      await localClient.connect();
      await searchData(localClient, "fox");
    } catch (err) {
      expect(err).to.equal("Error from DB while executing the query");
    } finally {
      localClient.end();
    }
  });
});

after(done => {
  pgClient.query("delete from dictionary").then(() => {
    pgClient.end(done());
  });
});
