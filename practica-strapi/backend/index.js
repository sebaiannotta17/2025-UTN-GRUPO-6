const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
var path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var token = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';
app.listen(81, () => {
});

//var BASE_URL = 'http://10.10.16.140:1337/api';
var BASE_URL = 'https://gestionweb.frlp.utn.edu.ar/api';

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/app.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/app.js'));
});

app.get('/carreras', function(req, res) {
    axios.get(BASE_URL + '/carreras', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});

app.post('/carreras', function(req, res) {
    let data = {
        nombre: req.body.data.nombre
    };

    axios.post(BASE_URL + '/carreras', { data: data }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});
app.delete('/carreras/:id', function(req, res) {
    axios.delete(BASE_URL + '/carreras/' + req.params.id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get('/materias', function(req, res) {
    axios.get(BASE_URL + '/materias?populate=*', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});
app.post('/materias', function(req, res) {
    let data = {
        nombre: req.body.data.nombre,
        carrera: req.body.data.carrera
    };

    axios.post(BASE_URL + '/materias', { data: data }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        });
});
app.put('/materias/:id', function(req, res) {
    let data = {
        alumnos: req.body.data.alumnos
    };
    axios.put(BASE_URL + '/materias/' + req.params.id, { data: data }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        });
});
app.delete('/materias/:id', function(req, res) {
    axios.delete(BASE_URL + '/materias/' + req.params.id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get('/alumnos', function(req, res) {
    axios.get(BASE_URL + '/alumnos', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});
app.post('/alumnos', function(req, res) {
    let data = {
        nombre: req.body.data.nombre,
        apellido: req.body.data.apellido,
        legajo: req.body.data.legajo
    };

    axios.post(BASE_URL + '/alumnos', { data: data }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});
app.delete('/alumnos/:id', function(req, res) {
    axios.delete(BASE_URL + '/alumnos/' + req.params.id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});
