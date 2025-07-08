"use client";

import type { GenerateScriptOutput } from "@/ai/flows/generate-script";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2 } from "lucide-react";
import React from "react";

interface ScriptCardProps {
  script: GenerateScriptOutput & { id: string };
  onDelete: (id: string) => void;
  className?: string;
}

export function ScriptCard({ script, onDelete, className }: ScriptCardProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    const scriptText = `Title: ${script.title}\n\nScript:\n${script.script}\n\nHashtags: ${script.hashtags}`;
    navigator.clipboard.writeText(scriptText);
    toast({
      title: "Copied to clipboard!",
      description: "The script has been copied successfully.",
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{script.title}</CardTitle>
            <CardDescription className="text-2xl pt-2">
              {script.emojiSummary}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy script</span>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(script.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete script</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap font-mono text-sm">
          {script.script}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {script.hashtags.split(" ").map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}