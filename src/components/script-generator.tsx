"use client";

import { generateScript, type GenerateScriptOutput } from "@/ai/flows/generate-script";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Loader2, Sparkles } from "lucide-react";
import { ScriptCard } from "./script-card";
import { ScriptSkeleton } from "./script-skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  topic: z
    .string()
    .min(10, { message: "Topic must be at least 10 characters." })
    .max(100, { message: "Topic must be 100 characters or less." }),
});

type ScriptWithId = GenerateScriptOutput & { id: string };

const LOCAL_STORAGE_KEY = "reelgenius-scripts";

export function ScriptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestScript, setLatestScript] = useState<ScriptWithId | null>(null);
  const [savedScripts, setSavedScripts] = useState<ScriptWithId[]>([]);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (items) {
        setSavedScripts(JSON.parse(items));
      }
    } catch (e) {
      console.error("Failed to parse scripts from local storage", e);
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setLatestScript(null);

    try {
      const result = await generateScript({ topic: values.topic });
      const newScript = { ...result, id: new Date().toISOString() };
      setLatestScript(newScript);
      const updatedScripts = [newScript, ...savedScripts];
      setSavedScripts(updatedScripts);
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedScripts)
      );
    } catch (e) {
      console.error(e);
      setError("Failed to generate script. Please try again.");
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  const handleDelete = (id: string) => {
    const updatedScripts = savedScripts.filter((script) => script.id !== id);
    setSavedScripts(updatedScripts);
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(updatedScripts)
    );
    if (latestScript?.id === id) {
      setLatestScript(null);
    }
  };

  return (
    <div className="space-y-12">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Create a new Reel Script</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Tips for starting a vegetable garden'"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the topic for your 60-second video.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Script
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="max-w-3xl mx-auto">
        {isLoading && <ScriptSkeleton />}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {latestScript && <ScriptCard script={latestScript} onDelete={handleDelete} />}
      </div>

      {savedScripts.length > 0 && (
        <div className="space-y-8">
            <Separator />
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
                    <History className="h-8 w-8 text-primary" />
                    Your Past Scripts
                </h2>
                <p className="text-muted-foreground mt-2">
                    Review and reuse your previously generated scripts.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {savedScripts.map((script) => (
                    <ScriptCard key={script.id} script={script} onDelete={handleDelete} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}