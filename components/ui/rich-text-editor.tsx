'use client';

import React, { useRef, useState } from 'react';
import { Button } from './button';
import { Bold, Italic, List, Type } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    updateValue();
  };

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 pb-2 border-b border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          className="p-2 h-8 w-8"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          className="p-2 h-8 w-8"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 h-8 w-8"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const size = prompt('Enter text size (1-7):', '3');
            if (size && /^[1-7]$/.test(size)) {
              execCommand('fontSize', size);
            }
          }}
          className="p-2 h-8 w-8"
        >
          <Type className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className={`min-h-[200px] p-3 rounded-md border ${
          isFocused ? 'border-primary' : 'border-input'
        } bg-transparent focus-visible:outline-none`}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={updateValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        placeholder={placeholder}
      />
    </div>
  );
}
