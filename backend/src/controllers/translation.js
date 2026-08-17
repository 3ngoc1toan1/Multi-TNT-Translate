import TranslationManager from './manager.js';

const translationManager = new TranslationManager();

export async function translateController(req, res) {
  try {
    const { text, sourceLanguage, targetLanguage, service } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required fields: text, targetLanguage'
      });
    }

    const result = await translationManager.translate(
      text,
      sourceLanguage || 'auto',
      targetLanguage,
      service
    );

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

export async function translateFileController(req, res) {
  try {
    const { sourceLanguage, targetLanguage, service } = req.body;
    const file = req.file;

    if (!file || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required fields or file'
      });
    }

    // Parse file, translate, generate new file
    // Implementation depends on file type
    // This is a simplified version

    res.json({
      success: true,
      message: 'File translation in progress'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

export async function translateBatchController(req, res) {
  try {
    const { texts, sourceLanguage, targetLanguage, service } = req.body;

    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return res.status(400).json({
        error: 'Invalid request: texts must be an array'
      });
    }

    const results = await Promise.all(
      texts.map((text) =>
        translationManager
          .translate(
            text,
            sourceLanguage || 'auto',
            targetLanguage,
            service
          )
          .catch((err) => ({ error: err.message }))
      )
    );

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

export async function getServiceStatusController(req, res) {
  try {
    const status = await translationManager.getServiceStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

export default {
  translateController,
  translateFileController,
  translateBatchController,
  getServiceStatusController
};
