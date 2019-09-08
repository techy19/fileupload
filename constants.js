exports.BATCH_SIZE = 10000;
exports.INSERT_QUERY = "INSERT INTO dictionary (word) VALUES %L";
exports.FETCH_QUERY = "SELECT * from dictionary where word=%L";
exports.DB_DETAILS = {
  host: "localhost",
  database: "excercises",
  user: "postgres"
};

exports.beautifyElem = (elem, dataMap) => {
  const beautifiedElem = elem
    .replace(/[!.;'"`[\]\\~_:'/,@#$%^*?()]/g, "")
    .toLowerCase()
    .slice(0, 50);
  if (!dataMap[beautifiedElem]) {
    dataMap[beautifiedElem] = [beautifiedElem];
  }
};
