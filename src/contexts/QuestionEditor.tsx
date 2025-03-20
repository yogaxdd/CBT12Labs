import React, { useState, useEffect } from 'react';
import { QuestionEditorProps, Option } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Trash, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

// Mock uuidv4 since we don't have it as a dependency yet
const mockUuidv4 = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  initialQuestion,
  onSave,
  onCancel,
}) => {
  const [questionText, setQuestionText] = useState(initialQuestion?.text || '');
  const [questionType, setQuestionType] = useState<'single' | 'multiple'>(
    initialQuestion?.type || 'single'
  );
  const [options, setOptions] = useState<Option[]>(
    initialQuestion?.options || [
      { id: mockUuidv4(), text: '', isCorrect: false },
      { id: mockUuidv4(), text: '', isCorrect: false },
    ]
  );
  const [errors, setErrors] = useState({
    questionText: '',
    options: '',
    correctOption: '',
  });

  // Effect to mark first option as correct if none are marked and type is 'single'
  useEffect(() => {
    if (questionType === 'single' && !options.some(opt => opt.isCorrect) && options.length > 0) {
      handleOptionCorrectChange(options[0].id, true);
    }
  }, [questionType]);

  const handleAddOption = () => {
    setOptions([...options, { id: mockUuidv4(), text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (id: string) => {
    // Don't allow removing if only 2 options are left
    if (options.length <= 2) {
      return;
    }
    
    // Check if we're removing the only correct option for single choice
    const isRemovingCorrect = options.find(o => o.id === id)?.isCorrect || false;
    const filteredOptions = options.filter(opt => opt.id !== id);
    
    // If removing the only correct option for single choice, set the first option as correct
    if (isRemovingCorrect && questionType === 'single') {
      filteredOptions[0].isCorrect = true;
    }
    
    setOptions(filteredOptions);
  };

  const handleOptionTextChange = (id: string, text: string) => {
    setOptions(
      options.map(opt => (opt.id === id ? { ...opt, text } : opt))
    );
  };

  const handleOptionCorrectChange = (id: string, isCorrect: boolean) => {
    if (questionType === 'single' && isCorrect) {
      // For single choice, unselect all other options
      setOptions(
        options.map(opt => ({
          ...opt,
          isCorrect: opt.id === id,
        }))
      );
    } else {
      // For multiple choice, toggle the selected option
      setOptions(
        options.map(opt =>
          opt.id === id ? { ...opt, isCorrect } : opt
        )
      );
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      questionText: '',
      options: '',
      correctOption: '',
    };
    
    if (!questionText.trim()) {
      newErrors.questionText = 'Question text is required';
    }
    
    // Check if all options have text
    const emptyOptions = options.some(opt => !opt.text.trim());
    if (emptyOptions) {
      newErrors.options = 'All options must have text';
    }
    
    // Check if at least one option is marked as correct
    const hasCorrectOption = options.some(opt => opt.isCorrect);
    if (!hasCorrectOption) {
      newErrors.correctOption = 'At least one option must be marked as correct';
    }
    
    setErrors(newErrors);
    
    // Form is valid if there are no error messages
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        text: questionText,
        type: questionType,
        options,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <Label htmlFor="question-text" className="text-base font-medium">
          Question
        </Label>
        <Textarea
          id="question-text"
          placeholder="Enter your question here..."
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          className={cn(
            "min-h-[100px] resize-y",
            errors.questionText && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.questionText && (
          <div className="text-destructive text-sm flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {errors.questionText}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">Question Type</Label>
        <RadioGroup
          value={questionType}
          onValueChange={(value) => setQuestionType(value as 'single' | 'multiple')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single">Single Choice</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multiple" id="multiple" />
            <Label htmlFor="multiple">Multiple Choice</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Options</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="h-8 px-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </div>
        
        {errors.options && (
          <div className="text-destructive text-sm flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {errors.options}
          </div>
        )}
        
        {errors.correctOption && (
          <div className="text-destructive text-sm flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {errors.correctOption}
          </div>
        )}
        
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
              <div className="mt-2.5">
                {questionType === 'single' ? (
                  <RadioGroupItem
                    checked={option.isCorrect}
                    onClick={() => handleOptionCorrectChange(option.id, true)}
                    className="mt-0.5"
                    id={`option-${option.id}`}
                  />
                ) : (
                  <Checkbox
                    checked={option.isCorrect}
                    onCheckedChange={(checked) => 
                      handleOptionCorrectChange(option.id, !!checked)
                    }
                    className="mt-0.5"
                    id={`option-${option.id}`}
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={cn(
                      "flex-1",
                      !option.text.trim() && errors.options && "border-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(option.id)}
                    className="text-muted-foreground px-1.5 h-8 hover:text-destructive"
                    disabled={options.length <= 2}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <Label
                  htmlFor={`option-${option.id}`}
                  className="block text-xs text-muted-foreground mt-1 cursor-pointer"
                >
                  {option.isCorrect ? 'Correct answer' : 'Mark as correct'}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Question</Button>
      </div>
    </form>
  );
};

export default QuestionEditor;
