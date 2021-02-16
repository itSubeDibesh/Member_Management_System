module.exports =
    /**
     * Middle Ware to Check if User is Loggedin
     * @param {object} request 
     * @param {object} response 
     * @param {object} next 
     */
    function(request, response, next) {
        if (request.session.LoginInformation === undefined && request.session.UserInfromation === undefined) {
            response.render('login', {
                title: 'Login',
                layout: false,
                data: request.body
            });
        } else {
            const { LoggedIn } = request.session.LoginInformation;
            if (LoggedIn == true)
                next();
            else {
                response.render('login', {
                    title: 'Login',
                    layout: false,
                    errors: [{ msg: 'Invalid login credentials!' }],
                    data: request.body
                });
            }
        }
    }