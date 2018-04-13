function startApp() {
  sessionStorage.clear();
  const BASE_URL = "https://baas.kinvey.com/appdata/kid_Sy_dpdksM";
  const APP_KEY = "kid_Sy_dpdksM";
  const APP_SECRET = "159f91e9e16345d7bdab3544bc1bc2ec";
  $("main").append(
    $(
      `<section id="viewMore" class="viewMore" style="display: none;"></section>`
    )
  );
  attachUrlToEditForm();
  attachUrlToCreateForm();
  attachButtons();
  
  let username;
  let password;

  checkUserLogin();

  function attachUrlToEditForm() {
    if ($("#formEditAd")[0].length === 7) {
      $("#formEditAd").append($("<div>image:</div>"));
      $("#formEditAd").append($('<div><input type="text" name="image"></div>'));
      let btn = $("#formEditAd > div:nth-child(11)");
      $("#formEditAd > div:nth-child(11)").remove();
      $("#formEditAd").append(btn);
    }
  }

  function showStatus(status) {
    $("section#infoBox").replaceWith(
      $(`<section id="infoBox" class="infoBox">${status}</section>`)
    );
    $("section#infoBox").show();
    setTimeout(() => {
      $("section#infoBox").hide(300);
    }, 3000);
  }
  
  function attachUrlToCreateForm() {
    if ( $("#formCreateAd")[ 0 ].length === 5 ) {
      $("#formCreateAd").append($("<div>image:</div>"));
      $("#formCreateAd").append(
        $('<div><input type="text" placeholder="image URL"></div>')
      );
      let btn = $(`#formCreateAd > div:nth-child(9)`);
      $("#formCreateAd > div:nth-child(9)").remove();
      btn.on("click", createAd);
      $("#formCreateAd").append(btn);
    }
  }
  
  function showAdCreation() {
    $("#viewMore").hide();
    $("#viewHome").hide();
    $("#viewAds").hide();
    $("#viewCreateAd").show();
    
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
    $("#linkCreateAd").on("click", () => {
      showAdCreation();
      $("#viewEditAd").hide();
    });
    $("#buttonCreateAd").on("click", createAd, () => $("#viewCreateAd").hide());
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

  function deleteAd(id, domElement) {
    dataLoaded(false);
    $.ajax({
      method: "DELETE",
      url: BASE_URL + `/ads/${id}`,
      headers: {
        Authorization: `Basic :${btoa(username + ":" + password)}`
      }
    })
      .then(() => {
        dataLoaded(true);
        showStatus("Successful deletion");
        domElement.remove();
      })
      .catch(err => {
        dataLoaded(true);
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
    let imgUrl = $(
      '#formCreateAd > div:nth-child(10) > input[type="text"]'
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
      dataLoaded(false);
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
          imgUrl,
          viewCount: 1,
          price: Number.parseFloat(price).toFixed(2)
        }
      })
        .then(() => {
          showStatus("Success");
          dataLoaded(true);
          document.getElementById("formCreateAd").reset();
          $("#linkListAds").click();
        })
        .catch(() => {
          dataLoaded(true);
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
    $("#viewMore").hide();
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
    dataLoaded(false);
    $.ajax({
      url: BASE_URL + "/ads",
      headers: {
        Authorization: `Basic :${btoa(username + ":" + password)}`
      }
    })
      .then(response => {
        dataLoaded(true);
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
          for (let advert of response.sort(
            (a, b) => b.viewCount - a.viewCount
          )) {
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
            ).on("click", e => editAd(advert, e));
            let buttonMore = $(`<a href="#">[Read More]</a>`).on("click", e =>
              viewMore(advert, e)
            );

            let title = $(`<td>${advert["title"]}</td>`);
            let publisher = $(`<td>${advert["publisher"]}</td>`);
            let description = $(`<td>${advert["description"]}</td>`);
            let price = $(`<td>${advert["price"]}</td>`);
            let date = $(`<td>${myDate.toISOString().substr(0, 10)}</td>`);
            let buttons = $(`<td>`);

            buttons.append(buttonMore, buttonDelete, buttonEdit);
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
        dataLoaded(true);
      });
    $("#viewAds").show();
  }
  
  function increaseCount(advert) {
    let count = Number(++advert.viewCount);
    let obj = {
      title: advert.title,
      description: advert.description,
      imgUrl: advert.imgUrl,
      price: advert.price,
      publishDate: advert.publishDate,
      publisher: advert.publisher,
      viewCount: count
    };
    $.ajax({
      method: "PUT",
      url: BASE_URL + `/ads/${advert._id}`,
      headers: { Authorization: `Basic :${btoa(username + ":" + password)}` },
      data: obj
    });
  }

  function viewMore(advert) {
    dataLoaded(false);
    $.ajax({
      url: BASE_URL + `/ads/${advert._id}`,
      headers: {
        Authorization: `Basic :${btoa(username + ":" + password)}`
      }
    })
      .then(response => {
        increaseCount(advert);
        dataLoaded(true);
        let container = $("#viewMore");
        container.empty();
        let myDate = new Date(advert["publishDate"]);
        $("#viewAds").hide();
        $("#viewAds").hide();
        container.append($(`<img src="${response.imgUrl}">`));
        container.append($(`<p>Title:</p>`));
        container.append($(`<h2>${response.title}</h2>`));
        container.append($(`<p>Description:</p>`));
        container.append($(`<p>${response.description}</p>`));
        container.append($(`<p>Publisher:</p>`));
        container.append($(`<p>${response.publisher}</p>`));
        container.append($(`<p>Date:</p>`));
        container.append($(`<p>${myDate.toISOString().substr(0, 10)}</p>`));
        container.append(
          $(
            `<p style="font-weight: 500;font-size:1.1rem">Views: ${
              response.viewCount
            }</p>`
          )
        );
        $("main").append(container);
        $("#viewMore").show();
        dataLoaded(true);
      })
      .catch(err => {
        showError(err.status);
        dataLoaded(true);
      });
  }

  function editAd(advert, e) {
    if (e.target.parentNode.parentNode.childNodes[2].innerText === username) {
      dataLoaded(false);
      $.ajax({
        url: BASE_URL + `/ads/${advert._id}`,
        headers: {
          Authorization: `Basic :${btoa(username + ":" + password)}`
        }
      })
        .then(response => {
          dataLoaded(true);
          let myDate = new Date(advert["publishDate"]);
          let month = Number(
            new Date(response.publishDate).toISOString().split("-")[1] - 1
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
          $('#formEditAd > div:nth-child(8) > input[type="date"]').val(date);
          $('#formEditAd > div:nth-child(10) > input[type="number"]').val(
            response.price
          );
          $('#formEditAd > div:nth-child(12) > input[type="text"]').val(
            response.imgUrl
          );
          dataLoaded(true);
          $("#buttonEditAd").on("click", () => {
            let obj = {
              title: $(
                '#formEditAd > div:nth-child(4) > input[type="text"]'
              ).val(),
              description: $("#formEditAd > div:nth-child(6) > textarea").val(),
              publishDate: $(
                '#formEditAd > div:nth-child(8) > input[type="date"]'
              ).val(),
              price: $(
                '#formEditAd > div:nth-child(10) > input[type="number"]'
              ).val(),
              publisher: username,
              imgUrl: $(
                '#formEditAd > div:nth-child(12) > input[type="text"]'
              ).val(),
              viewCount: response.viewCount
            };
            dataLoaded(false);

            $.ajax({
              method: "PUT",
              url: BASE_URL + `/ads/${advert._id}`,
              headers: {
                Authorization: `Basic :${btoa(username + ":" + password)}`
              },
              data: obj
            })
              .then(() => {
                dataLoaded(true);
                showStatus("Successful Edit");
                $("#linkListAds").click();
              })
              .catch(err => {
                showError(err.status);
              });
          });
        })
        .catch(err => {
          showError(err.status);
          dataLoaded(true);
        });
    } else {
      showError("You dont have permission to do that!");
    }
  }

  function registerUser() {
    username = $('#formRegister > div:nth-child(2) > input[type="text"]').val();
    password = $(
      '#formRegister > div:nth-child(4) > input[type="password"]'
    ).val();
    dataLoaded(false);
    $.ajax({
      method: "POST",
      url: `https://baas.kinvey.com/user/kid_Sy_dpdksM/`,
      headers: { Authorization: "Basic " + btoa(APP_KEY + ":" + APP_SECRET) },
      data: { username, password }
    })
      .then(() => {
        dataLoaded(true);
        showLogin();
        showStatus("Successful registration");
      })
      .catch(err => {
        dataLoaded(true);
        showError(err.status);
      });
  }

  function loginUser() {
    username = $('#formLogin > div:nth-child(2) > input[type="text"]').val();
    password = $(
      '#formLogin > div:nth-child(4) > input[type="password"]'
    ).val();
    dataLoaded(false);
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
        dataLoaded(true);
        showStatus("Successful login");
      })
      .catch(() => {
        dataLoaded(true);
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
    username = undefined;
    password = undefined;
    showNotLogged();
  }

  function validForm(title, description, publishDate, price) {
    let correctTitle = title !== "";
    let correctDescr = description !== "";
    let correctDate = !isNaN(publishDate.getTime());
    let correctPrice = !isNaN(price) && price !== "";
    return { correctTitle, correctDescr, correctDate, correctPrice };
  }

  function dataLoaded(done) {
    if (!done) {
      $("#loadingBox").show();
    } else {
      $("#loadingBox").hide();
      $("#infoBox").val("Success");
    }
  }
}
