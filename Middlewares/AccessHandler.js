module.exports =
    /**
     * Middle Ware to handle Access
     * @param {object} request 
     * @param {object} response 
     * @param {object} next 
     */
    function(request, response, next) {
        console.log("URL", request.url)
        console.log("Session", request.session)
    }