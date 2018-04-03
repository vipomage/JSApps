function startApp() {
  sessionStorage.clear();
  const BASE_URL = "https://baas.kinvey.com/appdata/kid_Sy_dpdksM";
  const APP_KEY = "kid_Sy_dpdksM";
  const APP_SECRET = "159f91e9e16345d7bdab3544bc1bc2ec";
  let username;
  let password;

  checkUserLogin();

  attachButtons();

  function showStatus(status) {
    $("section#infoBox").replaceWith(
      $(`<section id="infoBox" class="infoBox">${status}</section>`)
    );
    $("section#infoBox").show();
    setTimeout(() => {
      $("section#infoBox").hide(300);
    }, 3000);
  }

  function attachButtons() {
    $("#linkHome").on("click", () => {
      $("#viewLogin").hide();
      $("#viewRegister").hide();
    });
    $("#linkLogin").on("click", showLogin);
    $("#linkLogout").on("click", logoutUser);
    $("#linkRegister").on("click", showRegister);
    $("#buttonRegisterUser").on("click", registerUser);
    $("#buttonLoginUser").on("click", loginUser);
    $("#linkListAds").on("click", listAds);
    $("#linkCreateAd").on("click", showAdCreation);
    $("#buttonCreateAd").on("click", createAd);
    $("#linkHome").on("click", checkUserLogin);
  }

  function showError(error) {
    let err;
    if (!isNaN(error)) {
      switch (error) {
        case 409:
          err = "Username already exists";
          break;
        case 400:
          err = "Bad Request (Did you miss any input fields ?)";
          break;
        case 401:
          err = "You don't have permission to do that!";
          break;
        case 402:
          err = "Eh sorry brah gibe money";
          break;
        case 403:
          err = "Unfortunately thats forbidden";
          break;
        case 404:
          err = "Meh :/ couldn't find this";
          break;
        case 429:
          err = "Are you tryn to DDOS  me bro ?";
          break;
        case 500:
          err = "Meh kinvey got internal problems bad food maybe the cause";
          break;
        case 503:
          err = "Kinvey on a break give him a minute";
          break;
        case 444:
          err = "she is ignoring you brah :D";
          break;
        default:
          err = "Error occured";
          break;
      }
    } else {
      err = error;
    }

    $("#errorBox").replaceWith(
      $(`<section id="errorBox" class="errorBox">${err}</section>`)
    );
    $("#errorBox").show();
    setTimeout(() => {
      $("#errorBox").hide(400);
    }, 3000);
  }

  function showNotLogged() {
    $("#linkHome,#linkLogin,#linkRegister,#viewHome").show();
  }

  function checkUserLogin() {
    if (sessionStorage.authToken === undefined) {
      showNotLogged();
      return false;
    } else {
      showLogged();
      $("#viewHome").show();
      return true;
    }
  }

  function showLogged() {
    $("#linkLogin,#linkRegister").hide();
    $("#viewLogin").hide();
    $("#linkHome").show();
    $("#linkCreateAd,#linkListAds,#linkLogout").show();
    $("main section").hide();
  }

  function showLogin() {
    $("#viewHome").hide();
    $("#viewRegister").hide();
    $("#viewLogin").show();
  }

  function showRegister() {
    $("#viewHome").hide();
    $("#viewLogin").hide();
    $("#viewRegister").show();
  }

  function showAdCreation() {
    $("#viewHome").hide();
    $("#viewAds").hide();
    $("#viewCreateAd").show();
  }

  function deleteAd(id, domElement) {
    loadingData(false);
    $.ajax({
      method: "DELETE",
      url: BASE_URL + `/ads/${id}`,
      headers: {
        Authorization: `Basic :${btoa(username + ":" + password)}`
      }
    })
      .then(response => {
        loadingData(true);
        showStatus("Successful deletion");
        domElement.remove();
      })
      .catch(err => {
        loadingData(true);
        showError(err.status);
      });
  }

  function createAd() {
    let title = $(
      '#formCreateAd > div:nth-child(2) > input[type="text"]'
    ).val();
    let description = $("#formCreateAd > div:nth-child(4) > textarea").val();
    let obj = $('#formCreateAd > div:nth-child(6) > input[type="date"]').val();
    let [year, month, day] = obj.split("-");
    let publishDate = new Date(year, month - 1, day);
    let publisher = username;
    let price = $(
      '#formCreateAd > div:nth-child(8) > input[type="number"]'
    ).val();
    let test = validForm(title, description, publishDate, price);
    if (
      test.correctTitle &&
      test.correctDescr &&
      test.correctDate &&
      test.correctPrice
    ) {
      $('#formCreateAd > div:nth-child(2) > input[type="text"]').css(
        "border",
        "none"
      );
      $("#formCreateAd > div:nth-child(4) > textarea").css("border", "none");
      $('#formCreateAd > div:nth-child(6) > input[type="date"]').css(
        "border",
        "none"
      );
      $('#formCreateAd > div:nth-child(8) > input[type="number"]').css(
        "border",
        "none"
      );
      loadingData(false);
      $.ajax({
        method: "POST",
        url: BASE_URL + "/ads",
        headers: {
          Authorization: `Basic :${btoa(username + ":" + password)}`
        },
        data: {
          title,
          description,
          publishDate,
          publisher,
          price: Number.parseFloat(price).toFixed(2)
        }
      })
        .then(response => {
          showStatus("Success");
          loadingData(true);
          document.getElementById("formCreateAd").reset();
          $("#linkListAds").click();
        })
        .catch(err => {
          loadingData(true);
        });
    } else {
      showError("Please fill all fields");
      if (!test.correctTitle) {
        $('#formCreateAd > div:nth-child(2) > input[type="text"]').css(
          "border",
          "1px solid red"
        );
      } else {
        $('#formCreateAd > div:nth-child(2) > input[type="text"]').css(
          "border",
          "none"
        );
      }
      if (!test.correctDescr) {
        $("#formCreateAd > div:nth-child(4) > textarea").css(
          "border",
          "1px solid red"
        );
      } else {
        $("#formCreateAd > div:nth-child(4) > textarea").css("border", "none");
      }
      if (!test.correctDate) {
        $('#formCreateAd > div:nth-child(6) > input[type="date"]').css(
          "border",
          "1px solid red"
        );
      } else {
        $('#formCreateAd > div:nth-child(6) > input[type="date"]').css(
          "border",
          "none"
        );
      }
      if (!test.correctPrice) {
        $('#formCreateAd > div:nth-child(8) > input[type="number"]').css(
          "border",
          "1px solid red"
        );
      } else {
        $('#formCreateAd > div:nth-child(8) > input[type="number"]').css(
          "border",
          "none"
        );
      }
    }
  }

  function listAds() {
    $("#viewHome").hide();
    $("#viewCreateAd").hide();
    $("#viewEditAd").hide();
    let container = $("#ads > table > tbody");
    container.replaceWith(
      $(`<tbody>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Publisher</th>
            <th>Date Published</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </tbody>`)
    );
    loadingData(false);
    $.ajax({
      url: BASE_URL + "/ads",
      headers: {
        Authorization: `Basic :${btoa(username + ":" + password)}`
      }
    })
      .then(response => {
        loadingData(true);
        if (response.length > 0) {
          $("#ads >table").replaceWith(
            $(
              "<table><tbody><tr>\n" +
                "<th>Title</th>\n" +
                "<th>Description</th>\n" +
                "<th>Publisher</th>\n" +
                "<th>Date Published</th>\n" +
                "<th>Price</th>\n" +
                "<th>Actions</th>\n" +
                "</tr></tbody></table>"
            )
          );
          for (let advert of response) {
            $("#ads p").replaceWith($("<table>"));
            let myDate = new Date(advert["publishDate"]);
            let buttonDelete = $(
              `<a id="btnDelete" href="#" itemprop="${advert._id}">[Delete]</a>`
            ).on("click", e => {
              let element = e.target.parentNode.parentNode;
              deleteAd(advert._id, element);
            });
            let buttonEdit = $(
              `<a id="btnEdit" href="#" itemprop="${advert._id}">[Edit]</a>`
            ).on("click", () => {
              loadingData(false);
              $.ajax({
                url: BASE_URL + `/ads/${advert._id}`,
                headers: {
                  Authorization: `Basic :${btoa(username + ":" + password)}`
                }
              })
                .then(response => {
                  loadingData(true);
                  let month = Number(
                    new Date(response.publishDate).toISOString().split("-")[1] -
                      1
                  );
                  let editDate = new Date(response.publishDate);
                  editDate.setMonth(month);
                  let date = myDate.toISOString().substr(0, 10);
                  $("#viewAds").hide();
                  $("#viewEditAd").show();
                  $('#formEditAd > div:nth-child(4) > input[type="text"]').val(
                    response.title
                  );
                  $("#formEditAd > div:nth-child(6) > textarea").val(
                    response.description
                  );
                  $('#formEditAd > div:nth-child(8) > input[type="date"]').val(
                    date
                  );
                  $(
                    '#formEditAd > div:nth-child(10) > input[type="number"]'
                  ).val(response.price);
                  loadingData(true);
                  $("#buttonEditAd").on("click", () => {
                    let obj = {
                      title: $(
                        '#formEditAd > div:nth-child(4) > input[type="text"]'
                      ).val(),
                      description: $(
                        "#formEditAd > div:nth-child(6) > textarea"
                      ).val(),
                      publishDate: $(
                        '#formEditAd > div:nth-child(8) > input[type="date"]'
                      ).val(),
                      price: $(
                        '#formEditAd > div:nth-child(10) > input[type="number"]'
                      ).val(),
                      publisher: username
                    };
                    loadingData(true);
                    $.ajax({
                      method: "PUT",
                      url: BASE_URL + `/ads/${advert._id}`,
                      headers: {
                        Authorization: `Basic :${btoa(
                          username + ":" + password
                        )}`
                      },
                      data: obj
                    })
                      .then(response => {
                        loadingData(true);
                        $("#linkListAds").click();
                      })
                      .catch(err => {
                        showError(err.status);
                      });
                  });
                })
                .catch(err => {
                  loadingData(true);
                });
            });

            let title = $(`<td>${advert["title"]}</td>`);
            let publisher = $(`<td>${advert["publisher"]}</td>`);
            let description = $(`<td>${advert["description"]}</td>`);
            let price = $(`<td>${advert["price"]}</td>`);
            let date = $(`<td>${myDate.toISOString().substr(0, 10)}</td>`);
            let buttons = $(`<td>`);
            buttons.append(buttonDelete, buttonEdit);
            let row = $("<tr>");
            row.append(title, description, publisher, date, price, buttons);
            $("#ads > table > tbody").append(row);
          }
        } else {
          $("#ads >table").replaceWith($("<p>No advertisements available</p>"));
        }
      })
      .catch(err => {
        showError(err.status);
        loadingData(true);
      });
    $("#viewAds").show();
  }

  function registerUser() {
    username = $('#formRegister > div:nth-child(2) > input[type="text"]').val();
    password = $(
      '#formRegister > div:nth-child(4) > input[type="password"]'
    ).val();
    loadingData(false);
    $.ajax({
      method: "POST",
      url: `https://baas.kinvey.com/user/kid_Sy_dpdksM/`,
      headers: { Authorization: "Basic " + btoa(APP_KEY + ":" + APP_SECRET) },
      data: { username, password }
    })
      .then(response => {
        loadingData(true);
        showLogin();
        showStatus("Successful registration");
      })
      .catch(err => {
        loadingData(true);
        showError(err.status);
      });
  }

  function loginUser() {
    username = $('#formLogin > div:nth-child(2) > input[type="text"]').val();
    password = $(
      '#formLogin > div:nth-child(4) > input[type="password"]'
    ).val();
    loadingData(false);
    $.ajax({
      method: "POST",
      url: `https://baas.kinvey.com/user/kid_Sy_dpdksM/login`,
      headers: { Authorization: "Basic " + btoa(APP_KEY + ":" + APP_SECRET) },
      data: { username, password }
    })
      .then(response => {
        sessionStorage.setItem("username", response.username);
        sessionStorage.setItem("authToken", response._kmd.authtoken);
        sessionStorage.setItem("userId", response._id);
        checkUserLogin();
        loadingData(true);
        showStatus("Successful login");
      })
      .catch(err => {
        loadingData(true);
      });
  }

  function logoutUser() {
    sessionStorage.clear();
    $('#formLogin > div:nth-child(2) > input[type="text"]').val("");
    $('#formLogin > div:nth-child(4) > input[type="password"]').val("");
    $("#linkListAds").hide();
    $("#linkCreateAd").hide();
    $("#linkLogout").hide();
    $("#linkLogin").show();
    $("#linkRegister").show();

    $("main section").hide();

    showNotLogged();
  }

  function validForm(title, description, publishDate, price) {
    let correctTitle = title !== "";
    let correctDescr = description !== "";
    let correctDate = !isNaN(publishDate.getTime());
    let correctPrice = !isNaN(price) && price !== "";
    return { correctTitle, correctDescr, correctDate, correctPrice };
  }

  function loadingData(done) {
    if (!done) {
      $("#loadingBox").show();
    } else {
      $("#loadingBox").hide();
      $("#infoBox").val("Success");
    }
  }
}
