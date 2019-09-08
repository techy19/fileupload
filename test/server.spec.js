let chai = require("chai");
let chaiHttp = require("chai-http");
const fse = require("fs-extra");
const { server, pgClient } = require("../server");

chai.use(chaiHttp);

describe("Test Server file", () => {
  it("Should upload file  successfully", done => {
    pgClient.query("delete from dictionary").then(data => {
      chai
        .request("http://localhost:5001")
        .post("/file")
        .attach("file", "./test/fileupload1.txt")
        .end((err, res) => {
          if (err) {
            console.log(err);
            done(err);
          } else {
            chai.expect(res.status).to.equal(200);
            chai
              .expect(fse.existsSync("uploads/fileupload1.txt"))
              .to.equal(true);
          }
          done();
        });
    });
  });
  it("Should return false for non existing word", done => {
    chai
      .request("http://localhost:5001")
      .get("/search?word=spanish")
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          chai.expect(res.status).to.equal(200);
          chai.expect(res.body.message).to.equal(false);
          done();
        }
      });
  });
  it("Should return true for an existing word", done => {
    chai
      .request("http://localhost:5001")
      .get("/search?word=vision")
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          chai.expect(res.status).to.equal(200);
          chai.expect(res.body.message).to.equal(true);
          done();
        }
      });
  });
  it("Should return error for non existing route", done => {
    chai
      .request("http://localhost:5001")
      .get("/search232?word=vision")
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          chai.expect(res.status).to.equal(500);
          chai.expect(res.body.error).to.not.empty;
          done();
        }
      });
  });
  it("Should return error if DB constraint is violated", done => {
    chai
      .request("http://localhost:5001")
      .post("/file")
      .attach("file", "./test/fileupload1.txt")
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          chai.expect(res.status).to.equal(500);
          done();
        }
      });
  });
  it("Should return error if file not in request", done => {
    chai
      .request("http://localhost:5001")
      .post("/file")
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          chai.expect(res.status).to.equal(500);
          done();
        }
      });
  });
});

after(done => {
  pgClient.end();
  server().close(done);
});
