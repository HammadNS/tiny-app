// Returns the user if the email is associated with any user in the data
function getUserByEmail (email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
}


//Gets the url for the user
function urlsForUser (id, urlData) {
  let userUrls = {};
  for (url in urlData) {
    if (urlData[url].userID === id) {
      userUrls[url] = urlData[url];
    }
  }
  return userUrls;
}; 

// generates a random string
function generateRandomString() {
  const abc = 'ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let newString = '';
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * abc.length);
    newString += abc[index];
  }
  return newString;
};
module.exports = { getUserByEmail, generateRandomString, urlsForUser }