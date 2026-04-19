
import { MountedRepo } from './types';

export const mockRepos: MountedRepo[] = [
  {
    id: 'repo-overscite',
    name: 'OVERSCITE',
    rootPath: '/',
    sourceType: 'sdk_workspace',
    branch: 'main',
    headSha: 'a1b2c3d',
    readOnly: false,
    syncState: 'clean',
    trustState: 'trusted',
    policyProfile: 'default',
    isActive: true,
  },
  {
    id: 'repo-scingular-docs',
    name: 'scingular-docs',
    rootPath: '/docs',
    sourceType: 'remote',
    branch: 'develop',
    headSha: 'f9e8d7c',
    readOnly: true,
    syncState: 'syncing',
    trustState: 'restricted',
    isActive: false,
  },
];

export const mockFileTree: any[] = [
    {
        id: 'src',
        repoId: 'repo-overscite',
        name: 'src',
        path: '/src',
        relativePath: 'src',
        nodeType: 'directory',
        hasChildren: true,
        children: [
            {
                id: 'app',
                repoId: 'repo-overscite',
                name: 'app',
                path: '/src/app',
                relativePath: 'src/app',
                nodeType: 'directory',
                hasChildren: true,
                children: [
                    {
                        id: 'layout.tsx',
                        repoId: 'repo-overscite',
                        name: 'layout.tsx',
                        path: '/src/app/layout.tsx',
                        relativePath: 'src/app/layout.tsx',
                        nodeType: 'file',
                        extension: '.tsx',
                        size: 1234,
                        modifiedAt: new Date().toISOString()
                    },
                    {
                        id: 'page.tsx',
                        repoId: 'repo-overscite',
                        name: 'page.tsx',
                        path: '/src/app/page.tsx',
                        relativePath: 'src/app/page.tsx',
                        nodeType: 'file',
                        extension: '.tsx',
                        size: 5678,
                        modifiedAt: new Date().toISOString(),
                        isProtected: true
                    },
                ]
            },
            {
                id: 'components',
                repoId: 'repo-overscite',
                name: 'components',
                path: '/src/components',
                relativePath: 'src/components',
                nodeType: 'directory',
                hasChildren: false,
                children: [] 
            }
        ]
    },
    {
        id: 'package.json',
        repoId: 'repo-overscite',
        name: 'package.json',
        path: '/package.json',
        relativePath: 'package.json',
        nodeType: 'file',
        extension: '.json',
        size: 987,
        modifiedAt: new Date().toISOString(),
        isCanonical: true
    },
    {
        id: '.env',
        repoId: 'repo-overscite',
        name: '.env',
        path: '/.env',
        relativePath: '.env',
        nodeType: 'file',
        extension: '',
        size: 123,
        modifiedAt: new Date().toISOString(),
        isHidden: true,
        isSensitive: true
    },
];

export const processTreeForStore = (nodes: any[], repoId: string) => {
    const tree: Record<string, any> = {};
    const childrenMap: Record<string, string[]> = {};
    const rootNodeIds: string[] = [];

    const traverse = (node: any, parentId?: string) => {
        const { children, ...rest } = node;
        tree[node.id] = { ...rest, repoId };

        if (!parentId) {
            rootNodeIds.push(node.id);
        }
        
        if (children && children.length > 0) {
            childrenMap[node.id] = children.map((c: any) => c.id);
            children.forEach((child: any) => traverse(child, node.id));
        } else {
             if(node.nodeType === 'directory') {
                 childrenMap[node.id] = [];
             }
        }
    };
    nodes.forEach(node => traverse(node));
    return { tree, childrenMap, rootNodeIds };
};
