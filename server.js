const app = require("./app");
const conectDB = require('./database');


conectDB();

app.listen(3001, () => {
  console.log("Server is running. Use our API on port: 3001");
});
