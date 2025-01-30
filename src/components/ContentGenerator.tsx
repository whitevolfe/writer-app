import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Copy, CheckCircle } from "lucide-react";
import { generateContent } from "@/services/gemini";
import { useAuth } from "@/contexts/AuthContext";
import PricingPlans from "./PricingPlans";

const ContentGenerator = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("article");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error("Please enter a topic");
      return;
    }

    if (!user) {
      toast.error("Please sign in to generate content");
      setShowPricing(true);
      return;
    }

    // For basic (free) plan, check if user has reached the limit
    if (generatedCount >= 10) {
      toast.error("You've reached your monthly limit. Please upgrade your plan to continue generating content.");
      setShowPricing(true);
      return;
    }

    setLoading(true);
    try {
      const result = await generateContent(
        topic, 
        style, 
        length, 
        localStorage.getItem("GEMINI_API_KEY") || ""
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        setGeneratedContent(result.text);
        setGeneratedCount(prev => prev + 1);
        toast.success("Content generated successfully!");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (showPricing) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Choose a Plan</h2>
          <p className="mt-2 text-gray-600">Select a plan to start generating content</p>
        </div>
        <PricingPlans />
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowPricing(false)}
        >
          Back to Generator
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8 animate-fade-in">
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="topic">What would you like to write about?</Label>
          <Input
            id="topic"
            placeholder="Enter your topic or prompt..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={!user}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Style</Label>
            <Select value={style} onValueChange={setStyle} disabled={!user}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="script">Script</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Length</Label>
            <Select value={length} onValueChange={setLength} disabled={!user}>
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={loading || !topic || !user}
        >
          {!user ? "Sign in to Generate Content" : (
            <>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Generating..." : "Generate Content"}
            </>
          )}
        </Button>

        {user && (
          <p className="text-sm text-gray-600 text-center">
            Generated {generatedCount}/10 articles this month
          </p>
        )}
      </Card>

      {generatedContent && (
        <Card className="p-6 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Generated Content</h3>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="h-8 w-8"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Textarea
            value={generatedContent}
            readOnly
            className="min-h-[200px] resize-none"
          />
        </Card>
      )}
    </div>
  );
};

export default ContentGenerator;