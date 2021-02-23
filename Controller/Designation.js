const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, AllowAccess, SELECT_LIMIT } = require('../Config/Http'),
    designationRouter = express.Router();

// Return List of All Designation as Json Dataset
designationRouter.get('/', isLoggedIn, AllowAccess, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.Designation.Select.Count, null, (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.Designation.Select.Paginate, [parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    request.session.DesignationInformation = res.response;
                    response.render('Designation/designation', {
                        title: 'Designation',
                        layout: 'main',
                        link: "/Designation",
                        UserInfromation: request.session.UserInfromation,
                        DesignationInformation: res.response
                    });
                });
        });
    } else {
        response.render('Designation/designation', {
            title: 'Designation',
            layout: 'main',
            link: "/Designation",
            UserInfromation: request.session.UserInfromation,
            DesignationInformation: {
                success: false
            }
        });
    }
});

// Designation Add Edit GET request
designationRouter.get('/action/:Task', isLoggedIn, AllowAccess, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { Designation } = request.query;
    // Check if task is null
    if (Task != null) {
        // Check if task is add or edit
        if (Task == 'edit') {
            // check if Designation is passed
            if (Designation != null) {
                // Fetch Designation details matching Designation and send it as well
                Exe.queryExecuator(queryBox.Designation.Select.ById, parseInt(Designation), (editError, editResult) => {
                    if (editError != null) Error.log(editError);
                    request.session.EditDesignation = editResult[0];
                    // Check if Result is not null
                    if (editResult) response.render('Designation/addEditDesignation', {
                        title: 'Designation',
                        layout: 'main',
                        pageType: Task,
                        subTitle: "Edit",
                        link: "/Designation",
                        UserInfromation: request.session.UserInfromation,
                        EditDesignation: editResult[0]
                    });
                })
            } else response.redirect('/Designation');
        } else if (Task == 'add') {
            // Render Add form
            response.render('Designation/addEditDesignation', {
                title: 'Designation',
                layout: 'main',
                pageType: Task,
                subTitle: "Add",
                link: "/Designation",
                UserInfromation: request.session.UserInfromation,
            });
        } else response.redirect('/Designation');
    } else response.redirect('/Designation');
});

// Designation Add Edit POST request
designationRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set Designation!'),
    check('Name')
    .notEmpty()
    .withMessage('Name is Required to set Designation!'),
    check('Membership_Fee')
    .isNumeric()
    .withMessage('Membership Fee Must be number!')
    .notEmpty()
    .withMessage('Membership Fee is Required to set Designation!'),
    check('Hierarchy_Value')
    .isNumeric()
    .withMessage('Hierarchy Value Must be number!')
    .notEmpty()
    .withMessage('Hierarchy Value is Required to set Designation!')
], isLoggedIn, AllowAccess, (request, response) => {
    // Extracted Elements from request body
    let { Task, Name, Membership_Fee, Hierarchy_Value, Remarks } = request.body;
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Executing Sql Query
            Exe.queryExecuator(queryBox.Designation.Insert + `('${Name}',${Membership_Fee},${Hierarchy_Value},'${Remarks}')`, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Designation');
            });
        } else if (Task == 'edit') {
            const { Designation } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.Designation.Update, [`${Name}`, parseFloat(Membership_Fee), parseInt(Hierarchy_Value), `${Remarks}`, parseInt(Designation)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Designation');
            });
        } else response.render('Designation/designation', {
            title: 'Designation',
            layout: 'main',
            link: "/Designation",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            EditDesignation: request.session.EditDesignation,
            DesignationInformation: request.session.DesignationInformation
        });
    } else
        response.render('Designation/designation', {
            title: 'Designation',
            layout: 'main',
            link: "/Designation",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            EditDesignation: request.session.EditDesignation,
            DesignationInformation: request.session.DesignationInformation
        });
});

designationRouter.post('/remove/:Designation', isLoggedIn, AllowAccess, (request, response) => {
    const { Designation } = request.params;
    if (Designation != null) {
        Exe.queryExecuator(queryBox.Designation.Delete, parseInt(Designation), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/Designation');
        });
    } else response.render('Designation/designation', {
        title: 'Designation',
        layout: 'main',
        link: "/Designation",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        EditDesignation: request.session.EditDesignation,
        DesignationInformation: request.session.DesignationInformation
    });
});
module.exports = designationRouter;