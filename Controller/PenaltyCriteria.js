const { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, SELECT_LIMIT } = require('../Config/Http'),
    penaltyCriteria = express.Router();

// Return List of All Penalty Criteria as Json Dataset
penaltyCriteria.get('/', isLoggedIn, (request, response) => {
    let page = parseInt(request.query.page) || 1;
    if (page != null) {
        const { paginate, count } = require('../Database/ExtraQuery'),
            offset = (page - 1) * parseInt(SELECT_LIMIT);
        count(queryBox.PenaltyCriteria.Select.Count, null, (result) => {
            if (response)
                paginate(request.baseUrl, request.url, page, queryBox.PenaltyCriteria.Select.Paginate, [parseInt(SELECT_LIMIT), parseInt(offset)], result.result.Total_Count, (res) => {
                    response.render('PenaltyCriteria/penaltyCriteria', {
                        title: 'Penalty Criteria',
                        layout: 'main',
                        link: "/PenaltyCriteria",
                        UserInfromation: request.session.UserInfromation,
                        PenaltyCriteriaInformation: res.response
                    });
                });
        });
    } else {
        response.render('PenaltyCriteria/penaltyCriteria', {
            title: 'Penalty Criteria',
            layout: 'main',
            link: "/PenaltyCriteria",
            UserInfromation: request.session.UserInfromation,
            PenaltyCriteriaInformation: {
                success: false
            }
        });
    }
});

// PenaltyCriteria Add Edit GET request
penaltyCriteria.get('/action/:Task', isLoggedIn, (request, response) => {
    // Extracting to define the condition
    const { Task } = request.params;
    const { PenaltyCriteria } = request.query;
    // Check if task is null
    if (Task != null) {
        // Check if task is add or edit
        if (Task == 'edit') {
            // check if PenaltyCriteria is passed
            if (PenaltyCriteria != null) {
                // Fetch PenaltyCriteria details matching PenaltyCriteria and send it as well
                Exe.queryExecuator(queryBox.PenaltyCriteria.Select.ById, parseInt(PenaltyCriteria), (editError, editResult) => {
                    if (editError != null) Error.log(editError);
                    request.session.EditPenaltyCriteria = editResult[0];
                    // Check if Result is not null
                    if (editResult) response.render('PenaltyCriteria/addEditPenaltyCriteria', {
                        title: 'Penalty Criteria',
                        layout: 'main',
                        pageType: Task,
                        subTitle: "Edit",
                        link: "/PenaltyCriteria",
                        UserInfromation: request.session.UserInfromation,
                        EditPenaltyCriteria: editResult[0]
                    });
                })
            } else response.redirect('/PenaltyCriteria');
        } else if (Task == 'add') {
            // Render Add form
            response.render('PenaltyCriteria/addEditPenaltyCriteria', {
                title: 'Penalty Criteria',
                layout: 'main',
                pageType: Task,
                subTitle: "Add",
                link: "/PenaltyCriteria",
                UserInfromation: request.session.UserInfromation,
            });
        } else response.redirect('/PenaltyCriteria');
    } else response.redirect('/PenaltyCriteria');
});

// PenaltyCriteria Add Edit POST request
penaltyCriteria.post('/Entry', [
    check('Task')
    .notEmpty()
    .withMessage('Task is Required to set PenaltyCriteria!'),
    check('Number_of_Exceeded_Days')
    .isNumeric()
    .withMessage('Number of Exceeded_Days must be number')
    .notEmpty()
    .withMessage('Number of Exceeded_Days is Required to set PenaltyCriteria!'),
    check('Amount')
    .isNumeric()
    .withMessage('Amount must be number')
    .notEmpty()
    .withMessage('Amount is Required to set PenaltyCriteria!')
], isLoggedIn, (request, response) => {
    // Extracted Elements from request body
    let { Task, Number_of_Exceeded_Days, Amount } = request.body;
    const errors = validationResult(request);
    if (errors.isEmpty()) {
        if (Task == 'add') {
            // Executing Sql Query
            Exe.queryExecuator(queryBox.PenaltyCriteria.Insert + `(${Number_of_Exceeded_Days},${Amount})`, null, (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/PenaltyCriteria');
            });
        } else if (Task == 'edit') {
            const { PenaltyCriteria } = request.body;
            // Perform edit operation
            Exe.queryExecuator(queryBox.PenaltyCriteria.Update, [Number_of_Exceeded_Days, Amount, parseInt(PenaltyCriteria)], (error, result) => {
                if (error != null) Error.log(error);
                if (result) response.redirect('/PenaltyCriteria');
            });
        } else response.render('PenaltyCriteria/penaltyCriteria', {
            title: 'Penalty Criteria',
            layout: 'main',
            link: "/PenaltyCriteria",
            errors: [{ msg: `Invalid Request, Try again later!` }],
            UserInfromation: request.session.UserInfromation,
            EditPenaltyCriteria: request.session.EditPenaltyCriteria
        });
    } else
        response.render('PenaltyCriteria/penaltyCriteria', {
            title: 'Penalty Criteria',
            layout: 'main',
            link: "/PenaltyCriteria",
            errors: errors.array(),
            UserInfromation: request.session.UserInfromation,
            EditPenaltyCriteria: request.session.EditPenaltyCriteria
        });
});

penaltyCriteria.post('/remove/:PenaltyCriteria', isLoggedIn, (request, response) => {
    const { PenaltyCriteria } = request.params;
    if (PenaltyCriteria != null) {
        Exe.queryExecuator(queryBox.PenaltyCriteria.Delete, parseInt(PenaltyCriteria), (error, result) => {
            if (error != null) Error.log(error);
            // Check if Result is not null
            if (result) response.redirect('/PenaltyCriteria');
        });
    } else response.render('PenaltyCriteria/penaltyCriteria', {
        title: 'Penalty Criteria',
        layout: 'main',
        link: "/PenaltyCriteria",
        errors: [{ msg: `Invalid Delete Request, Try again later!` }],
        UserInfromation: request.session.UserInfromation,
        EditPenaltyCriteria: request.session.EditPenaltyCriteria
    });
});
module.exports = penaltyCriteria;