import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const EditorPage = () => {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null); // State to track last saved time

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/docs/${id}`);
        setContent(response.data.content);
        socket.emit("joinDocument", id);
      } catch (error) {
        console.error("Error fetching document:", error);
        alert("Document not found!");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();

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
    socket.emit("updateDocument", { docId: id, content: newContent });
  };

  const saveDocument = useCallback(async () => {
    try {
      await axios.patch(`http://localhost:5000/api/docs/${id}`, { content });
      setIsSaved(true);
      setLastSaved(new Date().toLocaleTimeString()); // Update last saved time
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Failed to save document");
    }
  }, [content, id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSaved) {
        saveDocument();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isSaved, saveDocument]);

  const copyDocumentLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Document link copied to clipboard!");
  };

  if (loading) return <p style={{ textAlign: "center", color: "gray" }}>Loading...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>Editing Document: {id}</h2>
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={copyDocumentLink}
          style={{ backgroundColor: "#007bff", color: "white", fontWeight: "bold", padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer" }}
        >
          Copy Document Link
        </button>
      </div>
      <textarea
        id="editor"
        style={{ width: "75%", height: "300px", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", boxShadow: "2px 2px 5px rgba(0,0,0,0.1)", outline: "none" }}
        value={content}
        onChange={handleChange}
      />
      <br />
      <button
        onClick={saveDocument}
        style={{ marginTop: "15px", padding: "10px 20px", fontSize: "16px", fontWeight: "bold", borderRadius: "5px", border: "none", cursor: "pointer", color: "white", backgroundColor: isSaved ? "#28a745" : "#007bff" }}
      >
        {isSaved ? "Saved" : "Save Document"}
      </button>

      {lastSaved && (
        <p style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}>
          Last saved at: <strong>{lastSaved}</strong>
        </p>
      )}
    </div>
  );
};

export default EditorPage;
