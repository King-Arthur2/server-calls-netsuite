const express = require('express');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

const oauth = OAuth({
    consumer: {
        key: 'a71c9245a29e17b9d1f2706f9f31f6f30aba9583b883716748fc01bf094ea8e7',
        secret: '53e4a817baa957d25e18673277f64e90426aa9696158e41fc66bebd370335939'
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
        return crypto.createHmac('sha256', key).update(base_string).digest('base64');
    }
});

const token = {
    key: 'e140d33229ba44ef29c447279d768e96fc6e213f540aeae96905d860f98eb924',
    secret: '608851773306998d9269c6ed65d2dd2df66b995941db4b1bf8de458c56305cb6'
};

app.get('/netsuite-data', async (req, res) => {
    const {typeRecord} = req.query;
    const url = `https://9612244-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1273&deploy=1&type=${typeRecord}`;

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

