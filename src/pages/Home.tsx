import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ControlsSidebar } from "@/components/ControlsSidebar";
import { generateTextPoster, type GenerationSettings } from "@/lib/canvas";
import { cn } from "@/lib/utils";

const DEFAULT_SETTINGS: GenerationSettings = {
  width: 4000,
  height: 4000,
  lyrics: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  lineSeparator: "   ",
  bgColor: "#0a0a0a",
  brightness: 100,
  contrast: 100,
  fontFamily: "Arial",
  fontSize: 26,
  lineHeight: 28,
  maintainAspectRatio: true,
};

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [settings, setSettings] = useState<GenerationSettings>(() => {
    const saved = localStorage.getItem("text-art-settings");
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    localStorage.setItem("text-art-settings", JSON.stringify(settings));
  }, [settings]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setImageSrc(src);
        
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
          if (settings.maintainAspectRatio) {
            const ratio = img.width / img.height;
            setSettings(prev => ({
              ...prev,
              height: Math.round(prev.width / ratio)
            }));
          }
        };
        img.src = src;

        setTimeout(() => triggerGenerate(src, settings), 100);
      };
      reader.readAsDataURL(file);
    }
  }, [settings.maintainAspectRatio]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const handleChangeImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onDrop([file]);
    };
    input.click();
  };

  const triggerGenerate = async (src = imageSrc, currentSettings = settings) => {
    if (!src || !canvasRef.current) return;
    
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      await generateTextPoster(canvasRef.current, src, currentSettings);
      
      // Ensure crisp rendering
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
      }
    } catch (err) {
      console.error("Error generating poster", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `text-art-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };


  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-black overflow-hidden text-foreground">
      
      <ControlsSidebar
        settings={settings}
        setSettings={setSettings}
        onGenerate={() => triggerGenerate()}
        onDownload={downloadCanvas}
        onChangeImage={handleChangeImage}
        isGenerating={isGenerating}
        hasImage={!!imageSrc}
        imageSize={imageSize}
      />

      <main className="flex-1 relative flex items-center justify-center p-8 md:p-12 overflow-hidden bg-background/50">
        
        {!imageSrc ? (
          <div 
            {...getRootProps()} 
            className={cn(
              "w-full max-w-2xl aspect-[4/3] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-12 text-center cursor-pointer transition-all duration-300 group glass-panel",
              isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/60 hover:border-primary/50 hover:bg-white/[0.02]"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary/20">
              <UploadCloud className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-white">Upload Image</h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Drag and drop or click to upload your image
            </p>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={5}
              wheel={{ step: 0.1 }}
              pinch={{ step: 5 }}
              doubleClick={{ step: 2 }}
            >
              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%' }}
                contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden border border-white/5 max-w-full max-h-full">
                  <canvas
                    ref={canvasRef}
                    className="block shadow-2xl cursor-grab active:cursor-grabbing"
                    style={{
                      maxWidth: 'calc(100vw - 450px)',
                      maxHeight: 'calc(100vh - 120px)',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      imageRendering: 'crisp-edges',
                      backgroundColor: settings.bgColor,
                      display: isGenerating ? 'none' : 'block'
                    }}
                  />
                </div>
              </TransformComponent>
            </TransformWrapper>
            
            {isGenerating && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-10 animate-in fade-in duration-300">
                <div className="bg-card p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 border border-white/10">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="font-bold text-lg tracking-tight text-white">Generating Text Art</p>
                    <p className="text-sm text-muted-foreground">This may take a few seconds...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
