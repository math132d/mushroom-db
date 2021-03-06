const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const fuzzy = require('fuzzy');

const connect = require('./snippets/database').connect;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.get("/mushrooms", (req, res) => {
    connect((collection) => {
        res_data = collection.find({}).toArray((err, result) => {
            if (err) console.error(err);
            res.json(result);
        });
    });
});

app.get("/mushrooms/random", (req, res) => {
    connect((collection) => {
        res_data = collection.find({}).toArray((err, result) => {
            if (err) console.error(err);

            let random = Math.floor(Math.random() * result.length);

            res.json(result[random]);
        });
    });
});


app.get("/mushroom/:id", (req, res) => {
    connect((collection) => {
        res_data = collection.findOne({_id: new ObjectId(req.params.id)}, (err, result) => {
            if (err) console.error(err);
            res.json(result);
        });
    });
});

app.delete("/mushroom/:id", (req, res) => {
    connect((collection) => {
        res_data = collection.remove({_id: new ObjectId(req.params.id)}, {single: true},(err, result) => {
            if (err) console.error(err);
            res.json(result);
        });
    });
});

app.post("/mushroom/:id/comment", (req, res) => {
    connect((collection) => {
        comment = req.body;
        comment._id = new ObjectId();

        res_data = collection.updateOne({_id: new ObjectId(req.params.id)}, { $push: {comments: comment} }, (err, result) => {
            if (err) console.log(err);
            res.json(result);
        })
    });
});

app.post("/mushroom", (req, res) => {
    connect((collection) => {

        //TODO: Verify data is legal
        req_data = req.body;

        collection.insertOne(
            req_data,
            (err, result) => {
                if (err) throw err;

                res.json(result);
            });
    });
});

app.get("/genus/:genus", (req, res) => {
    connect((collection) => {
        collection.find({'classification.genus': req.params.genus}).toArray((err, result) => {
            if (err) console.error(err);
            res.json(result);
        });
    });
});

app.get("/family/:family", (req, res) => {
    connect((collection) => {
        collection.find({'classification.family': req.params.family}).toArray((err, result) => {
            if (err) console.error(err);
            res.json(result);
        });
    });
});

app.get("/search/:term", (req, res) => {
    connect((collection) => {
        collection.find({}, {projection: {name: 1}}).toArray((err, result) => {
            if (err) console.error(err);

            let options = {
                pre: '<strong>',
                post: '</strong>',
                extract: function(el) {
                    return el.name;
                }
            }

            let filtered_result = fuzzy.filter(req.params.term, result, options);

                filtered_result = filtered_result.map((el) => {
                    return {
                        _id: el.original._id,
                        match: el.string
                    }
                })

            res.json(filtered_result)
        });
    });
});

app.listen(30031, () => {
    console.log("Listening on port 30031");
});