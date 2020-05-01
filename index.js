const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
const fuzzy = require('fuzzy');

const connect = require('./snippets/database').connect;

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/mushrooms", (req, res) => {
    connect((collection) => {
        res_data = collection.find({}).toArray((err, result) => {
            if (err) console.error(err);
            res.json(result);
        });
    });
});

app.get("/mushroom/:id", (req, res) => {

    console.log(req.params);

    connect((collection) => {
        res_data = collection.findOne({_id: new ObjectId(req.params.id)}, (err, result) => {
            if (err) console.error(err);
            res.json(result);
        });
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
        collection.find({'classification.genus': req.params.genus}
            ).toArray((err, result) => {
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
                pre: '<em>',
                post: '</em>',
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

app.listen(30030, () => {
    console.log("Listening on port 30030");
});