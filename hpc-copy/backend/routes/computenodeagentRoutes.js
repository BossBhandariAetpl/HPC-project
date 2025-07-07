import express from "express";
import { getcomputenodeagentStatus,  postActions } from "../controllers/computenodeagentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const computenodeagentRouter = express.Router();



// Get Slurm Status
computenodeagentRouter.get('/getcomputenodeagentStatus/:node', protect, adminProtect, getcomputenodeagentStatus) 


// Pot action on  compute node 
computenodeagentRouter.post('/postaction/:node/:action', protect, adminProtect, postActions) 

export default computenodeagentRouter;