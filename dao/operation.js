const { studentsDetails, Marks } = require('../models/db-details')
const { Sequelize } = require('sequelize')
const { Op } = require('sequelize');

//To Get data of all the students
const getStudents = async (res) => {
  try {
    let result = await (studentsDetails).findAll({
      include: Marks,
    })
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Occured on getStudents()" })
  }
}

//To Get data of a particular the students

const getStudentsById = async (id,res) => {
  try {
    let result = await studentsDetails.findOne({
      where: { id: id },
      include: [Marks],
    })
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Occured on getStudentsById()" })
  }
}

//To Create a new student details into the database

const createDetails = async (fname, lname, email, marks,res) => {
  try {
    const student = await studentsDetails.create({
      first_name: fname,
      last_name: lname,
      email_id: email
    });

    const newMarksData = await Marks.create({
      tamil: marks.tamil,
      english: marks.english,
      maths: marks.maths,
      student_id: student.id
    });
    return JSON.parse(JSON.stringify(newMarksData));
  } catch (err) {
    // return err;
    // if (err.name === 'SequelizeUniqueConstraintError') {
    //   const error = {message: 'Email ID is already in use. Please provide a unique email ID.'}
    //   console.log("======================",error)
    // //  return res.status(500).send(JSON.stringify(error))
    // } 
    // else
    // {console.log("Error occurred on createDetails()",err)}
    // console.log(".....................")
     res
      .status(500)
      .json({ message: "Error Occured on updateMarks()" })
  }
};

//To Update the mark of the existing student by using the first name of the student

const updateMarks = async (email, updatedMarks, updateName,res) => {
  try {
    const student = await studentsDetails.findOne({
      where: { email_id: email },
    });
    if (student) {
      await studentsDetails.update(updateName, {
        where: { email_id: email },
      });
      await Marks.update(updatedMarks, {
        where: { student_id: student.id },
      });
    }
  } catch (err) {
    console.log("Error occurred on update()",err)
    // res
    //   .status(500)
    //   .json({ message: "Error Occured on updateMarks()" })
  }
}


const deleteById = async (id,res) => {
  try {
    let result = await studentsDetails.destroy({
      include: [
        {
          model: studentsDetails,
        },
      ],
      where: { id: id },
    })
    return JSON.parse(JSON.stringify(result));
  }
  catch (err) {
    res
      .status(500)
      .json({ message: "Error Occured on deleteById()" })
  }
}




const getStudentsByCategory = async (category,res) => {
  let minTotalMarks, maxTotalMarks;

  if (category === 'good') {
    minTotalMarks = 250;
    maxTotalMarks = 280;
  } else if (category === 'average') {
    minTotalMarks = 180;
    maxTotalMarks = 250;
  } else if (category === 'excellence') {
    minTotalMarks = 280;
    maxTotalMarks = 301; 
  } 

  try {
    const students = await Marks.findAll({
     
      include: [
        {
          model: studentsDetails,
        },
      ],
      attributes: [

        'student_id',
        [
          Sequelize.literal('SUM(tamil + english + maths)'),
          'total_mark',
        ],
      ],
      group: 'student_id',
      having: {
        total_mark: {
          [Op.gte]: minTotalMarks,
          [Op.lt]: maxTotalMarks,
        },
      },
    });
    const studentsWithCategory = students.map((student) => {
      return {
        ...student.toJSON(),
        category,
      };
    });

    return studentsWithCategory;
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Occured on getStudentsByCategory()" })
  }
};



module.exports = {
  getStudents: getStudents,
  getStudentsById: getStudentsById,
  deleteById: deleteById,
  getStudentsByCategory: getStudentsByCategory,
  createDetails: createDetails,
  updateMarks: updateMarks,

}
