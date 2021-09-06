// create server URL variable


const serverURL = "https://cryptic-dusk-31004.herokuapp.com/";

// create table and form variables

const table = document.getElementById("workoutsTable");
const addForm = document.getElementById("addForm");

// create row number variable to keep track of the number of rows to dynamically name the button ids

var numberOfRows = 1;

const makeTable = (allRows) => {

    // create table and set id

    var table = document.createElement("table");
    table.id = "workoutsTable";

    // create header row

    var firstRow = document.createElement("tr");

    // create all the header row columns

    var col1 = document.createElement("th"); 
    var col2 = document.createElement("th"); 
    col2.innerHTML = "name";
    var col3 = document.createElement("th"); 
    col3.innerHTML = "reps";
    var col4 = document.createElement("th"); 
    col4.innerHTML = "weight";
    var col5 = document.createElement("th"); 
    col5.innerHTML = "unit";
    var col6 = document.createElement("th"); 
    col6.innerHTML = "date";

    // append columns to first row

    firstRow.appendChild(col1);
    firstRow.appendChild(col2);
    firstRow.appendChild(col3);
    firstRow.appendChild(col4);
    firstRow.appendChild(col5);
    firstRow.appendChild(col6);

    // append first row to table

    table.appendChild(firstRow);

    // make a row for each element in our tableData array

    for (var i=0; i<allRows.length; i++) {
        
        // call makeRow to make each row

        var newRow = makeRow(allRows[i]);

        // increment number of rows variable

        numberOfRows ++;

        // append each new row to the table

        table.appendChild(newRow);
    }

    // get header element

    header1 = document.getElementById("header1");

    // append table to header element

    header1.append(table);
}

const deleteTable = (table) => {

    // delete all rows from the table

    table.remove();
}

const makeRow = (row) => {

    // create a new row

    var newRow = document.createElement("tr");

    // create data cells for each of the 6 columns in the row and append to the new row

    var newCell1 = makeCell("hidden", "id", row.id);
    newRow.appendChild(newCell1);
    var newCell2 = makeCell("text", "name", row.name);
    newRow.appendChild(newCell2);
    var newCell3 = makeCell("number", "reps", row.reps);
    newRow.appendChild(newCell3);
    var newCell4 = makeCell("number", "weight", row.weight);
    newRow.appendChild(newCell4);

    // make radio cells

    var newCell5 = makeRadioCell(newRow, row.unit);
    newRow.appendChild(newCell5);

    // format the date so that only the first 10 characters of the returned date are shown

    formattedDate = formatDate(row.date);

    var newCell6 = makeCell("date", "date", formattedDate);
    newRow.appendChild(newCell6);

    // create edit and delete buttons and append to row

    var editButton = makeEditButton();
    var deleteButton = makeDeleteButton();

    newRow.appendChild(editButton);
    newRow.appendChild(deleteButton);

    // return new row

    return newRow;
    
}

const formatDate = (date) => {

    // only take first then characters of JSON date string

    correct_date = "";
    for (var i=0; i<10; i++) {
        correct_date += date[i];
    }
    
    return correct_date;
}

const makeCell = (type, name, value) => {

    // create a table data element and input element

    var new_cell = document.createElement("td"); 
    var new_input = document.createElement("input");

    // set input type, name, and value, and append input to new cell 

    new_input.type = type;
    new_input.name = name;
    new_input.value = value;
    new_input.id = numberOfRows+name;
    new_cell.append(new_input);

    // return new cell

    return new_cell;
}

const getRadioValue = () => {

    // check if lbs is checked, if so, get that value, otherwise get kgs value

    var lbs = document.getElementById("lbs");
    var kgs = document.getElementById("kgs");
    if (lbs.checked){
        var radioVal = lbs.value;
    }
    else {
        var radioVal = kgs.value;
    }
    return radioVal;
}

const makeRadioCell = (newRow, unitValue) => {

    // create table data element

    cell = document.createElement("td");

    // create form element

    form = document.createElement("form");

    // create 2 label elements and set text

    lbsLabel = document.createElement("label");
    kgsLabel = document.createElement("label");
    lbsLabel.innerHTML = "lbs";
    kgsLabel.innerHTML = "kgs";

    // create lbs and kgs input elements

    lbsInput = document.createElement("input");
    kgsInput = document.createElement("input");

    // create type, name, id, and value properties

    lbsInput.type = "radio";
    lbsInput.name = "unit";
    lbsInput.value = "0";
    lbsInput.id = numberOfRows.toString() + "lbs";

    kgsInput.type = "radio";
    kgsInput.name = "unit";
    kgsInput.value = "1";
    kgsInput.id = numberOfRows.toString() + "kgs";

    // if row.unit value is 0, check the lbs selection, otherwise check the kgs selection

    if (unitValue == 0){
        lbsInput.checked = "checked";
    } else {
        kgsInput.checked = "checked";
    }

    // append input to label, then label to new row

    lbsLabel.appendChild(lbsInput);
    kgsLabel.appendChild(kgsInput);

    newRow.appendChild(lbsLabel);
    newRow.appendChild(kgsLabel);

    // append label to form, then form to cell

    form.appendChild(lbsLabel);
    form.appendChild(kgsLabel);
    cell.appendChild(form);

    // return radio cell 

    return cell;

}

const makeEditButton = () => {

    // create table data and button elements

    var TD = document.createElement("td");
    var editButton = document.createElement("button");

    // set button text and id

    editButton.innerHTML = "Save";
    editButton.id = numberOfRows.toString();

    // add event listener

    editButton.addEventListener("click", function(){

        // update the row with the button id

        onEdit(editButton.id);

        // get new table data, delete old table, and make new table

        (async () => {
            let stringObject = await getData();
            let tableData = JSON.parse(stringObject.results);

            // get table element

            var table = document.getElementById("workoutsTable"); 

            deleteTable(table);

            makeTable(tableData);
        })();
    });

    // append edit button to table data element

    TD.appendChild(editButton);

    // return edit button

    return editButton;

}

