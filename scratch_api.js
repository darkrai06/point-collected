const https = require('https');

const data = JSON.stringify({
  email: 'test@example.com',
  password: 'password123'
});

const req = https.request({
  hostname: 'point-collected-9ygm.vercel.app',
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    try {
      const token = JSON.parse(body).token;
      if (!token) return console.log("No token:", body);
      
      const patchData = JSON.stringify({ minutes: 35 });
      const patchReq = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/tasks/1/complete', // assuming task 1 exists
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': patchData.length,
          'x-auth-token': token
        }
      }, (pres) => {
        let pbody = '';
        pres.on('data', d => pbody += d);
        pres.on('end', () => {
          console.log("Response:", pres.statusCode, pbody);
        });
      });
      patchReq.write(patchData);
      patchReq.end();

    } catch (e) {
      console.log("Error:", e.message, body);
    }
  });
});
req.write(data);
req.end();
