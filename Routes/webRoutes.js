/**
 * Web Routes Regestry
 */
module.exports = class WebRoutes {
    /**
     * Bind Routes with Controllers
     * @param {Object} APP -> Express APP instance 
     */
    constructor(APP) {
        // Authirize Route handeled By AuthirizeController
        APP.use('/', require('../Controller/Authorize'))

        // Authorization Route
        // APP.use('/auth')
    }
}