const makeDeleteButton = () => {
    
    // create table data and button elements

    var TD = document.createElement("td");
    var deleteButton = document.createElement("button");

    // set button text and id

    deleteButton.innerHTML = "Delete";
    deleteButton.id = numberOfRows.toString();

    // add event listener

    deleteButton.addEventListener("click", function(){

        // delete row with button id

        onDelete(deleteButton.id);

        // get new table data, delete old table, and make new table

        (async () => {
            let stringObject = await getData();
            let tableData = JSON.parse(stringObject.results);

            // get table element

            var table = document.getElementById("workoutsTable"); 

            deleteTable(table);

            makeTable(tableData);
        })();

    });

    // append delete button to table data element

    TD.appendChild(deleteButton);

    // return delete button

    return deleteButton;

}

const getObject = (docElement, rowID=0) => {

    // if row id is 0, then make JSON object for form element

    if (rowID == 0){

        // get form element values

        var name = docElement.name.value;
        var reps = docElement.reps.value;
        var weight = docElement.weight.value;
        var unit = getRadioValue();
        var date = docElement.date.value;

        // create form JSON object and stringify

        var inputObject = {"name":name, "reps":reps, "weight":weight, "unit":unit, "date":date};
        var JSONObject = JSON.stringify(inputObject);


    // if row id is not 0, then make JSON object for table row

    } else {

        // get all the IDs for each table data element in the row

        var nameID = rowID.toString() + "name";
        var repsID = rowID.toString() + "reps";
        var weightID = rowID.toString() + "weight";
        var dateID = rowID.toString() + "date";
        var idID = rowID.toString() + "id";

        // get radio IDs

        var lbsID = rowID.toString() + "lbs";
        var kgsID = rowID.toString() + "kgs";

        // get all the table data elements

        var name = document.getElementById(nameID);
        var reps = document.getElementById(repsID);
        var weight = document.getElementById(weightID);
        var date = document.getElementById(dateID);
        var ID = document.getElementById(idID);

        // get the unit elements

        var lbsInput = document.getElementById(lbsID);
        var kgsInput = document.getElementById(kgsID);

        // determine which radio button is checked to set unit

        if (lbsInput.checked) {
            unit = lbsInput;
        } else {
            unit = kgsInput;
        }

        // create JSON object and stringify

        var inputObject = {"name":name.value, "reps":reps.value, "weight":weight.value, "unit":unit.value, "date":date.value, "id": ID.value};
        var JSONObject = JSON.stringify(inputObject);
    }
    
    // return JSON object

    event.preventDefault();
    return JSONObject;
}

const onEdit = (buttonID) => {

    // send put request to server

    var req = new XMLHttpRequest();
    req.open("PUT", serverURL, false);
    req.setRequestHeader('Content-Type', 'application/json');

    // create JSON object and send

    var JSONObject = getObject(table, buttonID);
    req.send(JSONObject);

    response = JSON.parse(req.responseText);
    // console.log(response);

}
const onDelete = (buttonID) => {

    // send delete request to server

    var req = new XMLHttpRequest();
    req.open("DELETE", serverURL, false);
    req.setRequestHeader('Content-Type', 'application/json');

    // create JSON object and send

    var JSONObject = getObject(table, buttonID);
    req.send(JSONObject);

    response = JSON.parse(req.responseText);
    // console.log(response);
}

const getData = () => {

    var req = new XMLHttpRequest();
    req.open("GET", serverURL, false);
    req.send(null);
    var rows = JSON.parse(req.responseText);
    return rows;
}

const insertData = () => {
    var req = new XMLHttpRequest();
    req.open("POST", serverURL, false);
    req.setRequestHeader('Content-Type', 'application/json');
    var JSONObject = getObject(addForm);
    req.send(JSONObject);
    var rows = JSON.parse(req.responseText)
    // console.log("rows: " + rows);
}

// add event listener to form

addForm.addEventListener("submit", function(){  

    // call insert data

    insertData();

    // get new data back, delete table, and remake table

    (async () => {
        let stringObject = await getData();
        let tableData = JSON.parse(stringObject.results);

        // get table element

        var table = document.getElementById("workoutsTable"); 

        deleteTable(table);

        makeTable(tableData);
    })();

});

// start client application with a get data call into a make table call

(async () => {
    let stringObject = await getData();
    let tableData = JSON.parse(stringObject.results);
    makeTable(tableData);
})();

// so in the final form, his event listeners look like this:

// "document.querySelector('#workoutsTable').onclick = async (event) => {...};", this is for the workout table, the reset table button
// is the exact same format except we query select the reset table button id, and the addForm event listener looks like this:

// "document.querySelecter('#addForm').onsubmit = async (event) => {...}" , so that elipses are for the js code logic that goes inside,
// he also has the code to run when the page first loads, and it looks like this:
//    "(async () => {
//     let tableData = await getData();
//     makeTable(tableData);
//     })();"

// at 1:03 in the video he talks about some of the notes after he finished the assignment.

// Ok, so let's get started here with this configuration. Man, we're not even sure where to start, the whole thing just feels very big.
// How can we start off small here? I guess we can work on the get request, to "view" the page? What does the rubric even mean by
// properly implementing viewing? So what do we want to do first of all, that's the question. Let's try to make a single row generated
// from just js? Actually, let's submit, let's work on this first part, submitting our data and making sure it goes somewhere. Wait,
// where are we submitting our data?

// Actually the first thing we need to do, is do radio buttons for lbs and kgs. Wait, is this a part of the assignment? Yeah it is lol.
// Ok, so from the "forms" lesson in module 2, here is what radio buttons should look like:

/* <label>
<input type="radio" name="rating" value="yes" />Yes</label>
<label>
<input type="radio" name="rating" value="no" />No</label> */

// So the radio buttons need to be inside forms, and also inside a label as well. Ok, so I think we figured that out. We needed to use
// this format:

/*<td>  
    <label>
        <input type="radio" name="unit" value="lbs" />Lbs</label>
    <label>
        <input type="radio" name="unit" value="kgs" />Kgs</label>
</td> */

