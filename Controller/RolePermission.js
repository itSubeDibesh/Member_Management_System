// Initializing Environment Variable
require('dotenv').config();
const { SELECT_LIMIT } = process.env;
const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn } = require('../Config/Http'),
    rolePermissionRouter = express.Router();

// Return List of All Roles and Permission as Json Dataset
rolePermissionRouter.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    const { paginate, count } = require('../Database/ExtraQuery'),
        offset = (page - 1) * parseInt(SELECT_LIMIT);
    if (page != null) {
        count(queryBox.RolePermisionCount, [parseInt(request.session.UserInfromation.RoleId), parseInt(SELECT_LIMIT), parseInt(offset)], (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.RolePermisionPaginated, [parseInt(request.session.UserInfromation.RoleId), parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    response.render('rolePermission', {
                        title: 'Roles And Permission',
                        layout: 'main',
                        UserInfromation: request.session.UserInfromation,
                        LoginInformation: request.session.LoginInformation,
                        RoleInformation: res.response
                    });
                });
        });
    } else {
        response.render('rolePermission', {
            title: 'Roles And Permission',
            layout: 'main',
            UserInfromation: request.session.UserInfromation,
            LoginInformation: request.session.LoginInformation,
            RoleInformation: {
                success: false,
                status: 400,
                message: "Role or page missing!"
            }
        });
    }
});

// Role Permission Edit request
rolePermissionRouter.get('/editRolePermission', isLoggedIn, (request, response) => {
    console.log(request.params, request.query, request.body, request.session)
});

module.exports = rolePermissionRouter;