const { body } = require('express-validator');

const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, SELECT_LIMIT } = require('../Config/Http'),
    paymentsRouter = express.Router();

// Return List of All Payments as Json Dataset
paymentsRouter.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.Payment.Select.Count, null, (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.Payment.Select.Paginate, [parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    request.session.PaymentInformation = res.response;
                    response.render('Payments/payment', {
                        title: 'Payments',
                        layout: 'main',
                        link: "/Payments",
                        UserInfromation: request.session.UserInfromation,
                        PaymentInformation: res.response
                    });
                });
        });
    } else {
        response.render('Payments/payment', {
            title: 'Payments',
            layout: 'main',
            link: "/Payments",
            UserInfromation: request.session.UserInfromation,
            PaymentInformation: {
                success: false
            }
        });
    }
});

// Payments Add Edit GET request
paymentsRouter.get('/action/:Task', isLoggedIn, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { Payments } = request.query;
    const UserInfromation = request.session.UserInfromation;
    // Check if task is null
    if (Task != null) {
        Exe.queryExecuator(queryBox.Member.Select.AllWithoutSelf, parseInt(UserInfromation.MemberId), (error, result) => {
            Exe.queryExecuator(queryBox.PenaltyCriteria.Select.All, null, (penaltyCriteriaError, penaltyCriteriaResult) => {
                if (penaltyCriteriaError != null) Error.log(penaltyCriteriaError);
                if (penaltyCriteriaResult) {
                    const PenaltyCriteria = penaltyCriteriaResult;
                    if (error != null) Error.log(error);
                    if (result) {
                        const MemberList = result;
                        // Check if task is add or edit
                        if (Task == 'edit') {
                            // check if Payments is passed
                            if (Payments != null) {
                                // Fetch Payments details matching Payments and send it as well
                                Exe.queryExecuator(queryBox.Payment.Select.ById, parseInt(Payments), (editError, editResult) => {
                                    if (editError != null) Error.log(editError);
                                    request.session.EditPayments = editResult[0];
                                    // Check if Result is not null
                                    if (editResult) response.render('Payments/addEditPayment', {
                                        title: 'Payments',
                                        layout: 'main',
                                        pageType: Task,
                                        subTitle: "Edit",
                                        link: "/Payments",
                                        UserInfromation,
                                        MemberList,
                                        PenaltyCriteria,
                                        EditPayments: editResult[0]
                                    });
                                })
                            } else response.redirect('/Payments');
                        } else if (Task == 'add') {
                            // Render Add form
                            response.render('Payments/addEditPayment', {
                                title: 'Payments',
                                layout: 'main',
                                pageType: Task,
                                subTitle: "Add",
                                link: "/Payments",
                                UserInfromation,
                                MemberList,
                                PenaltyCriteria
                            });
                        } else response.redirect('/Payments');
                    }
                }
            });
        });
    } else response.redirect('/Payments');
});

// Payments Add Edit POST request
paymentsRouter.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set Payments!'),
    check('MemberId')
    .notEmpty()
    .withMessage('Member is Required to set Payments!'),
    check('Payment_Title')
    .notEmpty()
    .withMessage('Payment Title is Required to set Payments!'),
    check('Amount')
    .notEmpty()
    .withMessage('Amount is Required to set Payments!')
], isLoggedIn, (request, response) => {
    // Extracted Elements from request body
    let { Task, MemberId, Payment_Title, Amount } = request.body;
    const errors = validationResult(request);
    console.log(request.body)
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Executing Sql Query
            Exe.queryExecuator(queryBox.Payment.Insert + `(${MemberId},'${Payment_Title}',${Amount})`, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Payments');
            });
        } else if (Task == 'edit') {
            const { Payments } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.Payment.Update, [`${MemberId}`, `${Payment_Title}`, Amount, parseInt(Payments)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/Payments');
            });
        } else response.render('Payments/payment', {
            title: 'Payments',
            layout: 'main',
            link: "/Payments",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            EditPayments: request.session.EditPayments,
            PaymentInformation: request.session.PaymentInformation
        });
    } else
        response.render('Payments/payment', {
            title: 'Payments',
            layout: 'main',
            link: "/Payments",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            EditPayments: request.session.EditPayments,
            PaymentInformation: request.session.PaymentInformation
        });
});

paymentsRouter.post('/remove/:Payments', isLoggedIn, (request, response) => {
    const { Payments } = request.params;
    if (Payments != null) {
        Exe.queryExecuator(queryBox.Payment.Delete, parseInt(Payments), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/Payments');
        });
    } else response.render('Payments/payment', {
        title: 'Payments',
        layout: 'main',
        link: "/Payments",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        PaymentInformation: request.session.PaymentInformation
    });
});
module.exports = paymentsRouter;