// So we can make a function that will generate that radio button from the server response. Ok, so we also fixed the top part to make
// radio buttons for lbs or kgs, and since we are already in a form, we don't want to actually do a form? Ok, so let's see what he was
// talking about, how he couldn't put data inside forms. What if we remove the forms, then what happens? Removing the form designation
// doesn't seem to change the html visually, but now maybe it makes it harder to access the data within? 

// Alright, now that we finally have the submit form with the radio buttons now, let's try to submit some info. So, where are we 
// submitting to? We want to submit to our server, which is where lol? We have to go look at the database code for this, as we don't
// really know how that's all going to work. Let's jump into our database code quickly and see if we can jog our memory.

// Ok, so going into our database file confused us even more. So, I think everything starts here in the public html folder. So when
// we open the page up, or js code will run, and it will initiate a get request to the server with the yet to be written getData()
// function, and getData returns into the tableData variable (as some json object probably), then we call makeTable function that needs
// to be written, using the tableData as the parameter, and it will make the table using our make rows, make cells, etc. functions and
// then we dynamically change the index.html file with our js (wiat, how do we even do that lol). Reading the ED discussion, that's right
// we already have the table as an element, just append the headers and rows and such I guess.

// So there's a "getting started tips" post on ED that is pretty good. It says that, we visit the base url, from the client, then (and
// this is specific to the way we are doing it without handlebars) the server renders an empty page, then the client requests table data
// with AJAX request, the server queries the current table data and sends it to the client, and finally the client receives the data and
// manipulates the DOM (via js?) to create the table. This all seems like we can't really test much? We have to have a working makeTable
// function in order to see any results. 

// Let's follow the above outline and write our code accordingly and try to test at each step of the way I guess, if we can. It doesn't
// seem like there are much small milestones to test though. Ok, so yeah, this is going to be the process. First, since when the client
// goes to the server, it has to make a request, so let's try to first test this GET request. We will write a GET requent in the client
// js, which is this script.js file, that will send a GET request to the server, and let's console.log that and see if that works first
// of all. So this is the get request, doesn't it need all the server side stuff like mySql and express to work? We're still not 
// understanding it. Ok, so that's a start. We call the only function that is actually written right now, "get data", which just console.
// logs "get data called", and pull up our engr website, and it's in the console, so we know that's working. Now, how do we query for
// the table data?

// *** Ok, so back to the radio button issue he was talking about. We can't have all these radio bc they all say radio, which means only
// one can be selected, so each of the radio buttons need to be encased in a <form> in order to separate each row's radio buttons for
// lbs and kgs, but the td cells themselves don't need to inside a form, which is the way we currently have it set up, and we'll need to
// test it hardcoded to see what happens if we remove the forms (around 1:07 in the video). We see his table and he sets the id for the
// unit labels so that we know if it's pounds or kgs, so we incorporated that.

// Alright, so we see that when he logs into the website, it sends a request to the "localhost" website, so the website with whatever
// port we're using, that's the server. So we want to send a GET request there. Ok, but how do we send it. Do we need to have all that
// express stuff in this file? How would the server and client communicate if both didn't use the same set of stuff lol. You would think
// he would mention it? We can review our HW 4 to see that API request to OWM and see how that works. When he submits something, a post
// request is sent from the client, so we need to set that post request linked to the form submit button. Wait a minute, so this public
// html is the client side, and yeah, the server side is the one that has the POST and GET functions, so how do we send POST requests
// from the client side, that's weird, why isn't it mentioned? Is there another way to do this? Oh, is it that HTML request thing? Don't
// we still need express and stuff for that?

// Ok, I think we found what we were looking for. It's actually been a while and we've forgotten some of this, and sometimes just copying
// the lecture code and forgetting, but this is the syntax for an AJAX call:

// document.getElementById('urlSubmit').addEventListener('click', function(event){
//     var req = new XMLHttpRequest();
//     var payload = {longUrl:null};
//     payload.longUrl = document.getElementById('longUrl').value;
//     req.open('POST', 'https://www.googleapis.com/urlshortener/v1/url?key=' + apiKey, true);
//     req.setRequestHeader('Content-Type', 'application/json');
//     req.addEventListener('load',function(){
//       if(req.status >= 200 && req.status < 400){
//         var response = JSON.parse(req.responseText);
//         document.getElementById('originalUrl').textContent = response.longUrl;
//         document.getElementById('shortUrl').textContent = response.id;
//       } else {
//         console.log("Error in network request: " + req.statusText);
//       }});
//     req.send(JSON.stringify(payload));
//     event.preventDefault();
//   });

// Here, the call is linked to a button, but I don't think we need to do that. The important thing is, this var req part and the XMLHTTP
// Request thing. Wait is this what the async awaits does, or this that just some way to get the handle the waiting for the function to
// get data (we think it's just a way to get the function to wait for the table data, but the lecture made it sound like maybe it's the
// same this XML request?). Yeah, so this looks familiar, and this is where we put the URL for the server, which is the website with the
// port. Ok, so reading couple lessons before that lesson, this is the data that we want. This is the template to make calls with JS,
// which was where we were confused about:

// var req = new XMLHttpRequest();
// req.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=Corvallis,or&appid=fa7d80c48643dfadde2cced1b1be6ca1", false);
// req.send(null);
// console.log(JSON.parse(req.responseText));

// remember doing this with open weather map, well, here we want to do it to our server. Alright, let's give it a try and see what 
// happens. We want to put this inside our getData request I think. Hmmm, our code is making the website hang on, so at least we know
// it's changing things. It doesn't let us access the info, nothing is printing out, so that's not good. It keeps trying to load 
// something. Wait a minute, we aren't logged in yet? We haven't ran the code yet, the "node index.js" from the database lol. No,
// running our index doesn't do anything either. Ugh, we seem to be missing something? Maybe we need to send some object that actually
// makes sense? The connection timed out again. Wait, do we have to log into that cisco connect thing? Oh jesus, that was it, this 
// freaking cisco connect. We're not even sure what this does, but that worked. Now we are getting something. 

