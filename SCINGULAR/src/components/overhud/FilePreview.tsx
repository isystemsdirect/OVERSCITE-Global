'use client';
import { useOverhudStore } from '@/lib/stores/overhud-store';
import Image from 'next/image';
import { File, ImageIcon } from 'lucide-react';

export default function FilePreview() {
    const { selectedNodeId, tree } = useOverhudStore();
    const selectedNode = selectedNodeId ? tree[selectedNodeId] : null;

    const isImage = selectedNode?.nodeType === 'file' && ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(selectedNode.extension || '');

    return (
        <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-md p-2">
            {!selectedNode ? (
                <div className="text-center text-muted-foreground/50">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-xs font-semibold">File Preview</p>
                    <p className="text-[10px]">Select a file to preview it here</p>
                </div>
            ) : isImage ? (
                <div className="relative w-full h-full">
                    <Image
                        // Using picsum photos as a placeholder, seeded by the node id for consistency
                        src={`https://picsum.photos/seed/${selectedNode.id.replace(/[^a-zA-Z0-9]/g, '')}/400/300`}
                        alt={selectedNode.name}
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            ) : (
                <div className="text-center text-muted-foreground/50">
                    <File className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-xs font-semibold truncate max-w-48">{selectedNode.name}</p>
                    <p className="text-[10px]">No preview available for this file type</p>
                </div>
            )}
        </div>
    );
}
