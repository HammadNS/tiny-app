const { assert } = require('chai');
const { urlsForUser } = require('../classes.js');
const { getUserByEmail } = require('../classes.js');


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "usertwoRandomID": {
    id: "userTwo", 
    email: "userTwo@example.com", 
    password: "hashhash"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW"},
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW"},
  q1h3Gr: { longURL: "facebook.com", userID: "gew22h" }
};



// url test
describe('urlsForUser', function() {
  it('should return the correct urls for a valid user', function() {
    const urls = urlsForUser("aJ48lW", urlDatabase);
    const expectedOutput = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW"},
      i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW"}
    }
    assert.deepEqual(urls, expectedOutput);
  });

  it('should return no urls if the user does not have any urls', function() {
    const urls = urlsForUser("aUser", urlDatabase);
    const expectedOutput = {};
    assert.deepEqual(urls, expectedOutput);
  });
})

// email test
describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });

  it('should return undefined with an invalid email', function() {
    const user = getUserByEmail("123@123.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});