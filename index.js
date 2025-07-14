//Modulos necesarios para el sevidor. 
const express = require('express');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const oauth = OAuth({
    consumer: {
        key: process.env.CONSUMER_KEY,
        secret: process.env.CONSUMER_SECRET
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
        return crypto.createHmac('sha256', key).update(base_string).digest('base64');
    }
});

const token = {
    key: process.env.TOKEN_ID,
    secret: process.env.TOKEN_SECRET
};

app.get('/netsuite-data', async (req, res) => {
    const {typeRecord} = req.query;
    if (!typeRecord) {
        return res.status(400).json({ error: 'El parámetro typeRecord es obligatorio' });
    }
    const url = `https://${process.env.ACCOUNT_ID}.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1273&deploy=1&type=${typeRecord}`;

    console.log(`Conectando a NetSuite con URL: ${url}`);
    const request_data = {
        url,
        method: 'GET'
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, token));
    headers['Content-Type'] = 'application/json';
    headers.Authorization += `, realm="9612244_SB1"`; // Opcional pero recomendable

    try {
        const response = await axios.get(url, { headers });
        res.json(response.data);
    } catch (error) {
        console.error('Error al conectarse a NetSuite:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor TBA activo en http://localhost:${PORT}`);
});

