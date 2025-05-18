const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://badr:vqxqrixxkkIR93f3@cluster0.pvcbdyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
