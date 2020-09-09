const bcrypt = require("bcryptjs");
let mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const UserRecord = function (db) {
  async function addUser(userjObj) {
    return new Promise((resolve, reject) => {
      try {
        let newUser = new db.model("user")(userjObj);
        newUser
          .save()
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function getUser(user_id) {
    return new Promise((resolve, reject) => {
      try {
        db.model("user")
          .find({ _id: ObjectId(user_id) })
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function getUserLogin(email) {
    return new Promise((resolve, reject) => {
      try {
        db.model("user")
          .findOne({ email })
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function getUsers(filter) {
    return new Promise((resolve, reject) => {
      try {
        db.model("user")
          .find()
          .select("-password")
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function deleteUser(user_id) {
    return new Promise((resolve, reject) => {
      try {
        db.model("user")
          .remove({ _id: ObjectId(user_id) })
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function editUser(user_id, userObj) {
    return new Promise((resolve, reject) => {
      let pass;
      try {
        if (userObj) {
          if (userObj.password) {
            bcrypt.genSalt(12, (err, salt) => {
              bcrypt.hash(userObj.password, salt, (err, hash) => {
                if (err) throw err;
                userObj.password = hash;
                pass = hash;
                console.log(
                  "Inner value : ",
                  userObj.password,
                  "HASH : ",
                  hash
                );
                db.model("user")
                  .update({ _id: ObjectId(user_id) }, { $set: userObj })
                  .then((data) => {
                    resolve(data);
                  })
                  .catch((e) => {
                    reject(e);
                  });
              });
            });
          } else {
            db.model("user")
              .update({ _id: ObjectId(user_id) }, { $set: userObj })
              .then((data) => {
                resolve(data);
              })
              .catch((e) => {
                reject(e);
              });
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  return {
    getUser,
    addUser,
    getUsers,
    deleteUser,
    editUser,
    getUserLogin,
  };
};

module.exports = UserRecord;
