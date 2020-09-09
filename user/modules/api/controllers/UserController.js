const UserController = function (Validator, rabbitMQ, userRecord) {

    async function view(req, res, next) {

        try {
            let rules = {
                "user_id" : "required|objectId|exists:user,_id"
            };
            let validation = new Validator(req.body, rules);

            validation.fails(() => {
                return res.err({
                    errors: validation.errors.errors,
                    http_code: 400
                });
            });

            validation.passes(async () => {
                try {
                    res.respond({http_code: 200, msg: 'coming from mars'})
                } catch (e) {
                    console.log(e);
                    return res.err({
                        error: e.message,
                        http_code: 500
                    });
                }
            });

        } catch (e) {
            console.log(e);
            return res.err({
                error: e.message,
                http_code: 500
            });
        }
    }


    return {
        view
    }

}

module.exports = UserController
