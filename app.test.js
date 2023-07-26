const express = require('express')
const exp = express()
const request = require('supertest');
const app = require('./index');
const details = require('./dao/operation')
const data = require('./db-connect')
describe('Student Details Database', () => {
    test("Should get the students details from the database", async () => {
        details.getStudents = jest.fn().mockResolvedValue([{
            data:
            {
                            "id": 54,
                            "first_name": "naveen",
                            "last_name": "elango",
                            "email_id": "ego@gmail.com",
                            "Mark": {
                                "ID": 8,
                                "student_id": 54,
                                "tamil": 40,
                                "english": 100,
                                "maths": 100
                            }
                        },
                    
                    "message": "Students name fetched successfully",
                    "code": 200
        }]);
        const response = await request(app).get('/get-students');
        console.log(response,"++++++++++++++++++++++++++++++")
        expect(response.body).toEqual([{
            data:
                {
                                "id": 54,
                                "first_name": "naveen",
                                "last_name": "elango",
                                "email_id": "ego@gmail.com",
                                "Mark": {
                                    "ID": 8,
                                    "student_id": 54,
                                    "tamil": 40,
                                    "english": 100,
                                    "maths": 100
                                }
                            },
                        
                        "message": "Students name fetched successfully",
                        "code": 200
        }]);
        // await request(app).get('/getStudents').send({}).expect({
        //     "data": [
        //         {
        //             "id": 1,
        //             "first_name": "naveen",
        //             "last_name": "elango",
        //             "email_id": "naveen@gmail.com",
        //             "Mark": {
        //                 "ID": 1,
        //                 "student_id": 1,
        //                 "tamil": 100,
        //                 "english": 100,
        //                 "maths": 70
        //             }
        //         },
        //         {
        //             "id": 6,
        //             "first_name": "naveen",
        //             "last_name": "elango",
        //             "email_id": "sample@gmail.com",
        //             "Mark": {
        //                 "ID": 4,
        //                 "student_id": 6,
        //                 "tamil": 40,
        //                 "english": 100,
        //                 "maths": 100
        //             }
        //         },
        //         {
        //             "id": 52,
        //             "first_name": "naveen",
        //             "last_name": "elango",
        //             "email_id": "elango@gmail.com",
        //             "Mark": {
        //                 "ID": 7,
        //                 "student_id": 52,
        //                 "tamil": 40,
        //                 "english": 100,
        //                 "maths": 100
        //             }
        //         },
        //         {
        //             "id": 54,
        //             "first_name": "naveen",
        //             "last_name": "elango",
        //             "email_id": "ego@gmail.com",
        //             "Mark": {
        //                 "ID": 8,
        //                 "student_id": 54,
        //                 "tamil": 40,
        //                 "english": 100,
        //                 "maths": 100
        //             }
        //         }
        //     ],
        //     "message": "Students name fetched successfully",
        //     "code": 200
        // })
    })

    test('should return message when there are no students', async () => {
        details.getStudents = jest.fn().mockResolvedValue([]);
        const response = await request(app).get('/get-students');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "There is no datas to fetch from the database",
            data: null,
        });
    });


    test('should navigate to /getOneStudent with input data', async () => {
        await request(app).get('/getOneStudent').query({
            id: 1
        }).expect({
            "data": {
                "id": 1,
                "first_name": "naveen",
                "last_name": "elango",
                "email_id": "naveen@gmail.com",
                "Mark": {
                    "ID": 1,
                    "student_id": 1,
                    "tamil": 100,
                    "english": 100,
                    "maths": 70
                }
            },
            "message": "Student name fetched successfully",
            "code": 200
        })
    })

    test('Error message for /getOneStudent without proper input data', async () => {
        await request(app).get('/get-one').query({})
            .expect(
                { message: "Error in invocation of API: /getOne" }
            )
    })

    test('Error message for /getOneStudent if the id is not exist', async () => {
        await request(app).get('/get-one').query({ id: 100 })
            .expect(
                { Message: "There is no student ID to get that students details", }
            )
    })
    test("Check if using the proper URL", async () => {
        await request(app).get('/creat').send({
        }).expect(404)
    })

    test('should navigate to /create with input data', (done) => {
        request(app).post('/create').send({
            "fname": "naveen",
            "lname": "elango",
            "email": "e@gmail.com",
            "marks": {
                "tamil": 40,
                "english": 100,
                "maths": 100

            },
        }).expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    })

    test("If there is no first name show error message", async () => {
        await request(app).post('/create').send({
            "lname": "elango",
            "email": "elango@gmail.com",
            "marks": {
                "tamil": 40,
                "english": 100,
                "maths": 100
            }
        }).expect({ Message: "The firstName of the student cannot be empty" })

    })

    test('should navigate to /create without lastName', async () => {
        await request(app).post('/create').send({
            fname: "wayne",
            marks: {
                tamil: 90,
                english: 0,
                maths: 100
            }
        }).expect({ "Message": "The Last Name of the student cannot be empty" })
    })

    test('should navigate to /create without Marks', async () => {
        await request(app).post('/create').send({
            fname: "wayne",
            lname: "bruce"
        }).expect({ Message: "The Marks of the student cannot be empty" })
    })

    // test('should show error ,if error occured in /api', async () => {
    //     await request(app).post('/create').send({
    //         fname: "wayne",
    //         lname: "bruce"
    //     }).expect({  message: "Error in invocation of API: /create"  })
    // })

    test('should navigate to /deleteById without input data', async () => {
        await request(app).delete('/delete').query({
                id:43
        }).expect({
            code: 200,
            DeleteStatus: 1,
            message: "Student's details has been Deleted successfully"
        })
    })
         test('should navigate to /deleteById without input data', async () => {
        await request(app).delete('/delete').query({
                id:100
        }).expect({
            "code": 500,
            "message": "Please give the existing student's Id to delete"
        })
    })

       test('should navigate to /updateMarks with email-id input data', async () => {
        await request(app).put('/update').send({
            "email":"naveen@gmail.com",
            "updatedMarks": {
                "tamil": 100
            }
        }).expect({Message: "You can also able to update the last_name of the student " })
    })

    test('should navigate to /updateMarks with email-id without marks input data', async () => {
        await request(app).put('/update').send({
            "email":"naveen@gmail.com",
            "updateName":{
                "last_name":"elango"
            }
        }).expect({Message: "You can also able to update the mark of the student " })
    })

    test('Should show the text if all input for update in given', async () => {
        await request(app).put('/update').send({
            "email":"naveen@gmail.com",
            "updatedMarks": {
                "tamil": 100
            },
            "updateName":{
                "last_name":"elango"
            }
        }).expect({ message: 'Marks updated successfully'  })
    })

    test('Should show the text if there is no mail id', async () => {
        await request(app).put('/update').send({
            "updatedMarks": {
                "tamil": 100
            },
            "updateName":{
                "last_name":"elango"
            }
        }).expect({ Message: "Please provide the email of the student to update the marks" })
    })

        test('should navigate to /create with input data',async () => {
        await request(app).get('/category').send({}).expect( {"data": {
        "good": [
            {
                "student_id": 1,
                "total_mark": 270,
                "student": {
                    "id": 1,
                    "first_name": "naveen",
                    "last_name": "elango",
                    "email_id": "naveen@gmail.com"
                },
                "category": "good"
            }
        ],
        "average": [
            {
                "student_id": 6,
                "total_mark": 240,
                "student": {
                    "id": 6,
                    "first_name": "naveen",
                    "last_name": "elango",
                    "email_id": "sample@gmail.com"
                },
                "category": "average"
            },
            {
                "student_id": 52,
                "total_mark": 240,
                "student": {
                    "id": 52,
                    "first_name": "naveen",
                    "last_name": "elango",
                    "email_id": "elango@gmail.com"
                },
                "category": "average"
            },
            {
                "student_id": 54,
                "total_mark": 240,
                "student": {
                    "id": 54,
                    "first_name": "naveen",
                    "last_name": "elango",
                    "email_id": "ego@gmail.com"
                },
                "category": "average"
            }
        ],
        "excellence": []
    },
    "message": "Students data fetched successfully",
    "code": 200})
            
    })
    test('should return message when there are no students', async () => {
        details.getStudentsByCategory = jest.fn().mockResolvedValue([]);
        const response = await request(app).get('/category');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'There are no students to fetch from the database',
            data: null,
        });
    });
     test('database connectivity',()=>{
        return data.sequelize().catch((error) => {
            expect(error).toThrowError("error")
        })
    })
})