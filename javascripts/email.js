// Create a generic function to log the response from Mandrill API
function log(obj) {
    console.log( JSON.stringify(obj) );
}

// Create a new instance of the Mandrill class from the mandrill
// library. It takes one parameter, your API key.

var m = new mandrill.Mandrill('O3UCRFWM9NMLW772-VSmlg');

// Ping your Mandrill account using the users/ping method

m.users.ping(function(res) {
    log(res);
    }, function(err) {
    log(err);
    });


var emailParams = {
    "message": {
        "from_email":"linkinmonkey@gmail.com",
        "to":[{"email":"jhclaura@gmail.com"}],
        "subject": "Sending a text email from the MASK website",
        "text": "I'm learning the Mandrill API at Codecademy."
    }
};

function sendTheMail() {
// Send the email!

    m.messages.send(emailParams, function(res) {
        log(res);
    }, function(err) {
        log(err);
    });
}