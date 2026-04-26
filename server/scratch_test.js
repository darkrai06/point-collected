const { exec } = require('child_process');
const axios = require('axios');

const server = exec('node server.js', { env: { ...process.env, PORT: 5001 } }, (err, stdout, stderr) => {});
server.stdout.on('data', d => console.log('SERVER:', d.toString().trim()));
server.stderr.on('data', d => console.log('SERVER ERR:', d.toString().trim()));

setTimeout(async () => {
  try {
    const api = axios.create({ baseURL: 'http://localhost:5001/api', headers: { 'Content-Type': 'application/json' } });
    const reg = await api.post('/auth/register', { username: 'test_a', email: 'ta@t.com', password: 'p' });
    api.defaults.headers.common['x-auth-token'] = reg.data.token;
    
    const taskRes = await api.post('/tasks', { title: 'Test Task', difficulty: 'easy' });
    console.log("Created task:", taskRes.data.id);
    
    const compRes = await api.patch(`/tasks/${taskRes.data.id}/complete`, { minutes: 15 });
    console.log("COMPLETED TASK RES:", compRes.data.task.minutes);
    
  } catch(e) {
    console.error("error:", e.response ? e.response.data : e.message);
  } finally {
    server.kill();
  }
}, 1000);
