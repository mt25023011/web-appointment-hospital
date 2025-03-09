'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    address: DataTypes.STRING,
    roleID: DataTypes.STRING,
    positionID: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};