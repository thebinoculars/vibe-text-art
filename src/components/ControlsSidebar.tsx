import React, { useState } from "react";
import { Label, Input, Textarea, Slider, Button, Checkbox } from "./ui/core";
import { Settings, Image as ImageIcon, Download, Loader2, ChevronDown } from "lucide-react";
import type { GenerationSettings } from "@/lib/canvas";

interface ControlsSidebarProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  onGenerate: () => void;
  onDownload: () => void;
  onChangeImage: () => void;
  isGenerating: boolean;
  hasImage: boolean;
  imageSize: { width: number; height: number } | null;
}

const FONTS = [
  "Arial",
  "Helvetica",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Courier",
  "Lucida Console",
  "Monaco",
  "Impact",
  "Comic Sans MS"
];

export function ControlsSidebar({ 
  settings, 
  setSettings, 
  onGenerate, 
  onDownload,
  onChangeImage,
  isGenerating,
  hasImage,
  imageSize
}: ControlsSidebarProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const handleSettingChange = (key: keyof GenerationSettings, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      
      if (prev.maintainAspectRatio && imageSize) {
        const ratio = imageSize.width / imageSize.height;
        if (key === "width") {
          newSettings.height = Math.round(value / ratio);
        } else if (key === "height") {
          newSettings.width = Math.round(value * ratio);
        }
      }
      
      return newSettings;
    });
  };

  return (
    <aside className="w-full lg:w-[400px] flex flex-col h-full bg-card/80 backdrop-blur-2xl border-r border-border/50 relative z-20 shadow-2xl">
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
            Text Art
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        
        <div className="space-y-3">
          <Label>Text Content</Label>
          <Textarea
            value={settings.lyrics}
            onChange={(e) => handleSettingChange("lyrics", e.target.value)}
            placeholder="Paste your text here..."
            className="font-mono text-xs leading-relaxed min-h-[200px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Width (px)</Label>
            <Input
              type="number"
              value={settings.width}
              onChange={(e) => handleSettingChange("width", parseInt(e.target.value) || 4000)}
              className="h-10"
            />
          </div>
          <div className="space-y-3">
            <Label>Height (px)</Label>
            <Input
              type="number"
              value={settings.height}
              onChange={(e) => handleSettingChange("height", parseInt(e.target.value) || 4000)}
              className="h-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="maintain-ratio" 
            checked={settings.maintainAspectRatio} 
            onCheckedChange={(checked) => handleSettingChange("maintainAspectRatio", !!checked)}
          />
          <Label htmlFor="maintain-ratio" className="cursor-pointer">Maintain Aspect Ratio</Label>
        </div>

        <div>
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center justify-between w-full text-sm font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            <span>Advanced Settings</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isAdvancedOpen && (
            <div className="space-y-5 mt-5">
              <div className="space-y-3">
                <Label>Font Family</Label>
                <select
                  className="flex h-10 w-full rounded-xl border border-input bg-card/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                  value={settings.fontFamily}
                  onChange={(e) => handleSettingChange("fontFamily", e.target.value)}
                >
                  {FONTS.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Font Size</Label>
                    <span className="text-xs text-muted-foreground font-mono">{settings.fontSize}px</span>
                  </div>
                  <Slider
                    min={4} max={100} step={1}
                    value={[settings.fontSize]}
                    onValueChange={([val]) => handleSettingChange("fontSize", val)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Line Height</Label>
                    <span className="text-xs text-muted-foreground font-mono">{settings.lineHeight}px</span>
                  </div>
                  <Slider
                    min={4} max={100} step={1}
                    value={[settings.lineHeight]}
                    onValueChange={([val]) => handleSettingChange("lineHeight", val)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Background Color</Label>
                <div className="relative">
                  <input
                    type="color"
                    value={settings.bgColor}
                    onChange={(e) => handleSettingChange("bgColor", e.target.value)}
                    className="w-12 h-12 rounded-full cursor-pointer"
                    style={{ 
                      padding: 0,
                      border: '2px solid rgba(255,255,255,0.1)',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      background: 'none'
                    }}
                  />
                  <style>{`
                    input[type="color"]::-webkit-color-swatch-wrapper {
                      padding: 0;
                      border-radius: 50%;
                    }
                    input[type="color"]::-webkit-color-swatch {
                      border: none;
                      border-radius: 50%;
                    }
                    input[type="color"]::-moz-color-swatch {
                      border: none;
                      border-radius: 50%;
                    }
                  `}</style>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Brightness</Label>
                    <span className="text-xs text-muted-foreground font-mono">{settings.brightness}%</span>
                  </div>
                  <Slider
                    min={0} max={200} step={5}
                    value={[settings.brightness]}
                    onValueChange={([val]) => handleSettingChange("brightness", val)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Contrast</Label>
                    <span className="text-xs text-muted-foreground font-mono">{settings.contrast}%</span>
                  </div>
                  <Slider
                    min={0} max={200} step={5}
                    value={[settings.contrast]}
                    onValueChange={([val]) => handleSettingChange("contrast", val)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="p-6 border-t border-border/50 bg-card/50 space-y-3">
        <Button 
          onClick={onGenerate} 
          disabled={!hasImage || isGenerating}
          className="w-full h-11"
        >
          {isGenerating ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
          ) : (
            <><Settings className="w-5 h-5 mr-2" /> Generate</>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={onDownload}
            disabled={!hasImage || isGenerating}
            className="h-11"
          >
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          
          <Button 
            variant="outline"
            onClick={onChangeImage}
            disabled={!hasImage}
            className="h-11"
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Change
          </Button>
        </div>
      </div>
    </aside>
  );
}
