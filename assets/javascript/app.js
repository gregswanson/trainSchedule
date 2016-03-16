
//time now
var timeNow = moment();

//reference to Firebase
var dataRef = new Firebase("https://gstrainschedule.firebaseio.com/");

//function to calculate minutes away
function trainTime(trainFirst, trainFrequency){
	var trainFirst = moment(trainFirst, 'HH:mm');
	var trainFrequency = parseInt(trainFrequency);
	//var timeNowMinutes = (timeNow.hour() * 60) + timeNow.minute();
	var trainFirstDate = moment(trainFirst, 'H mm');
	//var trainFirstMinutes = (trainFirstDate.hour() * 60) + trainFirstDate.minute();
	var a = moment().diff(moment.utc(trainFirstDate), "minutes");
	var b =  a % trainFrequency;
	var c = trainFrequency - b;
	return c;
	
}


//on submit
$('#trainSubmit').on('click', function(){

//get values
	trainName = $('#trainName').val().trim();
	trainDestination = $('#trainDestination').val().trim();
	trainFrequency = $('#trainFrequency').val();
	trainFirst = $('#trainFirst').val();

//push data to Firebase	
	dataRef.push({
		trainName: trainName,
		trainDestination: trainDestination,
		trainFrequency: trainFrequency,
		trainFirst: trainFirst,
		})

//clear values from form
	$('#trainName').val('');
	$('#trainDestination').val('');
	$('#trainFrequency').val('');
	$('#trainFirst').val('');

// prevent page reload
return false;
})


//get data from Firebase
dataRef.on('child_added', function(childSnapshot, prevChildKey) {
//get minutes away from function	
	var mAway = trainTime(childSnapshot.val().trainFirst, childSnapshot.val().trainFrequency);
//append info to rows

	var row = $('<tr>');
	row.append('<td class="trainName digital">' + childSnapshot.val().trainName + '</td>');
	row.append('<td class="trainDestination digital">' + childSnapshot.val().trainDestination + '</td>');
	row.append('<td class="trainFrequency digital">' + childSnapshot.val().trainFrequency + '</td>');
	row.append('<td class="nextArrival digital">' + moment().add(mAway, 'minute').format('hh:mm') + '</td>');
	row.append('<td class="minutesAway digital">' + mAway + '</td>');
	$('#scheduleTable').append(row);

}, function (errorObject) {

  	console.log("The read failed: " + errorObject.code);

});






