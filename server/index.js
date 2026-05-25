const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRoutes = require("./routes/todoroutes");
require("dotenv").config();


const app = express();


// Middleware : 

app.use(cors());
app.use(express.json());

// MongoDB Connection:

mongoose.connect(process.env.MongoDB_URL)
.then(() => console.log("Connected"))
.catch((err) => console.log(err));


app.get("/",(req,res) => {
    res.send("API Working...")
});

app.use("/api/todos",todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});