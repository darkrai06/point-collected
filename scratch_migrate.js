const db = require('./server/config/db');

try {
  db.exec('ALTER TABLE tasks ADD COLUMN minutes INTEGER DEFAULT 1');
  console.log('Successfully added minutes column');
} catch (e) {
  if (e.message.includes('duplicate column name')) {
    console.log('Column already exists');
  } else {
    console.error(e);
  }
}
