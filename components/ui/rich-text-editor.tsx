'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from './button';
import { Bold, Italic, List, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setIsEmpty(content === '' || content === '<br>' || content === '<div><br></div>');
    }
  }, [value]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    updateValue();
  };

  const updateValue = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setIsEmpty(content === '' || content === '<br>' || content === '<div><br></div>');
      onChange(content);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      execCommand('insertLineBreak');
    }
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

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          className={cn(
            "min-h-[200px] p-3 rounded-md border bg-transparent focus-visible:outline-none",
            isFocused ? "border-primary" : "border-input",
            "focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          )}
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={updateValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
        />
        {isEmpty && !isFocused && placeholder && (
          <div className="absolute top-3 left-3 text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
