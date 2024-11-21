import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTranscription = async () => {
    if (!file) return alert("Please upload an audio file first.");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setTranscription(data.transcription);
    } catch (error) {
      console.error(error);
      alert("Error transcribing the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Audio Transcriber</h1>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      <button onClick={handleTranscription} disabled={loading}>
        {loading ? "Transcribing..." : "Transcribe"}
      </button>
      <p>{transcription}</p>
    </div>
  );
}
