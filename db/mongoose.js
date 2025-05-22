const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://badr:vqxqrixxkkIR93f3@cluster0.pvcbdyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then (() => {
  console.log("conecter")
} 
)
.catch (()=> {
  console.log("fail")
})

const MongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://badr:vqxqrixxkkIR93f3@cluster0.pvcbdyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
MongoClient.connect(url)
.then(client => {
    // Sélection de la base de données 'test' (vous pouvez remplacer 'test' par le nom de votre base de données)
    const db = client.db('test');

    // Sélection de la collection "users"
    const collection = db.collection('users');

    // Utilisation de find pour récupérer tous les documents de la collection
    return collection.find({}).toArray();
  });


module.exports = mongoose;
