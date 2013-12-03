'use strict';

module.exports = {
    init: function (app) {
        var routes = require('./routes');
        
        //user side routes
        app.get('/', routes.home);
        app.get('/home', routes.home);

        app.get('/signin', routes.signin.get);
        app.get('/signin/authenticate', routes.signin.authenticate);
        app.get('/signin/success', routes.signin.success);

        app.get('/signout', routes.signout);

        app.get('/waiver', routes.waiver.get);

        app.get('/access-denied', routes.accessDenied);

        app.get('/volunteer', routes.volunteer.get);
        app.post('/volunteer', routes.volunteer.post);
        app.get('/volunteer/success', routes.volunteer.success);
        app.get('/volunteer/failure', routes.volunteer.failure);

        app.get('/volunteer/account', routes.volunteer.account.get);
        app.post('/volunteer/account', routes.volunteer.account.post);
        app.get('/volunteer/account/delete', routes.volunteer.account.delete);
        app.get('/volunteer/account/success', routes.volunteer.account.success);
        app.get('/volunteer/account/failure', routes.volunteer.account.failure);

        app.get('/volunteer/team', routes.team.get);
        app.get('/volunteer/team/invite', routes.team.invite);
        app.get('/volunteer/team/join', routes.team.join);
        app.get('/volunteer/team/leave', routes.team.leave);
        app.get('/volunteer/team/:id', routes.team.get);
        
        app.get('/staffHome', routes.staffHome.get);

        app.get('/staff/volunteer/team/list', routes.staffTeamList);
        app.get('/staff/volunteer/team/:id', routes.team.get);

        app.get('/jobsite/request', routes.jobsiteRequest.get);
        app.post('/jobsite/request', routes.jobsiteRequest.post);
        app.get('/jobsite/request/success', routes.jobsiteRequest.success);
        app.get('/jobsite/request/failure', routes.jobsiteRequest.failure);

        //staff side routes
        app.get('/staff/volunteer/success', routes.volunteer.success);
        app.get('/staff/volunteer/failure', routes.volunteer.failure);

        app.get('/staff/volunteer/account/success', routes.volunteer.account.success);
        app.get('/staff/volunteer/account/failure', routes.volunteer.account.failure);
        app.get('/staff/volunteer/account/delete/:id', routes.volunteer.account.staff.delete);
        app.get('/staff/volunteer/account/:id', routes.volunteer.account.staff.get);
        app.post('/staff/volunteer/account/:id', routes.volunteer.account.staff.post);

        app.get('/staff/jobsite/request', routes.jobsiteRequest.get);
        app.post('/staff/jobsite/request', routes.jobsiteRequest.staff.post);
        app.get('/staff/jobsite/request/success', routes.jobsiteRequest.success);
        app.get('/staff/jobsite/request/failure', routes.jobsiteRequest.failure);

        app.get('/staff/jobsite/evaluation-listing', routes.jobsiteEvaluation.listing);

        app.get('/staff/jobsite/:id', routes.jobsite.get);
        app.post('/staff/jobsite/:id', routes.jobsite.post);
        app.get('/staff/jobsite/:id/delete', routes.jobsite.delete);
        app.get('/staff/jobsite/:id/approve', routes.jobsite.approve);
        app.get('/staff/jobsite/:id/claim', routes.jobsite.claim);
        app.get('/staff/jobsite/:id/unclaim', routes.jobsite.unclaim);
        app.get('/staff/jobsite/:id/evaluation', routes.jobsiteEvaluation.get);

        app.get('/staff/tool', routes.tool.get);
        app.post('/staff/tool', routes.tool.post);
        app.get('/staff/tool/success', routes.tool.success);
        app.get('/staff/tool/failure', routes.tool.failure);

        app.get('/staff/tool/review/success', routes.tool.review.success);
        app.get('/staff/tool/review/failure', routes.tool.review.failure);
        app.post('/staff/tool/review/delete/:id', routes.tool.review.delete);
        app.get('/staff/tool/review/:id', routes.tool.review.get);
        app.post('/staff/tool/review/:id', routes.tool.review.post);

        app.get('/staff/staffHomePage', routes.staffHomePage.get);
        app.get('/staff/staffHomePage/updateTable', routes.staffHomePage.updateTable);
        app.get('/staff/staffHomePage/sort', routes.staffHomePage.sort);

        app.get('/staff/toolReport', routes.toolReport.get);
        app.get('/staff/toolReport/failure', routes.toolReport.failure);

        app.get('/staff/updateZipCodes', routes.zipcodes.get);
        app.post('/staff/updateZipCodes', routes.zipcodes.post);
        app.get('/staff/updateZipCodes/failure', routes.zipcodes.failure);

        app.get('/staff/updateWaiver', routes.waiver.getUpdateForm);
        app.post('/staff/updateWaiver', routes.waiver.update);
        app.get('/staff/updateWaiver/failure', routes.waiver.failure);

        app.get('/staff/logout', routes.signin.get);
        app.get('/staff/clearDatabase', routes.staffHomePage.clearDatabase);
        app.get('/staff/updateReports', routes.staffHomePage.updateReports);
        
        app.get('*', routes.notfound);
    }
};
