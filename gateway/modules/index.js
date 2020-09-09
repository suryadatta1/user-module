const { makeRouteInvoker, makeMiddlewareInvoker } = require("bottlejs-express");

const middleware = require("../modules/api/middleware");

module.exports.apiRouter = (dependencies, app) => {
  const DefaultController = makeRouteInvoker(dependencies, "DefaultController");
  const UserInvoker = makeRouteInvoker(dependencies, "UserController");
  const ProfileInvoker = makeRouteInvoker(dependencies, "ProfileController");

  middleware.AttachRequestHelpers(dependencies, app);
  
 
  app.post("/api/user/login", UserInvoker("loginUser"));
  app.post("/api/user/add", UserInvoker("addUser"));
  middleware.ParseAuthToken(dependencies, app);
  app.get("/api/user/list", UserInvoker("getAllUsers"));
  app.get("/api/user/view/:user_id", UserInvoker("viewUser"));
  app.delete("/api/user/delete/:user_id", UserInvoker("deleteUser"));
  app.post('/api/user/edit/:user_id', UserInvoker('editUser'));

  app.get("/api/user/rmqView/:id", UserInvoker("rmqView"));
  app.get("/api/user/rmqView", UserInvoker("rmqView"));

  // profile
  app.get("/api/profile/list", ProfileInvoker("getAllProfiles"));
  app.post("/api/profile/add", ProfileInvoker("addProfile"));
  app.get("/api/profile/view/:profile_id", ProfileInvoker("viewProfile"));
  app.delete("/api/profile/delete/:profile_id",ProfileInvoker("deleteProfile"));
  app.post("/api/profile/edit/:profile_id", ProfileInvoker("editProfile"));

  app.get("/api", DefaultController("ping"));
  app.get("/api/ping", DefaultController("ping"));

  // middleware.ParseAuthToken(dependencies, app);
};