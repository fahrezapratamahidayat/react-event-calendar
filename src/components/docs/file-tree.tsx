'use client';
import React, { useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type InputTreeItem =
  | string
  | {
      [key: string]: InputTreeItem[];
    };

type FileTreeItemDiff = 'none' | 'addition' | 'deletion';

interface FileTreeItem {
  title: string;
  icon?: string;
  children?: FileTreeItem[];
  highlighted?: boolean;
  diff?: FileTreeItemDiff;
}

interface FileTreeProps {
  title?: string;
  icon?: string;
  autoSlash?: boolean;
  showArrow?: boolean;
  showIcon?: boolean;
  tree: InputTreeItem[];
}

interface FileTreeRootProps {
  tree: FileTreeItem[];
  showArrow?: boolean;
  showIcon?: boolean;
  level: number;
}

const iconMap = new Map([
  ['js', 'lucide:file-code'],
  ['ts', 'lucide:file-code'],
  ['jsx', 'lucide:file-code'],
  ['tsx', 'lucide:file-code'],
  ['json', 'lucide:file-json'],
  ['md', 'lucide:file-text'],
  ['txt', 'lucide:file-text'],
  ['css', 'lucide:file-code'],
  ['scss', 'lucide:file-code'],
  ['html', 'lucide:file-code'],
  ['vue', 'lucide:file-code'],
  ['py', 'lucide:file-code'],
  ['java', 'lucide:file-code'],
  ['cpp', 'lucide:file-code'],
  ['c', 'lucide:file-code'],
  ['php', 'lucide:file-code'],
  ['rb', 'lucide:file-code'],
  ['go', 'lucide:file-code'],
  ['rs', 'lucide:file-code'],
  ['xml', 'lucide:file-code'],
  ['yml', 'lucide:file-code'],
  ['yaml', 'lucide:file-code'],
  ['toml', 'lucide:file-code'],
  ['env', 'lucide:file-code'],
  ['gitignore', 'lucide:file-code'],
  ['dockerfile', 'lucide:file-code'],
  ['readme', 'lucide:file-text'],
  ['license', 'lucide:file-text'],
  ['package.json', 'lucide:file-json'],
  ['tsconfig.json', 'lucide:file-json'],
  ['next.config.js', 'lucide:file-code'],
  ['tailwind.config.js', 'lucide:file-code'],
]);

const FileTreeRoot: React.FC<FileTreeRootProps> = ({
  tree,
  showArrow = false,
  showIcon = true,
  level,
}) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedItems(newExpanded);
  };

  const getIcon = (
    filename: string,
    type: 'folder' | 'file',
    isExpanded?: boolean,
  ) => {
    if (filename === '...') return null;

    if (type === 'folder') {
      return isExpanded ? (
        <FolderOpen className="h-4 w-4" />
      ) : (
        <Folder className="h-4 w-4" />
      );
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    if (iconMap.has(ext || '')) {
      return <File className="h-4 w-4" />;
    }

    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-0.5">
      {tree.map((item, index) => {
        const itemPath = `${level}-${index}-${item.title}`;
        const isExpanded = expandedItems.has(itemPath);
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div key={itemPath}>
            <div
              className={cn(
                'hover:bg-accent/50 flex items-center rounded-sm px-2 py-1 transition-colors',
                item.highlighted && 'bg-accent',
                item.diff === 'addition' && 'bg-green-50 text-green-700',
                item.diff === 'deletion' &&
                  'bg-red-50 text-red-700 line-through',
              )}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
              {showArrow && hasChildren && (
                <button
                  onClick={() => toggleExpand(itemPath)}
                  className="hover:bg-accent mr-1 flex h-4 w-4 items-center justify-center rounded-sm"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              )}
              {!showArrow && hasChildren && <div className="mr-1 w-4" />}
              {showIcon && (
                <div className="mr-2 flex items-center">
                  {getIcon(
                    item.title,
                    hasChildren ? 'folder' : 'file',
                    isExpanded,
                  )}
                </div>
              )}
              <span className="font-mono text-sm select-none">
                {item.title}
              </span>
            </div>
            {hasChildren && (!showArrow || isExpanded) && (
              <FileTreeRoot
                tree={item.children!}
                showArrow={showArrow}
                showIcon={showIcon}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const FileTree: React.FC<FileTreeProps> = ({
  title,
  icon,
  autoSlash = true,
  showArrow = false,
  showIcon = true,
  tree,
}) => {
  const getIcon = (filename: string, type: 'folder' | 'file') => {
    if (filename === '...') return undefined;
    if (filename.endsWith('/')) return 'lucide:folder';

    const ext = filename.split('.').pop()?.toLowerCase();
    return (
      iconMap.get(ext || '') ||
      iconMap.get(filename.toLowerCase()) ||
      (type === 'file' ? 'lucide:file' : 'lucide:folder')
    );
  };

  const getItem = (
    key: string,
    type: 'folder' | 'file',
    children?: InputTreeItem[],
  ): FileTreeItem => {
    let title = key;
    let highlighted = false;

    if (title.startsWith('^') && title.endsWith('^')) {
      title = title.substring(1, title.length - 1);
      highlighted = true;
    }

    let diff: FileTreeItemDiff = 'none';
    if (title.startsWith('+')) {
      title = title.substring(1);
      diff = 'addition';
    } else if (title.startsWith('-')) {
      title = title.substring(1);
      diff = 'deletion';
    }

    if (type === 'file') {
      return {
        title,
        icon: getIcon(title, 'file'),
        highlighted,
        diff,
      };
    } else {
      return {
        title: `${title}${autoSlash ? '/' : ''}`,
        icon: getIcon(title, 'folder'),
        children: children && getTree(children),
        highlighted,
        diff,
      };
    }
  };

  const getTree = (tree: InputTreeItem[]): FileTreeItem[] => {
    const res: FileTreeItem[] = [];
    for (const item of tree) {
      if (typeof item === 'string') {
        res.push(getItem(item, 'file'));
      } else if (typeof item === 'object') {
        for (const key of Object.keys(item)) {
          res.push(getItem(key, 'folder', item[key]));
        }
      }
    }
    return res;
  };

  const parsedTree = useMemo(() => {
    return getTree(tree);
  }, [tree, autoSlash]);

  return (
    <div className="relative overflow-hidden rounded-md border [&:not(:first-child)]:mt-5 [&:not(:last-child)]:mb-5">
      {title && (
        <div className="flex items-center border border-b p-3 font-mono text-sm">
          {icon && <File className="mr-1.5 h-4 w-4" />}
          <span>{title}</span>
        </div>
      )}
      <div className="bg-muted/30 w-auto p-2">
        <FileTreeRoot
          tree={parsedTree}
          showArrow={showArrow}
          showIcon={showIcon}
          level={0}
        />
      </div>
    </div>
  );
};

export default FileTree;
