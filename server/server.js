require('dotenv').config();
const express = require('express')
    , session = require('express-session')
    , bodyParser = require('body-parser')
    , massive = require('massive')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , controller = require('./controller.js');


const app = express();

app.use((req, res, next)=>{
    console.log(req.url);
    next();
})

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

massive(process.env.CONNECTION_STRING).then( db => {
    console.log('massive function is running')
    app.set('db', db);
})

passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, function(accessToken, refreshToken, extraParams, profile, done){
    // db calls

    // console.log(profile._json.identities[0])
    console.log('profile is...', typeof profile.identities[0].user_id)

    const db = app.get('db');

    db.find_user([ profile.identities[0].user_id ]).then( user => {
        if(user[0]){
            console.log('USER EXSISTS with id of...', user[0])
            
            return done(null, user[0].user_id)
        } else {
            console.log('CREATING A NEW USER')
            const user = profile._json
            console.log('user is..', user.identities[0].user_id)
            db.create_user([ user.name, user.email, user.picture, user.identities[0].user_id ])
            .then( user => {
                
                return done(null,user[0].user_id)
            })
        }
    })
    // done(null, profile);
}))

app.get('/auth', passport.authenticate('auth0'))
app.get('/auth/callback', passport.authenticate('auth0',{

    successRedirect: 'http://localhost:3000/browse',
    failureRedirect: 'http://localhost:3000/'

}))
app.get('/auth/me', (req,res) => {
    console.log(req.user)
    if(!req.user) {
        return res.status(404).send('User not found.')
    }
    return res.status(200).send(req.user);
})

app.get('/auth/logout', (req, res) => {
    req.logOut();
    res.redirect('http://localhost:3000/')
})

passport.serializeUser( function( user, done ){
    console.log('SERIALIZED')
    console.log('user is...', user)
    done(null, user);
})
passport.deserializeUser( function( user, done ){
    console.log('deserialized')
    //gets checked everytime (extra level of security)
    //takes the user and puts info on req.user for any endpoint
    // app.get('db').find_current_user([ id ])
    // .then( user => {
        done(null, user)
    // })
})

const PORT = 3005;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))