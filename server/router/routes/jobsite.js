'use strict';

var util = require('util');

var debug = require('../../debug');
var dbman = require('../../dbman');
var emailer = require('../../emailer');

var log = debug.getLogger({ prefix: '[route.jobsite]-  ' });
var jobsites = dbman.getCollection('jobsites');
var zipsCollection = dbman.getCollection('zips');

var ObjectId = dbman.getObjectId();

module.exports = {
    request: {
        get: function (req, res) {
            zipsCollection.find().toArray(function(err, zipDocs){
                if(err || !zipDocs){
                    log('Could not get Zip Codes');
                }
                else{
                    var zipMap = zipDocs[0];
                    var counties = ['Lee', 'Chambers', 'Russell', 'Macon', 'Tallapoosa', 'Harris', 'Muscogee'];
                    var zipValues = {
                        Lee: zipMap['lee-county-zips'],
                        Chambers: zipMap['chambers-county-zips'],
                        Russell: zipMap['russell-county-zips'],
                        Macon: zipMap['macon-county-zips'],
                        Tallapoosa: zipMap['tallapoosa-county-zips'],
                        Harris: zipMap['harris-county-zips'],
                        Muscogee: zipMap['muscogee-county-zips']
                    };
                    var zips = [];
                    for(var i=0; i<counties.length; i++)
                    {
                        var currentValue = zipValues[counties[i]];
                        if(currentValue !== undefined)
                        {
                            zips.push.apply(zips, currentValue.toString().split(','));
                        }
                    }
                    res.render('jobsite-request', {
                        title: 'Job Site Request',
                        zips: zips,
                        _layoutFile: 'default'
                    });
                }
            });
        },

        post: function (req, res) {
            var record = req.body;
            var options = { w: 1 };
            
            record.formattedAddress = util.format('%s %s, %s %s',
                record.address, record.city, record.state, record.zip);

            jobsites.insert(record, options, function (err) {
                if (err) {
                    log('POST: Error inserting record:\n\n%s\n\n', err);
                    res.send(400);
                } else {
                    emailer.send({
                        to: record.email,
                        subject: 'Job Request Confirmation',
                        template: 'jobsite-request',
                        locals: { user: record }
                    }, function (err) {
                        if (err) res.send(400);
                        else res.send('ok', 200);
                    });
                }
            });
        },

        staff : {
            post: function(req, res){
                var record = req.body;
                var options = { w: 1 };
            
                record.formattedAddress = util.format('%s %s, %s %s',
                    record.address, record.city, record.state, record.zip);

                jobsites.insert(record, options, function (err, records) {
                    if (err) {
                        log('POST: Error inserting record:\n\n%s\n\n', err);
                        res.send(400, 'staff');
                    } else {
                        emailer.send({
                            to: record.email,
                            subject: 'Job Request Confirmation',
                            template: 'jobsite-request',
                            locals: { user: record }
                        }, function (err) {
                            if (err) res.send(400, 'staff');
                            else res.send(200, {id: records[0]._id});
                        });
                    }
                });
            }
        },

        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Jobsite Request Submitted',
                header: 'Jobsite Request Submitted',
                message: 'You should receive an e-mail confirmation verifying that your submission was successfully received.',
                _layoutFile: 'default'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Submission Failed',
                header: 'Sorry!',
                message: 'There was a problem submitting your jobsite request. Please try again later.',
                _layoutFile: 'default'
            });
        }
    },

    evaluation: {
        get: function (req, res) {
            var id = req.params.id;
            jobsites.findOne({_id: new ObjectId(id)}, function(err, record){
                if(err){
                    log('JOBSITE.EVALUATION.GET: Error getting jobsite: %s', err);
                    res.render('hero-unit', {
                        title: 'Error',
                        header: 'Sorry!',
                        message: 'There was a problem retrieving the jobsite from the database. Please try again later.',
                        _layoutFile: 'default'
                    });
                }
                else if(!record){
                    log('JOBSITE.EVALUATION.GET: Jobsite not found', err);
                    res.render('hero-unit', {
                        title: 'Error',
                        header: 'Sorry!',
                        message: 'Jobsite not found in the database. Please try again later.',
                        _layoutFile: 'default'
                    });
                }
                else{
                    log('JOBSITE.EVALUATION.GET: Jobsite Found.');
                    res.render('jobsite-evaluation', {
                        title: 'Job Site Evaluation',
                        jobRequest: record,
                        _layoutFile: 'default'
                    });
                }
            });
        },

        post: function (req, res) {
            res.send('ok', 200);
        },

        delete: function (req, res){
            res.send(200);
        },
        
        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Jobsite Evaluation Submitted',
                header: 'Jobsite Evaluation Submitted',
                message: 'You should receive an e-mail confirmation verifying that your submission was successfully received.',
                _layoutFile: 'default'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Submission Failed',
                header: 'Sorry!',
                message: 'There was a problem submitting your jobsite evaluation. Please try again later.',
                _layoutFile: 'default'
            });
        }
    }
};
