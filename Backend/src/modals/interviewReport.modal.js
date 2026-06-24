const mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required: [true, "Technical question is required"]
    },
    intention:{
        type:String,
        required: [true, "Intention is required"]
    },
    answer:{
        type:String,
        required: [true, "Answer is required"]
    }
},{
    _id: false
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required: [true, "Behavioural question is required"]
    },
    intention:{
        type:String,
        required: [true, "Intention is required"]
    },
    answer:{
        type:String,
        required: [true, "Answer is required"]
    }
},{
    _id: false
})

const preparationplanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required: [true, "day is required"]
    },
    focus:{
        type:String,
        required: [true, "focus is required"]
    },
    tasks:[{
        type:String,
        required: [true, "Task is required"]
    }]
})
const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required: [true, "Skill is required"]
    },
    severity:{
        type:String,
        enum: [ "low", "medium", "high" ],
        required: [true, "Severity is required"]
    }
},{
    _id:false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type:String,
        required: [true, "Job description is required"]
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalquestions:[ technicalQuestionSchema ],
    behaviouralquestions: [ behaviouralQuestionSchema ],
    skillGap: [ skillGapSchema ],
    preparationPlan: [ preparationplanSchema ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        required:[ true, "job title is required"]
    }
},{
    timestamps:true
})

const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema)
module.exports = interviewReportModel