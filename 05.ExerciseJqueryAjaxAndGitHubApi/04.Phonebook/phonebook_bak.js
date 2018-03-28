function attachEvents() {
  $("#btnLoad").on("click", () => {
    load();
  });
  $("#btnCreate").on("click", () => {
    let obj = {
      person: $("#person").val(),
      phone: $("#phone").val()
    };
    $.ajax({
      method: "POST",
      url: "https://phonebook-nakov.firebaseio.com/phonebook/.json",
      data: JSON.stringify(obj)
    });
    $("#person").val("");
    $("#phone").val("");
    load();
  });

  function load() {
    $.ajax({
      url: "https://phonebook-nakov.firebaseio.com/phonebook/.json",
      success: populateData
    });

    function populateData(response) {
      $(`#phonebook`).empty();
      for (let contact in response) {
        let person;
        person = response[contact].hasOwnProperty("person")
          ? response[contact]["person"]
          : response[contact]["name"];
        let phone = response[contact]["phone"];
        $("#phonebook").append(
          $(
            `<li>${person}: ${phone} <span id="elmnt-id" style="display: none">${contact}</span></li>`
          ).append(
            $(` <button>[Delete]</button>`).on("click", e => {
              let idForDelete = $("#elmnt-id").val();
              console.log(contact);
              $.ajax({
                method: "DELETE",
                url: `https://phonebook-nakov.firebaseio.com/phonebook/${contact}.json`
              });
              setTimeout(function() {
                load();
              }, 2000); //or remove DOM ellement for immediate change
            })
          )
        );
      }
    }
  }
}
