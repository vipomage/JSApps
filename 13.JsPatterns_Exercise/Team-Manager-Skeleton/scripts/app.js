$(() => {
  const app = Sammy("#main", function () {
    let appCtx = this;
    appCtx.use("Handlebars", "hbs");
    
    appCtx.get("/index.html", homeController.loadHomePage);
    appCtx.get("#/home", homeController.loadHomePage);
    appCtx.get("#/about", homeController.loadAboutPage);
    
    appCtx.get('#/catalog', teamsController.loadCatalog);
    appCtx.get('#/catalog/:_id', teamsController.loadDetails);
    
    appCtx.get("#/login", accountController.loadLoginPage);
    appCtx.get("#/register", accountController.loadRegisterPage);
    
    appCtx.post("#/login", accountController.loginUser);
    appCtx.post("#/register", accountController.registerUser);
    
    appCtx.get('#/logout', function (ctx) {
      sessionStorage.clear();
      ctx.redirect('#/home')
    });
  });
  
  app.run();
});
