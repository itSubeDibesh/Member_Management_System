const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, SELECT_LIMIT } = require('../Config/Http'),
    userRouter = express.Router();

// Return List of All User as Json Dataset
userRouter.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    const LoggedInUser = request.session.UserInfromation;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.User.Select.Count, parseInt(LoggedInUser.UserId), (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.User.Select.Paginate, [parseInt(LoggedInUser.UserId), parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    request.session.ALLUserInformation = res.response;
                    response.render('User/user', {
                        title: 'User',
                        layout: 'main',
                        link: "/User",
                        UserInfromation: LoggedInUser,
                        ALLUserInformation: res.response
                    });
                });
        });
    } else {
        response.render('User/user', {
            title: 'User',
            layout: 'main',
            link: "/User",
            UserInfromation: request.session.UserInfromation,
            ALLUserInformation: {
                success: false
            }
        });
    }
});

// User Add Edit GET request
userRouter.get('/action/:Task', isLoggedIn, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { User } = request.query;
    const UserInfromation = request.session.UserInfromation;
    // Check if task is null
    if (Task != null) {
        Exe.queryExecuator(queryBox.Role.Select.All, null, (selectError, selectResult) => {
            if (selectError != null) Error.log(selectError);
            if (selectResult) {
                // Check if task is add or edit
                if (Task == 'edit') {
                    // check if User is passed
                    if (User != null) {
                        if (UserInfromation.UserId != parseInt(User)) {
                            // Fetch User details matching User and send it as well
                            Exe.queryExecuator(queryBox.User.Select.ById, parseInt(User), (editError, editResult) => {
                                if (editError != null) Error.log(editError);
                                request.session.EditUser = editResult[0];
                                // Check if Result is not null
                                if (editResult) response.render('User/addEditUser', {
                                    title: 'User',
                                    layout: 'main',
                                    pageType: Task,
                                    subTitle: "Edit",
                                    link: "/User",
                                    UserInfromation,
                                    EditUser: editResult[0],
                                    Roles: selectResult
                                });
                            })
                        } else response.redirect('/User');
                    } else response.redirect('/User');
                } else if (Task == 'add') {
                    // Render Add form
                    response.render('User/addEditUser', {
                        title: 'User',
                        layout: 'main',
                        pageType: Task,
                        subTitle: "Add",
                        link: "/User",
                        UserInfromation,
                        Roles: selectResult
                    });
                } else response.render('User/user', {
                    title: 'User',
                    layout: 'main',
                    link: "/User",
                    errors: [{ msg: `Invalid Request, Try again later!` }],
                    UserInfromation: request.session.UserInfromation,
                    ALLUserInformation: request.session.ALLUserInformation
                });
            }
        });
    } else response.redirect('/User');
});

// User Add Edit POST request
userRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set User!'),
    check('RoleId')
    .notEmpty()
    .withMessage('Role is Required to set User!'),
    check('UserName')
    .isLength({ min: 5, max: 20 })
    .withMessage('User Name must have 5-20 characters.')
    .notEmpty()
    .withMessage('User Name is Required to set User!'),
    check('Password')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must have 8-20 characters.')
    .notEmpty()
    .withMessage('Password is Required to set User!')
], isLoggedIn, (request, response) => {
    // Extracted Elements from request body
    let { Task, RoleId, Password, UserName } = request.body;
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Executing Sql Query
            Exe.queryExecuator(queryBox.User.Insert + `(${RoleId},'${UserName}','${Password}')`, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/User');
            });
        } else if (Task == 'edit') {
            const { User } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.User.Update, [RoleId, `${UserName}`, `${Password}`, parseInt(User)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/User');
            });
        } else response.render('User/user', {
            title: 'User',
            layout: 'main',
            link: "/User",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            ALLUserInformation: request.session.ALLUserInformation
        });
    } else
        response.render('User/user', {
            title: 'User',
            layout: 'main',
            link: "/User",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            ALLUserInformation: request.session.ALLUserInformation
        });
});

userRouter.post('/remove/:User', isLoggedIn, (request, response) => {
    const { User } = request.params;
    if (User != null) {
        Exe.queryExecuator(queryBox.User.Delete, parseInt(User), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/User');
        });
    } else response.render('User/user', {
        title: 'User',
        layout: 'main',
        link: "/User",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        ALLUserInformation: request.session.ALLUserInformation
    });
});
module.exports = userRouter;