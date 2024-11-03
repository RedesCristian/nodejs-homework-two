const app = require("./app");
const conectDB = require('./database');



conectDB();

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});