$(() => {
  renderCatTemplate().then(attachEvents);
  
  function attachEvents() {
    $("div > button").on("click", e => {
      let target = $(e.target);
      if ( e.target.textContent === "Show status code" ) {
        e.target.textContent = "Hide status code";
      } else {
        e.target.textContent = "Show status code";
      }
      $(target[ "0" ].nextElementSibling).toggle("display");
      console.log((target.textContent = "Hide status code"));
    });
  }
  
  async function renderCatTemplate() {
    let source = await $.get("template.hbs");
    let compiled = Handlebars.compile(source);
    let template = compiled({cats: window.cats});
    $("body").append(template);
  }
});
