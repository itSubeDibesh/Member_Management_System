const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, SELECT_LIMIT } = require('../Config/Http'),
    committeRouter = express.Router();

// Return List of All Committe as Json Dataset
committeRouter.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.Committe.Select.Count, null, (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.Committe.Select.Paginate, [parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    request.session.CommitteInformation = res.response;
                    response.render('Committe/committe', {
                        title: 'Committe',
                        layout: 'main',
                        link: "/Committe",
                        UserInfromation: request.session.UserInfromation,
                        CommitteInformation: res.response
                    });
                });
        });
    } else {
        response.render('Committe/committe', {
            title: 'Committe',
            layout: 'main',
            link: "/Committe",
            UserInfromation: request.session.UserInfromation,
            CommitteInformation: {
                success: false
            }
        });
    }
});

// Committe Add Edit GET request
committeRouter.get('/action/:Task', isLoggedIn, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { Committe } = request.query;
    const UserInfromation = request.session.UserInfromation;
    // Check if task is null
    if (Task != null) {
        Exe.queryExecuator(queryBox.Branch.Select.All, null, (branchError, branchResult) => {
            if (branchError) Error.log(branchError);
            if (branchResult) {
                const BranchList = branchResult;
                Exe.queryExecuator(queryBox.Member.Select.AllWithoutSelf, parseInt(UserInfromation.MemberId), (MemberListError, MemberListResult) => {
                    if (MemberListError) Error.log(MemberListError);
                    if (MemberListResult) {
                        const MemberList = MemberListResult;
                        // Check if task is add or edit
                        if (Task == 'edit') {
                            // check if Committe is passed
                            if (Committe != null) {
                                // Fetch Committe details matching Committe and send it as well
                                Exe.queryExecuator(queryBox.Committe.Select.ById, parseInt(Committe), (editError, editResult) => {
                                    if (editError != null) Error.log(editError);
                                    request.session.EditCommitte = editResult[0];
                                    // Check if Result is not null
                                    if (editResult) response.render('Committe/addEditCommitte', {
                                        title: 'Committe',
                                        layout: 'main',
                                        pageType: Task,
                                        subTitle: "Edit",
                                        link: "/Committe",
                                        UserInfromation,
                                        EditCommitte: editResult[0],
                                        BranchList,
                                        MemberList
                                    });
                                })
                            } else response.redirect('/Committe');
                        } else if (Task == 'add') {
                            // Render Add form
                            response.render('Committe/addEditCommitte', {
                                title: 'Committe',
                                layout: 'main',
                                pageType: Task,
                                subTitle: "Add",
                                link: "/Committe",
                                UserInfromation,
                                BranchList,
                                MemberList
                            });
                        } else response.redirect('/Committe');
                    }
                });
            }
        });
    } else response.redirect('/Committe');
});

// Committe Add Edit POST request
committeRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set Committe!'),
    check('BranchId')
    .notEmpty()
    .withMessage('Branch is Required to set Committe!'),
    check('Name')
    .notEmpty()
    .withMessage('Name is Required to set Committe!'),
    check('Starting_Year')
    .notEmpty()
    .withMessage('Starting Year is Required to set Committe!'),
    check('Ending_Year')
    .notEmpty()
    .withMessage('Ending Year is Required to set Committe!')
], isLoggedIn, (request, response) => {
    // Extracted Elements from request body
    let { Task, Name, BranchId, Starting_Year, Ending_Year, ComitteHead } = request.body;
    ComitteHead = ComitteHead != null || ComitteHead != undefined ? ComitteHead : null;
    BranchId = BranchId != null || BranchId != undefined ? BranchId : null;
    console.log({ Task, Name, BranchId, Starting_Year, Ending_Year, ComitteHead });
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Executing Sql Query
            // `BranchId`, `Starting_Year`, `Ending_Year`, `Name`,`ComitteHead`
            Exe.queryExecuator(queryBox.Committe.Insert + `(${BranchId},'${Starting_Year}','${Ending_Year}','${Name}',${ComitteHead})`, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Committe');
            });
        } else if (Task == 'edit') {
            const { Committe } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.Committe.Update, [BranchId, Starting_Year, Ending_Year, `${Name}`, ComitteHead, parseInt(Committe)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Committe');
            });
        } else response.render('Committe/committe', {
            title: 'Committe',
            layout: 'main',
            link: "/Committe",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            EditCommitte: request.session.EditCommitte,
            CommitteInformation: request.session.CommitteInformation
        });
    } else
        response.render('Committe/committe', {
            title: 'Committe',
            layout: 'main',
            link: "/Committe",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            EditCommitte: request.session.EditCommitte,
            CommitteInformation: request.session.CommitteInformation
        });
});

committeRouter.post('/remove/:Committe', isLoggedIn, (request, response) => {
    const { Committe } = request.params;
    if (Committe != null) {
        Exe.queryExecuator(queryBox.Committe.Delete, parseInt(Committe), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/Committe');
        });
    } else response.render('Committe/committe', {
        title: 'Committe',
        layout: 'main',
        link: "/Committe",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        CommitteInformation: request.session.CommitteInformation
    });
});
module.exports = committeRouter;