# Pre-Mutation: Type Integrity Resolution

## Current IDE Reported Defect State
- `recognition-truth-state-badge.tsx` - "Property 'children' does not exist on type 'IntrinsicAttributes & BadgeProps'"
- `tsconfig.json` - missing jest, node, react, react-dom types
- `cloud/functions/tsconfig.json` - missing triple-beam, ws implicit types.

## Target Contract `src/components/ui/badge.tsx`
```typescript
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
```

## Root `tsconfig.json`
Has default typeRoots (none specified locally in last changeset):
```json
    "types": [
      "node",
      "react",
      "react-dom",
      "jest"
    ],
```

## Cloud/Functions `tsconfig.json`
Modified previously but language server reports cache mismatch:
```json
    "typeRoots": ["./node_modules/@types"],
    "types": [
      "node",
      "jest",
      "cors"
    ]
```

## Action Plan
1. Directly mutate `badge.tsx` and inject `children?: React.ReactNode` to force compliance.
2. Run `tsc --noEmit` locally in root and `cloud/functions` to observe terminal log outputs vs IDE diagnostic.
