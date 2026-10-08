require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { initDb } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/login', passport.authenticate('github'));
app.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) return next(error);
        res.redirect('/');
    });
});
app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
app.use('/users', require('./routes/users'));

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
        console.log('Connected to DB and listening on port ' + port);
    });
});
