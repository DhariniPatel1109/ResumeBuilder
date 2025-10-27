import React from 'react';

interface DiffViewProps {
  original: string;
  enhanced: string;
  className?: string;
}

const DiffView: React.FC<DiffViewProps> = ({ original, enhanced, className = '' }) => {
  // Simple inline diff algorithm for side-by-side view
  const createInlineDiff = (original: string, enhanced: string) => {
    if (!original && !enhanced) return { original: [], enhanced: [] };
    if (!original) return { original: [], enhanced: [{ text: enhanced, type: 'added' as const }] };
    if (!enhanced) return { original: [{ text: original, type: 'removed' as const }], enhanced: [] };
    
    // Split into words while preserving spaces
    const originalWords = original.split(/(\s+)/);
    const enhancedWords = enhanced.split(/(\s+)/);
    
    const originalResult: Array<{ text: string; type: 'unchanged' | 'removed' }> = [];
    const enhancedResult: Array<{ text: string; type: 'unchanged' | 'added' }> = [];
    
    let origIndex = 0;
    let enhIndex = 0;
    
    while (origIndex < originalWords.length || enhIndex < enhancedWords.length) {
      const origWord = originalWords[origIndex] || '';
      const enhWord = enhancedWords[enhIndex] || '';
      
      if (origIndex >= originalWords.length) {
        // Only enhanced words left
        enhancedResult.push({ text: enhWord, type: 'added' });
        enhIndex++;
      } else if (enhIndex >= enhancedWords.length) {
        // Only original words left
        originalResult.push({ text: origWord, type: 'removed' });
        origIndex++;
      } else if (origWord === enhWord) {
        // Words are identical
        originalResult.push({ text: origWord, type: 'unchanged' });
        enhancedResult.push({ text: enhWord, type: 'unchanged' });
        origIndex++;
        enhIndex++;
      } else {
        // Words are different
        originalResult.push({ text: origWord, type: 'removed' });
        enhancedResult.push({ text: enhWord, type: 'added' });
        origIndex++;
        enhIndex++;
      }
    }
    
    return { original: originalResult, enhanced: enhancedResult };
  };
  
  const { original: originalDiff, enhanced: enhancedDiff } = createInlineDiff(original, enhanced);
  
  const renderTextWithHighlights = (words: Array<{ text: string; type: 'unchanged' | 'removed' | 'added' }>) => {
    return words.map((word, index) => (
      <span
        key={index}
        className={`
          ${word.type === 'unchanged' ? 'text-gray-700 dark:text-gray-300' : ''}
          ${word.type === 'removed' ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 line-through' : ''}
          ${word.type === 'added' ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 font-medium' : ''}
        `}
      >
        {word.text}
      </span>
    ));
  };
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {/* Original Text */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Original</h4>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm leading-relaxed">
            {renderTextWithHighlights(originalDiff)}
          </p>
        </div>
      </div>
      
      {/* Enhanced Text */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI Enhanced</h4>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm leading-relaxed">
            {renderTextWithHighlights(enhancedDiff)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiffView;
