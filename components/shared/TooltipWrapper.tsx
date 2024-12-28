import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";


interface TooltipWrapperProps {
    tooltipText: string;
    children: React.ReactNode;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ tooltipText, children }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <span>{tooltipText}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default TooltipWrapper;