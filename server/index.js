const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();
const port = process.env.PORT || 443;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/api/auth", authRoutes);

//Not found route
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem"),
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
  console.log("HTTPS server running on port 443");
});
