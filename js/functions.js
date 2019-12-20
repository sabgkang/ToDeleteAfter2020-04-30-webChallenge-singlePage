function addCourse() {
  console.log("addCourse");

  courseNum++;
  $("#courseNumber").text("新增團課課程 - U" + zeroFill(courseNum, 4));

  $("#courseTable").hide();
  $("#courseHistory").hide();
  $("#spacerBetweenTables").hide();

  $(".dataTables_filter").hide();
  $(".dataTables_info").hide();
  $('#courseTable_paginate').hide();
  $('#courseHistory_paginate').hide();

  $("#addCourse").show();

  $("#inProgress").hide();
  $("#addBtn").hide();
  $("#refreshBtn").hide();
  //      $("#addBtn").attr("disabled", true);
  //      $("#refreshBtn").attr("disabled", true);
}

function courseConfirm() {
  console.log("courseConfirm");
  console.log($("#courseName").val());

  console.log(typeof $("#Calories").val());
  var dataToAdd = [
            "U" + zeroFill(courseNum, 4),
            $("#courseName").val(),
            $("#coachName").val(),
            $("#courseTime").val(),
            $("#Calories").val(),
            $("#maxPersons").val(),
            $("#assistName").val(),
            $("#fee").val(),
            $("#otherDesc").val(),
          ];

  dataSet.push(dataToAdd);

  var courseTable = $('#courseTable').DataTable();
  courseTable.clear().draw();
  courseTable.rows.add(dataSet);
  courseTable.draw();

  $("#addCourse").hide();
  $("#courseTable").show();
  $("#spacerBetweenTables").show();
  $("#courseHistory").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#courseTable_paginate').show();
  $('#courseHistory_paginate').show();

  $("#inProgress").show();
  $("#addBtn").show();
  $("#refreshBtn").show();
  //      $("#addBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);      
}

function courseCancel() {
  console.log("courseCancel");
  courseNum--;
  $("#addCourse").hide();
  $("#spacerBetweenTables").show();
  $("#courseHistory").show();
  $("#courseTable").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#courseTable_paginate').show();
  $('#courseHistory_paginate').show();

  $("#inProgress").show();
  $("#addBtn").show();
  $("#refreshBtn").show();
  //      $("#addBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);       
}

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // always return a string
}

function refreshCourse() {
  console.log("Refresh Course");

  // TODO: 讀取 Database 的課程資料

  var courseTable = $('#courseTable').DataTable();
  courseTable.clear().draw();
  courseTable.rows.add(dataSet);
  courseTable.draw();

  var courseTable = $('#courseHistory').DataTable();
  courseTable.clear().draw();
  courseTable.rows.add(dataSetHistory);
  courseTable.draw();
}

function backToHome() {
  console.log("Refresh Course");

  $("#courseDetail").hide();

  $("#courseTable").show();
  $("#courseHistory").show();
  $("#spacerBetweenTables").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#courseTable_paginate').show();
  $('#courseHistory_paginate').show();
  $("#addCourse").hide();
  $("#inProgress").show();
  $("#addBtn").show();
  $("#refreshBtn").show();
}

function logInAndOut() {
  if (!isLogin) {
    $("#password").val("");
    $("#loginDiv").show();
  } else {
    firebase.auth().signOut();
  }
}

function signIn() {
  //check email
  if (!validateEmail($("#emailAddress").val())) {
    $("#emailAddress").val("");
    $("#emailAddress").attr("placeholder", "Email Address Error, try again!");
    $("#emailAddress").css("background-color", "yellow");
  } else {
    $("#loginDiv").hide();
    firebase.auth().signInWithEmailAndPassword($("#emailAddress").val(), $("#password").val()).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Login Error! Try again!")
    });
  }

}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
}


function signInAbort() {
  $("#loginDiv").hide();
}