// Now, we need to specifically request the table data. How do we do that lol. OK, so there is this getAllData function from the database
// js code, and I think that's what we want to call. So how do we get the client to send the GET request that tells the server to call
// the getAllData function? Ok, I think it's actually, when we send the get request from the client, it actually calls the get request
// from the server automatically and that's why we are getting a response in our console? Let's double check the script and index js
// files to see what is outputting to the console. Nope, it seems like the server code for the get request of getAllData is not actually
// being run. It could be a different function that we're accessing, or our GET request isn't actually making the server request that 
// data. Then how do we get our GET request to make the server query?

// I guess our question is, a) how do we get our GET request from the client to ask the server for data (does it return automatically)?
// it didn't look like it bc we didn't get a console.log? b) how do we get the server to respond and send the data back (or does it do
// that automatically as well, even though, once again, our server code didnt' print anything to the console?). Hmmm... that results
// printout seems to be the data that we need back, but it's empty bc there's nothing in there? How do we test it with actual values in
// the table to see what the object looks like? Oh, we're looking at our console.log and it does say that the "server is sending back
// JSON", so our GET request from the client is activating the server to call the its "get" function for the home page. I guess since
// we have GET, POST, UPDATE, and PUT, we can make the appropriate request from the client to call the appropriate function from the
// server, is that how that works?

// Ok, so if that is the test, then what do we want to do? Let's first do the logic of when we first visit the site. The client sends
// a GET request to the server, via XML request, and that leads the server to call its GET request function, which is to query for the
// entire table in the database. This query results in an JSON object, called "rows" in our server GET request, which is returned, and
// that's what  is the "context" that prints out in the console, which is empty, bc there's nothing in the tables right now. Ok, so 
// the server sends it back to the client and the client makes the page from the table JSON returned object. Ok, so we want to test a
// couple different things then. We've already seen that we get back the object and that works, and in the video code, the function is
// called via a async await procedure, and the function returns as a tableData parameter, which we'll use to create a new table via DOM
// manipulation with JS. Ok, so let's test this async await function, by putting in console.logs and making sure that the order of the
// functions is happening correctly (we had issues with this in the practice, where we couldn't get the function to "wait" for the 
// results).

// So it console.logged fine, after we actually ran index.js, but I'm not sure if that works or not. So let's do a different test. Let's
// make the getData function return an actual object (currently the database is empty and nothing is returned), and see if that object
// is there before or after the async await function is called. Ok, so I think the async await is working properly, and it is waiting for
// the object to be returned, since there is an [Object object], even though we can't access it, so that'll be something we have to figure
// out, but I think that works. So, the "viewing" or "GET" request, theoretically, is done. Now, let's work on submitting the data, or
// the POST request, since we can actually edit the table and do something more concrete now.

// Alright, so since our query is named insertQuery, we'll call this function insert data, even though that's kind of a weird name, we'd
// prefer update or submit, but that might cause more confusion, and we don't need to be any more confused than we already are. Alright,
// so here is the post format from the module several weeks ago:

// var req = new XMLHttpRequest();
// req.open("POST", "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAh2sUzWPm-pRQCbgyZijqWcKGFcoXeK2o", false);
// req.setRequestHeader('Content-Type', 'application/json');
// req.send('{"longUrl":"http://www.oregonstate.edu"}');
// console.log(JSON.parse(req.responseText));

// Hmm.. so we're sending a JSON object, but what does it actually look like? It needs to be in the format of the workout table right?
// So, from the module, the objects look something like this:

// [{"id":1,"name":"","done":0,"due":null},{"id":2,"name":"The Other Task","done":1,"due":"2015-12-05T08:00:00.000Z"}]

// so can we fix this to look like the work out table? We wouldn't want to do the ID column bc it's a hidden value, so it's just the
// name, reps, weight, unit, and date values, so what if we try something like this?
// [{"name":"bench", "reps":5, "weight":10, "unit":0, "date":"2020-01-01"}], let's see if this object shows up or anything. Ugh, we are
// getting this error "Error: ER_BAD_FIELD_ERROR: Unknown column 'date' in 'field list'". We check online and it might be some formatting
// issue but we're not sure. We can't seem to get around it. Alright, so I guess it doesn't like the data values, what if we remove the 
// date column? Lol, it still says "date" even after we removed the thing in the JSON we sent, wtf? Hmm... not sure what we're doing
// wrong and nothing on ED about this specific issue. Wait a minute, we just looked the project over, and date goes before units? WTF?
// Was the ordering the problem? Nope, that didn't fix anything.

// Wow, we finally fixed it. We had noticed our typo when typing "date DATE" in the makeTableQuery and it was "data DATE", so we fixed
// it, but nothing happened. On a whim, we went to see where that query goes, and it is called when we go to "reset table" route, which
// will delete the table and reset. The problem was, it was a typo, so it was looking for "data" instead of "date", which is why there
// was a field error. Man, that could have been a hard stuck if we didn't figure that out.

// Ok, so we get back the data object, and we see that it has the stuff that we want. Now, we want to, when we fill in the form, for all
// that data to be package into the json object like our json object, so that we can send it. So we want to link an eventlistener to our
// submit form button, that will take all the fields and send it in the insertData function. Obviously this function also needs to 
// query again for the contents of the database and then make the new updated table, which we haven't implemented that function yet.
// Maybe we can console.log the returned object in a more readable format as well, or is it fine? We can still see where it is in the
// array from the current object I think.

// So we tried adding the eventlister via that async thing and it said "TypeError: document.querySelecter is not a function", so I'm not
// sure what's going on there lol. Well, we had to google it but our googled code works. I think he was probably doing it some other way,
// however, we're not sure what he did. Wait, did it need an async? It's whatever, let's move on. Ok, so we were able to get the submit
// button to run a function. Now, let's write out the makeInput button to make the input string that goes in our insert data function?
// Ok, let's go over this again since we are forgetting what we are trying to do. I guess there is this makeInput function, which we want
// to make a JSON string I guess? I'm not sure why it has a data parameter though, and what is the data? How do we get the data from the
// form? Wait, is the json object already created?

