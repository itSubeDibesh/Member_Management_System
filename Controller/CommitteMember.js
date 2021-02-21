const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, SELECT_LIMIT } = require('../Config/Http'),
    committeMemberRouter = express.Router();

// Return List of All Committe Members as Json Dataset
committeMemberRouter.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    const UserInfromation = request.session.UserInfromation;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.CommitteMember.Select.Count.ExceptMemberID, [parseInt(UserInfromation.MemberId), parseInt(SELECT_LIMIT), parseInt(offset)], (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.CommitteMember.Select.Paginate.AllExceptMemberID, [parseInt(UserInfromation.MemberId), parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    request.session.CommitteMemberInformation = res.response;
                    response.render('CommitteMember/committeMember', {
                        title: 'Committe Members',
                        layout: 'main',
                        link: "/CommitteMember",
                        UserInfromation,
                        CommitteMemberInformation: res.response
                    });
                });
        });
    } else {
        response.render('CommitteMember/committeMember', {
            title: 'Committe Members',
            layout: 'main',
            link: "/CommitteMember",
            UserInfromation,
            CommitteMemberInformation: {
                success: false
            }
        });
    }
});

// Committe Members Edit request
committeMemberRouter.get('/action/:Task', isLoggedIn, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { CommitteMember } = request.query;
    const UserInfromation = request.session.UserInfromation;
    // Check if task is null
    if (Task != null) {
        // Fetch Committe Members Details to load in form
        const multipleQueries = `${queryBox.Committe.Select.All}; ${queryBox.Member.Select.AllWithoutSelf}`;
        Exe.queryExecuator(multipleQueries, parseInt(UserInfromation.MemberId), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) {
                const CommitteMemberObject = { Committe: result[0], Member: result[1] };
                // Check if task is add or edit
                if (Task == 'edit') {
                    // check if Role and permission are passed
                    if (CommitteMember != null) {
                        // Fetch Committe Members details matching role and permission and send it as well
                        Exe.queryExecuator(queryBox.CommitteMember.Select.All.ById, parseInt(CommitteMember), (editError, editResult) => {
                            if (editError != null) Error.log(editError);
                            // Check if Result is not null
                            if (editResult) response.render('CommitteMember/addEditCommitteMember', {
                                title: 'Committe Members',
                                layout: 'main',
                                pageType: Task,
                                subTitle: "Edit",
                                link: "/CommitteMember",
                                UserInfromation,
                                CommitteMemberList: CommitteMemberObject,
                                EditCommitteMember: editResult[0]
                            });
                        })
                    } else response.redirect('/CommitteMember');
                } else if (Task == 'add') {
                    // Render Add form
                    response.render('CommitteMember/addEditCommitteMember', {
                        title: 'Committe Members',
                        layout: 'main',
                        pageType: Task,
                        subTitle: "Add",
                        link: "/CommitteMember",
                        UserInfromation,
                        CommitteMemberList: CommitteMemberObject
                    });
                } else response.redirect('/CommitteMember');
            }
        });
    } else response.redirect('/CommitteMember');
});

committeMemberRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set Committe Members!'),
    check('CommitteId')
    .notEmpty()
    .withMessage('Committe is Required to set Committe Members!'),
    check('MemberId')
    .notEmpty()
    .withMessage('Member is Required to set Committe Members!')
], isLoggedIn, (request, response) => {
    // Extracted Elements from request body
    let { Task, CommitteId, MemberId, Status } = request.body;
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Perform Add operation
            let sqlParams = "";
            for (let index = 0; index < MemberId.length; index++) {
                const element = MemberId[index];
                sqlParams += `(${CommitteId},${element}), `;
            }
            sqlParams = sqlParams.substr(0, sqlParams.lastIndexOf(','));
            sqlParams = queryBox.CommitteMember.Insert + sqlParams;
            // Executing Sql Query
            Exe.queryExecuator(sqlParams, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/CommitteMember');
            });
        } else if (Task == 'edit') {
            const { CommitteMember } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.CommitteMember.Update, [parseInt(CommitteId), parseInt(MemberId), parseInt(CommitteMember)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/CommitteMember');
            });
        } else response.render('CommitteMember/committeMember', {
            title: 'Committe Members',
            layout: 'main',
            link: "/CommitteMember",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            CommitteMemberInformation: request.session.CommitteMemberInformation
        });
    } else
        response.render('CommitteMember/committeMember', {
            title: 'Committe Members',
            layout: 'main',
            link: "/CommitteMember",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            CommitteMemberInformation: request.session.CommitteMemberInformation
        });
});

committeMemberRouter.post('/remove/:CommitteMember', isLoggedIn, (request, response) => {
    const { CommitteMember } = request.params;
    if (CommitteMember != null) {
        Exe.queryExecuator(queryBox.CommitteMember.Delete.ById, parseInt(CommitteMember), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/CommitteMember');
        });
    } else response.render('CommitteMember/committeMember', {
        title: 'Committe Members',
        layout: 'main',
        link: "/CommitteMember",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        CommitteMemberInformation: request.session.CommitteMemberInformation
    });
});

module.exports = committeMemberRouter;