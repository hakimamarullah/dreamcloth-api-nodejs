const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;




const init = async ()=>{
    await mongoose
      .connect("mongodb://hakimamarullah:requiremongoose@dreamcloth-1-shard-00-00.rinex.mongodb.net:27017,dreamcloth-1-shard-00-01.rinex.mongodb.net:27017,dreamcloth-1-shard-00-02.rinex.mongodb.net:27017/?ssl=true&replicaSet=atlas-b1jkvh-shard-0&authSource=admin&retryWrites=true&w=majority")
      .then(() => console.log("Database connection successfull"))
      .catch((err) => {
        console.log(err);
      });
    
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}....`);
    });
}

init()