const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const docRoutes = require("./routes/docRoutes");
const Document = require("./models/Document");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/docs", docRoutes);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("joinDocument", async (docId) => {
    socket.join(docId);
    console.log(`👤 User ${socket.id} joined document ${docId}`);

    try {
      const document = await Document.findById(docId);
      if (document) {
        socket.emit("loadDocument", document.content);
      } else {
        socket.emit("error", "Document not found");
      }
    } catch (error) {
      console.error("Error loading document:", error);
      socket.emit("error", "Failed to load document");
    }
  });

  socket.on("updateDocument", async ({ docId, content }) => {
    try {
      const existingDoc = await Document.findById(docId);
      if (existingDoc && existingDoc.content !== content) {
        await Document.findByIdAndUpdate(docId, { content }, { new: true });

        console.log(`📄 Document ${docId} updated by ${socket.id}`);

        // Now send the update to all users, including sender
        io.to(docId).emit("documentUpdated", content);
      }
    } catch (error) {
      console.error("Error updating document:", error);
      socket.emit("error", "Failed to update document");
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
