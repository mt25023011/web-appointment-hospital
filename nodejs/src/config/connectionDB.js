import express from "express"
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('web_appointment_hospital', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;
