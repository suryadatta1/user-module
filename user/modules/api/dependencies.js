const _ = require('lodash');

const DefaultController = require('./controllers');
const UserController = require('./controllers/UserController');


const RabbitMQ = require('../utils/RabbitMQ');
const MongoDB = require('../utils/MongoDB');
const Validator = require('../utils/Validator')

const UserRecord = require('./db/UserRecord');

const APIDependencies = async function (diProvider) {
    let rmq = RabbitMQ();

    diProvider.constant('RabbitMQ', rmq);
    diProvider.service('MongoDB', MongoDB);
    diProvider.service('Validator', Validator, 'MongoDB');

    diProvider.service('UserRecord', UserRecord, 'MongoDB');

    diProvider.service('DefaultController', DefaultController);
    diProvider.service('UserController', UserController, 'Validator', 'RabbitMQ', 'UserRecord');
};

module.exports = APIDependencies;
