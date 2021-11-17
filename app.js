const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require("express-rate-limit");

const nodeEnv =  process.env.NODE_ENV;

const sequelize = nodeEnv === 'test' ? 
    new Sequelize('sqlite::memory:') :
    new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

const SensorData =  sequelize.define('sensorData', {
    serial: {
        type: DataTypes.STRING,
        allowNull:  false
    },
    name: {
        type: DataTypes.STRING,
        allowNull:  false
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull:  false
    }
});

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10 // limit each IP to 10 requests per windowMs
  });

const app = express();


app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(limiter);

app.use((req, res, next) => {
    let key = req.query.key;
    if(!key || key !== '12345'){
        res.status(403).send();
    }
    next();
})

app.get('/data', async (req, res) => {
    let limit = req.query.limit || 5;
    let offset = req.query.offset || 0;
    const allData = await SensorData.findAll({ limit, offset });
    res.status(200).send(allData);
    return;
});

app.post('/data', async (req, res) => {
    let data = req.body;
    const sensorData = await SensorData.create(data);
    res.status(201).send(sensorData);
    return;
});


// app.listen({port: 8080}, () => {
//     try {
//         sequelize.authenticate();
//         console.log('Connected to DB');
//         sequelize.sync({ alter:true });
//         console.log('Sync to DB');
//     } catch (error) {
//         console.log('Could not connect to DB', error);
//     }
//     console.log('Server is  running');
// });


module.exports = { app, sequelize};
