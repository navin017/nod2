const { sequelize } = require('../db-connect')
const { Sequelize, DataTypes } = require('sequelize')

const studentsDetails = sequelize.define('students', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email_id: {
        type:  DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
        isEmail : true}
    }
}, {
    tableName: 'students',
    timestamps: false
});

const Marks = sequelize.define('marks', {
    marks_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id'
        }
    },
    tamil: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    english: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    maths: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'marks',
    timestamps: false
},

);
studentsDetails.hasOne(Marks, {
    foreignKey: 'student_id',
    onDelete: 'CASCADE',
}),
    Marks.belongsTo(studentsDetails, {
        foreignKey: 'student_id',
    })

sequelize.sync();
module.exports = {
    studentsDetails,
    Marks,
};



