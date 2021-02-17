// Initializing Environment Variable
require('dotenv').config();
const { SELECT_LIMIT } = process.env;
const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn } = require('../Config/Http'),
    rolePermissionRouter = express.Router();

// Return List of All Roles and Permission as Json Dataset
rolePermissionRouter.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.RolePermisionCountALL, [parseInt(request.session.UserInfromation.RoleId), parseInt(SELECT_LIMIT), parseInt(offset)], (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.RolePermisionPaginated, [parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    request.session.RolePermissionInformation = res.response;
                    console.log(res.response)
                    response.render('RolePermission/rolePermission', {
                        title: 'Roles Permission',
                        layout: 'main',
                        link: "/RolePermission",
                        UserInfromation: request.session.UserInfromation,
                        LoginInformation: request.session.LoginInformation,
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
            LoginInformation: request.session.LoginInformation,
            RolePermissionInformation: {
                success: false,
                status: 400,
                message: "Role or page missing!"
            }
        });
    }
});

// Role Permission Edit request
rolePermissionRouter.get('/action/:Task', isLoggedIn, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { Role, Permission } = request.query;
    // Check if task is null
    if (Task != null) {
        // Fetch Roles and Permission Details to load in form
        const multipleQueries = `${queryBox.RoleSelectAll}; ${queryBox.PermissionSelectAll}`;
        Exe.queryExecuator(multipleQueries, null, (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) {
                const rolePermissionObject = { Role: result[0], Permission: result[1] };
                // Check if task is add or edit
                if (Task == 'edit') {
                    // check if Role and permission are passed
                    if (Role != null && Permission != null) {
                        // Fetch Role Permission details matching role and permission and send it as well



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
                        LoginInformation: request.session.LoginInformation,
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
    .withMessage('Permission is Required to set Role Permission!'),
    check('Status')
    .notEmpty()
    .withMessage('Status is Required to set Role Permission')
], isLoggedIn, (request, response) => {
    // Extracted Elements from request body
    const { Task, RoleId, PermissionId, Status } = request.body;
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Perform Add operation
            let sqlParams = "";
            for (let index = 0; index < PermissionId.length; index++) {
                const element = PermissionId[index];
                sqlParams += `(${RoleId},${element},'${Status}'), `;
            }
            sqlParams = sqlParams.substr(0, sqlParams.lastIndexOf(','));
            sqlParams = queryBox.BulkInsertRolePermission + sqlParams;
            // Executing Sql Query
            Exe.queryExecuator(sqlParams, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/RolePermission');
            });
        } else if (Task == 'edit') {
            console.log(Task, RoleId, PermissionId, Status)
                // Perform edit operation




        } else response.render('RolePermission/rolePermission', {
            title: 'Roles Permission',
            layout: 'main',
            link: "/RolePermission",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            LoginInformation: request.session.LoginInformation,
            RolePermissionInformation: request.session.RolePermissionInformation
        });
    } else
        response.render('RolePermission/rolePermission', {
            title: 'Roles Permission',
            layout: 'main',
            link: "/RolePermission",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            LoginInformation: request.session.LoginInformation,
            RolePermissionInformation: request.session.RolePermissionInformation
        });
});

module.exports = rolePermissionRouter;