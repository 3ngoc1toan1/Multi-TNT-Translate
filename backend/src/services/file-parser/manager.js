import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import XLSX from 'xlsx';
import xml2js from 'xml2js';

// SRT Parser
class SRTParser {
  parse(content) {
    const lines = content.trim().split('\n');
    const subtitles = [];
    let current = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        if (Object.keys(current).length > 0) {
          subtitles.push(current);
          current = {};
        }
      } else if (!isNaN(line)) {
        current.index = parseInt(line);
      } else if (line.includes('-->')) {
        const [start, end] = line.split('-->');
        current.startTime = start.trim();
        current.endTime = end.trim();
      } else {
        if (!current.text) current.text = '';
        current.text += (current.text ? '\n' : '') + line;
      }
    }

    if (Object.keys(current).length > 0) {
      subtitles.push(current);
    }

    return {
      format: 'srt',
      subtitles,
      metadata: { totalSubtitles: subtitles.length }
    };
  }

  generate(subtitles) {
    return subtitles
      .map(
        (sub) =>
          `${sub.index}\n${sub.startTime} --> ${sub.endTime}\n${sub.text}\n`
      )
      .join('\n');
  }
}

// VTT Parser
class VTTParser {
  parse(content) {
    const lines = content.trim().split('\n');
    const subtitles = [];
    let current = {};
    let index = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === 'WEBVTT' || line === '') {
        if (Object.keys(current).length > 0) {
          subtitles.push(current);
          current = {};
        }
        continue;
      }

      if (line.includes('-->')) {
        const [start, end] = line.split('-->');
        current.index = index++;
        current.startTime = start.trim();
        current.endTime = end.trim();
      } else if (line) {
        if (!current.text) current.text = '';
        current.text += (current.text ? '\n' : '') + line;
      }
    }

    if (Object.keys(current).length > 0) {
      subtitles.push(current);
    }

    return {
      format: 'vtt',
      subtitles,
      metadata: { totalSubtitles: subtitles.length }
    };
  }

  generate(subtitles) {
    let vtt = 'WEBVTT\n\n';
    vtt += subtitles
      .map(
        (sub) =>
          `${sub.startTime} --> ${sub.endTime}\n${sub.text}\n`
      )
      .join('\n');
    return vtt;
  }
}

// ASS/SSA Parser
class ASSParser {
  parse(content) {
    const lines = content.split('\n');
    const subtitles = [];
    let inEvents = false;
    let index = 1;

    for (const line of lines) {
      if (line.startsWith('[Events]')) {
        inEvents = true;
        continue;
      }

      if (inEvents && line.startsWith('Dialogue:')) {
        const parts = line.split(',');
        if (parts.length >= 10) {
          const start = parts[1].trim();
          const end = parts[2].trim();
          const text = parts.slice(9).join(',').trim();
          // Remove ASS formatting tags
          const cleanText = text.replace(/{[^}]*}/g, '');
          subtitles.push({
            index: index++,
            startTime: start,
            endTime: end,
            text: cleanText
          });
        }
      }
    }

    return {
      format: 'ass',
      subtitles,
      metadata: { totalSubtitles: subtitles.length }
    };
  }

  generate(subtitles) {
    let ass = '[Script Info]\n';
    ass += 'Title: Translated Subtitles\n\n';
    ass += '[V4+ Styles]\n';
    ass += 'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n';
    ass += 'Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,0,0,0,1\n\n';
    ass += '[Events]\n';
    ass += 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
    ass += subtitles
      .map(
        (sub) =>
          `Dialogue: 0,${sub.startTime},${sub.endTime},Default,,0,0,0,,${sub.text}`
      )
      .join('\n');
    return ass;
  }
}

// PDF Parser
class PDFParser {
  async parse(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);

      return {
        format: 'pdf',
        pages: data.numpages,
        content: data.text,
        metadata: {
          author: data.info?.Author || '',
          title: data.info?.Title || '',
          creationDate: data.info?.CreationDate || ''
        }
      };
    } catch (error) {
      throw new Error(`PDF parsing error: ${error.message}`);
    }
  }
}

// DOCX Parser
class DOCXParser {
  async parse(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return {
        format: 'docx',
        content: result.value,
        metadata: { messages: result.messages }
      };
    } catch (error) {
      throw new Error(`DOCX parsing error: ${error.message}`);
    }
  }
}

// Excel Parser
class ExcelParser {
  parse(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const result = {
        format: 'xlsx',
        sheets: {}
      };

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        result.sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet);
      }

      return result;
    } catch (error) {
      throw new Error(`Excel parsing error: ${error.message}`);
    }
  }

  generate(sheetData, sheetName = 'Sheet1') {
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    return workbook;
  }
}

// XML Parser
class XMLParser {
  async parse(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(content);

      return {
        format: 'xml',
        data: result,
        content
      };
    } catch (error) {
      throw new Error(`XML parsing error: ${error.message}`);
    }
  }
}

// Text Parser
class TextParser {
  parse(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        format: 'txt',
        content,
        metadata: {
          lines: content.split('\n').length,
          characters: content.length
        }
      };
    } catch (error) {
      throw new Error(`Text parsing error: ${error.message}`);
    }
  }
}

class FileParserManager {
  constructor() {
    this.parsers = {
      srt: new SRTParser(),
      vtt: new VTTParser(),
      ass: new ASSParser(),
      ssa: new ASSParser(),
      pdf: new PDFParser(),
      docx: new DOCXParser(),
      doc: new DOCXParser(),
      xlsx: new ExcelParser(),
      xls: new ExcelParser(),
      csv: new ExcelParser(),
      xml: new XMLParser(),
      txt: new TextParser(),
      md: new TextParser(),
      markdown: new TextParser()
    };
  }

  getFileFormat(filePath) {
    const ext = path.extname(filePath).toLowerCase().slice(1);
    return ext;
  }

  async parse(filePath) {
    const format = this.getFileFormat(filePath);
    const parser = this.parsers[format];

    if (!parser) {
      throw new Error(`Unsupported file format: ${format}`);
    }

    return await parser.parse(filePath);
  }

  async generateFile(data, format, outputPath) {
    const parser = this.parsers[format];

    if (!parser) {
      throw new Error(`Unsupported format: ${format}`);
    }

    if (format === 'srt') {
      const content = parser.generate(data);
      fs.writeFileSync(outputPath, content, 'utf8');
    } else if (format === 'vtt') {
      const content = parser.generate(data);
      fs.writeFileSync(outputPath, content, 'utf8');
    } else if (format === 'ass') {
      const content = parser.generate(data);
      fs.writeFileSync(outputPath, content, 'utf8');
    } else if (format === 'xlsx') {
      const workbook = parser.generate(data);
      XLSX.writeFile(workbook, outputPath);
    }
  }
}

export default FileParserManager;
