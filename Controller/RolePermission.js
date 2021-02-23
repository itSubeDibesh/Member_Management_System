const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, AllowAccess, SELECT_LIMIT } = require('../Config/Http'),
    rolePermissionRouter = express.Router();

// Return List of All Roles and Permission as Json Dataset
rolePermissionRouter.get('/', isLoggedIn, AllowAccess, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.RolePermission.Select.Count.CountALL, [parseInt(request.session.UserInfromation.RoleId), parseInt(SELECT_LIMIT), parseInt(offset)], (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.RolePermission.Select.Paginate.All, [parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    request.session.RolePermissionInformation = res.response;
                    response.render('RolePermission/rolePermission', {
                        title: 'Roles Permission',
                        layout: 'main',
                        link: "/RolePermission",
                        UserInfromation: request.session.UserInfromation,
                        RolePermissionInformation: res.response
                    });
                });
        });
    } else {
        response.render('RolePermission/rolePermission', {
            title: 'Roles Permission',
            layout: 'main',
            link: "/RolePermission",
            UserInfromation: request.session.UserInfromation,
            RolePermissionInformation: {
                success: false
            }
        });
    }
});

// Role Permission Edit request
rolePermissionRouter.get('/action/:Task', isLoggedIn, AllowAccess, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { RolePermission } = request.query;
    // Check if task is null
    if (Task != null) {
        // Fetch Roles and Permission Details to load in form
        const multipleQueries = `${queryBox.Role.Select.All}; ${queryBox.Permission.Select.All}`;
        Exe.queryExecuator(multipleQueries, null, (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) {
                const rolePermissionObject = { Role: result[0], Permission: result[1] };
                // Check if task is add or edit
                if (Task == 'edit') {
                    // check if Role and permission are passed
                    if (RolePermission != null) {
                        // Fetch Role Permission details matching role and permission and send it as well
                        Exe.queryExecuator(queryBox.RolePermission.Select.All.ByRolePermissionId, parseInt(RolePermission), (editError, editResult) => {
                            if (editError != null) Error.log(editError);
                            // Check if Result is not null
                            if (editResult) response.render('RolePermission/addEditRolePermission', {
                                title: 'Roles Permission',
                                layout: 'main',
                                pageType: Task,
                                subTitle: "Edit",
                                link: "/RolePermission",
                                UserInfromation: request.session.UserInfromation,
                                RolePermissionList: rolePermissionObject,
                                EditRolePermission: editResult[0]
                            });
                        })
                    } else response.redirect('/RolePermission');
                } else if (Task == 'add') {
                    // Render Add form
                    response.render('RolePermission/addEditRolePermission', {
                        title: 'Roles Permission',
                        layout: 'main',
                        pageType: Task,
                        subTitle: "Add",
                        link: "/RolePermission",
                        UserInfromation: request.session.UserInfromation,
                        RolePermissionList: rolePermissionObject
                    });
                } else response.redirect('/RolePermission');
            }
        });
    } else response.redirect('/RolePermission');
});

rolePermissionRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set Role Permission!'),
    check('RoleId')
    .notEmpty()
    .withMessage('Role is Required to set Role Permission!'),
    check('PermissionId')
    .notEmpty()
    .withMessage('Permission is Required to set Role Permission!')
], isLoggedIn, AllowAccess, (request, response) => {
    // Extracted Elements from request body
    let { Task, RoleId, PermissionId, Status } = request.body;
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        // Setting Status
        Status = Status != null ? Status : "Inactive";
        if (Task == 'add') {
            // Perform Add operation
            let sqlParams = "";
            for (let index = 0; index < PermissionId.length; index++) {
                const element = PermissionId[index];
                sqlParams += `(${RoleId},${element},'${Status}'), `;
            }
            sqlParams = sqlParams.substr(0, sqlParams.lastIndexOf(','));
            sqlParams = queryBox.RolePermission.Insert + sqlParams;
            // Executing Sql Query
            Exe.queryExecuator(sqlParams, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) {
                    Exe.queryExecuator(queryBox.RolePermission.Select.All.ByRoleId, parseInt(request.session.UserInfromation.RoleId), (roleError, roleResult) => {
                        if (roleError) Error.log(roleError);
                        if (roleResult)
                            request.session.UserRolePermissionList = roleResult;
                        response.redirect('/RolePermission');
                    });
                }

            });
        } else if (Task == 'edit') {
            const { RolePermission } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.RolePermission.Update, [parseInt(RoleId), parseInt(PermissionId), `${Status}`, parseInt(RolePermission)], (error, result) => {
                if (error != null) Error.log(error);
                Exe.queryExecuator(queryBox.RolePermission.Select.All.ByRoleId, parseInt(request.session.UserInfromation.RoleId), (roleError, roleResult) => {
                    if (roleError) Error.log(roleError);
                    if (roleResult)
                        request.session.UserRolePermissionList = roleResult;
                    if (result) response.redirect('/RolePermission');
                });
            });
        } else response.render('RolePermission/rolePermission', {
            title: 'Roles Permission',
            layout: 'main',
            link: "/RolePermission",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            RolePermissionInformation: request.session.RolePermissionInformation
        });
    } else
        response.render('RolePermission/rolePermission', {
            title: 'Roles Permission',
            layout: 'main',
            link: "/RolePermission",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            RolePermissionInformation: request.session.RolePermissionInformation
        });
});

rolePermissionRouter.post('/remove/:RolePermission', isLoggedIn, AllowAccess, (request, response) => {
    const { RolePermission } = request.params;
    if (RolePermission != null) {
        Exe.queryExecuator(queryBox.RolePermission.Delete.ByRolePermissionId, parseInt(RolePermission), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result)
                Exe.queryExecuator(queryBox.RolePermission.Select.All.ByRoleId, parseInt(request.session.UserInfromation.RoleId), (roleError, roleResult) => {
                    if (roleError) Error.log(roleError);
                    if (roleResult)
                        request.session.UserRolePermissionList = roleResult;
                    if (result) response.redirect('/RolePermission');
                });
        });
    } else response.render('RolePermission/rolePermission', {
        title: 'Roles Permission',
        layout: 'main',
        link: "/RolePermission",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        RolePermissionInformation: request.session.RolePermissionInformation
    });
});

module.exports = rolePermissionRouter;