//Modulos necesarios para el sevidor. 
const express = require('express');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const { type } = require('os');
require('dotenv').config();

// Se crea el servidor Express y se configura el puerto
const app = express();
const PORT = process.env.PORT || 3000;


// Configuración de autenticación OAuth 1.0
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

// Middleware para manejar las peteciones desde Power BI
app.get('/transacciones', async (req, res) => {
    var { tranType, startDate, endDate, queryNet } = req.query;

    if (!queryNet) {
        return res.status(400).json({ error: 'El parámetro queryNet es obligatorio' });
    }

    if (queryNet === 1) {
        if (!tranType) {
            return res.status(400).json({ error: 'El parámetro tranType es obligatorio' });
        }

        if (!startDate) {
            return res.status(400).json({ error: 'El parámetro startDate es obligatorio' });
        }

        if (!endDate) {
            return res.status(400).json({ error: 'El parámetro endDate es obligatorio' });
        }
    }
    const url = `https://${process.env.ACCOUNT_ID}.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1255&deploy=1&typeQuery=transacciones&tranType=${tranType}&startDate=${startDate}&endDate=${endDate}&queryNet=${queryNet}`;

    const request_data = {
        url,
        method: 'GET'
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, token));
    headers['Content-Type'] = 'application/json';
    headers.Authorization += `, realm="9612244"`; // Opcional pero recomendable

    try {
        const response = await axios.get(url, { headers });
        res.json(response.data);
    } catch (error) {
        console.error('Error al conectarse a NetSuite:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.get('/articulos', async (req, res) => {
    const { typeSearch } = req.query;

    if (!typeSearch) {
        return res.status(400).json({ error: 'El parámetro typeSearch es obligatorio' });
    }

    if (typeSearch === 'costoPromedio') {
        const url = `https://${process.env.ACCOUNT_ID}.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1256&deploy=1&typeSearch=${typeSearch}`;

        const request_data = {
            url,
            method: 'GET'
        };

        const headers = oauth.toHeader(oauth.authorize(request_data, token));
        headers['Content-Type'] = 'application/json';
        headers.Authorization += `, realm="9612244"`; // Opcional pero recomendable

        try {
            const response = await axios.get(url, { headers });
            res.json(response.data);
        } catch (error) {
            console.error('Error al conectarse a NetSuite:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({ error: error.message });
        }
    } else if (typeSearch === 'serializados') {
        const url = `https://${process.env.ACCOUNT_ID}.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1255&deploy=1&typeQuery=articulos&typeSearch=${typeSearch}`;

        const request_data = {
            url,
            method: 'GET'
        };

        const headers = oauth.toHeader(oauth.authorize(request_data, token));
        headers['Content-Type'] = 'application/json';
        headers.Authorization += `, realm="9612244"`; // Opcional pero recomendable

        try {
            const response = await axios.get(url, { headers });
            res.json(response.data);
        } catch (error) {
            console.error('Error al conectarse a NetSuite:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({ error: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor TBA activo en http://localhost:${PORT}`);
});
