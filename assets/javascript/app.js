"use strict"

// using prefix g to indicate global and also to reserve the more 
// intituative variable for firebase
var gTrainName;
var gTrainDestination;
// First train time
var gTrainFirstTime;
var gTrainFrequency;


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDIscHy1h9ELNnFYjkZjKiU2AMGhznYKUM",
    authDomain: "train-schedule-219ab.firebaseapp.com",
    databaseURL: "https://train-schedule-219ab.firebaseio.com",
    projectId: "train-schedule-219ab",
    storageBucket: "",
    messagingSenderId: "361697740822"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

$(document).on("click", ".btn-train-submit", function(e) {
    e.preventDefault();

    gTrainName = $("#train-name").val();
    gTrainDestination = $("#train-dest").val();
    gTrainFirstTime = $("#train-first-time").val();
    gTrainFrequency = $("#train-frequency").val();

    console.log(gTrainName + " " + gTrainDestination + " " + gTrainFirstTime + " " + gTrainFrequency);

    saveToDb();
})

function saveToDb()
{
    database.ref().push({
        trainName : gTrainName,
        trainDestination: gTrainDestination,
        trainFirstTime: gTrainFirstTime,
        trainFrequency: gTrainFrequency
    });
}

// database.ref().on("child_added", function(snapshot) {
database.ref().on("child_added", function(snapshot) {
    let row = snapshot.val();
    gTrainName = row.trainName;
    gTrainDestination = row.trainDestination;
    gTrainFirstTime = row.trainFirstTime;
    gTrainFrequency = row.trainFrequency;

    addTrainScheduleRow();
})

function addTrainScheduleRow()
{
    let times = calculateTrainTime(gTrainFirstTime, gTrainFrequency);

    let row = $("<tr>");
    $("<td>").text(gTrainName).appendTo(row);
    $("<td>").text(gTrainDestination).appendTo(row);
    $("<td>").text(gTrainFrequency).appendTo(row);
    $("<td>").text(times.nextTrainTime.format("LT")).appendTo(row);
    $("<td>").text(times.minAway).appendTo(row);

    row.appendTo( $("#train-schedule-body"));
}

// Note that firstTime is assumed to be in military time, i.e. HH:mm
// frequency is expected to be in minutes
function calculateTrainTime(firstTime, frequency)
{
    let now = moment();
    let firstTrain = moment(firstTime, "HH:mm").subtract(1, "year");
    let duration = moment.duration(now.diff(firstTrain)); 
    let minAway = frequency - ( duration.minutes() % frequency );
    let nextArrival = now.add(minAway, "minutes");

    console.log(minAway, nextArrival.toString());

    return {"minAway": minAway, "nextTrainTime": nextArrival};

}