// Ok, looking at the forms and AJAX module yet again, this is the relevant code:

// var payload = {longUrl:null};
// payload.longUrl = document.getElementById('longUrl').value;

// It's inside of the event listener. So, basically, the makeInput function will get the values from each input value in the form, by
// grabbing those values with "document.getElementById(idName).value", alright so let's try this with a single value we want to submit.
// Lol, it says the value is null are we calling it wrong? Ok, so 2 issues, now it's saying the value is undefined, but the console.log
// is doing it really quickly. Is there a way slow it down, is it bc we aren't calling "event.preventDefault();" Ohh... event.prevent
// default did stop the console.log from flashing, interesting. now, the value is still undefined lol. Ugh, we got it to work, but we
// had to add an "id" field besides the "name" field bc we can't pull the info with the name property ugh. 

// Annoying, but now, let's do the makeInput function to extract each element and combine it into a JSON object. There is a way to use a
// for loop to access all the elements of a form, however, since the radio buttons are weird, we just set each element individually. Hmm
// so how are we going to extract the radio buttons? we only want 1 value, whichever one is selected, we're gonna have to google it. Ok,
// yeah, so we were able to get all the 4 data things to appear. We need to restart the node there, so sometimes I guess the save button
// doesn't save it.

// Alright, so let's google how to get the radio button value, add it to our JSON object, and put this object into the insertData function
// as the parameter for req.send. Ok, so since only 1 radio button can be checked, we can by default check 1 radio button, and see if
// it's still checked, if so, it's that value, if not, it's the other value.

// We;ve written our radio button function, but it doesn't seem to be running at all, that's weird. Ugh, this is so weird, why isn't
// our function running. Ok, that's really weird, it doesn't seem like anything is updating? Ugh, did we connect to the remote host?
// WTF. We thougth maybe we didn't log into flip, bc it does it automatically, so we log out, but nothing is printing out of console.
// log, wth is going on? Ugh. I'm very confused. We created a new function, but it isn't saving? We don't see if in our code? This is
// really weird. None of our data is being saved today? Why's that? Let's restart VS code? WTF?

// We googled it and this is a really weird problem. Not sure why it didn't creep up yesterday, but we have to go to the "network" tab
// of the chrome tools and check the "disable cache" button, now we see our new codes and all the prints. This is not a good start to the
// day. Ok, so, we want to get the radio buttons, and make sure they show up in our string (should be 0 for false and 1 for true?) then
// put it into our object to be sent.

// Ok, good, so the radio function works, now, lets's package all this in an object and send it to add to the database. Ok, so currently
// we're having issues converting the data to the English version, we tried .localString but it doens't seem to do anything. This is fine
// when we're sending it as a JSON object, but not good to display on the client side. Ok, so we got our JSON object packaged, but the
// numbers are in quotes instead of not in quotes. Let's see if we can send out the object to the database now. Lol, we hit submit but
// nothing's happening the hell. Hmm.. now w ehave a can't access insertData before initialization, whatever that means. OK, I thnk we
// fixed it by calling it after declaring the value, so we need to set the event listener after defining insertData. Now we are getting
// a "SyntaxError: Unexpected token ' in JSON at position 0" and it caused our computer to try to print some stuff a couple of times,
// lmao wtf.

// Ok, I think it doesn't like the extra quotes we put in there, so let's remove that and see what happens. Ok, so that did work, but
// it called the print screen 3x when we submit the form, the hell? How is it even doing that? Interesting, so we remove the "event.
// preventDefault" line, and now it doens't ask to print, but the console.log dissapears and makes it hard to debug, lmao.

// Ok, so we got the form to submit, and got the new updated table object after the insertion into the database table, now, let's write
// the makeTable function to make the table out of the JSON object we get back. Remember that we want to remove forms outside of the TD
// cells, but add a form to encase each rows radio buttons, but let's start with the little functions that create the table first.

// Lol, we do have to keep this event.preventDefault thing to actually see what is console.logging out. Interesting, so we tried prevent.
// Default since it says event.preventDefault not used anymore or something, but that didn't work, so we went back to event... and now
// it works and not making us print stuff, so weird. Alright, so this is what is being sent back from the insertData query it looks like:

// 0: {id: 1, name: "bench", reps: 5, weight: 10, unit: 0, …}
// 1: {id: 2, name: "walking", reps: 10, weight: 10, unit: 0, …}
// 2: {id: 3, name: "jumping", reps: 25, weight: 18, unit: 1, …}
// 3: {id: 4, name: "hiking", reps: 15, weight: 15, unit: 1, …}
// 4: {id: 5, name: "jumping", reps: 80, weight: 80, unit: 0, …}
// 5: {id: 6, name: "jump", reps: 2, weight: 2, unit: 1, …}

// There's actually more, and the last key value pair should be the date key with the date value. So, we see here that the first object
// is element 0 of the array, and it starts with the id field. So, I think if we want to access the name field of the first activity, 
// it's going to be rows[0].name or maybe rows[0[0]? Let's try and see what comes out... Ok, so tabledata[0].name doesn't work, let's
// see what tabledata[0] prints out? Hmmm... that's undefined lol. Let's see what tabledata prints out again. Ok, so, after a little
// bit of trial and error "tableData.results" prints out the array, so from there, we can access the 0th element and its property?

//Ok, let's think this through. So, table.results is an array has has 1 array in it. Wait a minute, so table.results[0] gives us a "[",
// which means the whole thing is a giant string, so we have to unstring it first? Ugh... how do we unstring? Ok, we finally got the 
// name of the first element. So, when the server sends it back to us, it has to stringify the context.results in order to send it, so
// we were right in tableData[0].name to access it. however, before we could do that, we have call JSON.parse(returnedObject.results)
// and set it equal to tableData. That took like 30 minutes, not good, but I think googling would have taken longer. Just trial and 
// error revealed we were trying to access array elements of a long string instead of an array of objects. 

