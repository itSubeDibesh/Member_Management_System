const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn } = require('../Config/Http'), authenticationRouter = express.Router();

// Dashboard if the Session has data set Else Login
authenticationRouter.get('/', isLoggedIn, (request, response) => {
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
authenticationRouter.get('/Dashboard', isLoggedIn, (request, response) => {
    const { UserName } = request.query;
    if (UserName.length != 0 && request.session.LoginInformation != undefined && request.session.UserInfromation != undefined) {
        if (UserName == request.session.LoginInformation.UserName && request.session.UserInfromation.UserName == UserName) {
            // Need to fetch all the role permission associated with user using RolePermisionByRoleId
            Exe.queryExecuator(queryBox.RolePermission.Select.All.ByRoleId, request.session.UserInfromation.RoleId, (error, result) => {
                if (error != null) Error.log(error);
                if (result)
                    if (result.length !== 0) request.session.RoleInformation = result;
                response.render('dashboard', {
                    title: 'Dashboard',
                    layout: 'main',
                    success: { msg: `Welcome ${UserName}, Have a wonderful day!` },
                    UserInfromation: request.session.UserInfromation,
                    LoginInformation: request.session.LoginInformation,
                    RoleInformation: request.session.RoleInformation
                });
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
], (request, response) => {
    // Check if Login Details Exists
    if (request.session.LoginInformation === undefined && request.session.UserInfromation === undefined) {
        // Storing Errors
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            // Destructuring requestuest Body 
            const { UserName, Password } = request.body;
            // Validate Database
            Exe.queryExecuator(queryBox.User.Login, [UserName, Password], (error, result) => {
                if (error != null) Error.log(error);
                if (result) {
                    if (result.length !== 0) {
                        request.session.LoginInformation = { UserName, LoggedIn: true };
                        request.session.UserInfromation = result[0];
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
                    response.render('login', {
                        title: 'Login',
                        layout: false,
                        errors: [{ msg: `Internal Issues, Try Again later!` }],
                        data: request.body
                    });
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