const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'conf@123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Hashed password:', hash);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash(); 