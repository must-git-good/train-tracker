
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBxwtriW59fE-6ZezqCm2mOJ1h8eOEupiY",
        authDomain: "train-schedule-poster.firebaseapp.com",
        databaseURL: "https://train-schedule-poster.firebaseio.com",
        projectId: "train-schedule-poster",
        storageBucket: "train-schedule-poster.appspot.com",
        messagingSenderId: "822849557756"
    };
    firebase.initializeApp(config);




// Create Variables
    var db = firebase.database();

    var trainName = "";
    var trainDestination = "";
    var trainFirst = 0;
    var trainFrequency = 0;
    
    var nextTrain = null;
    var minAway = 10;

    // On Button Click:
    $(document).on("click", "#post-schedule", function(){
        console.log("The click works.")
        event.preventDefault();

        //Get values from the input form:
        trainName = $("#train-name-input ").val().trim();
        trainDestination = $("#destination-input ").val().trim();
        trainFirst = $("#time-input ").val().trim();
        trainFrequency = $("#frequency-input ").val().trim();

        //Push values to firebase:
        db.ref().push({
            name: trainName,
            destination: trainDestination,
            departureTime: trainFirst,
            frequency: trainFrequency,
        });
    });

    // When a new entry is placed in the database...
    db.ref().on("child_added", function(snapshot){
        var ss = snapshot.val();
        var tb = $("#table-body");
        var newRow = $("<tr>");
        
        var tFirstTime = ss.departureTime;
        var tFrequency = ss.frequency;
        var firstTimeConverted = moment(tFirstTime, "HH:mm").subtract(1, "years");
        var now = moment();
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var timeRemains = (diffTime % tFrequency);
        var minTilTrain = tFrequency - timeRemains;
        console.log("MINUTES UNTIL TRAIN: "+minTilTrain);
        var nextTrain = moment().add(minTilTrain, "minutes");
        console.log("ARRIVAL TIME: "+ moment(nextTrain).format("hh:mm"));
        var minAway = (moment(nextTrain).format("hh:mm"));
        
        newRow.html("<td>"+ss.name+"</td><td>"+ss.destination+"</td><td>"+ss.frequency+"</td><td>"+(moment(nextTrain).format("hh:mm"))+"</td><td>"+minTilTrain+"</td>");
        tb.append(newRow);

       






    }, function(errorObject) {
        console.log("Errors handled: "+errorObject.code);
    });