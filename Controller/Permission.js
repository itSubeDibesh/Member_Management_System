const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, SELECT_LIMIT } = require('../Config/Http'),
    permissionRouter = express.Router();

// Return List of All Permissions as Json Dataset
permissionRouter.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.Permission.Select.Count, null, (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.Permission.Select.Paginate, [parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    response.render('Permission/permission', {
                        title: 'Permissions',
                        layout: 'main',
                        link: "/Permission",
                        UserInfromation: request.session.UserInfromation,
                        PermissionInformation: res.response
                    });
                });
        });
    } else {
        response.render('Permission/permission', {
            title: 'Permissions',
            layout: 'main',
            link: "/Permission",
            UserInfromation: request.session.UserInfromation,
            PermissionInformation: {
                success: false
            }
        });
    }
});

// Permission Add Edit GET request
permissionRouter.get('/action/:Task', isLoggedIn, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { Permission } = request.query;
    // Check if task is null
    if (Task != null) {
        // Check if task is add or edit
        if (Task == 'edit') {
            // check if Permission is passed
            if (Permission != null) {
                // Fetch Permission details matching Permission and send it as well
                Exe.queryExecuator(queryBox.Permission.Select.ById, parseInt(Permission), (editError, editResult) => {
                    if (editError != null) Error.log(editError);
                    request.session.EditPermission = editResult[0];
                    // Check if Result is not null
                    if (editResult) response.render('Permission/addEditPermission', {
                        title: 'Permissions',
                        layout: 'main',
                        pageType: Task,
                        subTitle: "Edit",
                        link: "/Permission",
                        UserInfromation: request.session.UserInfromation,
                        EditPermission: editResult[0]
                    });
                })
            } else response.redirect('/Permission');
        } else if (Task == 'add') {
            // Render Add form
            response.render('Permission/addEditPermission', {
                title: 'Permissions',
                layout: 'main',
                pageType: Task,
                subTitle: "Add",
                link: "/Permission",
                UserInfromation: request.session.UserInfromation,
            });
        } else response.redirect('/Permission');
    } else response.redirect('/Permission');
});

// Permission Add Edit POST request
permissionRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set Permission!'),
    check('Name')
    .notEmpty()
    .withMessage('Name is Required to set Permission!')
], isLoggedIn, (request, response) => {
    // Extracted Elements from request body
    let { Task, Name, Remarks } = request.body;
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Executing Sql Query
            Exe.queryExecuator(queryBox.Permission.Insert + `('${Name}','${Remarks}')`, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Permission');
            });
        } else if (Task == 'edit') {
            const { Permission } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.Permission.Update, [`${Name}`, `${Remarks}`, parseInt(Permission)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Permission');
            });
        } else response.render('Permission/permission', {
            title: 'Permissions',
            layout: 'main',
            link: "/Permission",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            EditPermission: request.session.EditPermission
        });
    } else
        response.render('Permission/permission', {
            title: 'Permissions ',
            layout: 'main',
            link: "/Permission",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            EditPermission: request.session.EditPermission
        });
});

permissionRouter.post('/remove/:Permission', isLoggedIn, (request, response) => {
    const { Permission } = request.params;
    if (Permission != null) {
        Exe.queryExecuator(queryBox.Permission.Delete, parseInt(Permission), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/Permission');
        });
    } else response.render('Permission/permission', {
        title: 'Permissions',
        layout: 'main',
        link: "/Permission",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        EditPermission: request.session.EditPermission
    });
});
module.exports = permissionRouter;