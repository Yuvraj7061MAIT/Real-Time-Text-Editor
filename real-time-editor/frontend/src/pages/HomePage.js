import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();

  const createNewDocument = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/docs",
        { content: " " }, // Send a non-empty string
        { headers: { "Content-Type": "application/json" } }
      );
  
      const documentId = response.data._id;
      navigate(`/docs/${documentId}`);
    } catch (error) {
      console.error("Error creating document:", error.response?.data || error);
      alert(`Failed to create document: ${error.response?.data?.message || "Unknown error"}`);
    }
  };
  

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Real-Time Editor</h1>
      <button onClick={createNewDocument} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Create New Document
      </button>
    </div>
  );
};

export default HomePage;
