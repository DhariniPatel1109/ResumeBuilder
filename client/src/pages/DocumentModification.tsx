/**
 * Document Modification Page
 * Combined page for both DOC and PDF file modification
 */

import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import DocModificationTool from '../components/doc/DocModificationTool';
import PDFModificationTool from '../components/pdf/PDFModificationTool';
import Button from '../components/ui/Button';
import { FileText, File } from 'lucide-react';

const DocumentModification: React.FC = () => {
  const [fileType, setFileType] = useState<'doc' | 'pdf'>('doc');

  return (
    <PageLayout
      title="Document Modification"
      subtitle="Modify text content in DOC/DOCX or PDF files while preserving formatting"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Document Modification' }
      ]}
    >
      <div className="py-8">
        {/* File Type Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={fileType === 'doc' ? 'primary' : 'outline'}
              onClick={() => setFileType('doc')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              DOC/DOCX Files
            </Button>
            <Button
              variant={fileType === 'pdf' ? 'primary' : 'outline'}
              onClick={() => setFileType('pdf')}
              className="flex items-center gap-2"
            >
              <File className="w-4 h-4" />
              PDF Files
            </Button>
          </div>
        </div>

        {/* Tool Description */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {fileType === 'doc' 
              ? 'Upload a DOC or DOCX file and replace specific text while preserving all formatting, fonts, colors, and layout.'
              : 'Upload a PDF file and replace specific text while maintaining the original document structure and appearance.'
            }
          </p>
        </div>

        {/* Tool Component */}
        {fileType === 'doc' ? <DocModificationTool /> : <PDFModificationTool />}

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              💡 Pro Tip
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {fileType === 'doc' 
                ? 'PDF modification is more reliable and preserves formatting better. Consider converting your DOC file to PDF first for better results.'
                : 'PDF files work best for text replacement. The original formatting, fonts, and layout will be preserved in the modified document.'
              }
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentModification;
