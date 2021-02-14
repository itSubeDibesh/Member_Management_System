// Initialize Environment Variable
require('dotenv').config();
const { SET_JSON } = process.env;
class Request_Logger {
    constructor(app, request, error) {
        app.use((_request, _response, _next) => {
            if (SET_JSON != "true") {
                request.log(`${(_request.secure ? 'Secured' : 'Unsecured').toUpperCase()} ${_request.method} REQUEST ON ${_request.protocol}://${_request.headers.host}${_request.url} FROM IP [${_request.ip}] with HEADERS [${JSON.stringify(_request.headers)}] ${typeof (_request.body) == "object" && Object.keys(_request.body).length != 0 ? 'and BODY [' + JSON.stringify(_request.body) + ']' : ' '}`)
            } else
                request.log({
                    Request: {
                        Security_Type: (_request.secure ? 'Secured' : 'Unsecured').toUpperCase(),
                        Type: _request.method,
                        URL: `${_request.protocol}://${_request.headers.host}${_request.url}`,
                        IP: _request.ip,
                        HEADERS: _request.headers,
                        BODY: typeof (_request.body) == "object" && Object.keys(_request.body).length != 0 ? _request.body : null
                    }
                });
            _next();
        });

        app.use((_err, _req, _res, _next) => {
            error.log(_err.stack)
            _res.status(500).send({ success: !1, status: 500, result: 'Oops Something broke out!' });
            _next();
        })
    }
}

module.exports = Request_Logger