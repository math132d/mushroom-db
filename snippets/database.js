const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/"

exports.init = function() {
            MongoClient.connect(url, (err, db) => {
                if (err) throw err;
        
                const dbo = db.db('mushrooms')
                dbo.createCollection('mushrooms', (err, res) => {
                    if (err) throw err;
                    console.log('mushrooms collection created!')
                    db.close()
                })

            })
        }

exports.connect = function(req, res, handler) {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        
        handler(req, res, db.db('mushrooms').collection('mushrooms'));

        db.close();
    })
}