const axios = require('axios');

async function test() {
  try {
    const api = axios.create({
      baseURL: 'https://point-collected-9ygm.vercel.app/api',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log("Registering temp user...");
    const rand = Math.floor(Math.random()*10000);
    const reg = await api.post('/auth/register', { username: 'test'+rand, email: 't'+rand+'@t.com', password: 'password' });
    const token = reg.data.token;
    api.defaults.headers.common['x-auth-token'] = token;

    console.log("Adding task...");
    const taskRes = await api.post('/tasks', { title: 'Test Task', difficulty: 'easy', custom_points: '' });
    const taskId = taskRes.data.id;
    console.log("Created task ID:", taskId);

    console.log("Completing task with 15 minutes...");
    const compRes = await api.patch(`/tasks/${taskId}/complete`, { minutes: 15 });
    console.log("Completion response minutes:", compRes.data.task.minutes);

    console.log("Validating total points... points should be 15 * 5 = 75");
    const userRes = await api.get('/auth');
    console.log("Total User points:", userRes.data.total_points);

  } catch(e) {
    if (e.response) {
      console.error("API Error:", e.response.status, e.response.data);
    } else {
      console.error(e);
    }
  }
}
test();
