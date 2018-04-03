function startApp() {
  const BASE_URL = "https://baas.kinvey.com/appdata/kid_Sy_dpdksM";
  const APP_KEY = "kid_Sy_dpdksM";
  const APP_SECRET = "159f91e9e16345d7bdab3544bc1bc2ec";
  let username;
  let password;
  const AUTH_HEADERS = {
    Authorization: "Basic " + btoa(APP_KEY + ":" + APP_SECRET)
  };
  
  checkUserLogin();
  
  attachButtons();
  
  function showStatus(status) {
    $('section#infoBox').replaceWith($(`<section id="infoBox" class="infoBox">${status}</section>`));
    $('section#infoBox').show();
    setTimeout(()=>{$('section#infoBox').toggle(300)},3000);
    
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
    $('#linkHome').on('click',checkUserLogin);
  }
  
  function showError(error) {
    let err;
    switch ( error ) {
      case 409:
        err = 'Username already exists';
        break;
      case 400:
        err = 'Bad Request (Did you miss any input fields ?)';
        break;
      case 401:
        err = "You don't have permission to do that!";
        break;
      case 402:
        err = 'Eh sorry brah gibe money';
        break;
      case 403:
        err = 'Unfortunately thats forbidden';
        break;
      case 404:
        err = "Meh :/ couldn't find this";
        break;
      case 429:
        err = 'Are you tryn to DDOS  me bro ?';
        break;
      case 500:
        err = 'Meh kinvey got internal problems bad food maybe the cause';
        break;
      case 503:
        err = 'Kinvey on a break give him a minute';
        break;
      case 444:
        err = 'she is ignoring you brah :D';
        break;
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
    if ( sessionStorage.authToken === undefined ) {
      showNotLogged();
      return false;
    } else {
      showLogged();
      return true;
    }
    
  }
  
  function showLogged() {
    $("#linkLogin,#linkRegister").hide();
    $("#viewLogin").hide();
    $('#linkHome').show();
    $("#linkCreateAd,#linkListAds,#linkLogout").show();
    $('main section').hide();
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
    $("#viewAds").hide();
    $("#viewCreateAd").show();
  }
  
  function deleteAd(id,domElement){
    $.ajax({
      method:'DELETE',
      url: BASE_URL+ `/ads/${id}`,
      headers: {
      Authorization: `Basic :${btoa(username + ":" + password)}`
    }
    }).then((response) => {
      showStatus('Successful deletion');
      domElement.remove();
      
    
    }).catch((err) => {
    
    })
  }
  
  function createAd() {
    let title = $(
      '#formCreateAd > div:nth-child(2) > input[type="text"]'
    ).val();
    let description = $("#formCreateAd > div:nth-child(4) > textarea").val();
    let obj = $('#formCreateAd > div:nth-child(6) > input[type="date"]').val();
    let [ year, month, day ] = obj.split("-");
    let publishDate = new Date(year, month - 1, day);
    let publisher = username;
    let price = $(
      '#formCreateAd > div:nth-child(8) > input[type="number"]'
    ).val();
    if ( validForm(title, description, publishDate, price) ) {
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
          //todo showloading
          showStatus('Success');
          document.getElementById('formCreateAd').reset();
        })
        .catch(err => {});
    } else {
      showError("Please fill all fields");
      if ( !correctTitle ) {
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
      if ( !correctDescr ) {
        $("#formCreateAd > div:nth-child(4) > textarea").css(
          "border",
          "1px solid red"
        );
      } else {
        $("#formCreateAd > div:nth-child(4) > textarea").css("border", "none");
      }
      if ( !correctDate ) {
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
      if ( !correctPrice ) {
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
    //todo fix relist after creating
    $("#viewCreateAd").hide();
    let container = $("#ads > table > tbody");
    container.replaceWith(
      $(
        `<tbody><tr><th>Title</th><th>Publisher</th><th>Description</th><th>Price</th><th>Date Published</th><th>Actions</th></tr></tbody>`
      )
    );
    $.ajax({
      url: BASE_URL + "/ads",
      headers: {
        Authorization: `Basic :${btoa(username + ":" + password)}`
      }
    })
      .then(response => {
        if (response.length > 0) {
          $("#ads >table").replaceWith($("<table><tbody><tr>\n" + "<th>Title</th>\n" + "<th>Publisher</th>\n" + "<th>Description</th>\n" + "<th>Price</th>\n" + "<th>Date Published</th>\n" + "<th>Actions</th>\n" + "</tr></tbody></table>"));
          for (let advert of response) {
            $("#ads p").replaceWith($("<table>"));
            let myDate = new Date(advert["publishDate"]);
            let buttonDelete = $(`<a id="btnDelete" href="#" itemprop="${advert._id}">[Delete]</a>`).on(
              "click",
              (e) => {
                let element = e.target.parentNode.parentNode;
                deleteAd(advert._id, element);
              }
            );
            let buttonEdit = $(`<a id="btnEdit" href="#" itemprop="${advert._id}">[Edit]</a>`).on(
              'click',
              ()=>{
              
              }
            );
            let title = $(`<td>${advert["title"]}</td>`);
            let publisher = $(`<td>${advert["publisher"]}</td>`);
            let description = $(`<td>${advert["description"]}</td>`);
            let price = $(`<td>${advert["price"]}</td>`);
            let date = $(`<td>${myDate.getFullYear()}-${myDate.getDay()}-${myDate.getDate()}</td>`);
            let buttons = $(`<td>`);
            buttons.append(buttonDelete, buttonEdit);
            let row = $("<tr>");
            row.append(title, publisher, description, price, date, buttons);
            $("#ads > table > tbody").append(row);
          }
        } else {
          $("#ads >table").replaceWith($("<p>No advertisements available</p>"));
        }
      })
      .catch(err => {
        showError(err.status);
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
      headers: AUTH_HEADERS,
      data: {username, password}
    })
      .then(response => {
        loadingData(true);
        showLogin();
        showStatus('Successful registration')
      })
      .catch(err => {
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
      headers: AUTH_HEADERS,
      data: {username, password}
    })
      .then(response => {
        sessionStorage.setItem("username", response.username);
        sessionStorage.setItem("authToken", response._kmd.authtoken);
        sessionStorage.setItem("userId", response._id);
        checkUserLogin();
        loadingData(true);
        showStatus('Successful login')
      })
      .catch(err => {});
  }
  
  function logoutUser() {
    sessionStorage.clear();
    $('#formLogin > div:nth-child(2) > input[type="text"]').val('');
    $('#formLogin > div:nth-child(4) > input[type="password"]').val('');
    $("#linkListAds").hide();
    $("#linkCreateAd").hide();
    $("#linkLogout").hide();
    $('#linkLogin').show();
    $('#linkRegister').show();
    
    $('main section').hide();
    
    showNotLogged();
    
  }
  
  function validForm(title, description, publishDate, price) {
    let correctTitle = title !== "";
    let correctDescr = description !== "";
    let correctDate = !isNaN(publishDate.getTime());
    let correctPrice = !isNaN(price) && price !== "";
    return {correctTitle, correctDescr, correctDate, correctPrice};
  }
  
  function loadingData(done) {
    if ( !done ) {
      $('#loadingBox').show();
    } else {
      $('#loadingBox').hide(400);
      $('#infoBox').val('Success');
    }
  }
}
