'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDb, getFirebaseStorage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssetUploadProps {
  inspectionId: string;
}

export const AssetUpload: React.FC<AssetUploadProps> = ({ inspectionId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload an image or PDF file.',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    const db = getDb();
    const storage = getFirebaseStorage();

    if (!db || !storage) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: 'Firebase not properly initialized.',
      });
      setIsUploading(false);
      return;
    }

    try {
      // 1. Generate unique asset ID
      const assetDocRef = doc(collection(db as Firestore, 'inspections', inspectionId, 'assets'));
      const assetId = assetDocRef.id;

      // 2. Upload to Firebase Storage
      const storagePath = `inspections/${inspectionId}/assets/${assetId}`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // 3. Create Firestore asset document
      await setDoc(assetDocRef, {
        inspectionId,
        assetId,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        imageUrl,
        storagePath,
        createdAt: serverTimestamp(),
        captureMode: 'upload',
        originalFileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        
        // Phase 3: Drafting Metadata
        isDrawingArtifact: isDrawing,
        domainHint: isDrawing ? 'architectural' : null,
      });

      setUploadStatus('success');
      toast({
        title: 'Upload Successful',
        description: 'Asset has been added to the inspection evidence queue.',
      });
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsDrawing(false);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'An error occurred during upload.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card/40 backdrop-blur-sm border-dashed border-primary/30">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">Add Inspection Asset</h3>
          <p className="text-xs text-muted-foreground">Upload images or PDFs for LARI-Vision logic</p>
          
          <div className="flex items-center space-x-2 mt-2">
            <input 
              type="checkbox" 
              id="isDrawing" 
              checked={isDrawing} 
              onChange={(e) => setIsDrawing(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 text-sky-500 focus:ring-sky-500"
            />
            <label htmlFor="isDrawing" className="text-xs font-medium text-sky-400 cursor-pointer select-none">
              Flag as Drawing / Blueprint (LARI_DRAFTING)
            </label>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            {uploadStatus === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500 animate-in fade-in zoom-in" />}
            {uploadStatus === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
            <Button 
                variant="outline" 
                size="sm" 
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="relative"
            >
                {isUploading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                </>
                ) : (
                <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Asset
                </>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="hidden"
                />
            </Button>
        </div>
      </div>
    </div>
  );
};

