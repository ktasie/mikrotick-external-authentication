const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RouterOSClient = require('routeros-client').RouterOSClient;

dotenv.config({ path: './.env' });
const app = require('./app');

// Database connection
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

//Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// To handle any promise without catch block
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('error', (err) => {
  console.log(err);
});
