const associationSetup = (sequelize) => {
  const { Student, Book, Borrow } = sequelize.models;

  Student.hasMany(Borrow, {
    foreignKey: "studentId",
  });
  Borrow.belongsTo(Student, {
    foreignKey: "studentId",
  });

  Book.hasMany(Borrow, {
    foreignKey: "isbn",
  });
  Borrow.belongsTo(Book, {
    foreignKey: "isbn",
  });
};

module.exports = { associationSetup };
