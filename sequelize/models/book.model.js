const { DataTypes } = require("sequelize");
require("dotenv").config();
const { BASE_URL } = process.env;

module.exports = (sequelize) => {
  sequelize.define(
    "Book",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      auther: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isbn: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      // borrowdate: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },
      // returndate: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },
      bookimage: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: `${BASE_URL}/defaultbook.png`,
      },
      isavailable: {
        type: DataTypes.STRING,
        defaultValue: true,
      },
    },
    {
      tableName: "Books",
    }
  );
};
