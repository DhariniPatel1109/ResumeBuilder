/**
 * DOC Modification Page
 * Demonstrates DOC file modification capabilities
 */

import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import DocModificationTool from '../components/doc/DocModificationTool';

const DocModification: React.FC = () => {
  return (
    <PageLayout
      title="DOC Modification Tool"
      subtitle="Modify specific sentences in DOC files while preserving exact formatting"
    >
      <DocModificationTool />
    </PageLayout>
  );
};

export default DocModification;
