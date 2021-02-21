/**
 * Web Routes Regeistry
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

        // Role Route handeled By RoleController
        APP.use('/Role', require('../Controller/Role'));

        // Permission Route handeled By PermissionController
        APP.use('/Permission', require('../Controller/Permission'));

        // PenaltyCriteria Route handeled By PenaltyCriteriaController
        APP.use('/PenaltyCriteria', require('../Controller/PenaltyCriteria'));

        // Designation Route handeled By DesignationController
        APP.use('/Designation', require('../Controller/Designation'));

        // User Route handeled By UserController
        APP.use('/User', require('../Controller/User'));

        // Member Route handeled By MemberController
        APP.use('/Member', require('../Controller/Member'));

        // Branch Route handeled By BranchController
        APP.use('/Branch', require('../Controller/Branch'));

        // AlligationsAndRewards Route handeled By AlligationsAndRewardsController
        APP.use('/AlligationsAndRewards', require('../Controller/AlligationsAndRewards'));

        // Payments Route handeled By PaymentsController
        APP.use('/Payments', require('../Controller/Payment'));

        // Committe Route handeled By CommitteController
        APP.use('/Committe', require('../Controller/Committe'));

        // CommitteMember Route handeled By CommitteMemberController
        APP.use('/CommitteMember', require('../Controller/CommitteMember'));
    }
}