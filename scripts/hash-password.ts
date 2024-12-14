const bcrypt = require('bcryptjs');

const password = 'Admin@sudhanshu@123';

// Hash the password
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Original password:', password);
console.log('Hashed password:', hashedPassword);
