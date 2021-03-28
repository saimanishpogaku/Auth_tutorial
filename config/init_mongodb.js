const mongoose = require('mongoose');

//URI can be written like mongodb://username:password@host:port/database?options...
mongoose.connect(process.env.MONGODB_URI,{
    dbName : process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const db = mongoose.connection;

db.on('connected',() => {
    console.log('Mongoose connected to db');
});

db.on('error',(err) => {
    console.log('Mongoose connection error due to '+err.message);
});

db.on('disconnected',() => {
    console.log('Mongoose connection is disconnected');
});

//This event will be triggred once we try to exit application by pressing Ctrl+c
process.on('SIGINT', async () => {
    await db.close();
    process.exit(0);
});




