const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, AllowAccess, bcrypt } = require('../Config/Http'), authenticationRouter = express.Router();

// Dashboard if the Session has data set Else Login
authenticationRouter.get('/', isLoggedIn, AllowAccess, (request, response) => {
    if (request.session.LoginInformation === undefined && request.session.UserInfromation != undefined) {
        response.render('login', { title: 'Login', layout: false });
    } else {
        const { UserName, LoggedIn } = request.session.LoginInformation;
        if (LoggedIn == true)
            response.redirect(`/Dashboard?UserName=${UserName}`);
        else
            response.redirect(`/Logout`);
    }
});

// Clears Up The Session
authenticationRouter.get('/Logout', (request, response) => {
    request.session.destroy((err) => {
        if (err) Error.log(err);
        response.redirect(`/`);
    });
});

// Redirects To Dashboard
authenticationRouter.get('/Dashboard', isLoggedIn, AllowAccess, (request, response) => {
    const { UserName } = request.query;
    if (UserName.length != 0 && request.session.LoginInformation != undefined && request.session.UserInfromation != undefined) {
        if (UserName == request.session.LoginInformation.UserName && request.session.UserInfromation.UserName == UserName) {
            response.render('dashboard', {
                title: 'Dashboard',
                layout: 'main',
                success: { msg: `Welcome ${UserName}, Have a wonderful day!` },
                UserInfromation: request.session.UserInfromation,
                LoginInformation: request.session.LoginInformation,
                UserRolePermissionList: request.session.UserRolePermissionList
            });
        } else
            response.redirect(`/Logout`);
    }
});

// Logins The User 
authenticationRouter.post('/Login', [
    check('UserName')
    .isLength({ min: 5, max: 20 })
    .withMessage('User Name must have 5-20 characters.'),
    check('Password')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must have 8-20 characters.')
], async(request, response) => {
    // Check if Login Details Exists
    if (request.session.LoginInformation === undefined && request.session.UserInfromation === undefined) {
        // Storing Errors
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            // Destructuring requestuest Body 
            const { UserName, Password } = request.body;
            // Fetch user By Name
            Exe.queryExecuator(queryBox.User.Select.ByName, UserName, (userError, userResult) => {
                if (userError != null) Error.log(userError);
                if (userResult) {
                    try {
                        // Login Success
                        //  Compare passwords and redirect
                        const comparision = bcrypt.compareSync(Password, userResult[0].Password);
                        if (comparision) {
                            // Validate Database
                            Exe.queryExecuator(queryBox.User.Login, [UserName, userResult[0].Password], (error, result) => {
                                if (error != null) Error.log(error);
                                if (result) {
                                    // Need to fetch all the role permission associated with user using RolePermisionByRoleId
                                    Exe.queryExecuator(queryBox.RolePermission.Select.All.ByRoleId, parseInt(result[0].RoleId), (roleError, roleResult) => {
                                        if (roleError != null) Error.log(roleError);
                                        if (roleResult) {
                                            if (result.length !== 0) {
                                                request.session.LoginInformation = { UserName, LoggedIn: true };
                                                request.session.UserInfromation = result[0];
                                                request.session.UserRolePermissionList = roleResult;
                                                response.redirect(`/Dashboard?UserName=${UserName}`);
                                            } else {
                                                response.render('login', {
                                                    title: 'Login',
                                                    layout: false,
                                                    errors: [{ msg: `Invalid Username or Password!` }],
                                                    data: request.body
                                                });
                                            }
                                        } else {
                                            response.render('dashboard', {
                                                title: 'Dashboard',
                                                layout: false,
                                                errors: [{ msg: `Unauthorized Access! Contact Administrator!` }],
                                                data: request.body
                                            });
                                        }
                                    });
                                } else {
                                    response.render('login', {
                                        title: 'Login',
                                        layout: false,
                                        errors: [{ msg: `Internal Issues, Try Again later!` }],
                                        data: request.body
                                    });
                                }
                            });
                        } else {
                            // Invalid Password
                            response.render('login', {
                                title: 'Login',
                                layout: false,
                                errors: [{ msg: `Invalid Username or Password!` }],
                                data: request.body
                            });
                        }
                    } catch {
                        // Fallback error
                        response.render('login', {
                            title: 'Login',
                            layout: false,
                            errors: [{ msg: `Internal Issues, Try Again later!` }],
                            data: request.body
                        });
                    }
                }
            });
        } else {
            response.render('login', {
                title: 'Login',
                layout: false,
                errors: errors.array(),
                data: request.body
            });
        }
    } else response.redirect('/');
});

// Exporting Routeer to WebRoute Handler
module.exports = authenticationRouter;