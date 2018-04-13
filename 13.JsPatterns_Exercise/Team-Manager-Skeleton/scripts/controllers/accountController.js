let accountController = (() => {
  function loadRegisterPage() {
    this.loadPartials({
      header: "./templates/common/header.hbs",
      footer: "./templates/common/footer.hbs",
      registerForm: "./templates/register/registerForm.hbs"
    }).then(function () {
      this.partial("./templates/register/registerPage.hbs");
    });
  }
  
  function loadLoginPage() {
    this.loadPartials({
      header: "./templates/common/header.hbs",
      footer: "./templates/common/footer.hbs",
      loginForm: "./templates/login/loginForm.hbs"
    }).then(function () {
      this.partial("./templates/login/loginPage.hbs");
    });
  }
  
  function registerUser(ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    let repeatPassword = ctx.params.repeatPassword;
    
    if ( repeatPassword === password ) {
      auth
        .register(username, password, repeatPassword)
        .then(function (userData) {
          auth.showInfo("You have registered successfully");
          auth.saveSession(userData);
          ctx.redirect("#/login");
        });
    } else {
      auth.showError("Wrong Password");
    }
  }
  
  function loginUser(ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    
    auth
      .login(username, password)
      .then(function (userData) {
        auth.showInfo("Successful login!");
        auth.saveSession(userData);
        ctx.redirect("#/home");
      })
      .catch(function () {
        auth.showError("Invalid credentials!");
      });
  }
  
  return {loadRegisterPage, loadLoginPage, registerUser, loginUser}
})();