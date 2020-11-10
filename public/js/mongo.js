let MongoClient = require('mongodb').MongoClient;
const config = require('./config');

MongoClient.connect("mongodb://localhost/"+config.db, function(err, client) {
  if (err) { return console.dir(err); }
  console.log("CONNECTED!");
  const db = client.db(config.db);
  db.collection("users", function(err, collection) {
    if (err) { return console.dir(err); }
    let docs = [
      // DBにレコード挿入
      // { session_id: "セッションIDが入る", score: 99 },
    ];
    collection.insertMany(docs, function(err, result) {
      if (err) { return console.dir(err); }
      console.dir(result);
    });
    // 表示する
    let stream = collection.find().stream();
    stream.on("data", function(item) {
      console.log(item);
    });
    stream.on("end", function() {
      console.log("FINISHED!!!!!!");
    });
  });
});

// レコード挿入と鍾乳結果表示コマンドは　$ node public/js/mongo.js