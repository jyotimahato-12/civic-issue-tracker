const Issue = require("../models/Issue.js");

// =======================
// CREATE ISSUE (Citizen only)
// =======================
exports.createIssue = async (req, res, next) => {
  try {
    const { department, description, location, image } = req.body;

    const issue = await Issue.create({
      department,
      description,
      location,
      image,
      status: "pending",
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue
    });

  } catch (err) {
    next(err);
  }
};


// =======================
// GET ALL ISSUES
// =======================
exports.getIssues = async (req, res, next) => {
  try {
    const { department } = req.query;

    const filter = department ? { department } : {};

    const issues = await Issue.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });

  } catch (err) {
    next(err);
  }
};


// =======================
// GET SINGLE ISSUE
// =======================
exports.getIssueById = async (req, res, next) => {
  try {

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    res.status(200).json({
      success: true,
      data: issue
    });

  } catch (err) {
    next(err);
  }
};


// =======================
// UPDATE ISSUE STATUS
// =======================
exports.updateIssueStatus = async (req, res, next) => {

  try {

    const { status } = req.body;

    const allowedStatus = [
      "Reported",
      "Assigned",
      "In Progress",
      "Resolved"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const issue = await Issue.findByIdAndUpdate(

      req.params.id,

      { status },

      { new: true }

    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: issue
    });

  } catch (err) {
    next(err);
  }

};


// =======================
// DELETE ISSUE
// =======================
exports.deleteIssue = async (req, res, next) => {

  try {

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully"
    });

  } catch (err) {
    next(err);
  }

};