const express = require('express');
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const { getUserByEmail } = require('./classes');
const { generateRandomString } = require('./classes');
const { urlsForUser } = require('./classes');
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],
}));


// Holds urls
const urlDatabase = {
};
// Holds users info
const users = {
};



// HOMEPAGE
app.get('/', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login')
  }
});




//get login
app.get('/login', (req, res) => {  
  let templateVars = { user_id: req.session.user_id, users: users };
  res.render('login.ejs', templateVars);
});

//post login to user
app.post('/login', (req, res) => { 
  const lookupEmailResult = getUserByEmail(req.body.emailAddress, users);
  if (lookupEmailResult) {
    if (bcrypt.compareSync(req.body.pwd, users[lookupEmailResult].password)) {
      req.session.user_id = users[lookupEmailResult].id;
      res.redirect('/urls')
    } else {
      res.statusCode = 404;
      res.send("ERROR 404: The password and email do not match");
    }
  } else {
    res.statusCode = 404;
    res.send("ERROR 404: The email you entered does not exist!")
  }
});

// Register user
app.get('/register', (req, res) => { 
  let templateVars = { user_id: req.session.user_id, users: users };
  res.render('registration.ejs', templateVars);
})

// Info when form has been filled in
app.post('/register', (req, res) => { 
  const email = req.body.emailAddress;
  const password = bcrypt.hashSync(req.body.pwd, 10);
  if (email === "" || password === "") {
    res.statusCode = 400;
    res.send('ERROR 400: Please fill out email and password')
  } else if (getUserByEmail(email, users)) { 
    res.statusCode = 400;
    res.send('ERROR 400: Email already exist!');
  } else {
    const randomID = generateRandomString();
    users[randomID] = { id: randomID, email: email, password: password };
    req.session.user_id = randomID;
  }
  res.redirect('/urls');

});


// Get and post the url
app.get('/urls', (req, res) => { 
  const userURLs = urlsForUser(req.session.user_id, urlDatabase);
  let templateVars = { user_id: req.session.user_id, urls: userURLs, users: users };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => { 
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});


// Posts the new url
app.get('/urls/new', (req, res) => {  
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let templateVars = { user_id: req.session.user_id, users: users};
    res.render('urls_new', templateVars);
  }
});


// diplay smallUrl
app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { user_id: req.session.user_id, shortURL: req.params.shortURL, users: users, longURL: undefined, owner: false, urls: urlsForUser(req.session.user_id, urlDatabase)}
  if (urlDatabase[req.params.shortURL]) {
    templateVars.longURL = urlDatabase[req.params.shortURL].longURL;
    if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
      templateVars.owner = true;
    }
  }
  res.render('urls_show', templateVars);
});

// edits the long url of the short url
app.put('/urls/:shortURL', (req, res) => {
  if (req.session.user_id) {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id };
  }
  res.redirect('/urls');
});

// Takes you to the long url instead of the short url
app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  } else {
    res.statusCode = 404;
    res.send("ERROR 404: Not Found.")
  }
});  

// Delete the short url
app.delete('/urls/:shortURL', (req, res) => {
  if (req.session.user_id) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL]
  }
  res.redirect('/urls');
});


// Logs you out of the account
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls')
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});
