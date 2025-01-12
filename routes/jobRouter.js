const express = require("express");
const Job = require("../models/jobModel.js");
const { Op } = require("sequelize");
const jobRouter = express.Router();
const { authenticateToken } = require("../utils/authMiddleware.js");


jobRouter.get("/jobs", authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.findAll({attributes: ['jobId', 'title', 'description', 'status', 'file', 'portalId', 'createdAt', 'updatedAt', 'deletedAt']}); 
    res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


jobRouter.post("/jobs", authenticateToken, async (req, res) => {
  const { jobId, title, description, status, file, portalId } = req.body;

  // Check if required fields are present
  if (!jobId || !title || !description || !status || !file || !portalId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const portal = await Job.create({
        jobId, 
        title, 
        description, 
        status, 
        file, 
        portalId,
        createdAt:  new Date()
    });

    res.status(201).json({
      message: "jobs added successfully",
      portal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

jobRouter.put("/jobs/:id", authenticateToken, async (req, res) => {

  const { id } = req.params;
  const {  title, description, status, file, portalId } = req.body;
  
  if (!title || !description || !status || !file || !portalId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {

    const job = await Job.findOne({ where: { jobId : id } });

    if (!job) {
      return res.status(404).json({ message: "jobs not found" });
    }

    job.title = title;
    job.description = description;
    job.status = status;
    job.file = file;
    job.portalId = portalId;
    job.updatedAt = new Date(); 

    await job.save();

    res.status(200).json({
      message: "jobs updated successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

jobRouter.delete("/jobs/:id", authenticateToken, async (req, res) => {
  
  const { id } = req.params;

  try {
    const job = await Job.findOne({ where: { jobId : id } });

    if (!job) {
      return res.status(404).json({ message: "Portal not found" });
    }
    await job.destroy();

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

jobRouter.get("/jobad-summary/:timeframe", async (req, res) => {
  const { timeframe } = req.params;

  let startDate;
  const today = new Date();

  if (timeframe === "year") {
    startDate = new Date(today.getFullYear(), 0, 1); 
  } else if (timeframe === "month") {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1); 
  } else if (timeframe === "week") {
    const weekStart = today.getDate() - today.getDay(); 
    startDate = new Date(today.getFullYear(), today.getMonth(), weekStart);
  } else {
    return res.status(400).json({ message: "Invalid timeframe. Use 'year', 'month', or 'week'." });
  }

  try {
    const jobSummaries = await Job.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      attributes: [
        "jobId",
        "title",
        "description",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: `Job summaries for the timeframe: ${timeframe}`,
      data: jobSummaries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = jobRouter;
