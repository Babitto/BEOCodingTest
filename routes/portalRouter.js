const express = require("express");
const Portal = require("../models/portalModel.js");
const portalRouter = express.Router();
const { authenticateToken } = require("../utils/authMiddleware.js");

portalRouter.get("/portals", authenticateToken, async (req, res) => {
  try {
    const portals = await Portal.findAll({attributes: ['name', 'description', 'status', 'logo']}); 
    res.status(200).json({ portals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

portalRouter.post("/portals", authenticateToken, async (req, res) => {
  const { portalId, name, description, status, logo } = req.body;

  // Check if required fields are present
  if (!name || !description || !status || !logo) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const portal = await Portal.create({
      portalId,
      name,
      description,
      status,
      logo,
    });

    res.status(201).json({
      message: "Portal added successfully",
      portal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

portalRouter.put("/portals/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, status, logo } = req.body;

  if (!name || !description || !status || !logo) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {

    const portal = await Portal.findOne({ where: { portalId : id } });

    if (!portal) {
      return res.status(404).json({ message: "Portal not found" });
    }

    portal.name = name;
    portal.description = description;
    portal.status = status;
    portal.logo = logo;
    portal.updatedAt = new Date(); 

    await portal.save();

    res.status(200).json({
      message: "Portal updated successfully",
      portal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

portalRouter.delete("/portals/:id", authenticateToken, async (req, res) => {
  
  const { id } = req.params;

  try {
    const portal = await Portal.findOne({ where: { portalId : id } });

    if (!portal) {
      return res.status(404).json({ message: "Portal not found" });
    }
    await portal.destroy();

    res.status(200).json({
      message: "Portal deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

portalRouter.get("/portal-usage-summary", async (req, res) => {
  try {
    
    const totalPortals = await Portal.count();

    const activePortals = await Portal.count({
      where: { status: "active" }, 
    });

    const inactivePortals = await Portal.count({
      where: { status: "inactive" },
    });

    res.status(200).json({
      message: "Portal usage summary retrieved successfully",
      data: {
        totalPortals,
        activePortals,
        inactivePortals,
      },
    });
  } catch (error) {
    console.error("Error fetching portal usage summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = portalRouter;
