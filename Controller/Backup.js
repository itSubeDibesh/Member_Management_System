const { express, Exe, isLoggedIn, AllowAccess } = require('../Config/Http'), backupRouter = express.Router();

// Clears Up The Session
backupRouter.get('/', isLoggedIn, AllowAccess, (request, response) => {
    if (Exe.setDatabaseBackup())
        response.render('dashboard', {
            title: 'Dashboard',
            layout: 'main',
            success: { msg: `Database Backuped Successfully!` },
            UserInfromation: request.session.UserInfromation,
            LoginInformation: request.session.LoginInformation,
            UserRolePermissionList: request.session.UserRolePermissionList
        })
    else response.render('dashboard', {
        title: 'Dashboard',
        layout: 'main',
        errors: [{ msg: `Problem backing up database please try again later!` }],
        UserInfromation: request.session.UserInfromation,
        LoginInformation: request.session.LoginInformation,
        UserRolePermissionList: request.session.UserRolePermissionList
    });
});

// Exporting Routeer to WebRoute Handler
module.exports = backupRouter;