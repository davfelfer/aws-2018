var express = require("express");
var bodyParser = require("body-parser");
var DataStore = require("nedb");

var BASE_API_PATH = "/api/v1";
var dbFileName = __dirname + "/contacts.json";

console.log("Starting server...");

var app = express();
app.use(bodyParser.json());

var initialContacts = [
    { "name": "peter", "phone": 12345 },
    { "name": "john", "phone": 6789 }
];

var db = new DataStore({
    filename: dbFileName,
    autoload: true
});

db.find({},(err,contacts)=>{
    if(err){
        console.error("Error accesing DB");
        process.exit(1);
    }else{
        if(contacts.length == 0){
            console.log("Empty DB, initializaing data...");
            db.insert(initialContacts);
        }else{
            console.log("Loaded DB with "+contacts.length+" contacts.");
        }
           
    }
});


app.get(BASE_API_PATH + "/contacts", (req, res) => {
    res.send(contacts);
});

app.post(BASE_API_PATH + "/contacts", (req, res) => {
    // Create a new contact
    var contact = req.body;

    contacts.push(contact);

    res.sendStatus(201);
});

app.put(BASE_API_PATH + "/contacts", (req, res) => {
    // Forbidden
    res.sendStatus(405);
});

app.delete(BASE_API_PATH + "/contacts", (req, res) => {
    // Remove all contacts

    contacts = [];

    res.sendStatus(200);
});


app.get(BASE_API_PATH + "/contacts/:name", (req, res) => {
    var name = req.params.name;


    var filteredContacts = contacts.filter((contact) => {
        return (contact.name == name);
    });

    if (filteredContacts.length > 0) {
        res.send(filteredContacts[0]);
    }
    else {
        res.sendStatus(404);
    }

});



app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});

app.listen(process.env.PORT);

console.log("Server ready!");