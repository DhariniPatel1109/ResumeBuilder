/**
 * Test script for DOC modification service
 * This script demonstrates how to use the DOC modification API
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001';

async function testDocModification() {
  console.log('🧪 Testing DOC Modification Service...\n');

  try {
    // Test 1: Extract text from a sample document
    console.log('1. Testing text extraction...');
    const extractResponse = await axios.post(`${API_BASE_URL}/api/doc/extract-text`, {
      filePath: 'uploads/sample-resume.docx' // You'll need to upload a sample file first
    });
    
    if (extractResponse.data.success) {
      console.log('✅ Text extraction successful');
      console.log('Sample text:', extractResponse.data.data.text.substring(0, 200) + '...\n');
    } else {
      console.log('❌ Text extraction failed:', extractResponse.data.error);
    }

    // Test 2: Validate a sentence
    console.log('2. Testing sentence validation...');
    const validateResponse = await axios.post(`${API_BASE_URL}/api/doc/validate-sentence`, {
      filePath: 'uploads/sample-resume.docx',
      sentence: 'Experienced software engineer with 5+ years of experience'
    });
    
    if (validateResponse.data.success) {
      console.log('✅ Sentence validation successful');
      console.log('Sentence exists:', validateResponse.data.data.exists);
    } else {
      console.log('❌ Sentence validation failed:', validateResponse.data.error);
    }

    // Test 3: Modify a sentence
    console.log('\n3. Testing sentence modification...');
    const modifyResponse = await axios.post(`${API_BASE_URL}/api/doc/modify`, {
      filePath: 'uploads/sample-resume.docx',
      originalSentence: 'Experienced software engineer with 5+ years of experience',
      newSentence: 'Senior software engineer with 7+ years of experience in full-stack development'
    });
    
    if (modifyResponse.data.success) {
      console.log('✅ Document modification successful');
      console.log('Output file:', modifyResponse.data.data.outputPath);
      console.log('Changes:', modifyResponse.data.data.changes);
    } else {
      console.log('❌ Document modification failed:', modifyResponse.data.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testDocModification();
