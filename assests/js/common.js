{
  const searchForm = $("#search-form");
  const inputTag = $("#tag-input");
  const submitBtn = $("#submit");
  const loader = $(".loader");
  const loaderDiv = $(".loader-div");

  let postIdArray = [];

  function sendAjaxRequest(event) {
    event.preventDefault();
    $("#results").empty();
    // $(loaderDiv).css("height", "80vh");
    $(loader).css("display", "inline-block");
    console.log(postIdArray.length);
    const data = {
      search: $(inputTag).val(),
      count: 10,
      ignore: postIdArray,
    };
    const jsondata = JSON.stringify(data);
    $.ajax({
      type: "post",
      url: "/search",
      data: jsondata,
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function (data) {
        // $(loaderDiv).css("height", "auto");
        $(loader).css("display", "none");
        console.log(data);
        for (let result of data.data) {
          const resutlDOM = getResultDOM(result);
          $("#results").append(resutlDOM);
          postIdArray.push(result.postId);
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
    $("#next-posts").removeAttr("disabled");
  }

  function getButtonDOM() {
    return `
        <div class="post-button">
            <button id="next-posts">Next</button>
        </div>
      `;
  }

  function getResultDOM(result) {
    return `
            <div class="post" id="${result.postId}">
                <div class="left-container">
                    <img src="${result.image}" />
                </div> 

                <div class="right-container">
                    <h1><a href="/post?link=${result.url}&username=${result.username}">${result.heading}</a></h1>
                    <div class="user-details">
                        <h4>${result.username}</h4>
                        <h5>${result.blog}</h5>
                    </div>
                </div>
            </button>
        `;
  }

  function clearPostId() {
    postIdArray = [];
  }

  function init() {
    // console.log('JS')
    // searchForm.submit(sendAjaxRequest);
    // submitBtn.click(clearPostId);
    $("#next-posts").click(sendAjaxRequest);

    $(inputTag).keyup(function (event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        sendAjaxRequest(event);
        clearPostId();
      }
    });
  }

  init();
}
