const express = require('express')
const app = express()
const details = require('../dao/operation');

app.use(express.json())
const showStudents = async (req, res) => {
    let detail = await details.getStudents();
    if (detail && detail.length > 0) {
        result = {
            data: detail,
            message: "Students name fetched successfully",
            code: 200,
        }
    }
    else {
        result = {
            message: "There is no datas to fetch from the database",
            data: null,
        }
    }
    res.send(result);
    
};
const getOne = async (req, res) => {
    const id = req.query.id;
    let detail = await details.getStudentsById(id);
    try {
        if (detail) {
            result = {
                data: detail,
                message: "Student name fetched successfully",
                code: 200,
            }
        }
        else {
            result = {
                Message: "There is no student ID to get that students details",
            }
        }
        res.send(result);
    } 
    catch (err) {
        res
        .status(500)
        .json({ message: "Error in invocation of API: /getOne" })
    }
    
};
const create = async (req, res) => {
    const { fname, lname, marks, email } = req.body;
    try {
        if (fname && email) {
            res.status(201).json({
                student: {
                    fname,
                    lname,
                    email
                },
                marks,
                Message: "Student name with their marks created successfully"
            });
        }
        if (!fname) {
            res.status(500).json({
                Message: "The firstName of the student cannot be empty"
            });
        }
        if (!email) {
            res.status(500).json({
                Message: "The email-id of the student cannot be empty"
            });
        }
        
    }
    catch (err) {
    //    if (err.name === 'SequelizeUniqueConstraintError') {
    //   const error = {message: 'Email ID is already in use. Please provide a unique email ID.'}
    //   console.log(error)
    //  return res.status(500).send(JSON.stringify(error))
    // } else
        res
        .status(500)
        .json({ message: "Error in invocation of API: /create" })
    }
    await details.createDetails(fname, lname, email, marks)
};

const destroy = async (req, res) => {

    const id = req.query.id;
    try {
        let detail = await details.deleteById(id)
        if (detail) {
            result = {
                code: 200,
                DeleteStatus: detail,
                message: "Student's details has been Deleted successfully"
            }
        }
        else {
            result =
            {
                code: 500,
                message: "Please give the existing student's Id to delete"
            }
        }
    } catch (err) {
       res
            .status(500)
            .json({ message: "Error in invocation of API: /delete" })
    }
    // res.send(result)
};

const updateDetails = async (req, res) => {
    const { email, updatedMarks, updateName } = req.body;
    try {
        if (email) { res.status(200).json({ message: 'Marks updated successfully' }); }
        if (!email) {
            res.status(500).json({
                Message: "Please provide the email of the student to update the marks"
            });
        }
    }
    catch (err) {
        res
        .status(500)
        .json({ message: "Error in invocation of API: /update" })
    }
    await details.updateMarks(email, updatedMarks, updateName);
};

const category = async (req, res) => {
    try {
        const categories = ['good', 'average', 'excellence'];
        const allStudents = {};

        for (const category of categories) {
            const students = await details.getStudentsByCategory(category);
            allStudents[category] = students;
        }

        const isEmpty = Object.values(allStudents).every((students) => students.length === 0);
        if (isEmpty) {
            return res.json({
                message: 'There are no students to fetch from the database',
                data: null,
            });
        }

        res.json({
            data: allStudents,
            message: 'Students data fetched successfully',
            code: 200,
        });
    } catch (err) {
       res
            .status(500)
            .json({ message: "Error in invocation of API: /category" })
    }
};

module.exports = {
    showStudents: showStudents,
    getOne: getOne,
    destroy: destroy,
    updateDetails: updateDetails,
    category: category,
    create: create
};