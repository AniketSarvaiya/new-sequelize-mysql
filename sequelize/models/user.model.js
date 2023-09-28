const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilepic: {
        type: DataTypes.STRING,
        defaultValue:
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      },
      isverified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Student",
    }
  );
};
