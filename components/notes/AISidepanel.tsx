import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, FileText, Wand2, Loader2, Languages, BarChart2 } from "lucide-react";
import { generateCompletionAction, generateSummaryAction, enhanceContentAction, translateContentAction, analyzeContentAction } from "@/actions/ai-actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Analysis {
  keyTopics: string[];
  mainIdeas: string[];
  actionItems: string[];
  dates: string[];
  entities: string[];
}

interface AISidepanelProps {
  content: string;
  onContentUpdate: (newContent: string) => void;
}

export default function AISidepanel({ content, onContentUpdate }: AISidepanelProps) {
  const { toast } = useToast();
  const [summaryDialog, setSummaryDialog] = useState(false);
  const [analysisDialog, setAnalysisDialog] = useState(false);
  const [summary, setSummary] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isCompletionLoading, setIsCompletionLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isEnhanceLoading, setIsEnhanceLoading] = useState(false);
  const [isTranslateLoading, setIsTranslateLoading] = useState(false);
  const [isAnalyzeLoading, setIsAnalyzeLoading] = useState(false);

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

  const handleTranslate = async (language: string) => {
    setIsTranslateLoading(true);
    try {
      const result = await translateContentAction(content, language);
      if (result.status === "success" && result.data) {
        onContentUpdate(result.data);
        toast({
          title: "Success",
          description: `Translated to ${language}`,
        });
      } else {
        throw new Error(result.message || "Failed to translate content");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to translate content",
        variant: "destructive",
      });
    } finally {
      setIsTranslateLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please add some content to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzeLoading(true);
    try {
      const result = await analyzeContentAction(content);
      if (result.status === "success" && result.data) {
        const analysis = result.data as Analysis;
        
        const sections = [];
        
        if (analysis.keyTopics.length > 0) {
          sections.push(
            "### Key Topics\n\n" +
            analysis.keyTopics.map(topic => `- ${topic}`).join('\n') +
            "\n\n"
          );
        }
        
        if (analysis.mainIdeas.length > 0) {
          sections.push(
            "### Main Ideas\n\n" +
            analysis.mainIdeas.map(idea => `- ${idea}`).join('\n') +
            "\n\n"
          );
        }
        
        if (analysis.actionItems.length > 0) {
          sections.push(
            "### Action Items\n\n" +
            analysis.actionItems.map(item => `- ${item}`).join('\n') +
            "\n\n"
          );
        }
        
        if (analysis.dates.length > 0) {
          sections.push(
            "### Important Dates\n\n" +
            analysis.dates.map(date => `- ${date}`).join('\n') +
            "\n\n"
          );
        }
        
        if (analysis.entities.length > 0) {
          sections.push(
            "### Key People/Entities\n\n" +
            analysis.entities.map(entity => `- ${entity}`).join('\n') +
            "\n\n"
          );
        }

        if (sections.length === 0) {
          toast({
            title: "No Analysis Results",
            description: "No significant elements were found to analyze in the content",
            variant: "default",
          });
          return;
        }

        const analysisText = `\n\n---\n\n## Content Analysis\n\n${sections.join('')}`;

        onContentUpdate(content + analysisText);
        
        toast({
          title: "Analysis Complete",
          description: "Content analysis has been added to your note",
        });
      } else {
        throw new Error(result.message || "Failed to analyze content");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze content",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzeLoading(false);
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

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div>
              <Select onValueChange={handleTranslate} disabled={isTranslateLoading}>
                <SelectTrigger className="w-10 h-10 p-0">
                  {isTranslateLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Languages className="h-4 w-4" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Portuguese">Portuguese</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                  <SelectItem value="Korean">Korean</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1">
            <p className="font-medium">Translate</p>
            <p className="text-xs text-muted-foreground">Translate to another language</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAnalyze}
              disabled={isAnalyzeLoading}
              className="h-10 hover:bg-muted"
            >
              {isAnalyzeLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BarChart2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1">
            <p className="font-medium">Analyze Content</p>
            <p className="text-xs text-muted-foreground">Add content analysis to note</p>
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