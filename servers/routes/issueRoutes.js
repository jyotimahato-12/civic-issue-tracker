const express = require("express");

const router = express.Router();

const issueController = require("../Controllers/issueController");

// auth middleware
const protect = require("../middleware/authMiddleware");

const restrictTo = require("../middleware/restrictTo");




console.log("protect:", typeof protect);
console.log("restrictTo:", typeof restrictTo);
console.log("getIssueStats:", typeof issueController.getIssueStats);
console.log("getIssuesByPriority:", typeof issueController.getIssuesByPriority);
console.log("getIssuesByDepartment:", typeof issueController.getIssuesByDepartment);
console.log("getRecentIssues:", typeof issueController.getRecentIssues);
// CREATE ISSUE
router.post(
  "/",
  protect,
  issueController.createIssue
);


// GET ALL ISSUES
router.get(
  "/",
  
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
  protect,restrictTo("admin", "manager"),
  issueController.updateIssueStatus
);


// DELETE ISSUE
router.delete(
  "/:id",
  protect,restrictTo("admin", "manager"),
  issueController.deleteIssue
);

router.get(
  "/status/:status",
  protect,
  issueController.getIssueStats
);
router.get(
  "/priority/:priority",
  protect,
  issueController.getIssuesByPriority
);
exports.getAssignedIssues = async (req, res) => {
  try {
    let query = {};

    // Step 1: Filter by role and department
    if (req.user.role === "manager" || req.user.role === "admin") {
      // Management sees all assigned issues, but ONLY in their department
      query.department = req.user.department;
      
      // Ensure we are only fetching issues that actually HAVE an assignee
      query.assignedTo = { $exists: true, $ne: null }; 
    } else {
      // Regular users/workers ONLY see issues assigned directly to their own User ID
      query.assignedTo = req.user.id;
    }

    // Step 2: Execute the query
    const issues = await Issue.find(query).populate("assignedTo", "name email");

    res.status(200).json({
      status: "success",
      results: issues.length,
      data: { issues }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
  };
router.get(
  "/stats",
  protect,
  issueController.getIssueStats
);
router.get(
  "/department/:department",
  protect,
  issueController.getIssuesByDepartment
);
router.get(
  "/stats/departments",
  protect,
  issueController.getDepartmentStats
);
router.get(
  "/recent",
  protect,
  issueController.getRecentIssues
);

module.exports = router;