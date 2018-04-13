var logginModule = {
  greet: function () {
    console.log("Loggin from module");
  }
};

(function () {
  document.write("<h1>Hello, Grunt!</h1>");
  logginModule.greet();
})();
