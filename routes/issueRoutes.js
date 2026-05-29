const express = require("express");

const router = express.Router();

const issueController = require("../Controllers/issueController");

// auth middleware
const protect = require("../middleware/authMiddleware");


// CREATE ISSUE
router.post(
  "/",
  protect,
  issueController.createIssue
);


// GET ALL ISSUES
router.get(
  "/",
  protect,
  issueController.getIssues
);


// GET SINGLE ISSUE
router.get(
  "/:id",
  protect,
  issueController.getIssueById
);


// UPDATE ISSUE STATUS
router.patch(
  "/:id/status",
  protect,
  issueController.updateIssueStatus
);


// DELETE ISSUE
router.delete(
  "/:id",
  protect,
  issueController.deleteIssue
);

module.exports = router;