// Ok, so I think we have the tableData back in the form that we want it. Now, let's create the table by accessing all of those elements
// from tableData. Ok, so there are functions for the items in html called "insertRow" and "insertCell", which we can use to insert it,
// or use append I guess. Ok, so let's try to make our rows first. So currently, our first row, which is the table header row, is always
// the same, so technically we could just keep it there, but I think we just want to recreate it everytime, bc first of all, it looks
// weird if there are no inputs, and secondly, it might be more difficult to append rows to the first row, then appending all the rows
// to a table. 

// Ok, so let's make a makeTableHeader function. So, for the table header, the first column is actually blank, so that's for the hidden
// id column, and the rest are just the rest of the stuff we have in our hardcoded template, so just make it make everything here. We
// also need to encase it in a table row as well. Man, why can't we just append the other stuff to this, we don't need to do this? Yeah
// I think it's fine to just start with the hardcoded copy, unless we see a need to change it. 

// Ok, so our table already has the table headers that we don't need to keep remaking. Now, let's create the rows first? So, for each
// element in our var tableData, we want to create a row right? We have the header row, so yeah, for each element, create a row. Ok, so
// our for loop is creating the correct number of rows. Now, how do we make a row? Let's go into the makeRow function now. OK, so I 
// guess there's a parameter for the makeRow function, and it's each individual row, so we have to loop, and use tableData[i] as the
// parameter. Oh lol, we finally figured out, why it keeps trying to print. We are trying to type out "console.log()" but sometimes 
// we accidentally type "print()" from the Python language lmao. OK, so from allrows[i] we need to call each property name I think, so
// id, name, reps, etc...

// It seems we're trying to do a for loop for each array with an object inside, but it is undefined for the length, there is no value 
// of length for this array? Ok, so we do do it like before but, we can't do a for loop for this, we can only call them by their 
// property names, so row.name gets us the name. ok, so the makeRow functions calls makeCell for each of the column, but how do we make
// these columns now? So we think we've made the cells properly, but how do we append everything together. We've appended the each data
// cell to its input cell, but how do we add that to each row (we want to append it to each row), and then how do we add that to the
// table (we want to append the rows to the table), but how do we reference everything inside of all these functions, that's the 
// confusing part.

// So, we made all the row cells, and we see a couple of problems. First off, the "name" or activity, is all jumping jacks, the last
// activity in there for some reason. Furthermore, the rows are aligned left to right, and we want them top to bottom, so maybe the tr
// cells aren't dividing properly? First, let's tackle the activity "name". Ok, we put the append outside our loop, so it only appended
// the one row, or the last row, instead of each row to the table, but how we see we have 6 sets of 6 columns. I think there shouldn't
// be a for loop in make rows, bc it's making 6 columns, 6 times. Ok, we removed that for loop, and now it looks great, however, there
// are 2 more display issues. The radio button is not displaying properly, which we kind of expected bc we need to write a function for
// that. Secondly, the date is not showing up at all.

// First, let's hardcode a date to make sure our code is actually working first of all. Yeah, so like he said, we have to format the 
// date, and basically we only want the first... 10 characters of that date string. Ok, good, that worked perfectly. Now, let's work on
// the radio button display. We also noticed that the update and submit buttons have not been coded, so we'll need to do that as well.

// So, for the radio buttons, we need to create a form, append 2 labels with appended inputs to them... Hmmm.. there's an issue, the
// forms now all have non unique ids of lbs and kgs, so how are we going to handle that? I guess we can remove the ID for now, but we'll
// need to call those ids later? Lmao. I guess one way we can do this, is to have all the radio buttons with no IDs, then we can loop
// through all the radio buttons and return the value if one is checked, since only 1 can be checked at a time? Lol, the buttons are
// invisible inside forms, yikes. Alright, we removed the forms and all the radio buttons look the same. I'm not sure how we are going
// to call the radio buttons, but at least they look proper now. Currently it looks like the form and table radio buttons are separate,
// so I guess that's good, they can submit something, and also update a row already in the table. 

// Do we want to try to fix the POST request now, since our function to identify the radio val has changed (we can't call by 
// getElementById anymore). Then, get the update and delete buttons displayed properly, then working. Also, there is no value for the
// lbs and kgs in the made table. We actually have to fix that. They can't be unchecked. They need to be checked according to the values
// (0 for lbs and 1 for kgs) from the database (but we can only check one at a time ugh... maybe we can create dynamic id names? a 
// global radio id counter that tracks how many there are? so that each one can be set?)

// *** He says that for the update function, we want to package up each of the values from the rows and send it (we though we'd package)
// each of columns, but he says it's each "value" in the row (only the "value", not "name" or "id" or anything else). For the delete
// function, we just want the "id" value of the row to delete. The onUpdate and onDelete functions are there to call when the respective
// buttons are pushed. Also, make sure to delete the table before building it again. He also says he sends everything (in the row, in
// the table? but we only need the row id for delete function). Reading over the assignment description, it says for the update button
//  we can go to a different page (doesn't requre AJAX call either) and edit from there, so that avoids trying to figure out the radio
// buttons from all the radio buttons I'd say. But going to another page and going back seems really hard? or not? lol. Wait a minute,
// if we make each event listener specific to the button, then we'd know which radio button was selected? I think this is the better way,
// I mean, not optimal, but we can't really mess around with all this extra stuff? we just want to satisfy the requirements.*** 

// Ok, so first, we need to get the radio buttons to display the proper value. Ok, we did the code to check, but, yeah, with radio 
// buttons, you can't control each one, unless you put it inside a form, but we tried that and it didn't work? I think we needed to put
// it inside a td, then a form? Not sure what we did before. Ok, so we got it to display the radio selections, we had forgotten to 
// append the new cell the the new row, which requires the function return the cell.

// Ok, I think we might have fixed the future issue of the update button not sure which radio selection to use, since each submit button
// will have its own event listener, so we know which row to look? Are the rows identifiable? They have the hidden number fields, which
// should match the button id, so yeah, it should be good. Ok, now what.

