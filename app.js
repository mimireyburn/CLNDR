

const express = require('express');
const app = express();

const {google} = require('googleapis');
const calendar = google.calendar('v3');

const key = require('./MY_JSON_KEY.json');
const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    [ 'https://www.googleapis.com/auth/calendar' ],
    null
);

const CALENDAR_ID = key.calendar_id;

jwtClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }
});

// const fetchPromise = fetch(calendar.events.list({
//     auth:jwtClient, 
//     calendarId: CALENDAR_ID,
//     timeMin: (new Date()).toISOString(), 
//     singleEvents: true, 
//     orderBy: 'startTime'
// }));

// fetchPromise.then(response => {
//     console.log(response);
//   });


app.get('/', function(req, res) {
    // Make an authorized request to list Calendar events.

    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1);
      }

    res.sendFile(__dirname + '/calendar.html');
    const date = new Date();
    const firstDayCurrentMonth = getFirstDayOfMonth(
        date.getFullYear(),
        date.getMonth(),
      );

    return new Promise((resolve, reject) => {
        calendar.events.list({
            auth: jwtClient,
            calendarId: CALENDAR_ID,
            timeMin: firstDayCurrentMonth.toISOString(),
            singleEvents: true, 
            orderBy: 'startTime'
        }, function(err, resp) {
            var eventsArray = resp.data.items
            var events = []
            eventsArray.forEach(function (arrayElement) {
                events.push({ title: arrayElement.summary, start: arrayElement.start.date})
            });
        resolve(
            app.post('/getdata', (req, res) => {
                res.send(events)
            })
        );
        reject("error");
    })
    });
});


app.listen(3000, function() {
    console.log('Listening on port 3000')
});