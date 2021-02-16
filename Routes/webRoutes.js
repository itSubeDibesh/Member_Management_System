/**
 * Web Routes Regestry
 */
module.exports = class WebRoutes {
    /**
     * Bind Routes with Controllers
     * @param {Object} APP -> Express APP instance 
     */
    constructor(APP) {
        // Authentication Route handeled By AuthenticationController
        APP.use('/', require('../Controller/Authentication'));

        // RolePermission Route handeled By RolePermissionController
        APP.use('/RolePermission', require('../Controller/RolePermission'));
    }
}