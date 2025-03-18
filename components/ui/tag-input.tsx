"use client";

import React, { useState, KeyboardEvent } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

const TagInput: React.FC<TagInputProps> = ({ 
  value = [], 
  onChange, 
  placeholder = "Add tag...",
  label
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      const newTags = [...value, trimmedValue];
      onChange(newTags);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={label}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addTag}
          disabled={!inputValue.trim()}
          size="sm"
          variant="secondary"
        >
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {tag}
            <Button
              type="button"
              onClick={() => removeTag(tag)}
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagInput;