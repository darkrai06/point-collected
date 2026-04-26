const db = require('./server/config/db');
console.log(db.prepare("SELECT id, title, minutes, points, is_completed FROM tasks").all());
