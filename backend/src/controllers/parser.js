import FileParserManager from './manager.js';

const fileParserManager = new FileParserManager();

export async function parseFileController(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: 'No file provided'
      });
    }

    const result = await fileParserManager.parse(file.path);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

export async function generateFileController(req, res) {
  try {
    const { data, format, filename } = req.body;

    if (!data || !format || !filename) {
      return res.status(400).json({
        error: 'Missing required fields: data, format, filename'
      });
    }

    const outputPath = `/tmp/${filename}`;
    await fileParserManager.generateFile(data, format, outputPath);

    res.download(outputPath, filename, (err) => {
      if (err) console.error('Download error:', err);
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

export default {
  parseFileController,
  generateFileController
};
