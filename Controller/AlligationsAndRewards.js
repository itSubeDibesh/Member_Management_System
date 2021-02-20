const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, SELECT_LIMIT } = require('../Config/Http'),
    alligationsAndRewardsRouter = express.Router();

// Return List of All AlligationsAndRewards as Json Dataset
alligationsAndRewardsRouter.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.AlligationsAndRewards.Select.Count, null, (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.AlligationsAndRewards.Select.Paginate, [parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    request.session.AlligationsAndRewardsInformation = res.response;
                    response.render('AlligationsAndRewards/alligationsAndRewards', {
                        title: 'Alligations and Rewards',
                        layout: 'main',
                        link: "/AlligationsAndRewards",
                        UserInfromation: request.session.UserInfromation,
                        AlligationsAndRewardsInformation: res.response
                    });
                });
        });
    } else {
        response.render('AlligationsAndRewards/alligationsAndRewards', {
            title: 'Alligations and Rewards',
            layout: 'main',
            link: "/AlligationsAndRewards",
            UserInfromation: request.session.UserInfromation,
            AlligationsAndRewardsInformation: {
                success: false
            }
        });
    }
});

// AlligationsAndRewards Add Edit GET request
alligationsAndRewardsRouter.get('/action/:Task', isLoggedIn, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { AlligationsAndRewards } = request.query;
    const UserInfromation = request.session.UserInfromation;
    // Check if task is null
    if (Task != null) {
        Exe.queryExecuator(queryBox.Member.Select.All, parseInt(UserInfromation.UserId), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Member list is null
            if (result) {
                const MemberList = result;
                // Check if task is add or edit
                if (Task == 'edit') {
                    // check if AlligationsAndRewards is passed
                    if (AlligationsAndRewards != null) {
                        // Fetch AlligationsAndRewards details matching AlligationsAndRewards and send it as well
                        Exe.queryExecuator(queryBox.AlligationsAndRewards.Select.ById, parseInt(AlligationsAndRewards), (editError, editResult) => {
                            if (editError != null) Error.log(editError);
                            request.session.EditAlligationsAndRewards = editResult[0];
                            // Check if Result is not null
                            if (editResult) response.render('AlligationsAndRewards/addEditAlligationsAndRewards', {
                                title: 'Alligations and Rewards',
                                layout: 'main',
                                pageType: Task,
                                subTitle: "Edit",
                                link: "/AlligationsAndRewards",
                                UserInfromation,
                                MemberList,
                                EditAlligationsAndRewards: editResult[0]
                            });
                        })
                    } else response.redirect('/AlligationsAndRewards');
                } else if (Task == 'add') {
                    // Render Add form
                    response.render('AlligationsAndRewards/addEditAlligationsAndRewards', {
                        title: 'Alligations and Rewards',
                        layout: 'main',
                        pageType: Task,
                        subTitle: "Add",
                        link: "/AlligationsAndRewards",
                        UserInfromation,
                        MemberList
                    });
                } else response.redirect('/AlligationsAndRewards');
            }
        });
    } else response.redirect('/AlligationsAndRewards');
});

// AlligationsAndRewards Add Edit POST request
alligationsAndRewardsRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set AlligationsAndRewards!'),
    check('MemberId')
    .notEmpty()
    .withMessage('Member is Required to set AlligationsAndRewards!'),
    check('Type')
    .notEmpty()
    .withMessage('Type is Required to set AlligationsAndRewards!'),
    check('Title')
    .notEmpty()
    .withMessage('Title is Required to set AlligationsAndRewards!'),
    check('Description')
    .notEmpty()
    .withMessage('Description is Required to set AlligationsAndRewards!')
], isLoggedIn, (request, response) => {
    // Extracted Elements from request body
    let { Task, MemberId, Type, Title, Description } = request.body;
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Executing Sql Query
            Exe.queryExecuator(queryBox.AlligationsAndRewards.Insert + `(${MemberId},'${Type}','${Title}','${Description}')`, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/AlligationsAndRewards');
            });
        } else if (Task == 'edit') {
            const { AlligationsAndRewards } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.AlligationsAndRewards.Update, [MemberId, `${Type}`, `${Title}`, `${Description}`, parseInt(AlligationsAndRewards)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/AlligationsAndRewards');
            });
        } else response.render('AlligationsAndRewards/AlligationsAndRewards', {
            title: 'Alligations and Rewards',
            layout: 'main',
            link: "/AlligationsAndRewards",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            EditAlligationsAndRewards: request.session.EditAlligationsAndRewards,
            AlligationsAndRewardsInformation: request.session.AlligationsAndRewardsInformation
        });
    } else
        response.render('AlligationsAndRewards/AlligationsAndRewards', {
            title: 'Alligations and Rewards',
            layout: 'main',
            link: "/AlligationsAndRewards",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            EditAlligationsAndRewards: request.session.EditAlligationsAndRewards,
            AlligationsAndRewardsInformation: request.session.AlligationsAndRewardsInformation
        });
});

alligationsAndRewardsRouter.post('/remove/:AlligationsAndRewards', isLoggedIn, (request, response) => {
    const { AlligationsAndRewards } = request.params;
    if (AlligationsAndRewards != null) {
        Exe.queryExecuator(queryBox.AlligationsAndRewards.Delete, parseInt(AlligationsAndRewards), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/AlligationsAndRewards');
        });
    } else response.render('AlligationsAndRewards/AlligationsAndRewards', {
        title: 'Alligations and Rewards',
        layout: 'main',
        link: "/AlligationsAndRewards",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        EditAlligationsAndRewards: request.session.EditAlligationsAndRewards,
        AlligationsAndRewardsInformation: request.session.AlligationsAndRewardsInformation
    });
});
module.exports = alligationsAndRewardsRouter;