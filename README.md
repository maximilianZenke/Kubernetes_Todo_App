
# TODO App 

### ❗ Exercise 4 Information  
This repo contains three different versions of the solution for exercise 4: 
1. kubernetes
    --> my first solution containing the deployments and services for my app. 
2. kubernetes-with-helm 
    --> second solution containing the helm-chart-transformation of the first solution. 
3. kubernetes-with-helm-replica-set 
    --> **FINAL SOLUTION**  uses one backend-service with two replicas instead of two deployments, backend and backend2 ( which was my not-optimal-solution for exercixe 3 ). Besides this change, the final solution is the same as the kubernetes-with-helm solution. 

## How to start the app for exercise 4 

### Minikube 
Start minikube. This may take some time 
```cmd
minikube start 
```
Enable minikubes' ingress-addon. This enables your host to directly communicate with services inside a kubernetes cluster. 
```cmd
minikube addons enable ingress 
```
Finish the ingress-setup by adding the hosts for the todo-app to your etc/hosts to ensure functioning DNS-resolving between the host system and the cluster. Add those entries to your etc/hosts 
```txt
# ingress without minikube tunnel 
192.168.49.2 frontend.local
192.168.49.2 backend.local
192.168.49.2 backend2.local

# ingress with minikube tunnel 
127.0.0.1 frontend.local
127.0.0.1 backend.local
127.0.0.1 backend2.local
```
Finish the setup by opening a minikube tunnel
```cmd
minikube tunnel
```
❗Do not close the window with the tunnel. 

### Helm 

The whole application can be installed using a helm chart. Navigate into the directory including the final solution
```cmd
cd .\kubernetes-with-helm-replica-backend\cc-helm-chart-02\
```
Start the application
```cmd
helm install cc-helm-chart ./
```
Startup will take some time. You can check on the status of your cluster using 
```cmd
kubectl get pods 
```
If everything is done, the output should look like this: 
```cmd
# kubectl get pods
NAME                                     READY   STATUS    RESTARTS   AGE
cc-helm-chart-backend-54dc9db58b-7vnwf   1/1     Running   0          108m
cc-helm-chart-backend-54dc9db58b-pw54j   1/1     Running   0          108m
cc-helm-chart-frontend-948f56cbb-mn6r8   1/1     Running   0          108m
db-7f9bb8c796-dnmt9                      1/1     Running   0          108m
```

### Access to the application 
Access the frontend by typing "http://frontend.local/" in your browser. 
Access the backend by typing "http://backend.local/todos" in your browser. 

### Kubeview 
Kubeview is an open-source visualization tool for kubernetes cluster. Follow the commands below to reveive a visual representation of the apps' cluster via kubeviews' web-ui. 
```cmd
cd ./kubeview/charts
helm install kubeview ./kubeview -f myvalues.yaml
kubectl port-forward svc/kubeview -n default 8080:80
```
Access the Kubeview web-ui at localhost:8080. 
❗While accessing Kubeview all endpoints will only point to kubeview. This is due to the fact that the ingress controller uses port 80 as well. 
If you want to access the application again, uninstall kubeview 
```cmd
helm uninstall kubeview 
```

## How to start the app for exercise 1, 2 and 3

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
