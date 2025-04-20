const express = require('express');
const cors = require('cors');
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Microsoft Graph Client Setup
const credential = new ClientSecretCredential(
  process.env.TENANT_ID,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
const graphClient = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const token = await credential.getToken('https://graph.microsoft.com/.default');
      return token.token;
    },
  },
});

// List files in SharePoint folder
app.get('/api/files', async (req, res) => {
  const { folderPath = process.env.FOLDER_PATH } = req.query;
  try {
    const files = await graphClient.api(`/sites/${process.env.SITE_ID}/drive/root:/${folderPath}:/children`)
      .select('id,name,webUrl,file')
      .get();
    const fileList = files.value
      .filter(item => item.file) // Only include files, not folders
      .map(item => ({
        id: item.id,
        name: item.name,
        url: item.webUrl,
      }));
    res.json(fileList);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Read file content (for text-based files like .txt, .docx, etc.)
app.get('/api/file/:fileId', async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await graphClient.api(`/sites/${process.env.SITE_ID}/drive/items/${fileId}`)
      .get();
    if (file.file.mimeType.includes('text') || file.file.mimeType.includes('word')) {
      const content = await graphClient.api(`/sites/${process.env.SITE_ID}/drive/items/${fileId}/content`)
        .get();
      res.json({ name: file.name, content: content.toString() });
    } else {
      res.json({ name: file.name, url: file.webUrl, message: 'File content not readable, use URL to download' });
    }
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// Search files by query
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query is required' });
  try {
    const searchResults = await graphClient.api(`/sites/${process.env.SITE_ID}/drive/root/search(q='${query}')`)
      .select('id,name,webUrl,file')
      .get();
    const fileList = searchResults.value
      .filter(item => item.file)
      .map(item => ({
        id: item.id,
        name: item.name,
        url: item.webUrl,
      }));
    res.json(fileList);
  } catch (error) {
    console.error('Error searching files:', error);
    res.status(500).json({ error: 'Failed to search files' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
