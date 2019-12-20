// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAhr69v1SCFW5mwzfv-qfMA6xL0IhKHNrc",
  authDomain: "webchallenge-c16eb.firebaseapp.com",
  databaseURL: "https://webchallenge-c16eb.firebaseio.com",
  projectId: "webchallenge-c16eb",
  storageBucket: "webchallenge-c16eb.appspot.com",
  messagingSenderId: "372130663533",
  appId: "1:372130663533:web:d73219272c0b4faf7f8364",
  measurementId: "G-LZ3DN86LX1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();

var isLogin = false;
firebase.auth().onAuthStateChanged(function (user) {
  console.log(user);

  if (user == null) {
    // not login
    console.log("no login");
    $("#loginStatus").text("請登入來寫入資料庫");
    $("#logToggle").text("登入");
    isLogin = false;
  } else {
    // login
    console.log(user.email);
    $("#loginStatus").text("Hello " + user.email);
    $("#logToggle").text("登出");
    isLogin = true;
  }
});

function readCoursesfromDB() {
  console.log("Read Database");

  $.loading.start('Loading data')

  var dataIsDone = false;
  var memberIsDone = false;
  var courseIsDone = false;
  firebase.database().ref('users/林口運動中心/團課課程').once('value').then(function (snapshot) {
    console.log("data read done");
    dataIsDone = true;
    var result = snapshot.val();
    dataSet = JSON.parse(result.現在課程);
    dataSetHistory = JSON.parse(result.過去課程);

    var tmp = dataSet[dataSet.length - 1][0];
    courseNum = parseInt(tmp.substr(1, 4));
    console.log(courseNum);

    refreshCourse();

    if (dataIsDone && memberIsDone && courseIsDone) $.loading.end();
  });

  firebase.database().ref('users/林口運動中心/客戶管理').once('value').then(function (snapshot) {
    console.log("member read done");
    memberIsDone = true;
    var result = snapshot.val();
    memberData = JSON.parse(result.會員資料);

    if (dataIsDone && memberIsDone && courseIsDone) $.loading.end();
  });

  firebase.database().ref('users/林口運動中心/課程管理').once('value').then(function (snapshot) {
    console.log("class read done");
    courseIsDone = true;
    var result = snapshot.val();
    courseMember = JSON.parse(result.課程會員);

    if (dataIsDone && memberIsDone && courseIsDone) $.loading.end();
  });

}