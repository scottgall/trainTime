// Initialize Firebase
    var config = {
        apiKey: "AIzaSyCSPLeuDs-retKL_2glMQvZk8IUVQS3up8",
        authDomain: "timesheet-2357a.firebaseapp.com",
        databaseURL: "https://timesheet-2357a.firebaseio.com",
        projectId: "timesheet-2357a",
        storageBucket: "timesheet-2357a.appspot.com",
        messagingSenderId: "1084555516539"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // Initial Values
    var name = "";
    var destination = "";
    var time = 0;
    var frequency = 0;

        // Capture Button Click
        $("#submit").on("click", function (event) {
            event.preventDefault();

            // Grabbed values from text boxes
            trainName = $("#trainName").val().trim();
            trainDestination = $("#trainDestination").val().trim();
            trainTime = $("#trainTime").val();
            trainFrequency = $("#trainFrequency").val();

            // Code for handling the push
            database.ref().push({
                name: trainName,
                destination: trainDestination,
                time: trainTime,
                frequency: trainFrequency,
            });
            $("#trainName").val('');
            $("#trainDestination").val('');
            $("#trainTime").val('');
            $("#trainFrequency").val('');
        });

        // Firebase watcher + initial loader + order/limit HINT: .on("child_added"
        database.ref().on("child_added", function (snapshot) {

            var sv = snapshot.val();

            var tFrequency = sv.frequency;
            var firstTime = sv.time;
            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);
            
            var tRemainder = diffTime % tFrequency;
            console.log(tRemainder);
            
            var tMinutesTillTrain = tFrequency - tRemainder;
            console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);  
            
            var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm a");
            console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
            
            
            var tBody = $("tbody");
            var tRow = $("<tr>");
            // Methods run on jQuery selectors return the selector they we run on
            // This is why we can create and save a reference to a td in the same statement we update its text
            var nameTd = $("<td>").text(sv.name);
            var destinationTd = $("<td>").text(sv.destination);
            var frequencyTd = $("<td>").text(sv.frequency);
            var nextArrivalTd = $("<td>").text(nextTrain);
            var minutesAwayTd = $("<td>").text(tMinutesTillTrain);

            // Append the newly created table data to the table row
            tRow.append(nameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd);
            // Append the table row to the table body
            tBody.prepend(tRow);

            // Handle the errors
        }, function (errorObject) {
            console.log("Errors handled: " + errorObject.code)
        });