module.exports = function(request, response, next) {
    if (request.session.LoginInformation === undefined && request.session.UserInfromation.UserName === undefined) {
        response.render('login', {
            title: 'Login',
            layout: false,
            data: request.body
        });
    } else {
        const { LoggedIn } = request.session.LoginInformation;
        if (LoggedIn == true && request.session.LoginInformation.UserName == request.session.UserInfromation.UserName)
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