// Alright, so we've labeled our form boxes, now we need to add the edit and delete buttons, and attach event listeners to each one. Ok,
// so it's a table data element, with a button element as a child, and the innerHTML set to the name of the button. When do we add the
// event listener's to these? Ok, so we make the buttons, but they don't line up with our table headers for edit and delete buttons, but
// we just removed the table headers because the buttons are kinda self explanatory.

// Ok, so we need to link each button to an eventListener, which means each button needs an unique id that matches the row number. Ok,
// so we were able to assign the buttons to an id which is basically just the string of the row number. Now, we did notice that the id
// for both the the edit and delete button were the same for each row, but I don't think that's a problem? Alright, so now we have to 
// make the edit and delete buttons work. Let's start with the delete button. Wait a minute, we need to write the delete function and
// put in an event listener.

// I think we're gonna have to do this by trial and error with the delete function to see what values are taken, but we should start
// with the entire row data, and just run it at the start. Well, I guess we can link it up to the button as well, why not. Actually
// the delete query just needs the id, so let's try just sending a JSON object with {"id":idVal}. Ok, so our delete function will send
// the JSON object to the server, then what do we want to do? I guess if the send is succesful, we delete the table, then rebuild it?

// Ok, so there's a couple things wrong. First off, we're getting an error that says 'name' can't be null, so I think we need the whole
// row object. Secondly, we're trying to pass a parameter into the onclick function, and I think it's just calling the function? Let's
// try it again without a parameter to see. Yeah, that seems right. It's calling the function each time the edit button's event listener
// is added bc of the parameter. Hmmm... if we don't call it like that, it actually isn't called the onDelete function at all now.
// Actually, it seems like we were using "onclick" instead of "click". When we changed it to click it worked, well, the function ran,
// but it says we still need the name property, or all the row properties I think.

// Ok, so we see that the correct object, well, the object we wanted to pass, is coming over {id:1}, but it does say name cannot be null,
// so let's pass the whole thing over, which means, we kind of want to reuse this makeInput function? Ok, so it looks like our makeInput
// function is fine but... we need an ID field in here, and we don't need it for the GET request. Wait, how do we access the row? It
// should be the same as the button id right? Wait a minute, we have the table element, it is as easy as table[i] for the row we want?
// Apparently not that simple, let's try something like this code:

// var table = document.getElementById("mytab1");
// for (var i = 0, row; row = table.rows[i]; i++) {
//    //iterate through rows
//    //rows would be accessed using the "row" variable assigned in the for loop
//    for (var j = 0, col; col = row.cells[j]; j++) {
//      //iterate through columns
//      //columns would be accessed using the "col" variable assigned in the for loop
//    }  
// }

// That kind of worked, but we still can't access the specific data cells? Or is it the input cells that we want? Wait a minute, why are
// we accessing the table elements, why not access the tableData elements, bc we know what those look like? 

// Ok, let's review a bit, bc we are losing focus. We are trying to add an event listener to our delete button that will delete things,
// but the database seems to want a name (so probably the whole row? but we were trying to give just the row id number). Anyway, we are
// unable to access the input values from the row, even though the row value and the button id are the same. How do we access all the
// td values of each row? How did we do it in our form?

// Wait a minute, we just seen that we're calling the POST method for the DELETE function, does that change anything? Interesting, now
// it doesn't do anything. Let's try to send that JSON object again. Interesting, so now our on delete is being called, and the object
// sent is correct, but the database hasn't changed. Well, when we printed out the response, it said deleted 0 rows lol, so I guess
// we did get a response. Ok, so we're sending the right object presumably, but it's not deleting anything, and I'm not sure that server
// code is even running, although it is giving us a response? That's weird, so changing the req.open parameter from false to true, gives
// us an error when we try to parse the response?

// Hmmm... the ED discussion is not helpful. I'm not sure what I'm doing wwrong, but it's not deleting. Let's go over the parts of the
// implementation video on deleting and see if he even talks about it?

// Ok, we had 2 thoughts. First of all, maybe the delete request needs the whole row? We can test it with hardcoding an object that has
// the whole row, since we can't seem to access the whole row. We can also work on the edit function to at least get that working if we
// keep getting stuck. For accessing the whole row, consider giving each of the relevant lines an id value, such as "[rowNumber]
// [varName]" so that we don't have to try iterating through each tr and other elements, which apparently we can't do.

// ***Note that we currently get the radio value of the form input for the getRadioValue function, so we need to pass it a docElement 
// parameter so that we can use it to get the radio value of the form or from the tableData? But wouldn't tableData not be a Doc element?
// Actually, we do want it from the table, so we can update it, so yeah, we need the readings from the form and from the table. ***

// *** Another note is that we are not creating the table immediately after we add the form inputs, so we need to make sure maketable is
// being run and updating the JS. Only when we refresh do we see that, so we just need to call the function in the GET post? As a 
// async await?***

// Alright, so let's hardcode the bench activity object and see what happens. Wait a minute, what if it just was the number 1 instead of
// string 1, would that make a difference? 

// Oh crap, that did work, so we just need the whole object instead of the ID, that's where we were messing up. We thought it was maybe
// not working bc the default printout said nothing got deleted, but that printout relies on the context object, which we didn't create
// but when we refreshed, it actually did delete the right row. Ok, so, we need to create the unique IDs for each TD element so that we
// can access them. What are there names? It's just the concatenation of the row number and the varName.

// Ok, so we were able to give each of those tds an id, fairly easily bc it was just a field on our makeCell function. Now, let's see,
// how do we want to access these? If the button is clicked, it has the row number as a parameter, so do getElementById with the id being
// the concatenation of the numberOfRows.toString and the name of the field (id, name, reps, weight, unit, date). Note that the radio
// buttons will probably need special processing. The radio buttons are inside their own form, but it doesn't matter, give each a unique
// id and we can do that as well.

