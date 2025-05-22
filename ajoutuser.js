const mongoose = require('./db/mongoose');
const User = require('./models/User');

const users = [
  {

  },
  {

  },
  {

  }
];

async function addUsers() {
  for (const u of users) {
    try {
      const exists = await User.findOne({ username: u.username });
      if (exists) {
        console.log(`⚠️ ${u.username} existe déjà`);
        continue;
      }

      const user = new User(u);
      await user.save();
      console.log(`✅ Utilisateur ajouté : ${u.username}`);
    } catch (err) {
      console.error(`❌ Erreur pour ${u.username} :`, err);
    }
  }

  mongoose.connection.close();
}

addUsers();
