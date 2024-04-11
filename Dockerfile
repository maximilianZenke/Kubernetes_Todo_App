FROM node:latest

WORKDIR /app

COPY backend ./backend

COPY frontend ./frontend

RUN cd backend && npm install

RUN npm install -g nodemon

RUN cd frontend && npm install

EXPOSE 3000

EXPOSE 5000

CMD cd backend && nodemon start & cd frontend && npm start

