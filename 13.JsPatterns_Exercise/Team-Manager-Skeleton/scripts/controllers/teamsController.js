let teamsController = (() => {
  function loadCatalog(ctx) {
    console.log(ctx);
    ctx.loggedIn = auth.isAuthenticated();
    ctx.username = auth.getUsername();
    teamsService.loadTeams().then(teamsData => {
      ctx.teams = teamsData;
      this.loadPartials({
        header: "./templates/common/header.hbs",
        footer: "./templates/common/footer.hbs",
        team: "./templates/catalog/team.hbs"
      }).then(function () {
        this.partial("./templates/catalog/teamCatalog.hbs");
      });
    });
  }
  
  function loadDetails(ctx) {
    ctx.loggedIn = auth.isAuthenticated();
    ctx.username = auth.getUsername();
    teamsService.loadTeamDetails((ctx.params._id.toString()).substr(1)).then(details => {
      ctx.name = details.name;
      ctx.comment = details.comment;
      this.loadPartials({
        header: "./templates/common/header.hbs",
        footer: "./templates/common/footer.hbs",
        team: "./templates/catalog/team.hbs",
        teamMember: "./templates/catalog/teamMember.hbs",
        teamControls: "./templates/catalog/teamControls.hbs"
      }).then(function () {
        this.partial("./templates/catalog/details.hbs");
      });
    });
  }
  
  return {
    loadCatalog,
    loadDetails
  };
})();
