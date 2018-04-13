$(() => {
  const APP = Sammy("#main", function () {
    this.use("Handlebars", "hbs");
    
    this.get("#/index.html", ctx => {
      ctx.swap("<h1>Hello from Sammy.js</h1>");
    });
    
    this.get("#/about", function () {
      this.swap("<h1>About Page</h1>");
    });
    
    this.get("#/contact", function () {
      this.swap("<h1>Contacts page</h1>");
    });
    
    this.get("#/book/:bookId", ctx => {
      let bookId = ctx.params.bookId;
      console.log(bookId);
    });
    
    this.get("#/login", ctx => {
      ctx.swap(
        '<form action="#/login" method="post">\n' +
        '  User: <input name="user" type="text">\n' +
        '  Pass: <input name="pass" type="password">\n' +
        '  <input type="submit" value="Login">\n' +
        "</form>\n"
      );
    });
    
    this.post("#/login", ctx => {
      console.log(ctx.params.user);
      console.log(ctx.params.pass);
    });
    
    this.get('#/hello/:name', (ctx) => {
      ctx.title = 'Hello!';
      ctx.name = ctx.params.name;
      
      ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
      }).then(function () {
        this.partial("./templates/greeting.hbs")
      });
      
    });
    
  });
  
  APP.run();
});
