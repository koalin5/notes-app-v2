import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, FileText, Wand2, Loader2 } from "lucide-react";
import { generateCompletionAction, generateSummaryAction, enhanceContentAction } from "@/actions/ai-actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AISidepanelProps {
  content: string;
  onContentUpdate: (newContent: string) => void;
}

export default function AISidepanel({ content, onContentUpdate }: AISidepanelProps) {
  const { toast } = useToast();
  const [summaryDialog, setSummaryDialog] = useState(false);
  const [summary, setSummary] = useState("");
  const [isCompletionLoading, setIsCompletionLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isEnhanceLoading, setIsEnhanceLoading] = useState(false);

  const handleAICompletion = async () => {
    setIsCompletionLoading(true);
    try {
      const result = await generateCompletionAction(content);
      if (result.status === "success" && result.data) {
        onContentUpdate(content + result.data);
      } else {
        throw new Error(result.message || "Failed to generate completion");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate completion",
        variant: "destructive",
      });
    } finally {
      setIsCompletionLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    try {
      const result = await generateSummaryAction(content);
      if (result.status === "success" && result.data) {
        setSummary(result.data);
        setSummaryDialog(true);
      } else {
        throw new Error(result.message || "Failed to generate summary");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleEnhanceContent = async () => {
    setIsEnhanceLoading(true);
    try {
      const result = await enhanceContentAction(content);
      if (result.status === "success" && result.data) {
        onContentUpdate(result.data);
        toast({
          title: "Success",
          description: "Content enhanced",
        });
      } else {
        throw new Error(result.message || "Failed to enhance content");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance content",
        variant: "destructive",
      });
    } finally {
      setIsEnhanceLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 w-[48px] sticky top-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAICompletion}
              disabled={isCompletionLoading}
              className="h-10 hover:bg-muted"
            >
              {isCompletionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1">
            <p className="font-medium">Continue Writing</p>
            <p className="text-xs text-muted-foreground">Let AI continue your thoughts</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGenerateSummary}
              disabled={isSummaryLoading}
              className="h-10 hover:bg-muted"
            >
              {isSummaryLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1">
            <p className="font-medium">Generate Summary</p>
            <p className="text-xs text-muted-foreground">Create a concise summary</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEnhanceContent}
              disabled={isEnhanceLoading}
              className="h-10 hover:bg-muted"
            >
              {isEnhanceLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1">
            <p className="font-medium">Enhance Content</p>
            <p className="text-xs text-muted-foreground">Improve writing quality</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={summaryDialog} onOpenChange={setSummaryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Note Summary</DialogTitle>
          </DialogHeader>
          <DialogDescription className="mt-4 text-base">
            {summary}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
} 