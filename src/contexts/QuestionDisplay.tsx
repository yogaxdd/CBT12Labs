import React from 'react';
import { QuestionDisplayProps } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedOptions,
  onAnswer,
  disabled = false,
  showCorrectAnswers = false,
}) => {
  const handleSingleOptionChange = (optionId: string) => {
    if (!disabled) {
      onAnswer(question.id, [optionId]);
    }
  };

  const handleMultipleOptionChange = (optionId: string, checked: boolean) => {
    if (!disabled) {
      let newSelectedOptions: string[];
      
      if (checked) {
        newSelectedOptions = [...selectedOptions, optionId];
      } else {
        newSelectedOptions = selectedOptions.filter(id => id !== optionId);
      }
      
      onAnswer(question.id, newSelectedOptions);
    }
  };

  const isOptionSelected = (optionId: string) => selectedOptions.includes(optionId);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-lg font-medium pb-2 border-b">{question.text}</div>
      
      <div className="space-y-3 pt-2">
        {question.type === 'single' ? (
          <RadioGroup
            value={selectedOptions[0] || ''}
            onValueChange={handleSingleOptionChange}
            disabled={disabled}
          >
            {question.options.map((option) => {
              const isCorrect = option.isCorrect;
              const isSelected = isOptionSelected(option.id);
              
              // Determine the style based on correctness and selection
              let optionClassName = "p-3 rounded-md border border-border transition-all duration-200";
              
              if (showCorrectAnswers) {
                if (isCorrect) {
                  optionClassName = cn(optionClassName, "border-green-500 bg-green-50");
                } else if (isSelected && !isCorrect) {
                  optionClassName = cn(optionClassName, "border-red-500 bg-red-50");
                }
              } else if (isSelected) {
                optionClassName = cn(optionClassName, "border-primary/70 bg-primary/5");
              }
              
              return (
                <div 
                  key={option.id} 
                  className={optionClassName}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem 
                      value={option.id} 
                      id={`question-${question.id}-option-${option.id}`}
                      className="mt-0.5"
                      disabled={disabled}
                    />
                    <div className="flex-grow">
                      <Label
                        htmlFor={`question-${question.id}-option-${option.id}`}
                        className={cn(
                          "text-base font-normal cursor-pointer",
                          disabled && "cursor-default"
                        )}
                      >
                        {option.text}
                      </Label>
                      
                      {showCorrectAnswers && (
                        <div className="mt-1 text-sm">
                          {isCorrect ? (
                            <span className="text-green-600 flex items-center gap-1.5">
                              <Check className="h-4 w-4" /> Correct answer
                            </span>
                          ) : isSelected ? (
                            <span className="text-red-600 flex items-center gap-1.5">
                              <X className="h-4 w-4" /> Incorrect answer
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            {question.options.map((option) => {
              const isCorrect = option.isCorrect;
              const isSelected = isOptionSelected(option.id);
              
              // Determine the style based on correctness and selection
              let optionClassName = "p-3 rounded-md border border-border transition-all duration-200";
              
              if (showCorrectAnswers) {
                if (isCorrect && isSelected) {
                  optionClassName = cn(optionClassName, "border-green-500 bg-green-50");
                } else if (isSelected && !isCorrect) {
                  optionClassName = cn(optionClassName, "border-red-500 bg-red-50");
                } else if (isCorrect && !isSelected) {
                  optionClassName = cn(optionClassName, "border-yellow-500 bg-yellow-50");
                }
              } else if (isSelected) {
                optionClassName = cn(optionClassName, "border-primary/70 bg-primary/5");
              }
              
              return (
                <div 
                  key={option.id}
                  className={optionClassName}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`question-${question.id}-option-${option.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleMultipleOptionChange(option.id, !!checked)
                      }
                      className="mt-0.5"
                      disabled={disabled}
                    />
                    <div className="flex-grow">
                      <Label
                        htmlFor={`question-${question.id}-option-${option.id}`}
                        className={cn(
                          "text-base font-normal cursor-pointer",
                          disabled && "cursor-default"
                        )}
                      >
                        {option.text}
                      </Label>
                      
                      {showCorrectAnswers && (
                        <div className="mt-1 text-sm">
                          {isCorrect && isSelected ? (
                            <span className="text-green-600 flex items-center gap-1.5">
                              <Check className="h-4 w-4" /> Correct answer
                            </span>
                          ) : isSelected && !isCorrect ? (
                            <span className="text-red-600 flex items-center gap-1.5">
                              <X className="h-4 w-4" /> Incorrect answer
                            </span>
                          ) : isCorrect && !isSelected ? (
                            <span className="text-yellow-600 flex items-center gap-1.5">
                              <Check className="h-4 w-4" /> You missed this correct answer
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;