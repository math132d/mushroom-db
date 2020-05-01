const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/"

exports.init = function() {
            MongoClient.connect(url, (err, mcl) => {
                if (err) throw err;
        
                const db = mcl.db('mushrooms');

                db.createCollection('mushrooms', (err, res) => {
                    if (err) throw err;
                    console.log(res)
                    mcl.close()
                });
            })
        }

exports.connect = function(query) {
    MongoClient.connect(url, (err, mcl) => {
        if (err) throw err;
        
        mcl.db('mushrooms').collection('mushrooms', (err, collection) => {
            if (err) throw err;

            query(collection);
        })

        mcl.close();
    })
}