import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({
                        title = 'No data found',
                        description = 'There are no items to display at the moment.',
                        action,
                        icon,
                    }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                {icon || <FolderOpen className="w-8 h-8 text-muted-foreground" />}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
            {action && (
                <Button onClick={action.onClick} size="sm">
                    {action.label}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;