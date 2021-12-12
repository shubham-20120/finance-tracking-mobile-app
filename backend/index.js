const express = require('express');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const uri = "mongodb+srv://finance:financePsw@cluster0.cl9mz.mongodb.net/users?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log('database connected successfully!');
})


app.use(cors());
app.use(express.json());

// ROUTES
app.use(require('./Routes/user'));
app.use(require('./Routes/Data'));

app.listen(port, (error) => {
    console.log(`server started on port ${port}`);
})