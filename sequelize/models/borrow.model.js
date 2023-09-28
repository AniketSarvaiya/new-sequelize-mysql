const { DataTypes, UUID } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Borrow", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // studentId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    // },
    // bookId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    // },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
};
