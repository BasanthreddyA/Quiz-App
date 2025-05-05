const router = require("express").Router();
const Exam = require("../models/examModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Question = require("../models/questionModel");

// add exam

router.post("/add", authMiddleware, async (req, res) => {
  try {
    // check if exam already exists
    const examExists = await Exam.findOne({ name: req.body.name });
    if (examExists) {
      return res
        .status(200)
        .send({ message: "Exam already exists", success: false });
    }
    req.body.questions = [];
    const newExam = new Exam(req.body);
    await newExam.save();
    res.send({
      message: "Exam added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all exams
router.post("/get-all-exams", authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.send({
      message: "Exams fetched successfully",
      data: exams,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get exam by id
router.post("/get-exam-by-id", authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.examId).populate("questions");
    res.send({
      message: "Exam fetched successfully",
      data: exam,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// edit exam by id
router.post("/edit-exam-by-id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndUpdate(req.body.examId, req.body);
    res.send({
      message: "Exam edited successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// delete exam by id
router.post("/delete-exam-by-id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.body.examId);
    res.send({
      message: "Exam deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// add question to exam

router.post("/add-question-to-exam", authMiddleware, async (req, res) => {
  try {
    // add question to Questions collection
    const newQuestion = new Question(req.body);
    const question = await newQuestion.save();

    // add question to exam
    const exam = await Exam.findById(req.body.exam);
    exam.questions.push(question._id);
    await exam.save();
    res.send({
      message: "Question added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// edit question in exam
router.post("/edit-question-in-exam", authMiddleware, async (req, res) => {
  try {
    // edit question in Questions collection
    await Question.findByIdAndUpdate(req.body.questionId, req.body);
    res.send({
      message: "Question edited successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});


// delete question in exam
router.post("/delete-question-in-exam", authMiddleware, async (req, res) => {
     try {
        // delete question in Questions collection
        await Question.findByIdAndDelete(req.body.questionId);

        // delete question in exam
        const exam = await Exam.findById(req.body.examId);
        exam.questions = exam.questions.filter(
          (question) => question._id != req.body.questionId
        );
        await exam.save();
        res.send({
          message: "Question deleted successfully",
          success: true,
        });
     } catch (error) {
      
     }
});

// bulk upload questions to exam from CSV
router.post("/:examId/upload-questions", authMiddleware, async (req, res) => {
  try {
    const { questions, examId } = req.body;

    if (!Array.isArray(questions) || !examId) {
      return res.status(400).send({
        success: false,
        message: "Invalid request format. 'questions' and 'examId' are required.",
      });
    }

    // Format and validate each question
    const formattedQuestions = questions.map((q) => {
      const options = {
        A: q.option1,
        B: q.option2,
        C: q.option3,
        D: q.option4,
      };

      return {
        name: q.question,
        correctOption: ["A", "B", "C", "D"][parseInt(q.correctOption) - 1],
        options,
        exam: examId,
      };
    });

    const insertedQuestions = await Question.insertMany(formattedQuestions);

    const exam = await Exam.findById(examId);
    insertedQuestions.forEach((q) => exam.questions.push(q._id));
    await exam.save();

    res.send({
      success: true,
      message: "Questions uploaded successfully",
      data: insertedQuestions,
    });
  } catch (error) {
    console.error("Upload questions error:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// router.post("/:examId/upload-questions", authMiddleware, async (req, res) => {
//   try {
//     const examId = req.params.examId;
//     const questions = req.body.questions;

//     for (let q of questions) {
//       const newQuestion = new Question({
//         name: q.question,
//         options: {
//           A: q.option1,
//           B: q.option2,
//           C: q.option3,
//           D: q.option4,
//         },
//         correctOption: ['A', 'B', 'C', 'D'][q.correctOption - 1],
//         exam: examId,
//       });
//       await newQuestion.save();

//       await Exam.findByIdAndUpdate(examId, {
//         $push: { questions: newQuestion._id },
//       });
//     }

//     res.send({ success: true, message: "Questions uploaded successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: "Something went wrong" });
//   }
// });


module.exports = router;
