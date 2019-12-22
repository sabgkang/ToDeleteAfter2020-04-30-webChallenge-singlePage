function initMainPage() {
  $("#loginDiv").hide();
  $("#addCourse").hide();
  $("#coachTable").hide();
  $("#courseDetail").hide();
  $("#newCoachInfo").hide();
  $("#memberDiv").hide();
  $("#addMemberInfo").hide();  

  var memberTable = $('#memberTable').DataTable({
    data: memberData,
    pageLength: 10,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: 姓名
        className: "centerCell"
              },
      {
        //title: LINE ID
        className: "centerCell"
              },
      { //title: "姓別"
        className: "centerCell"
              },
      {
        //title: "年紀"
        className: "centerCell"
              },
      {
        //title: "電話"
        className: "centerCell"
              },
      {
        //title: "身分字號"
        className: "centerCell"
              },              
      {
        //title: "地址", 不對中，對左
      
              },
//      {
//        //title: "操作",
//        data: null,
//        defaultContent: "<button class = 'dueButton to-edit'>到期</button> " +
//          "<button class = 'detailButton to-edit'>詳細</button> " +
//          "<button class = 'deleteButton to-delete'>刪除</button>"
//              }
            ]
  });  
  
  var courseTable = $('#courseTable').DataTable({
    data: dataSet,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "課程編號"
        className: "centerCell"
              },
      {
        //title: "課程名稱", 不對中，對左
              },
      { //title: "老師"
        className: "centerCell"
              },
      {
        //title: "時間"
        className: "centerCell"
              },
      {
        //title: "卡路里燃燒"
        className: "centerCell"
              },
      {
        //title: "人數"
        className: "centerCell"
              },
      {
        //title: "操作",
        data: null,
        defaultContent: "<button class = 'dueButton to-edit'>到期</button> " +
          "<button class = 'detailButton to-edit'>詳細</button> " +
          "<button class = 'deleteButton to-delete'>刪除</button>"
              }
            ]
  });

  $('#courseTable tbody').on('click', '.dueButton', function () {
    console.log("Due is clicked");

    if (!isLogin) {
      alert("必須登入後才能修改");
      return 0;
    }    

    var sueIt = false;
    dueIt = confirm("確定要課程過期!無法回復!");

    if (dueIt) {
      var data = courseTable.row($(this).parents('tr')).data();
      console.log("delete:" + data[0]);

      dataSetHistory.push(data);

      dataSet = dataSet.filter(function (value, index, arr) {
        return value[0] != data[0];
      });

      // 更新 courseNum
      var tmp1 = dataSet[dataSet.length - 1][0];
      var tmp2 = parseInt(tmp1.substr(1, 4));
      var tmp3 = dataSetHistory[dataSetHistory.length - 1][0];
      var tmp4 = parseInt(tmp3.substr(1, 4));   
      courseNum = (tmp4 > tmp2)? tmp4:tmp2;    

      // TODO: 更新 database
      database.ref('users/林口運動中心/團課課程').set({
        現在課程: JSON.stringify(dataSet),
        過去課程: JSON.stringify(dataSetHistory),
      }, function(error){
            if (error) {
              //console.log(error);
              return 0;
            }
              console.log('Write to database successful');
      });      
      
      courseTable.clear().draw();
      courseTable.rows.add(dataSet);
      courseTable.draw();

      courseHistory.clear().draw();
      courseHistory.rows.add(dataSetHistory);
      courseHistory.draw();
    }

  });

  $('#courseTable tbody').on('click', '.detailButton', function () {
    console.log("Detail is clicked");

    $("#courseTable").hide();
    $("#courseHistory").hide();
    $("#spacerBetweenTables").hide();

    //$(".dataTables_filter").hide();
    //$(".dataTables_info").hide();
    $('#courseTable_filter').hide();
    $('#courseTable_info').hide();
    $('#courseTable_paginate').hide();
    $('#courseHistory_filter').hide();
    $('#courseHistory_info').hide();
    $('#courseHistory_paginate').hide();
    $("#addCourse").hide();
    $("#inProgress").hide();
    $("#addBtn").hide();
    $("#refreshBtn").hide();

    $("#courseMemberTable_filter").css({
      "font-size": "16px"
    });
    $("#courseMemberTable_info").css({
      "font-size": "16px"
    });
    $("#courseMemberTable_paginate").css({
      "font-size": "16px"
    });

    var data = courseTable.row($(this).parents('tr')).data();
    //console.log("detail:" + data[0]);

    $("#courseNumberDetail").text("簽到頁面 - " + data[0] + data[1] + "@" + data[3]);

    $("#courseNameDetail").val(data[1]);
    $("#coachNameDetail").val(data[2]);
    $("#assistNameDetail").val(data[6]);
    $("#courseTimeDetail").val(data[3]);
    $("#CaloriesDetail").val(data[4]);
    $("#maxPersonsDetail").val(data[5]);
    $("#feeDetail").val(data[7]);
    $("#otherDescDetail").val(data[8]);

    courseMember.forEach(function (item, index, array) {
      if (item[0] == data[0]) {
        item.shift();

        item.forEach(function (item1, index, array) {
          //console.log(item1);
          //console.log(item1[1]);
          var addData = [];
          memberData.forEach(function (item2, index, array) {
            if (item1[0] == item2[0]) {
              addData = item2;
            };
          });
          addData.push(item1[1], item1[2]);
          console.log(addData);
          courseMemberSet.push(addData);
        });

        item.unshift(data[0]);
      }
    });

    courseMemberTable.clear().draw();
    courseMemberTable.rows.add(courseMemberSet);
    courseMemberTable.draw();

    $("#courseDetail").show();

  });

  $("#courseTable tbody").on('click', '.deleteButton', function () {
    // delete button
    console.log("delete:");   
    if (!isLogin) {
      alert("必須登入後才能修改");
      return 0;
    }
    var data = courseTable.row($(this).parents('tr')).data();

    var deleteIt = false;
    deleteIt = confirm("確定要刪除此課程!無法回復!");

    if (deleteIt) {
      //console.log("dddd");
      dataSet = dataSet.filter(function (value, index, arr) {
        return value[0] != data[0];
      });

      // 更新 courseNum
      var tmp1 = dataSet[dataSet.length - 1][0];
      var tmp2 = parseInt(tmp1.substr(1, 4));
      var tmp3 = dataSetHistory[dataSetHistory.length - 1][0];
      var tmp4 = parseInt(tmp3.substr(1, 4));   
      courseNum = (tmp4 > tmp2)? tmp4:tmp2;   
      
      // TODO: 更新 database
      database.ref('users/林口運動中心/團課課程').set({
        現在課程: JSON.stringify(dataSet),
        過去課程: JSON.stringify(dataSetHistory),
      }, function(error){
            if (error) {
              //console.log(error);
              return 0;
            }
              console.log('Write to database successful');
      });
            
      console.log(deleteIt);
      console.log(dataSet);
      courseTable.clear().draw();
      courseTable.rows.add(dataSet);
      courseTable.draw();
    }
  });

  var courseHistory = $('#courseHistory').DataTable({
    data: dataSetHistory,
    pageLength: 8,
    deferRender: true,
    lengthChange: false,
    columns: [{ //title: "課程編號"
        className: "centerCell"
              },
      {
        //title: "課程名稱"
              },
      { //title: "老師"
        className: "centerCell"
              },
      {
        //title: "時間"
        className: "centerCell"
              },
      {
        //title: "卡路里燃燒"
        className: "centerCell"
              },
      {
        //title: "人數"
        className: "centerCell"
              },

            ]
  });

  var courseMemberTable = $('#courseMemberTable').DataTable({
    data: courseMemberSet,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "Name"
        className: "centerCell"
              },
      {
        //title: "LINE ID"
        className: "centerCell"
              },
      { //title: "電話"
        className: "centerCell"
              },
      {
        //title: "身分證號"
        className: "centerCell"
              },
      {
        //title: "地址"
        className: "centerCell"
              },
      {
        //title: "繳費"
        className: "centerCell"
              },
      {
        //title: "簽到"
        className: "centerCell"
              },
      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class = 'payButton to-edit'>繳費</button> " +
          "<button class = 'checkInButton to-edit'>簽到</button> "
              }
            ]
  });
}

var coachList = $('#coachList').DataTable({
  data: coachSet,
  //ordering: false,
  pageLength: 14,
  lengthChange: false,
  deferRender: true,
  columns: [
    { //title: "老師姓名"
      className: "centerCell"
    },
    {
      //title: "性別"
      className: "centerCell"
    },
    {
      //title: "其他說明"
    }
  ]
});

$('#coachList tbody').on('click', 'tr', function () {
  console.log("coach is clicked");


    var data = coachList.row($(this)).data();
    console.log(data);
    $("#coachName").val(data[0]);
    $("#addCourse").show();  
    $("#coachTable").hide();

});

