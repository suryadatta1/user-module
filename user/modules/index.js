const {makeRouteInvoker} = require('bottlejs-express');

module.exports.apiRouter = (dependencies, rmq) => {
    const UserInvoker = makeRouteInvoker(dependencies, 'UserController')

    rmq.routes = {
        'user.view': UserInvoker('view')
    };

};
