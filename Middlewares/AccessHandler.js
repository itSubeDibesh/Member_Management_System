/**
 * Extract Access List and Assigned Routes from the Json File and Match to the database pesrmssion set an allow access accordingly
 */
const AccessList = require('./AccessList.json').AccessList;
module.exports =
    /**
     * Middle Ware to handle Access
     * @param {object} request 
     * @param {object} response 
     * @param {object} next 
     */
    function(request, response, next) {
        if (HasRole(request.originalUrl, request.session.UserRolePermissionList))
            next();
        else response.render('dashboard', {
            title: 'Dashboard',
            layout: 'main',
            errors: [{ msg: `Unauthorized Access! Contact Administrator!` }],
            UserInfromation: request.session.UserInfromation,
            LoginInformation: request.session.LoginInformation,
        });
    }

/**
 * Match And Return Boolean if URl includes the Access List
 * @param {String} RequestURL
 * @param {array} PermissionList
 */
function HasRole(RequestURL, PermissionList) {
    const AccessObject = getAccessObject(RequestURL);
    if (PermissionList.length != 0) {
        for (let index = 0; index < PermissionList.length; index++) {
            const element = PermissionList[index];
            if (element.Permission == AccessObject.Permission_Name) {
                return element.RolePermission_Status == "Active" ? true : false;
            }
        }
        return false;
    }
    return false;
}

/**
 * Returns The Access Object 
 * @param {string} RequestURl 
 * @returns {object} Access Elemet
 */
function getAccessObject(RequestURl) {
    for (let index = 0; index < AccessList.length; index++) {
        const element = AccessList[index];
        for (let indexRoute = 0; indexRoute < element.Routes.length; indexRoute++) {
            const elementRoute = element.Routes[indexRoute];
            if (RequestURl.match(elementRoute))
                return element;
        }
    }
}