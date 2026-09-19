const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const app = require("./app");
const connectToDB = require("./src/config/database");

const port = process.env.PORT || 3000;

console.log("3. Starting DB connection");

connectToDB();

console.log("4. DB connection function called");

app.listen(port, "0.0.0.0", () => {
    console.log(`5. Server running on port ${port} 🔥`);
});