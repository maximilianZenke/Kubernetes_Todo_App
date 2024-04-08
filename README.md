# TODO App 

## How to start the app 
### MongoDB 

To run the database, docker/ docker-desktop needs to be installed. 

The TODO app stores its TODOS in a MongoDB instance. The MongoDB instance is running inside 
a docker container.Navigate into the db folder and run the command below to start the instance 
```cmd
cd db 
docker-compose up 
```

### Backend 

The TODO app can not directly access the database. To enable the connection, a 
backend is needed. Navigate into the backend folder and run the command below to start the backend 
```cmd
cd backend 
nodemon index.js
```
confirm the backend is running by checking *localhost:5000* in a browser. It should 
display *"App is Working"*. 

### Client 

The client provides the TODO app's UI. Navigate into the frontend folder and run the command below 
to start the client. 
```cmd
cd frontend 
npm start
```
The client is available at *localhost:3000* 

## Testing the Requirements 

The TODO app has to fulfil a set of requirements. To check if all requirements are met, f.e. if the client truthfully edits/deletes/saves its TODOS, 
access to the MongoDB is needed. As the MongoDB is running in a docker container, this can be accomplished via 
```cmd 
docker exec -it db-mongodb-1 mongosh
```
this opens a mongosh shell in which the db and collections can be directly accessed 
```cmd
use Todo-Db
db.todos.find()
```
using this query, all TODO entries will be displayed. Using this method, one can edit an entry using the client and check, if 
the changes really did place on the database-side. 
