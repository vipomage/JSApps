function attachEvents() {
  const BASEURL = "https://baas.kinvey.com/appdata/kid_HkkUtE59M/";
  const USERNAME = "vipo";
  const PASS = "123456";
  const BASE_64 = btoa(`${USERNAME}:${PASS}`);
  const AUTH_HEADER = { Authorization: "Basic " + BASE_64 };
  let posts = {};

  $(`#btnLoadPosts`).on("click", loadPosts);
  $(`#btnViewPost`).on("click", loadComments);

  function loadPosts() {
    $.ajax({
      url: BASEURL + "posts",
      headers: AUTH_HEADER
    })
      .then(function(response) {
        $(`#posts`).empty();
        for (let post of response) {
          $(`#posts`).append(
            $(`<option value = "${post._id}">${post.title}</option>`)
          );
          posts[post._id] = post.body;
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function loadComments() {
    let postId = $(`#posts`).val();
    let postTitle = $(`#posts option:selected`).text();
    $(`#post-title`).text(postTitle);
    $(`#post-body`).text(posts[postId]);
    $.ajax({
      url: BASEURL + `comments/?query={"post_id": "${postId}"}`,
      headers: AUTH_HEADER
    }).then(function(response) {
      $(`#post-comments`).empty();
      for (let comm of response) {
        $(`#post-comments`).append($(`<li>${comm.text}</li>`));
      }
    });
  }
}
