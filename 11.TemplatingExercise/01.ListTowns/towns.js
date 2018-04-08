function attachEvents() {
  $("#btnLoadTowns").on("click", () => {
    let source = $("#towns-template").html();
    let towns = {
      towns: $("#towns")
        .val()
        .split(", ")
    };
    let template = Handlebars.compile(source);
    let html = template(towns);
    $("#root").replaceWith(`<div id="root">${html}</div>`);
  });
}
