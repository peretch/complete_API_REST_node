const express = require('express');
const mongoose = require('mongoose');
const app = express();
const setRoutes = require('./src/routes/v1.js');

// Agrego prefijo de version

setRoutes(app);

mongoose.connect('mongodb://localhost/clase10', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        console.log('Base de datos lista para recibir conexiones');

        setRoutes(app);

        app.listen(8080, () => {
            console.log('Servidor listo para recibir conexiones');
        });
    })
    .catch((error) => {
        console.error(error);

        mongoose.connection.close();
    });
