# TODO App 

## How to start the app 

### Docker-Compose 
As required in exercise 2, the whole application is containerized: Images for the react-client and nodejs-server are defined via a *Dockerfile* in their respective subdirectories ./frontend and ./backend. The setup for the mongodb, as well as the orchestration of the multi-container-application is handled with docker-compose and described in a docker-compose.yml file in the root directory of the project. Run the following commands from the root directory ./Cloud_computing_mzenke to build the containers and start the containerized setup. 

```cmd
docker compose build 
docker compose up 
```

After completing the commands, three containers should be running ( client, server and db ). This can be tested via 
```cmd
docker ps 
```
and should display something like
```cmd
# docker ps
CONTAINER ID   IMAGE                             COMMAND                  CREATED          STATUS          PORTS                      NAMES
407473f52b28   cloud_computing_mzenke-frontend   "docker-entrypoint.s…"   14 minutes ago   Up 14 minutes   0.0.0.0:3000->3000/tcp     cloud_computing_mzenke-frontend-1
dc41ede2617c   cloud_computing_mzenke-backend    "docker-entrypoint.s…"   14 minutes ago   Up 14 minutes   0.0.0.0:5000->5000/tcp     cloud_computing_mzenke-backend-1
6cc18deb4e2c   mongo                             "docker-entrypoint.s…"   14 minutes ago   Up 14 minutes   0.0.0.0:27017->27017/tcp   db
```

*actions below are deprecated and should only be regarded as documentation for exercise 1* 
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
npm install 
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
