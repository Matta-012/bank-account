## 💻 Prerequisites

This application uses [Docker](https://www.docker.com/get-started/) and [Docker Compose](https://docs.docker.com/compose/install/) to start it, so make sure that both tools are installed correctly on your computer.

## 🚀 Cloning the Project

Open your terminal and type the following commands:
```
git clone https://github.com/Matta-012/bank-account.git

cd bank-account
```
## 🚀 Starting the Application
With the project cloned on your machine and inside the `bank-account` directory, run the following docker compose command:

```
docker-compose up
```
Wait until the installation is finished.

Open a new terminal window, make sure you are inside the project directory, and run the following commands to migrate the database and seed it:

```
npm run migrate

npm run seed
```

Wait for the commands to run and open the project documentation link:

[http://localhost:3000/api](http://localhost:3000/api)

#### Unit Tests

To run the unit tests from this project:

Make sure you are in the root directory

Install dependencies:
```
npm install
```
Start the tests
```
npm test
```