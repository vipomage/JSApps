function attachEvents() {
  $("div input#location.bl").focus();
  $(`#submit`).on("click", loadData);
  $(`div input#location.bl`).on("keypress", e => {
    if (e.keyCode === 13) {
      loadData();
    }
  });

  let code;

  function showErr() {
    $(`div#forecast`).show();
    $(`div#forecast #current`).textContent = "Error Occured";


  }

  function loadData() {
    $.ajax({
      url: `https://judgetests.firebaseio.com/locations.json`
    })
      .then(function(response) {
        let location = $(`div input#location.bl`).val();
        code = response.filter(
          loc => loc.name.toLowerCase() === location.toLowerCase()
        )[0].code;
        forecast();
        threeDay();
      })
      .catch(showErr);
  }

  function forecast() {
    $.ajax({
      url: `https://judgetests.firebaseio.com/forecast/today/${code}.json `
    })
      .then(response => parseLocal(response))
      .catch(showErr);
  }

  function threeDay() {
    $.ajax({
      url: `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json `
    })
      .then(response => parseThreeDay(response))
      .catch(showErr);
  }

  function parseLocal(values) {
    let symbol = returnSymbol(values.forecast.condition);
    $(`div#forecast`).show();
    $(`div#forecast #current`).replaceWith(
      $(`<div id="current"><div class="label">Current
    conditions</div></div>`)
    );
    let container = $(`div#forecast #current`);

    container.append($(`<span class="condition symbol">${symbol}</span>`));
    container.append($(`<span class="condition"></span>`));
    let innerContainer = $(`#current > span:nth-child(3)`);
    innerContainer.append(
      $(`<span class="forecast-data">${values.name}</span>`)
    );
    innerContainer.append(
      $(
        `<span class="forecast-data">${values.forecast.low +
          "&#176" +
          "/" +
          values.forecast.high +
          "&#176"}</span>`
      )
    );
    innerContainer.append(
      $(`<span class="forecast-data">${values.forecast.condition}</span>`)
    );
  }

  function parseThreeDay(values) {
    let container = $(`#upcoming`);
    container.empty();
    container.append($(`<div class="label">Three-day forecast</div>`));
    for (let upCond of values.forecast) {
      let child = $(`<span class="upcomming">
<span class="symbol">${returnSymbol(upCond.condition)}</span>
<span class="forecast-data">${upCond.low +
        "&#176" +
        "/" +
        upCond.high +
        "&#176"}</span>
<span class="forecast-data">${upCond.condition}</span>
</span>`);
      container.append(child);
    }
  }

  function returnSymbol(string) {
    switch (string) {
      case "Sunny":
        return "&#x2600";
      case "Partly sunny":
        return "&#x26C5";
      case "Overcast":
        return "&#x2601";
      case "Rain":
        return "&#x2614";
    }
  }
}
