var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8007;

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


router.get('/' , function(req,res){
	res.json({message: 'hooray!welcome to our api !'});
});

router.route("/bears")

	.post(function(req, res) {
        
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)
		
        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });
        
    })
	
	.get(function(req,res){
		Bear.find(function(err,bears){
			if(err)
				res.send(err);
			res.json(bears);
		});
	});
	
router.route('/bears/:bear_id')
	
	.get(function(req,res){
		Bear.findById(req.params.bear_id,function(err,bear){
			if(err)
				res.send(err);
			res.json(bear);
		});
	})
	
	.put(function(req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated! ' + bear.name });
            });

        });
    })
    
    .delete(function(req,res){
	    Bear.remove({
		    _id: req.params.bear_id
	    },function(err,bear){
		    if(err)
		    	res.send(err);
		    res.json({message: "Sucessfully deleted "});
	    });
    });


app.use('/api',router);

app.listen(port);
console.log("maggic happen on port "+ port);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

var Bear = require('./app/models/bear');