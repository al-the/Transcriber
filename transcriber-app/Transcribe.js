import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const WhisperAPIKey = process.env.WHISPER_API_KEY; // Set in Vercel Environment Variables

const transcribeAudio = async (filePath) => {
  const file = fs.createReadStream(filePath);

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WhisperAPIKey}`,
    },
    body: file,
  });

  if (!res.ok) throw new Error("Failed to transcribe audio.");
  const data = await res.json();
  return data.text;
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error parsing the file.");
    }

    try {
      const transcription = await transcribeAudio(files.file.filepath);
      res.status(200).json({ transcription });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error transcribing the file.");
    }
  });
}
