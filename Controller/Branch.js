const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, AllowAccess, SELECT_LIMIT } = require('../Config/Http'),
    branchRouter = express.Router();

// Return List of All Branch as Json Dataset
branchRouter.get('/', isLoggedIn, AllowAccess, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.Branch.Select.Count, null, (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.Branch.Select.Paginate, [parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    request.session.BranchInformation = res.response;
                    response.render('Branch/branch', {
                        title: 'Branch',
                        layout: 'main',
                        link: "/Branch",
                        UserInfromation: request.session.UserInfromation,
                        BranchInformation: res.response
                    });
                });
        });
    } else {
        response.render('Branch/branch', {
            title: 'Branch',
            layout: 'main',
            link: "/Branch",
            UserInfromation: request.session.UserInfromation,
            BranchInformation: {
                success: false
            }
        });
    }
});

// Branch Add Edit GET request
branchRouter.get('/action/:Task', isLoggedIn, AllowAccess, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { Branch } = request.query;
    // Check if task is null
    if (Task != null) {
        Exe.queryExecuator(queryBox.Branch.Select.All, null, (error, result) => {
            if (error != null) Error.log(error);
            if (result) {
                const AllBranch = result;
                // Check if task is add or edit
                if (Task == 'edit') {
                    // check if Branch is passed
                    if (Branch != null) {
                        // Fetch Branch details matching Branch and send it as well
                        Exe.queryExecuator(queryBox.Branch.Select.ById, parseInt(Branch), (editError, editResult) => {
                            if (editError != null) Error.log(editError);
                            request.session.EditBranch = editResult[0];
                            // Check if Result is not null
                            if (editResult) response.render('Branch/addEditBranch', {
                                title: 'Branch',
                                layout: 'main',
                                pageType: Task,
                                subTitle: "Edit",
                                link: "/Branch",
                                UserInfromation: request.session.UserInfromation,
                                EditBranch: editResult[0],
                                AllBranch
                            });
                        })
                    } else response.redirect('/Branch');
                } else if (Task == 'add') {
                    // Render Add form
                    response.render('Branch/addEditBranch', {
                        title: 'Branch',
                        layout: 'main',
                        pageType: Task,
                        subTitle: "Add",
                        link: "/Branch",
                        UserInfromation: request.session.UserInfromation,
                        AllBranch
                    });
                } else response.redirect('/Branch');
            }
        });
    } else response.redirect('/Branch');
});

// Branch Add Edit POST request
branchRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set Branch!'),
    check('Name')
    .notEmpty()
    .withMessage('Name is Required to set Branch!'),
    check('Name')
    .notEmpty()
    .withMessage('Name is Required to set Branch!'),
    check('Address')
    .notEmpty()
    .withMessage('Address is Required to set Branch!'),
    check('Contact')
    .notEmpty()
    .withMessage('Contact is Required to set Branch!')
], isLoggedIn, AllowAccess, (request, response) => {
    // Extracted Elements from request body
    let { Task, ParentId, Name, Address, Contact, Status } = request.body;
    ParentId = ParentId != undefined ? ParentId : null;
    Status = Status != undefined ? Status : "Inactive";
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Executing Sql Query
            Exe.queryExecuator(queryBox.Branch.Insert + `(${ParentId},'${Name}','${Address}',${Contact},'${Status}')`, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Branch');
            });
        } else if (Task == 'edit') {
            const { Branch } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.Branch.Update, [ParentId, `${Name}`, `${Address}`, Contact, `${Status}`, parseInt(Branch)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Branch');
            });
        } else response.render('Branch/branch', {
            title: 'Branch',
            layout: 'main',
            link: "/Branch",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            EditBranch: request.session.EditBranch,
            BranchInformation: request.session.BranchInformation
        });
    } else
        response.render('Branch/branch', {
            title: 'Branch',
            layout: 'main',
            link: "/Branch",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            EditBranch: request.session.EditBranch,
            BranchInformation: request.session.BranchInformation
        });
});

branchRouter.post('/remove/:Branch', isLoggedIn, AllowAccess, (request, response) => {
    const { Branch } = request.params;
    if (Branch != null) {
        Exe.queryExecuator(queryBox.Branch.Delete, parseInt(Branch), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/Branch');
        });
    } else response.render('Branch/branch', {
        title: 'Branch',
        layout: 'main',
        link: "/Branch",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        BranchInformation: request.session.BranchInformation
    });
});
module.exports = branchRouter;