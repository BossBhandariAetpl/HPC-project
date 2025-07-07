import asyncHandler from 'express-async-handler';
import { exec } from 'child_process';






// Access only Admin Role
export const getcomputenodeagentStatus = asyncHandler(async (req, res) => {

    const { node } = req.params;

    exec(`xdsh ${node} systemctl status slurmd`, (err,stdout,stderr) => {

        if (err) {
            return res.status(500).json({ status: 'Error fetching status', error: stderr });
          }
          const isActive = stdout.includes('active (running)');
          return res.json({ status: isActive ? 'Running.....' : 'Stopped.....' });

    })
    
  });



  
  // post actions 
  export const postActions = asyncHandler(async(req,res) => {
    
    const { node,action } = req.params;
    console.log(node , action)
    if (!['start', 'stop', 'restart'].includes(action)) {
        return res.status(400).send('Invalid action');
      }
      exec(`xdsh ${node} systemctl ${action} slurmd`, (err, stdout, stderr) => {
        if (err) {
          return res.status(500).json({ error: stderr });
        }
        res.send({message :`${action.charAt(0).toUpperCase() + action.slice(1)} successful`});
      });

  })