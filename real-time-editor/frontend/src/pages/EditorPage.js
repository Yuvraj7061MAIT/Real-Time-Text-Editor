import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

// Keep the socket connection outside the component to avoid reconnections
const socket = io("http://localhost:5000");

const EditorPage = () => {
  const { id } = useParams(); // Get document ID from URL
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/docs/${id}`);
        setContent(response.data.content);
        socket.emit("joinDocument", id); // Join the document room
      } catch (error) {
        console.error("Error fetching document:", error);
        alert("Document not found!");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();

    // Listen for real-time updates
    socket.on("documentUpdated", (newContent) => {
      setContent(newContent);
    });

    return () => {
      socket.off("documentUpdated");
    };
  }, [id]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsSaved(false);

    // Emit real-time changes
    socket.emit("updateDocument", { docId: id, content: newContent });
  };

  const saveDocument = useCallback(async () => {
    try {
      await axios.patch(`http://localhost:5000/api/docs/${id}`, { content });
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Failed to save document");
    }
  }, [content, id]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSaved) {
        saveDocument();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isSaved, saveDocument]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Editing Document: {id}</h2>
      <textarea
        style={{ width: "80%", height: "300px", fontSize: "16px" }}
        value={content}
        onChange={handleChange}
      />
      <br />
      <button
        onClick={saveDocument}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isSaved ? "green" : "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isSaved ? "Saved" : "Save Document"}
      </button>
    </div>
  );
};

export default EditorPage;
