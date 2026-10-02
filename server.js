require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors());
app.use(express.json());

// JSON parsing error handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON format' });
    }
    next(err);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));

app.get('/', (req, res) => {
    res.send('Welcome to the NextGen E-Commerce API');
});

const port = process.env.PORT || 8080;

initDb((error) => {
    if (error) {
        console.error(error);
        return;
    }

    app.listen(port, () => {
        // console.log('Connected to DB and listening on port ' + port);
          console.log(`Server running at http://localhost:${port}`);
   

    });
});
