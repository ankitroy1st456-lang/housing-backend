import express from "express";
import cors from "cors";

const app = express();
const PORT = 8123;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Main route
app.post("/api/evaluate", async (req, res) => {
  try {
    // 1. Read the cloud variable from Render, or fall back to local 8000 port
    const pythonUrl = process.env.PYTHON_SERVER_URL || "http://localhost:8000";

    // 2. Format the URL cleanly to make sure it hits the /predict endpoint
    const targetPythonUrl = pythonUrl.endsWith("/")
      ? `${pythonUrl}predict`
      : `${pythonUrl}/predict`;

    console.log(
      `Forwarding payload directly to Python target: ${targetPythonUrl}`,
    );

    // 3. Make the fetch request to the dynamic address
    const pythonResponse = await fetch(targetPythonUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const aiData = await pythonResponse.json();
    console.log("Prediction received from python: ", aiData);

    res.json({ aiData });
  } catch (error) {
    console.log("Failed to connect to python server: ", error);
    res.status(500).json({ error: "web backend could not reach Ai model" });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`Node backend running smoothly on http://localhost:${PORT}`);
});
