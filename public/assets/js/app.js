$(".close-btn").on("click", function () {
  window.location.href = "/";
});

$(".close-btn-2").on("click", function () {
  window.location.href = "/favorites";
});



$(".scrape-btn").on("click", function () {

  event.preventDefault();
  $("section").empty();

  $.ajax("/scrape", {
    method: "GET"
  })

  $("#scrape-modal").modal("toggle");
});



$(".save-article-btn").on("click", function () {

  event.preventDefault();
  var id = $(this).attr("data-id");

  $.ajax("/save/" + id, {
    method: "PUT"
  })

  $("#saved-modal").modal("toggle");
});



$(".remove-article-btn").on("click", function () {

  event.preventDefault();
  var id = $(this).attr("data-id");

  $.ajax("/unsave/" + id, {
    method: "PUT"
  })

  $("#unsave-modal").modal("toggle");
});



$(".note-article-btn").on("click", function () {

  event.preventDefault();
  var id = $(this).attr("data-id");

  $.ajax("/find-note/" + id, {
    method: "GET"
  })
    .then(function (data) {
      $("#note-modal").modal("toggle");
      $(".modal-title").html(data.title);
      $(".saveNoteBtn").attr("data-id", id);


      for (i = 0; i < data.note.length; i++) {
        $(".noteArea").append(
          "<div class='card-body notecard' id='notecard'>" +
          "<h4 class='notecardTitle' data-id='" + data.note[i]._id + "'>" +
          data.note[i].title +
          "</h4>" +
          "<button type='button' class='btn btn-danger deleteNote' data-id='" + data.note[i]._id + "'>Delete</button>" +
          "</div>"
        );

      }

    });
});



$(".saveNoteBtn").on("click", function () {

  event.preventDefault();
  var id = $(this).attr("data-id");

  $.ajax("/update-note/" + id, {
    method: "POST",
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })

  $("#titleinput").val("");
  $("#bodyinput").val("");
  window.location.href = "/favorites";

});


$(".notecardTitle").on("click", function () {

  event.preventDefault();
  var id = $(this).attr("data-id");

  $.ajax("/create-note/" + id, {
    method: "POST",
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  console.log("-----------------" + data + "------------------")
});


$(".deleteNote").on("click", function () {

  event.preventDefault();
  var id = $(this).attr("data-id");

  $.ajax("/delete-note/" + id, {
    method: "DELETE",
  })
  window.location.href = "/favorites";
});