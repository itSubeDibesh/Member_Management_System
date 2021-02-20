const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, SELECT_LIMIT } = require('../Config/Http'),
    memberRouter = express.Router();

// Return List of All Member as Json Dataset
memberRouter.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    const LoggedInUser = request.session.UserInfromation;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        // With Login
        count(queryBox.Member.Select.Count, parseInt(LoggedInUser.UserId), (result) => {
            count(queryBox.Member.Select.CountWithoutUser, null, (withoutResult) => {
                //    Without Login
                if (withoutResult)
                // With Login
                    if (response)
                    paginate(request.baseUrl, request.url, page, queryBox.Member.Select.Paginate, [parseInt(LoggedInUser.UserId), parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                        // Without Login
                        paginate(request.baseUrl, request.url, page, queryBox.Member.Select.PaginateWithoutUser, [parseInt(SELECT_LIMIT), parseInt(offset)], withoutResult.result.Total_Count, (responseLogin) => {
                            request.session.MemberInformation = res.response;
                            request.session.MemberWithLoginInformation = responseLogin.response;
                            console.log(responseLogin.response)
                            response.render('Member/member', {
                                title: 'Member',
                                layout: 'main',
                                link: "/Member",
                                UserInfromation: LoggedInUser,
                                MemberInformation: res.response,
                                MemberWithLoginInformation: responseLogin.response,
                            });
                        });
                    });
            });
        });
    } else {
        response.render('Member/member', {
            title: 'Member',
            layout: 'main',
            link: "/Member",
            UserInfromation: request.session.UserInfromation,
            MemberInformation: {
                success: false
            },
            MemberWithLoginInformation: {
                success: false
            }
        });
    }

});

// Member Add Edit GET request
memberRouter.get('/action/:Task', isLoggedIn, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { Member } = request.query;
    const UserInfromation = request.session.UserInfromation;
    // Check if task is null
    if (Task != null) {
        // Select All User Except Current User
        Exe.queryExecuator(queryBox.User.Select.All, parseInt(UserInfromation.UserId), (allUserError, allUserResult) => {
            if (allUserError != null) Error.log(allUserError);
            if (allUserResult) {
                // Select All Designation
                Exe.queryExecuator(queryBox.Designation.Select.All, null, (allDesignationError, allDesignationResult) => {
                    if (allDesignationError != null) Error.log(allDesignationError);
                    if (allDesignationResult) {
                        // Check if task is add or edit
                        if (Task == 'edit') {
                            // check if User is passed
                            if (Member != null) {
                                // Fetched Member By ID
                                Exe.queryExecuator(queryBox.Member.Select.ById, parseInt(Member), (memberByIdError, memberByIdResult) => {
                                    if (memberByIdError != null) Error.log(memberByIdError);
                                    if (memberByIdResult) {
                                        const MemberInformation = memberByIdResult[0];
                                        if (UserInfromation.UserId != MemberInformation.UserId) {
                                            response.render('Member/addEditMember', {
                                                title: 'Member',
                                                layout: 'main',
                                                pageType: Task,
                                                subTitle: "Edit",
                                                link: "/Member",
                                                UserInfromation,
                                                Lists: { User: allUserResult, Designation: allDesignationResult },
                                                MemberInformation,
                                                MemberWithLoginInformation: request.session.MemberWithLoginInformation
                                            });
                                        } else response.redirect('/Member');
                                    } else response.redirect('/Member');
                                });
                            } else response.redirect('/Member');
                        } else if (Task == 'add') {
                            // Render Add form
                            response.render('Member/addEditMember', {
                                title: 'Member',
                                layout: 'main',
                                pageType: Task,
                                subTitle: "Add",
                                link: "/Member",
                                UserInfromation,
                                Lists: { User: allUserResult, Designation: allDesignationResult }
                            });
                        } else response.render('Member/member', {
                            title: 'Member',
                            layout: 'main',
                            link: "/Member",
                            errors: [{ msg: `Invalid Request, Try again later!` }],
                            UserInfromation: UserInfromation,
                            MemberInformation: request.session.MemberInformation,
                            MemberWithLoginInformation: request.session.MemberWithLoginInformation
                        });
                    }
                });
            }
        });
    } else response.redirect('/User');
});

// Member Add Edit POST request
memberRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set Member!'),
    check('DesignationId')
    .notEmpty()
    .withMessage('Designation is Required to set Member!'),
    check('Name')
    .notEmpty()
    .withMessage('Name is Required to set Member!'),
    check('Profession')
    .notEmpty()
    .withMessage('Profession is Required to set Member!'),
    check('DOB')
    .notEmpty()
    .withMessage('DOB is Required to set Member!'),
    check('Address')
    .notEmpty()
    .withMessage('Address is Required to set Member!'),
    check('Gender')
    .notEmpty()
    .withMessage('Gender is Required to set Member!'),
    check('Contact')
    .notEmpty()
    .withMessage('Contact is Required to set Member!')
], isLoggedIn, (request, response) => {
    // Extracted Elements from request body
    let { Task, UserId, DesignationId, Name, DOB, Address, Profession, Gender, Contact, Status, Joined_Date, Membership_Renew_Status, Last_Renewed_Date } = request.body;
    const errors = validationResult(request);
    UserId = UserId != undefined || UserId != null ? parseInt(UserId) : null;
    DesignationId = DesignationId != undefined || DesignationId != null ? parseInt(DesignationId) : null;
    Status = Status != null ? Status : "Inactive";
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Executing Sql Query
            // `UserId`, `DesignationId`, `Name`, `DOB`, `Address`, `Profession`, `Gender`, `Contact`, `Status`, `Joined_Date`, `Membership_Renew_Status`, `Last_Renewed_Date`
            Exe.queryExecuator(queryBox.Member.Insert + `(${UserId},${DesignationId},'${Name}',${DOB},'${Address}','${Profession}','${Gender}',${Contact},'${Status}','${Joined_Date || null}','${Membership_Renew_Status || null}','${Last_Renewed_Date || null}')`, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Member');
            });
        } else if (Task == 'edit') {
            const { Member } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.Member.Update, [UserId, DesignationId, `${Name}`, DOB, `${Address}`, `${Profession}`, `${Gender}`, `${Contact}`, `${Status}`, Joined_Date || null, Membership_Renew_Status || null, Last_Renewed_Date || null, parseInt(Member)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Member');
            });
        } else response.render('Member/member', {
            title: 'Member',
            layout: 'main',
            link: "/Member",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            MemberInformation: request.session.MemberInformation,
            MemberWithLoginInformation: request.session.MemberWithLoginInformation
        });
    } else
        response.render('Member/member', {
            title: 'Member',
            layout: 'main',
            link: "/Member",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            MemberInformation: request.session.MemberInformation,
            MemberWithLoginInformation: request.session.MemberWithLoginInformation
        });
});

memberRouter.post('/remove/:Member', isLoggedIn, (request, response) => {
    const { Member } = request.params;
    if (Member != null) {
        Exe.queryExecuator(queryBox.Member.Delete, parseInt(Member), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/Member');
        });
    } else response.render('Member/member', {
        title: 'Member',
        layout: 'main',
        link: "/Member",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        MemberInformation: request.session.MemberInformation,
        MemberWithLoginInformation: request.session.MemberWithLoginInformation
    });
});
module.exports = memberRouter;