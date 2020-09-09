const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserController = function (Validator, rabbitMQ, userRecord) {
  async function getAllUsers(req, res, next) {
    try {
      let rules = {};

      let validation = new Validator(req.body, rules);

      validation.fails(() => {
        return res.err({
          errors: validation.errors.errors,
          http_code: 400,
        });
      });

      validation.passes(async () => {
        try {
          let userDetails = await userRecord.getUsers();
          res.respond({ http_code: 200, msg: "users list", data: userDetails });
        } catch (e) {
          // input validation was successful
          res.respond({ http_code: 500, error: e.message });
        }
      });
    } catch (e) {
      // error is unknown
      res.respond({ http_code: 500, error: e.message });
    }
  }

  async function addUser(req, res, next) {
    try {
      let rules = {
        name: "required",
        email: "required|email|unique:user",
        password: "required|min:6|confirmed",
      };
      let validation = new Validator(req.body, rules);
      validation.fails(() => {
        return res.err({
          errors: validation.errors.errors,
          http_code: 400,
        });
      });

      validation.passes(async () => {
        try {
          let userAddStatus = await userRecord.addUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });
          bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(userAddStatus.password, salt, (err, hash) => {
              if (err) throw err;

              userAddStatus.password = hash;
              userAddStatus.save();

              res.respond({
                http_code: 200,
                msg: "user added",
                data: userAddStatus,
              });
            });
          });
        } catch (e) {
          // input validation was successful
          res.respond({ http_code: 500, error: e.message });
        }
      });
    } catch (e) {
      // error is unknown
      res.respond({ http_code: 500, error: e.message });
    }
  }
  // user login
  async function loginUser(req, res, next) {
    try {
      let rules = {
        email: "required|email|exists:user,email",
        password: "required",
      };
      let validation = new Validator(req.body, rules);
      validation.fails(() => {
        return res.err({
          errors: validation.errors.errors,
          http_code: 400,
        });
      });

      validation.passes(async () => {
        try {
          const email = req.body.email;
          const password = req.body.password;

          let user = await userRecord.getUserLogin(email);
          // console.log("bcrypgt", req.body);
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
              const payload = { id: user.id, name: user.name }; // Create JWT Payload
              // Sign Token
              jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                  return res.json({
                    http_code: 200,
                    msg: "user logged in",
                    token: "Bearer " + token,
                  });
                }
              );
            } else {
              return res.status(400).json("invalid credentials");
            }
          });
        } catch (e) {
          // input validation was successful
          res.respond({ http_code: 500, error: e.message });
        }
      });
    } catch (e) {
      // error is unknown
      res.respond({ http_code: 500, error: e.message });
    }
  }

  async function viewUser(req, res, next) {
    try {
      let rules = {};

      let validation = new Validator(req.body, rules);

      validation.fails(() => {
        return res.err({
          errors: validation.errors.errors,
          http_code: 400,
        });
      });

      validation.passes(async () => {
        try {
          let userDetails = await userRecord.getUser(req.params.user_id);
          res.respond({
            http_code: 200,
            msg: "user details",
            data: userDetails,
          });
        } catch (e) {
          // input validation was successful
          res.respond({ http_code: 500, error: e.message });
        }
      });
    } catch (e) {
      // error is unknown
      res.respond({ http_code: 500, error: e.message });
    }
  }

  async function deleteUser(req, res, next) {
    try {
      let rules = {};

      let validation = new Validator(req.body, rules);

      validation.fails(() => {
        return res.err({
          errors: validation.errors.errors,
          http_code: 400,
        });
      });

      validation.passes(async () => {
        try {
          let userDetails = await userRecord.deleteUser(req.params.user_id);
          res.respond({
            http_code: 200,
            msg: "user deleted",
            data: userDetails,
          });
        } catch (e) {
          res.respond({ http_code: 500, error: e.message });
        }
      });
    } catch (e) {
      // error is unknown
      res.respond({ http_code: 500, error: e.message });
    }
  }

  //EDIT
  async function editUser(req, res, next) {
    try {
      req.body.user_id = req.params.user_id;

      let rules = {
	email:"email",
       	password:"min:6"
      };

      let validation = new Validator(req.body, rules);

      validation.fails(() => {
        return res.err({
          errors: validation.errors.errors,
          http_code: 400,
        });
      });

      validation.passes(async () => {
        try {
          let userDetails = await userRecord.editUser(
            req.body.user_id,
            req.body
          );

          res.respond({
            http_code: 200,
            msg: "user edited",
            data: userDetails,
          });
        } catch (e) {
          res.respond({ http_code: 500, error: e.message });
        }
      });
    } catch (e) {
      // error is unknown
      console.log(e);
      res.respond({ http_code: 500, error: e.message });
    }
  }

  async function rmqView(req, res, next) {
    try {
      let rules = {};

      let validation = new Validator(req.body, rules);

      validation.fails(() => {
        return res.err({
          errors: validation.errors.errors,
          http_code: 400,
        });
      });

      validation.passes(async () => {
        try {
          const rmqData = JSON.parse(
            (
              await rabbitMQ.execute(
                "user.view",
                { user_id: req.params.id },
                1000
              )
            ).toString()
          );
          res.respond(rmqData);
        } catch (e) {
          // input validation was successful
          res.respond({ http_code: 500, error: e.message });
        }
      });
    } catch (e) {
      // error is unknown
      console.log(e);
      res.respond({ http_code: 500, error: e.message });
    }
  }

  return {
    getAllUsers,
    addUser,
    loginUser,
    viewUser,
    deleteUser,
    editUser,
    rmqView,
  };
};

module.exports = UserController;
