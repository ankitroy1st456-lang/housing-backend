import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8123;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Main route
app.post('/api/evaluate', async(req, res) => {
  
  try{
    const pythonResponse= await fetch("http://localhost:8000/predict",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(req.body),
    })
    const aiData= await pythonResponse.json();
    console.log("Prediction received from python: ",aiData);

    res.json({ aiData });
  }catch(error){
    console.log("Failed to connect to python server: ",error);
    res.status(500).json({error :"web backend could not reach Ai model"});
  } 
});

// Start listening
app.listen(PORT, () => {
  console.log(`Node backend running smoothly on http://localhost:${PORT}`);
});
