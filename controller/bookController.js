const Joi = require("joi");
const { models } = require("../sequelize");
const auth = require("../middleware/auth");
require("dotenv").config();
const { BASE_URL } = process.env;

const bookvalidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().min(30).max(255).required(),
  auther: Joi.string().required(),
  isbn: Joi.string().min(10).max(13).required(),
});

const addbook = async (req, res) => {
  try {
    // const date = new Date();// const yyyy = date.getFullYear();// let mm = date.getMonth() + 1;// let dd = date.getDate();// if (dd < 10) dd = "0" + dd;
    // if (mm < 10) mm = "0" + mm; // const formattedToday = dd + "/" + mm + "/" + yyyy;// console.log("---------------", formattedToday);// console.log(date);
    const file = req.file;
    console.log("++++++++++", file);
    const { error } = bookvalidation.validate(req.body, { abortEarly: false });
    const { title, description, auther, isbn } = req.body;

    console.log("-------------", error);
    if (error) {
      console.log("erro hello");
      return res.status(400).json({
        error: error.details,
      });
    }
    const book = await models.Book.findOne({
      where: {
        isbn: isbn,
      },
    });

    if (book)
      return res.status(400).json({ message: "Book is already exists." });

    if (file) {
      console.log("file che");
      const bookimageurl = `${BASE_URL}/images/book/${file.filename}`;

      const createbook = await models.Book.create({
        title: title,
        description: description,
        auther: auther,
        isbn: isbn,
        bookimage: bookimageurl,
      });
      res.status(200).json({
        status: "success",
        message: "Book added successfully",
        book: createbook,
      });
    } else {
      console.log("file nathi");

      const createbook = await models.Book.create({
        bookname: bookname,
        auther: auther,
        isbn: isbn,
      });
      res.status(200).json({
        status: "success",
        message: "Book added successfully",
        book: createbook,
      });
    }
  } catch (error) {
    res.send(error);
  }
};

const updatebook = async (req, res) => {
  const { bookname, auth, isbn } = req.body;
};

//---------------------------------borrowbook validation ---------------------------------

const isToday = (value, helpers) => {
  const currentDate = new Date();
  const enteredDate = new Date(value);

  if (enteredDate.toDateString() >= currentDate.toDateString()) {
    return value;
  }
  return helpers.message("Date must be today or greater..");
};

const today = new Date();
const borrowBookValidation = Joi.object({
  studentId: Joi.number().required(),
  isbn: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999999)
    .messages({
      "number.integer": "Invalid input, please enter a whole number.",
      "number.min": "isbn The number must be at least 10 digits long",
      "number.max": "The number cannot exceed 13 digits.",
    })
    .required(),
  borrowDate: Joi.date().custom(isToday, "Custom validation"),
  returnDate: Joi.date().greater(today).required(),
});

//--------------------------------------------------------BorrowBook---------------------------------------------------

const borrowBook = async (req, res) => {
  try {
    const { studentId, isbn, borrowDate, returnDate } = req.body;
    console.log(req.body);
    const { error } = borrowBookValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res.status(400).json({ status: "fail", error: error.details });

    const student = await models.Student.findByPk(studentId);
    const isavailable = await models.Book.findByPk(isbn);
    console.log(student?.dataValues, isavailable?.dataValues);
    if (!student)
      return res
        .status(400)
        .json({ status: "fail", message: "student id does not exists" });
    if (!isavailable)
      return res
        .status(400)
        .json({ status: "fail", message: "Book is not listed" });

    if (isavailable?.dataValues?.isavailable != true) {
      return res
        .status(400)
        .json({ status: "fail", message: "Book is not available to borrow" });
    }
    await models.Book.update({ isavailable: false }, { where: { isbn: isbn } });
    console.log("book Isavailable set to ---> false");

    const borrowbookInsert = await models.Borrow.create({
      studentId: studentId,
      isbn: isbn,
      borrowDate: borrowDate,
      returnDate: returnDate,
    });

    if (borrowbookInsert)
      return res
        .status(200)
        .json({ status: "OK", message: "Record Inserted..." });
    else
      return res
        .status(400)
        .json({ status: "fail", message: "Record Insertion fail..." });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

const BorrowBookDetails = async (req, res) => {
  try {
    const borrowbookData = await models.Borrow.findAll({
      where: { isbn: 1935182722 },
      // include: ["Student", "Book"],
      include: [
        { model: models.Student, where: { isverified: true } },
        { model: models.Book },
      ],
    });
    res.status(200).json({ status: "OK", borrowBooks: borrowbookData });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

module.exports = { addbook, borrowBook, BorrowBookDetails };
