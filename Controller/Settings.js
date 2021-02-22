const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, SELECT_LIMIT } = require('../Config/Http'),
    settingsRouter = express.Router();

// Return List of All Settings as Json Dataset
settingsRouter.get('/', isLoggedIn, (request, response) => {
    const UserInfromation = request.session.UserInfromation;
    Exe.queryExecuator(queryBox.Member.Select.ByUserId, parseInt(UserInfromation.UserId), (error, result) => {
        if (error) Error.log(error);
        if (result) {
            const MemberInformation = result[0];
            request.session.MemberInformation = MemberInformation;
            response.render('Settings/settings', {
                title: 'Settings',
                layout: 'main',
                link: "/Settings",
                UserInfromation,
                MemberInformation
            });
        }
    });
});

// Memberinfo Edit POST request
settingsRouter.post('/MemberInfo', [
    check('DesignationId')
    .notEmpty()
    .withMessage('Designation is Required to update your profile!'),
    check('Name')
    .notEmpty()
    .withMessage('Name is Required to update your profile!'),
    check('Profession')
    .notEmpty()
    .withMessage('Profession is Required to update your profile!'),
    check('DOB')
    .notEmpty()
    .withMessage('DOB is Required to update your profile!'),
    check('Address')
    .notEmpty()
    .withMessage('Address is Required to update your profile!'),
    check('Gender')
    .notEmpty()
    .withMessage('Gender is Required to update your profile!'),
    check('Contact')
    .notEmpty()
    .withMessage('Contact is Required to update your profile!')
], isLoggedIn, (request, response) => {
    const UserInfromation = request.session.UserInfromation;
    // Extracted Elements from request body
    let { UserId, DesignationId, Name, DOB, Address, Profession, Gender, Contact, Status, Joined_Date, Membership_Renew_Status, Last_Renewed_Date } = request.body;
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        const { Member } = request.body;
        // Perform edit operation
        Exe.queryExecuator(queryBox.Member.Update, [UserId, DesignationId, `${Name}`, DOB, `${Address}`, `${Profession}`, `${Gender}`, `${Contact}`, `${Status}`, Joined_Date || null, Membership_Renew_Status || null, Last_Renewed_Date || null, parseInt(Member)], (error, result) => {
            if (error != null) Error.log(error);
            if (result) {
                Exe.queryExecuator(queryBox.Member.Select.ByUserId, parseInt(UserInfromation.UserId), (error, result) => {
                    if (error) Error.log(error);
                    if (result) {
                        const MemberInformation = result[0];
                        request.session.MemberInformation = MemberInformation;
                        response.render('Settings/settings', {
                            title: 'Settings',
                            layout: 'main',
                            link: "/Settings",
                            UserInfromation,
                            MemberInformation,
                            success: { msg: `${Name} some updates have been made in your profile!` },
                        });
                    }
                });
            }
        });
    } else
        response.render('Settings/settings', {
            title: 'Settings',
            layout: 'main',
            link: "/Settings",
            errors: errors.array(),
            UserInfromation,
            errors: errors.array(),
            MemberInformation: request.session.MemberInformation
        });
});

// Update User Name Only
settingsRouter.post('/UserName', [
    check('UserName')
    .notEmpty()
    .withMessage('User Name is Required to update your user credentials!'),
    check('CurrentPassword')
    .notEmpty()
    .withMessage('Current Password is Required to update your user credentials!'),
], isLoggedIn, (request, response) => {
    const errors = validationResult(request);
    const UserInfromation = request.session.UserInfromation;
    const { CurrentPassword, UserName, User, RoleId } = request.body;
    if (errors.isEmpty()) {
        if (UserInfromation.Password == CurrentPassword) {
            Exe.queryExecuator(queryBox.User.Update, [RoleId, `${UserName}`, `${CurrentPassword}`, parseInt(User)], (error, result) => {
                if (error) Error.log(error);
                if (result) {
                    request.session.destroy((err) => {
                        if (err) Error.log(err);
                        response.render('login', {
                            title: 'Login',
                            layout: false,
                            success: { msg: `Username Updated Successfully, Please login again!` },
                        });
                    });
                }
            })
        } else {
            response.render('Settings/settings', {
                title: 'Settings',
                layout: 'main',
                link: "/Settings",
                errors: [{ msg: `Invalid Password, Please Tryagain later with correct password!` }],
                UserInfromation,
                MemberInformation: request.session.MemberInformation
            });
        }
    } else {
        response.render('Settings/settings', {
            title: 'Settings',
            layout: 'main',
            link: "/Settings",
            UserInfromation,
            errors: errors.array(),
            MemberInformation: request.session.MemberInformation
        });
    }
});


// Update User Password Only
settingsRouter.post('/Password', [
    check('Old_Password')
    .notEmpty()
    .withMessage('Old Password is Required to update your user credentials!'),
    check('Password')
    .notEmpty()
    .withMessage('New Password is Required to update your user credentials!'),
], isLoggedIn, (request, response) => {
    const errors = validationResult(request);
    const UserInfromation = request.session.UserInfromation;
    const { Old_Password, Password, UserName, User, RoleId } = request.body;
    if (errors.isEmpty()) {
        if (UserInfromation.Password == Old_Password) {
            Exe.queryExecuator(queryBox.User.Update, [RoleId, `${UserName}`, `${Password}`, parseInt(User)], (error, result) => {
                if (error) Error.log(error);
                if (result) {
                    request.session.destroy((err) => {
                        if (err) Error.log(err);
                        response.render('login', {
                            title: 'Login',
                            layout: false,
                            success: { msg: `Password Updated Successfully, Please login again!` },
                        });
                    });
                }
            })
        } else {
            response.render('Settings/settings', {
                title: 'Settings',
                layout: 'main',
                link: "/Settings",
                errors: [{ msg: `Invalid Password, Please Tryagain later with correct password!` }],
                UserInfromation,
                MemberInformation: request.session.MemberInformation
            });
        }
    } else {
        response.render('Settings/settings', {
            title: 'Settings',
            layout: 'main',
            link: "/Settings",
            UserInfromation,
            errors: errors.array(),
            MemberInformation: request.session.MemberInformation
        });
    }
});

module.exports = settingsRouter;