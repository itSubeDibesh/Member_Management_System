module.exports = function(request, response, next) {
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
            console.log("Here")
            response.render('login', {
                title: 'Login',
                layout: false,
                errors: [{ msg: 'Invalid login credentials!' }],
                data: request.body
            });
        }
    }
}