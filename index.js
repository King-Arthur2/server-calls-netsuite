const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// ⚠️ Reemplaza con tu token de acceso obtenido vía OAuth 2.0 (Paso 2)
const accessToken = 'eyJraWQiOiJjLjk2MTIyNDRfU0IxLjIwMjUtMDUtMjlfMDItNDEtMzEiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjAyOzEyMjQyIiwiYXVkIjpbIjRGRDYzNkM1LUQ1NDQtNEI2Qy05MDE2LTc4N0NDRjE2REI0Mzs5NjEyMjQ0X1NCMSIsIjFkYmRlNTA2MGE0YWNjNTEwMTc2MjlhNmY1N2E1Y2JhMGQ0YzM5MTg0ZTY0MjI4MzQ5MGE0MDExOWZmODJkOGMiXSwic2NvcGUiOlsicmVzdGxldHMiXSwiaXNzIjoiaHR0cHM6Ly9zeXN0ZW0ubmV0c3VpdGUuY29tIiwib2l0IjoxNzUyNTA2NjQ4LCJleHAiOjE3NTI1MTMwNTAsImlhdCI6MTc1MjUwOTQ1MCwianRpIjoiOTYxMjI0NF9TQjEuYS1hLjRjOTQwYjNiLWJkZDMtNDdlYi04MmQ3LTEyMTJiZWU3ZGE1MF8xNzUyNTA2NjQ4NTgzLjE3NTI1MDk0NTA1OTQifQ.OeOGFizKd4kVKo1NeOA-jbVP5MP2SAR_PHhBgSE6Jdd9SZeKnTn56xEr1_lREW3iRfsYM2XdVCUzaQrEuIbWt2YzQKhv9eHGLJDkl9Oea0IFl3MRQ4TkEMcNCcTH77y-OZPSuXaZbjArxmJJ8s6IQlW_xXxTMGpClZlUD-nwAPU9tPle8m3L3NMCqdwQw-kEv5ZMunUatnwRM4gX1bTrAhy-1QPy0381DQVGaUgPXsAvOHunxzvcaiGeWTOwcxmsPDxpBuIy8YcIOJ5-0oKYF3JHUp1cds69ZCQxD56xjFAAXcDsmKzkW4QY1MpGz-VO8CjQkp508XiC5THTb3p2ePx4xp3SSo4rMKPjaINaUnmhOiWG4QDpJhRBHv4wpPsu0J2ODFmuGbX5IkZSao7MFv2MibMxrkROeGQ2raGmZoacNZsCQQemt_dbrvpDm8Dm5QmNjvV7e-Jx8Wg8_l1VHjizILfUbyJJU33SEbKfCB3E1R3otBB8z7Md63D2OhrS0_yM2Urr_r7CPZn_3lpHFp76_2OYxl0L0_wvy41RgsZtvhUWfcDCefT4_zqmehVQJDmjypNT9S3zZqkJ0GBgYBOzpg7Dm4l8lQy0b6v8ns-2DNIZ621sm6zlhS3c26rRaj-ONWZtghptEclGasgGC5oN_kLXiCsiKhR90SbdBZw';

app.get('/netsuite-data', async (req, res) => {
    console.log('Recibiendo solicitud para obtener datos de NetSuite');
  const url = 'https://9612244-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1273&deploy=1&type=salesorder';

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json' // Puedes omitir esto si no lo necesitas
  };

  try {
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error al conectarse a NetSuite con Bearer Token:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