// Ok, so we also gave our radio buttons a unique name. Now, let's pool up these properties when the delete button is hit. Ok so we're
// getting a little lost again. We have the button click, and it's passing the button ID, which is a row number, so we're gonna call
// getObject to create our JSON object, with one of the parameters being, the table? No, that's the wrong part. The parameter for the
// doc element is the row, which we also don't really need. It doesn't matter what the doc element is actually, bc we won't use that
// info. All we need is the button ID (maybe this should be a different function now that we think about it, but too late, it's fine).
// Use the buttonId, which is the rowNumber, to get all the elements with the rowNumber and property, set them, and put them into the
// object.

// Ok, so how are we going to pick the unitID? we need to get both input labels, then check if lbs.checked is checked, if it is, then 
// the unit value is 0 and lbs.checked is checked, otherwise the unit value is 1 and kgs.checked is checked. Ok, so I think we got that
// to work, it's sending the correct entire row, which is causing the row to be deleted.

// Ok, let's now work on the edit function. Ok, we are getting some kind of parse error:

// Error: ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the 
// right syntax to use near 'unit=NULL date=? WHERE id=?' at line 1

// This error seems to be hinting that our unit is null.. hmmm, is it? Are we getting the value correctly? Yeah, it's a 1. Maybe we need
// to use a non string 1? Let's use different hardcoded JSONs and see if we can update. Interesting, so manually putting in the values
// (which means there might be something wrong with our makeObject radio value) gives us a different but similar error:

// Error: ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the 
// right syntax to use near 'unit='1' date='2021-05-31' WHERE id='3'' at line 1

// So appears to be some syntax issue. Yeah, so there's some syntax issue, but we're not sure what it is. We can review parts of the
// video for the update function and see if we can catch anything, or when he sets up the update function. I mean, he just copy and
// pasted it, and that's what we have. It seems the issue currently is our JSON object not sending, which is.

// Hmmm, we're noticing in our updateQuery some weird syntaxing. First, there are no commas after some sets, and secondly, there's an
// extra space before the final quote. Let's edit both of those and see what happens? That didn't seem to change anything. It's weird
// bc looking at the git file for mySQL for the class, there are these weird no commas and spaces before the last quote, so maybe that
// is the corrct syntax? Let's google this mySQL syntax. Hmmm... maybe we don't need the id line? Let's watch the video and see what he
// is sending for update? OK, we see from the video that he does send all 6 values, and the values are all in strings. The order is
// date, id, name, reps, unit, and weight.

// Ok, so our mysql version is ver 15.1, achieved by typing "mysql -V" in the terminal. Let's look for its syntax? Interesting, so we're
// noticing a couple of different things playing around with the syntax. First off, it doesn't seem enough to just save the file when
// we change our qeury string, we actually have to restart node or it won't really save the query changes. I think our idea to add the
// commas was correct, bc after adding the commas, it doesn't save near "unit..." but now is getting caught up at the "where" part of
// the string, so it's getting better lol. 

// Yes, the edit function worked! So, we googled up the mariaDB thing (it didn't even ask for a version) and looked at the template, and
// basically every value, except the value before "where" has a comma, and there is no space before the last quotation mark either, so
// that successfully edited now thank god.

// Ok, we need to have these edit and delete functions call, wait for them, then delete the table and remake the table (this requires)
// async await and a delete table function. Ok, following the mold of that async call, I think we were able to do it. It created the
// new table from the data after the delete, and appended it to the current table (which is wrong of course bc we have not deleted the
// old table) so it seems to work. We just need to delete the old table before we append the new table.

// So googling reveals a .deleteRow() function, which might be the one we want to use, bc we want to keep the header row, but delete all
// the other rows. Interesting, so looking at our table, it seems we have a table element, attached to a table body element, and inside
// the table body element is our table rows for the header, so I think if we just delete all the rows, it should keep the header and 
// remove the rows we want to remove. Hmmm... there's also a .remove() function that removes all the rows? Let's try that first. 
// Interesting, it did delete the table, but it didn't remake the table.

// Interesting, so that didn't seem to work. The problem is we can't see the table lol. maybe call its children? Hmm... we're resetting
// this number of rows, but I don't think we should be? Bc the database still has those old row numbers. Ok, so right now, the new table
// is not showing up. All our functions are being called in order, so we have to determine if the delete table is not working, or maybe
// the make table is not working? Holy crap, we spent like 30 mins trying to recreate the way to read the results. It's "stringObject
// .results" thats what we want to print out to see what's in the table jesus.

// Ok, so we finally confirmed that the info in table Data is right after deletion, and our make table is running, so where's the new
// table? I mean, we've seen the table make after a deletion and append to our current table. So that's not the problem. The problem
// I'm pretty sure is this delete function maybe removing the table entirely? If we use remove, we can just create a new table element
// right? 

// Let's just create everything on the table, and append to the header. Ok, so that's working now. We have to leave a header for the
// "workout" tables header, then create the whole table, including the table's first row, and then delete the whole table. The issue
// I'm pretty sure was that the remove function removed the table for us to append. Ok, so that worked, now, let's clean things up,
// then update the add event listener for edit to getData, delete table, and make table.

// *** Ok, so the edit function works, but we just realized, the headers for our row are not there. Alright, we had not appended the first
// row, then appended it after the other rows. Now we have everything set up. Now what? Let's make sure the radio buttons selecting and
// editing and making correctly. Then make sure to reset the numberOfRows variable when the table is reset? Does that even matter lol?
// Finally, we need to fix the issue of the form not updating if there's no name? We had done it with no date, and it took the submission
// but it's not supposed to take it without all valid input? ***

// Ok, we need to get the data to update when we add to the form as well. Ok, so that's worknig now too. and it looks like our radio
// buttons from the add form i sworking. So I think the radio buttons are showing up fine. The final thing is, we need to make it reject
// if non valid input from form.

// I think we're ok with this. Let's reset the table, then play around and make sure everything works, then remove all the comments and
// make a forever port (do we need to make a forever port with the public html stuff? yeah, I think so)?

