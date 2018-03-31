function attachEvents() {
  const BASE_URL =
    "https://baas.kinvey.com/appdata/kid_Bk2DIg29G/biggestCatches";
  const USER = "admin";
  const PASS = "root";
  const BASE_64 = btoa(`${USER}:${PASS}`);
  const AUTH_HEADER = {
    Authorization: "Basic " + BASE_64,
    "Content-type": "application/json"
  };

  function listCatches() {
    $.ajax({
      method: "GET",
      url: BASE_URL,
      headers: AUTH_HEADER
    })
      .then(response => {
        $(`div#catches`).empty();
        response.forEach(fish => {
          $(`div#catches`).append(
            $(
              `<div class="catch" data-id="${fish._id}">
            <label>Angler</label>
            <input type="text" class="angler" value="${fish.angler}">
            <label>Weight</label>
            <input type="number" class="weight" value="${fish.weight}">
            <label>Species</label>
            <input type="text" class="species" value="${fish.species}">
            <label>Location</label>
            <input type="text" class="location" value="${fish.location}">
            <label>Bait</label>
            <input type="text" class="bait" value="${fish.bait}">
            <label>Capture Time</label>
            <input type="number" class="captureTime" value="${
              fish.captureTime
            }">
            <button class="update">Update</button>
            <button class="delete">Delete</button>
        </div>`
            )
          );
          $(`button.update`).on("click", e => updateACatch(e));
          $(`button.delete`).on("click", e => updateACatch(e));
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  function createCatch() {
    let angler = $(`#addForm > input.angler`).val();
    let weight = $(`#addForm > input.weight`).val();
    let species = $(`#addForm > input.species`).val();
    let location = $(`#addForm > input.location`).val();
    let bait = $(`#addForm > input.bait`).val();
    let captureTime = $(`#addForm > input.captureTime`).val();
    let id;

    let object = {
      angler: angler,
      weight: Number(weight),
      species: species,
      location: location,
      bait: bait,
      captureTime: Number(captureTime)
    };

    $.ajax({
      method: "POST",
      url: BASE_URL,
      headers: AUTH_HEADER,
      data: JSON.stringify(object)
    })
      .then(response => {
        id = response._id;
        listCatches();
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  function updateACatch(e) {
    let element = e.target.parentElement;
    let id = element.getAttribute("data-id").toString();

    if (e.target.getAttribute("class") === "update") {
      let angler = element.children[1].value;
      let weight = element.children[3].value;
      let species = element.children[5].value;
      let location = element.children[7].value;
      let bait = element.children[9].value;
      let captureTime = element.children[11].value;

      element.children[1].setAttribute("value", angler);
      element.children[3].setAttribute("value", weight);
      element.children[5].setAttribute("value", species);
      element.children[7].setAttribute("value", location);
      element.children[9].setAttribute("value", bait);
      element.children[11].setAttribute("value", captureTime);

      let object = {
        angler: angler,
        weight: Number(weight),
        species: species,
        location: location,
        bait: bait,
        captureTime: Number(captureTime)
      };

      $.ajax({
        type: "PUT",
        url: BASE_URL + `/${id}`,
        data: JSON.stringify(object),
        headers: AUTH_HEADER
      });
    } else {
      $.ajax({
        method: "DELETE",
        url: BASE_URL + `/${id}`,
        headers: AUTH_HEADER
      }).then(() => {
        $(`div.catch[data-id=${id}]`).remove();
      });
    }
  }

  $(`#addForm > button`).on("click", createCatch);
  $(`#aside > button`).on("click", listCatches);
}
