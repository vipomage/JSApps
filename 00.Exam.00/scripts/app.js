function startApp() {
  clearSession();
  const BASE_URL = 'https://baas.kinvey.com';
  const APP_KEY = 'kid_rkGR10enz';
  const APP_SECRET = 'de05ecb5c7e24e608fde8e641c1dba7b';
  const KINVEY = {Authorization: "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
  const USER_AUTH = {};
  
  function showInfo(info) {
    $("#infoBox span")[ 0 ].textContent = info;
    $("#infoBox").show();
    $('#infoBox').on('click', e => {
      $(e.currentTarget).hide();
    });
    setTimeout(() => {
      $("#infoBox").hide();
    }, 3000);
  }
  
  function pageLoading(done) {
    if ( !done ) {
      $("#loadingBox").show();
    } else {
      $("#loadingBox").hide();
    }
  }
  
  function showErrNotification(error) {
    
    function showError(error) {
      let err;
      if ( !isNaN(error) ) {
        switch ( error ) {
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
      return err;
    }
    
    
    $("#errorBox span")[ 0 ].textContent = showError(error);
    $("#errorBox").show();
    $('#errorBox').on('click', e => {
      $(e.currentTarget).hide();
    });
    setTimeout(() => {
      $("#errorBox").hide();
    }, 3000);
  }
  
  function listReceipts(responseList) {
    
    let container = $('#all-receipt-view');
    $('#all-receipt-view > div').replaceWith($(`<div class="table">
                <div class="table-head">
                    <div class="col wide">Creation Date</div>
                    <div class="col wide">Items</div>
                    <div class="col">Total</div>
                    <div class="col">Actions</div>
                </div>
            </div>`));
    let table = $('#all-receipt-view > div');
    responseList.forEach(item => {
      let myDate = new Date(item._kmd.lmt).toISOString().replace('T', ' ').substr(0, 16);
      table.append($(`<div class="row">
                    <div class="col wide">${myDate}</div>
                    <div class="col wide">${item.productCount}</div>
                    <div class="col">${item.total}</div>
                    <div class="col">
                        <a href="#" itemid="${item._id}">Details</a>
                    </div>
                </div>`))
    });
    container.append($(table));
    attachBtnEvents();
  }
  
  function getMyReceipts() {
    pageLoading(false);
    $('#all-receipt-view').replaceWith($('<section id="all-receipt-view" style="">\n' +
      '            <h1>All Receipts</h1><div class="table"></div>\n' +
      '        </section>'));
    $.ajax({
      url: `https://baas.kinvey.com/appdata/${APP_KEY}/receipts?query={"_acl.creator":"${sessionStorage.getItem('id')}","active":"false"}`,
      headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authtoken')}`},
    }).then((response) => {
      pageLoading(true);
      listReceipts(response);
      attachBtnEvents();
      
    }).catch((err) => {
    
    })
  }
  
  function attachBtnEvents() {
    $('#registerBtn').on('click', e => {
      e.preventDefault();
      registerUser();
    }); // register
    
    
    $('#loginBtn').on('click', e => {
      e.preventDefault();
      loginUser();
    }); // login
    
    $('#nav > ul > li:nth-child(3) > a').on('click', () => {
      logoutUser();
      showNotLogged();
    }); // logout
    
    $('#addItemBtn').on('click', (e) => {
      e.preventDefault();
      createEntry(sessionStorage.getItem('recipeId'))
    });
    
    $('#nav > ul > li:nth-child(2) > a').on('click', () => {
      getActiveReceipt();
      $('#all-receipt-view').hide();
      $('#create-receipt-form').show();
      
    });
    
    $('#create-receipt-view div a').on('click', e => {
      let dbId = e.target.attributes[ 1 ].value;
      let domElmnt = e.target.parentNode.parentElement;
      removeEntry(dbId, domElmnt);
      
      
    });
    
    $('#checkoutBtn').on('click', (e) => {
      e.preventDefault();
      if ( $('#create-receipt-view div a').length !== 0 ) {
        updateReceipt(true);
        showInfo('Successful checkout!');
      } else {
        showErrNotification('You dont have any entry to checkout');
      }
    });
    
    $('#nav > ul > li:nth-child(1) > a').on('click', () => {
      $('#container section').hide();
      $('#all-receipt-view').show();
      getMyReceipts();
      
    });
    $('#all-receipt-view a').on('click', e => {
      let dbId = e.target.attributes[ 1 ].value;
      showDetails(dbId);
      
    });
    
  }
  
  
  function showNotLogged() {
    $('section:not("#welcome-section")').hide();
    $('#welcome-section').show();
    $('#profile').hide();
  }
  
  function clearSession() {
    sessionStorage.clear();
    checkLogin();
  }//
  
  function showLoggedUser() {
    $('#profile').show();
    $('#welcome-section').hide();
    $('#create-receipt-view').hide();
  }
  
  function checkLogin() {
    if ( sessionStorage.getItem("authtoken") !== null ) {
      showLoggedUser();
    } else {
      showNotLogged();
    }
  }//
  
  function sessionSet(res) {
    sessionStorage.setItem("username", res.username);
    sessionStorage.setItem("authtoken", res[ "_kmd" ][ "authtoken" ]);
    sessionStorage.setItem("id", res[ "_id" ]);
  }//
  
  function clearRegisterForm() {
    $('#username-register').val('');
    $('#password-register').val('');
    $('#password-register-check').val('');
  }
  
  function registerUser() {
    
    let username = $('#username-register').val();
    let password = $('#password-register').val();
    let repPassw = $('#password-register-check').val();
    
    let requirements =
      username !== "" &&
      username !== undefined &&
      username.length > 4 &&
      password.length > 1 &&
      password === repPassw;
    
    if ( requirements ) {
      pageLoading(false);
      $.ajax({
        method: "POST",
        url: `${BASE_URL}/user/${APP_KEY}/`,
        headers: KINVEY,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({username, password})
      })
        .then(response => {
          clearRegisterForm();
          pageLoading(true);
          sessionSet(response);
          showInfo('User registration successful.');
          checkLogin();
        })
        .catch(err => {
          pageLoading(true);
          showErrNotification(err.status);
        });
    } else {
      showErrNotification("Please fill all input fields");
    }
  }
  
  function clearLoginForm() {
    
    $('#username-login').val('');
    $('#password-login').val('');
  }
  
  function loginUser() {
    let username = $('#username-login').val();
    let password = $('#password-login').val();
    
    
    let requirements =
      username !== "" &&
      username !== undefined &&
      username.length > 4 &&
      password.length > 1;
    if ( requirements ) {
      pageLoading(false);
      $.ajax({
        method: "POST",
        url: BASE_URL + "/user/" + APP_KEY + "/login",
        headers: KINVEY,
        data: {username, password}
      })
        .then(response => {
          pageLoading(true);
          sessionSet(response);
          checkLogin();
          showInfo("Login successful.");
          clearLoginForm();
          $('#cashier').replaceWith($(`<div id="cashier">
                <span>Cashier: </span>
                <a href="#">${username}</a>
            </div>`))
        })
        .catch(err => {
          pageLoading(true);
          if ( err.status === 401 ) {
            showErrNotification("Invalid credentials");
          } else {
            showErrNotification(err.status);
          }
          clearLoginForm();
        });
    } else {
      showErrNotification("Please fill all input fields");
    }
  }
  
  function logoutUser() {
    pageLoading(false);
    $.ajax({
      method: "POST",
      url: BASE_URL + "/user/" + APP_KEY + "/_logout",
      headers: {
        'X-Kinvey-Api-Version': 1,
        Authorization: `Kinvey ${sessionStorage.getItem('authtoken')}`
      },
    }).then((response) => {
      pageLoading(true);
      clearSession();
      showInfo('Logout successful.');
    }).catch((err) => {
      showError('Error occured');
    })
    
    
  }
  
  function removeEntry(entryId, domElmnt) {
    domElmnt.remove();
    pageLoading(false);
    $.ajax({
      method: 'DELETE',
      url: `${BASE_URL}/appdata/${APP_KEY}/entries/${entryId}`,
      headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authtoken')}`},
    }).then((response) => {
      listEntries(sessionStorage.getItem('receiptId'));
      pageLoading(true);
    }).catch((err) => {
    
    })
  }
  
  function getActiveReceipt() {
    pageLoading(false);
    $.ajax({
      url: `https://baas.kinvey.com/appdata/${APP_KEY}/receipts?query={"_acl.creator":"${sessionStorage.getItem('id')}","active":"true"}`,
      headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authtoken')}`},
    }).then((response) => {
      pageLoading(true);
      if ( response.length === 0 ) {
        createReceipt();
      } else {
        listEntries(response[ 0 ]._id);
        sessionStorage.setItem('receiptId', response[ 0 ]._id);
      }
      
      
    }).catch((err) => {
    
    })
    
  }
  
  function createReceipt() {
    pageLoading(false);
    $.ajax({
      method: 'POST',
      url: `https://baas.kinvey.com/appdata/${APP_KEY}/receipts`,
      'Content-Type': 'application/json',
      headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authtoken')}`},
    }).then((response) => {
      pageLoading(true);
      listEntries(response._id);
      sessionStorage.setItem('receiptId', response._id);
    }).catch((err) => {
    
    })
  }
  
  function createEntry() {
    let type = $('#create-entry-form > div:nth-child(1) > input').val();
    let qty = $('#create-entry-form > div:nth-child(2) > input').val();
    let price = $('#create-entry-form > div:nth-child(3) > input').val();
    let obj = {
      receiptId: sessionStorage.getItem('receiptId'),
      price: Number(price),
      qty: Number(qty),
      type: type
    };
    pageLoading(false);
    $.ajax({
      method: 'POST',
      url: `${BASE_URL}/appdata/${APP_KEY}/entries`,
      headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authtoken')}`},
      data: obj
    }).then((response) => {
      pageLoading(true);
      listEntries(sessionStorage.getItem('receiptId'));
      
    }).catch((err) => {
      
    })
  }
  
  function listEntries(receiptId) {
    let total = 0;
    pageLoading(false);
    $.ajax({
      url: `https://baas.kinvey.com/appdata/${APP_KEY}/entries?query={"receiptId":"${receiptId}"}`,
      headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authtoken')}`},
    }).then((response) => {
      pageLoading(true);
      let container = $('#create-receipt-view > div');
      container.empty();
      let thead = $('<div class="table-head">\n' +
        '                    <div class="col wide">Product Name</div>\n' +
        '                    <div class="col wide">Quantity</div>\n' +
        '                    <div class="col wide">Price per Unit</div>\n' +
        '                    <div class="col">Sub-total</div>\n' +
        '                    <div class="col">Action</div>\n' +
        '                </div>');
      container.append(thead);
      
      response.forEach(entry => {
        total += entry.qty * entry.price;
        container.append($(`<div class="row">
                    <div class="col wide">${entry.type}</div>
                    <div class="col wide">${entry.qty}</div>
                    <div class="col wide">${entry.price}</div>
                    <div class="col">${entry.price * entry.qty}</div>
                    <div class="col right">
                     <a href="#" itemid="${entry._id}">✖</a>
                    </div>
                </div>`));
      });
      let inputFields = $('<div class="row">\n' +
        '                    <form id="create-entry-form">\n' +
        '                        <div class="col wide">\n' +
        '                            <input name="type" placeholder="Product name">\n' +
        '                        </div>\n' +
        '                        <div class="col wide">\n' +
        '                            <input name="qty" placeholder="Quantity">\n' +
        '                        </div>\n' +
        '                        <div class="col wide">\n' +
        '                            <input name="price" placeholder="Price per Unit">\n' +
        '                        </div>\n' +
        '                        <div class="col">Sub-total</div>\n' +
        '                        <div class="col">\n' +
        '                            <input id="addItemBtn" type="submit" value="Add">\n' +
        '                        </div>\n' +
        '                    </form>\n' +
        '                </div>');
      let tfoot = $(`<div class="table-foot">
       <form id="create-receipt-form">
       <div class="col wide"></div>
       <div class="col wide"></div>
       <div class="col wide right">Total:</div>
       <div class="col">${total}</div>
       <div class="col">
       <input id="checkoutBtn" type="submit" value="Checkout">
       </div>
       </form>
       </div>`);
      container.append(inputFields);
      container.append(tfoot);
      
      attachBtnEvents();
      updateReceipt();
      $('#create-receipt-view').show();
    }).catch((err) => {
    
    });
    
    
  }
  
  function showDetails(receiptId) {
    
    let total = 0;
    pageLoading(false);
    $.ajax({
      url: `https://baas.kinvey.com/appdata/${APP_KEY}/entries?query={"receiptId":"${receiptId}"}`,
      headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authtoken')}`},
    }).then((response) => {
      pageLoading(true);
      let container = $('#all-receipt-view > div');
      container.empty();
      let thead = $('<div class="table-head">\n' +
        '                    <div class="col wide">Product Name</div>\n' +
        '                    <div class="col wide">Quantity</div>\n' +
        '                    <div class="col wide">Price per Unit</div>\n' +
        '                    <div class="col">Sub-total</div>\n' +
        
        '                </div>');
      container.append(thead);
      response.forEach(entry => {
        total += entry.qty * entry.price;
        container.append($(`<div class="row">
                    <div class="col wide">${entry.type}</div>
                    <div class="col wide">${entry.qty}</div>
                    <div class="col wide">${entry.price}</div>
                    <div class="col">${entry.price * entry.qty}</div>
                    
                </div>`));
      });
      
      $('#all-receipt-view > h1').replaceWith($('<h1>Receipt Details</h1>'));
      attachBtnEvents();
    }).catch((err) => {
    
    });
    
  }
  
  function updateReceipt(finished) {
    let productCount = $('#create-receipt-view > div')[ "0" ].children.length - 3;
    let total = $(`#create-receipt-form > div:last-child`)[ "0" ].previousSibling.previousElementSibling.innerText;
    if ( finished ) {
      pageLoading(false);
      $.ajax({
        method: 'PUT',
        url: `https://baas.kinvey.com/appdata/${APP_KEY}/receipts/${sessionStorage.getItem('receiptId')}`,
        headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authtoken')}`},
        data: {productCount, total, active: false}
      }).then((response) => {
        pageLoading(true);
      }).catch((err) => {
      
      })
    } else {
      pageLoading(false);
      $.ajax({
        method: 'PUT',
        url: `https://baas.kinvey.com/appdata/${APP_KEY}/receipts/${sessionStorage.getItem('receiptId')}`,
        headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authtoken')}`},
        data: {productCount, total, active: true}
      }).then((response) => {
        pageLoading(true);
      }).catch((err) => {
        showErrNotification('Error ocured');
      })
    }
    
  }
  
  
  ////////////////////////////
  
  showNotLogged();
  attachBtnEvents();
  
  
}

