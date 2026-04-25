'use client';
import { useOverhudStore } from '@/lib/stores/overhud-store';
import { FileText, Clock, HardDrive, Hash, Folder } from 'lucide-react';

export default function FileDetails() {
    const { selectedNodeId, tree } = useOverhudStore();
    const selectedNode = selectedNodeId ? tree[selectedNodeId] : null;

    if (!selectedNode) {
        return <div className="text-xs text-muted-foreground text-center p-4">Select a file to see details.</div>;
    }

    const details = [
        { icon: selectedNode.nodeType === 'file' ? FileText : Folder, label: 'Type', value: selectedNode.extension || 'Directory' },
        { icon: HardDrive, label: 'Size', value: selectedNode.size ? `${(selectedNode.size / 1024).toFixed(2)} KB` : '--' },
        { icon: Clock, label: 'Modified', value: selectedNode.modifiedAt ? new Date(selectedNode.modifiedAt).toLocaleDateString() : '--' },
        { icon: Hash, label: 'ID', value: <span className="font-mono truncate">{selectedNode.id}</span>, fullWidth: true },
    ];

    return (
        <div className="text-xs space-y-3">
            <h4 className="font-bold text-sm text-foreground truncate" title={selectedNode.name}>{selectedNode.name}</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {details.map(detail => (
                    <div key={detail.label} className={detail.fullWidth ? 'col-span-2' : ''}>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <detail.icon className="h-3 w-3 shrink-0" />
                            <span className="font-semibold">{detail.label}:</span>
                        </div>
                        <div className="pl-5 truncate">{detail.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
