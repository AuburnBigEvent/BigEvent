'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.tool]-  ' });
var tools = dbman.getCollection('tools');
var ObjectId = dbman.getObjectId();

module.exports = {

    get: function (req, res) {
        res.render('tool', {
            title: 'Add Tool',
            user: req.session.user,
            _layoutFile: 'default'
        });
    },

    post: function (req, res) {
        var newRecord = req.body;

        //set the name to all lower case for checking purposes. Saw and saw are the same thing
        newRecord.name = newRecord.name.toLowerCase();

        //check to see if the checkbox was checked. If it was not checked there will be no field for it in the record. Add one
        if(!newRecord.maxRequest)
        {
            newRecord.maxRequest = 'off';
        }

        //check to see if we already have a tool by this name
        log('POST: Checking for name -- %s', newRecord.name);
        tools.findOne({name: newRecord.name}, function(error, oldRecord){
            if(error)
            {
                log('POST: Error checking database for tool', error);
                res.send(400, 'Error');
            }
            else if(!oldRecord)
            {
                log('POST: Tool not found -> adding new entry to database');
                
                //calculate the number reamining in storage
                newRecord.numberRemaining = newRecord.totalAvailable - newRecord.numberInUse;

                //insert new entry
                tools.insert(newRecord, { w: 1 }, function (err, records) {
                    if (err || !records) {
                        log('POST: Error adding new record:\n\n%s\n\n', err);
                        res.send(400);
                    } else {
                        log('POST: New record successfully added to database');
                        res.send(200, {id: records[0]._id});
                    }
                });
            }
            else
            {
                log('POST: Found an entry -> notifying user');
                res.send(400, 'Entry Found');
            }
        });
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Tool Added',
            header: 'Tool Added',
            message: 'Tool was added successfully.',
            user: req.session.user,
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Could Not Add Tool',
            header: 'Sorry!',
            message: 'There was a problem adding your tool. Please try again later.',
            user: req.session.user,
            _layoutFile: 'default'
        });
    },

    review: {
        get: function(req, res){
            var id = req.params.id;
            log('TOOL.REVIEW.GET: Get Tool with _id: %s', id);
            tools.findOne({ _id: new ObjectId(id)}, function(error, record){
                if(error){
                    log('TOOL.REVIEW.GET: Error looking for record with _id: %s', id);
                    res.render('hero-unit', {
                        title: 'Error getting tool for review.',
                        header: 'Error',
                        message: 'There was an unknown error retrieving tool from database.',
                        user: req.session.user,
                        _layoutFile: 'default'
                    });
                }
                else if(!record){
                    log('TOOL.REVIEW.GET: Unable to find record with _id: %s', id);
                    res.render('hero-unit', {
                        title: 'Could not find Tool in datbase.',
                        header: 'Tool Not Found',
                        message: 'Did not find the tool in the database.',
                        user: req.session.user,
                        _layoutFile: 'default'
                    });

                }
                else{
                    log('TOOL.REVIEW.GET: Found record with id: %s', id);
                    res.render('toolReview', {
                        title: 'Edit Tool',
                        record: record,
                        user: req.session.user,
                        _layoutFile: 'default'
                    });
                }
            });
        },

        post: function(req, res){
            var newRecord = req.body;
            var id = req.params.id;

            log('TOOL.REVIEW.POST Trying to bet tool with _id: %s', id);

             //check to see if the checkbox was checked. If it was not checked there will be no field for it in the record. Add one
            if(!newRecord.maxRequest)
            {
                newRecord.maxRequest = 'off';
                //just in case there was a request limit before this was turned off we need to update the limit to 0
                newRecord.maxRequestValue = 0;
            }

            //calcualte number remaining
            newRecord.numberRemaining = newRecord.totalAvailable - newRecord.numberInUse;
            var query = { _id: new ObjectId(id) };
            var cmd = { $set: newRecord };
            var opt = { w: 1 };

            tools.update(query, cmd, opt, function (err, result) {
                if(err) {
                    log('TOOL.REVOIEW.POST: Update error, tool:\n\n%s\n\n', err);
                    res.send(400);
                }
                else if(!result){
                    log('TOOL.REVIEW.POST: Could not find tool, _id:\n\n%s\n\n', id);
                    res.send(400);

                }
                else {
                    log('TOOL.REVIEW.POST: Updated tool with _id %s', id);
                    res.send(200);
                }
            });
        },

        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Success',
                header: 'Tool Updated',
                message: 'You successfully updated the Tool.',
                user: req.session.user,
                _layoutFile: 'default'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Could Not Update Tool',
                header: 'Sorry!',
                message: 'There was a problem Updating the tool. Please try again later.',
                user: req.session.user,
                _layoutFile: 'default'
            });
        }
    }
};
