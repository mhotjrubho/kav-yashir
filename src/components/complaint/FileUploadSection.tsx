import { useState, useCallback } from "react";
import { Upload, X, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  onFilesChange: (urls: string[]) => void;
  uploadedUrls: string[];
}

export function FileUploadSection({ onFilesChange, uploadedUrls }: FileUploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newFiles: { name: string; url: string }[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "סוג קובץ לא נתמך",
            description: `הקובץ ${file.name} אינו נתמך. יש להעלות קבצי תמונה או PDF בלבד.`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "קובץ גדול מדי",
            description: `הקובץ ${file.name} גדול מדי. גודל מקסימלי: 10MB`,
            variant: "destructive",
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `complaints/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('complaint-attachments')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "שגיאה בהעלאה",
            description: `לא ניתן להעלות את הקובץ ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('complaint-attachments')
          .getPublicUrl(filePath);

        newFiles.push({ name: file.name, url: publicUrl });
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updatedFiles);
        onFilesChange(updatedFiles.map(f => f.url));
        
        toast({
          title: "הקבצים הועלו בהצלחה",
          description: `${newFiles.length} קבצים הועלו`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "שגיאה בהעלאה",
        description: "אירעה שגיאה בהעלאת הקבצים",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  }, [uploadedFiles, onFilesChange]);

  const removeFile = useCallback((urlToRemove: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.url !== urlToRemove);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.url));
  }, [uploadedFiles, onFilesChange]);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return <Image className="h-5 w-5 text-primary" />;
    }
    return <FileText className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Upload className="h-5 w-5 text-primary" />
        צירוף מסמכים
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        ניתן לצרף תמונות או מסמכים רלוונטיים (PDF, JPG, PNG). גודל מקסימלי: 10MB לקובץ.
      </p>

      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <Upload className="h-10 w-10 text-muted-foreground" />
          <span className="text-muted-foreground">
            {isUploading ? "מעלה קבצים..." : "לחץ כאן להעלאת קבצים"}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {isUploading ? "מעלה..." : "בחר קבצים"}
          </Button>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">קבצים שהועלו:</p>
          {uploadedFiles.map((file) => (
            <div
              key={file.url}
              className="flex items-center justify-between p-3 bg-accent rounded-md"
            >
              <div className="flex items-center gap-2">
                {getFileIcon(file.name)}
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
