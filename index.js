
// It allows us to access methods and function in easily creating
const express = require("express");

// We create an application using express.
// app is our server.
const app = express();

const port = 3000;

//Use middleware
app.use(express.json());     // Allow your app to read json data.
app.use(express.urlencoded({extended: true}));   // Allows your app to read json data.

//[SECTION] Routes
// if(request.url == "/login" && request.method = "POST") = using node.js

// This routes expects to receive a GET request at the 
app.get("/", (req,res)=>{
	res.send("Hello World");
})
app.get("/hello", (req,res)=>{
	res.send("Hello from the/hello endpoint");
})

// Upon sending a POST request in the /hello endpoint, the server will response with the message: "Hello there <firstName> <lastName>"

app.post("/hello", (req,res)=>{
	console.log(req.body);
	res.send(`Hello there ${req.body.firstName} ${req.body.lastName}`)
})

//[SECTION] CRUD Functionality

// Create a mock database for users
let users = [];


/*

    SCENARIO:

    We want to create a simple Users database that will perform CRUD operations based on the client request. The following routes should peform its functionality:

                "

*/

/*1. "/signup" route
                    - This will allow a client to register in our database using a username and password.
                    - Make sure that the client entered the complete information before saving it in the mock database.
                        - If the client entered a complete information, store it in our mock database and send a response of "User <username> successfully registered!".
                            Ex. User johndoe successfully registered!
                        - If the client entered a incomplete information, send a response "Please input BOTH Username and Password.*/
app.post("/signup", (req, res)=>{
	if(req.body.userName != "" && req.body.password != ""){
		//This will store the user object sent via Postman in our mock database
		users.push(req.body)
		console.log(users);

		//This will be sent as a response if both username and password is not empty
		res.send(`User ${req.body.userName} successfully registered!`);
	}
	else{
		//This will be sent as a response if either username or password is empty.
		res.send("Please input BOTH Username and Password.");
	}
})

/*
	 2. "/users" route
                    - This endpoint will be used to view all the users registered in our database.
                 Sample output:[
						{
							"userName":"johndoe",
							"password":"john123"
						}
						]
*/
//solution:

app.get("/users", (req,res)=>{
	//This will retrieve all the users stored in the mock database
	res.send(users);
})


/*

   3. "/change-password" route
                    - This will allow a registered user to update his/her password.
                    - Make sure that the user is registered in the database before applying the changes.
                        - If the user's username is found in the database, change the user's password and send a response of "User <username>'s password has been updated."
                        - If the username is not found in the database, send a response of "User does not exist."

*/
//Solution:

app.patch("/change-password", (req,res)=>{

	//Create a variable
	let message;
	// Creates a for loop that will loop through the elements of the "users" mock database.
	for(i = 0; i < users.length; i++){
		//If the username provided in the postman and the username of the current object in the loop is the same.
		/*
			user: john, jane, joe
			loop: start at 0
			john == jane // User does not exist
			loop: 1
			jane == jane // User jane's password has been updated
			loop: 2
			joe == jane //user does not exist
		*/
		if(users[i].userName == req.body.userName){

			// Changes the password of the user if the username provided matches the current object in the loop.
			users[i].password = req.body.password;

			message = `User ${req.body.userName}'s password has been updated`;
			// Breaks out the loop once a user matches the username provided in the postman.
			break;
		}
		else{
			message = "User does not exist";
		}
		// Once res.send is initiated it will end the communication with the client
	}
	res.send(message);
})

/*
  4. "/delete-user" route
                    - This endpoint will delete a user from the mock database, upon sending a "username" as a request.
                    - Before performing any actions in this endpoint, Make sure that the database is not empty and the user to be deleted exist.
                    - If the mock database is not empty, create a condition that will check if the user exist in the database and will peform the following actions:
                        - If the username is found in the database, remove the user and send a response "User <username> has been deleted.".
                        - If the user is not found in the database, send a response "User doesn't exists".
                    - if the mock database is empty, send a response "The user database is empty!"
*/

// app.delete("/delete-user", (req, res) => {
//        if (users.length > 0){
//         let userExist = false;
//         for(i = 0; i < users.length; i++){

//                if (users[i].userName == req.body.userName) {
//                         res.send(`User ${users[i].userName} has been deleted`);    
//                         console.log(users[i].userName); 
//                         users.splice(i, 1);
//                         break;

//                 }
//         }
//         if (!userExist)
//                 res.send("User doesn't exists")
//        }
//        else {
//         res.send("The user database is empty!")
//        }

// })

app.delete("/delete-user", (req, res)=> {
	let message;
	// Create a condition to check if the mock database is empty
	if(users.length != 0){
		// Check if the user exist
		for(i = 0; i < users.length; i++){
			if(req.body.userName == users[i].userName){
				//We will delete the user
				message = `User ${req.body.userName} has been deleted.`

				// Current index of the element to be deleted, "1" represents the number of elements to be removed.
				users.splice(i,1)

				// to stop the loop
				break;
			}
			else{
				message = "User does not exist."
			}
		}
	}
	else{
		message = "The user database is empty!"
	}
})


/*
5. "/home" route
                    - This will send a response "Welcome to the homepage" upon accessing by the client.

*/

app.get("/home", (req, res) =>{
	res.send("Welcome to the homepage");
})

app.listen(port, ()=> console.log(`Server running at port ${port}`))