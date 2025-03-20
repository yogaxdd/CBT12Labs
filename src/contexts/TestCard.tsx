import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestCardProps } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Edit, Trash, Eye } from 'lucide-react';

const TestCard: React.FC<TestCardProps> = ({ 
  test, 
  onStart, 
  onEdit, 
  onDelete, 
  onView,
  variant = 'student' 
}) => {
  const formattedDate = new Date(test.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };

  return (
    <Card className="card-hover overflow-hidden group transition-all duration-300 border-opacity-60 hover:border-opacity-100">
      <CardHeader className="py-4 relative">
        <div className="absolute top-0 right-0 m-3 flex items-center gap-2">
          {variant === 'admin' && (
            <Badge variant={test.published ? "default" : "secondary"} className="opacity-90">
              {test.published ? "Published" : "Draft"}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl tracking-tight font-medium">{test.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {test.description}
        </p>
        
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDuration(test.duration)}</span>
          <span className="mx-2">•</span>
          <span>{test.questions.length} questions</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {variant === 'admin' ? 'Last updated' : 'Available since'}: {formattedDate}
        </div>
        <div className="flex gap-2">
          {variant === 'admin' ? (
            <>
              {onView && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onView}
                  className="opacity-70 hover:opacity-100"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  <span>View</span>
                </Button>
              )}
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEdit}
                  className="opacity-70 hover:opacity-100"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  <span>Edit</span>
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDelete}
                  className="text-destructive opacity-70 hover:opacity-100"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  <span>Delete</span>
                </Button>
              )}
            </>
          ) : (
            onStart && (
              <Button 
                size="sm" 
                onClick={onStart}
                className="group-hover:bg-cbt-600 transition-colors"
              >
                <Play className="h-4 w-4 mr-1.5" />
                <span>Start Test</span>
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestCard;
