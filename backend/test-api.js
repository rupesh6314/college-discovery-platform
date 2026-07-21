const axios = require('axios');

async function testLiveApi() {
  try {
    const res = await axios.post('https://college-discovery-backend-rkl3.onrender.com/api/auth/forgot-password', {
      email: 'rupesh2k5chandra@gmail.com'
    });
    console.log('Status:', res.status);
    console.log('Data:', res.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}
testLiveApi();
