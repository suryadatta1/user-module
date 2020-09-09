const bcrypt = require("bcryptjs");

const ProfileController = function (Validator, rabbitMQ, profileRecord) {
    async function getAllProfiles(req, res, next) {
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
              let userDetails = await profileRecord.getProfiles();
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
  async function addProfile(req, res, next) {
    try {
      let rules = {
        bio: "required",
        dateOfBirth: "required",
        gender: "required",
        phone: "required",
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
          let profileAddStatus = await profileRecord.addProfile({
            bio: req.body.bio,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            phone: req.body.phone,
          });
          profileAddStatus.save()
          console.log(req.body)
          res.respond({
            http_code: 200,
            msg: "profile added",
            data: profileAddStatus,
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

  async function viewProfile(req, res, next) {
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
          // let response = await rabbitMQ.execute("profile.*", {"filter": "anand"});
          let profileDetails = await profileRecord.getProfile(
            req.params.profile_id
          );
          res.respond({
            http_code: 200,
            msg: "profile details",
            data: profileDetails,
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

  async function deleteProfile(req, res, next) {
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
          // let response = await rabbitMQ.execute("profile.*", {"filter": "anand"});
          let profileDetails = await profileRecord.deleteProfile(
            req.params.profile_id
          );
          res.respond({
            http_code: 200,
            msg: "profile deleted",
            data: profileDetails,
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

  async function editProfile(req, res, next) {
    try {
      req.body.profile_id = req.params.profile_id;

      let rules = {
        profile_id: "required|exists:profile,_id",
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
          // let response = await rabbitMQ.execute("profile.*", {"filter": "anand"});
          let profileDetails = await profileRecord.editProfile(
            req.body.profile_id,
            req.body
          );
          res.respond({
            http_code: 200,
            msg: "profile edited",
            data: profileDetails,
          });
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

  //   async function rmqView(req, res, next) {
  //     try {
  //       let rules = {};

  //       let validation = new Validator(req.body, rules);

  //       validation.fails(() => {
  //         return res.err({
  //           errors: validation.errors.errors,
  //           http_code: 400,
  //         });
  //       });

  //       validation.passes(async () => {
  //         try {
  //           const rmqData = JSON.parse(
  //             (
  //               await rabbitMQ.execute(
  //                 "profile.view",
  //                 { profile_id: req.params.id },
  //                 1000
  //               )
  //             ).toString()
  //           );
  //           res.respond(rmqData);
  //         } catch (e) {
  //           // input validation was successful
  //           res.respond({ http_code: 500, error: e.message });
  //         }
  //       });
  //     } catch (e) {
  //       // error is unknown
  //       console.log(e);
  //       res.respond({ http_code: 500, error: e.message });
  //     }
  //   }

  return {
    getAllProfiles,
    addProfile,
    viewProfile,
    deleteProfile,
    editProfile,
    // rmqView,
  };
};

module.exports = ProfileController;
