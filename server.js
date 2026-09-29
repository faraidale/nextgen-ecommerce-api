require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/connect');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;

initDb((error) => {
    if (error) {
        console.error(error);
        return;
    }

    app.listen(port, () => {
        console.log('Connected to DB and listening on port ' + port);
    });
});
