'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { ChevronRight, Folder, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const ProjectStructureVisual = dynamic(
  () => import('@/docs-components/ProjectStructureVisual'),
  { ssr: false }
);

interface TreeNodeProps {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNodeProps[];
}

const treeData: TreeNodeProps[] = [
  {
    name: 'app',
    type: 'folder',
    children: [
      {
        name: 'api',
        type: 'folder',
        children: [
          { name: 'auth', type: 'folder', children: [
            { name: 'route.ts', type: 'file' }
          ]},
          { name: 'products', type: 'folder', children: [
            { name: 'route.ts', type: 'file' }
          ]}
        ]
      },
      {
        name: 'dashboard',
        type: 'folder',
        children: [
          { name: 'page.tsx', type: 'file' },
          { name: 'layout.tsx', type: 'file' }
        ]
      },
      {
        name: 'docs',
        type: 'folder',
        children: [
          {
            name: 'structure',
            type: 'folder',
            children: [
              { name: 'page.tsx', type: 'file' }
            ]
          },
          {
            name: 'api',
            type: 'folder',
            children: [
              { name: 'page.tsx', type: 'file' }
            ]
          }
        ]
      },
      { name: 'page.tsx', type: 'file' }
    ]
  },
  {
    name: 'docs',
    type: 'folder',
    children: [
      { name: 'DASHBOARD_AND_API.md', type: 'file' },
      { name: 'PROJECT_STRUCTURE.md', type: 'file' }
    ]
  },
  {
    name: 'docs-components',
    type: 'folder',
    children: [
      { name: 'ProjectStructureVisual.tsx', type: 'file' }
    ]
  },
  {
    name: 'components',
    type: 'folder',
    children: [
      {
        name: 'ui',
        type: 'folder',
        children: [
          { name: 'button.tsx', type: 'file' },
          { name: 'input.tsx', type: 'file' }
        ]
      },
      { name: 'Navbar.tsx', type: 'file' },
      { name: 'Footer.tsx', type: 'file' }
    ]
  },
  {
    name: 'lib',
    type: 'folder',
    children: [
      { name: 'utils.ts', type: 'file' },
      { name: 'api.ts', type: 'file' }
    ]
  }
];

const TreeNode: React.FC<{ node: TreeNodeProps; level?: number }> = ({ 
  node, 
  level = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="select-none ">
      <motion.div
        onClick={handleToggle}
        className={`flex items-center py-1 px-2 rounded-md cursor-pointer ${
          isDark 
            ? 'hover:bg-gray-800 text-gray-200' 
            : 'hover:bg-gray-100 text-gray-800'
        }`}
        style={{ marginLeft: `${level * 20}px` }}
        whileHover={{ x: 4 }}
      >
        {node.type === 'folder' && (
          <ChevronRight
            className={`w-4 h-4 mr-1 transition-transform ${
              isOpen ? 'transform rotate-90' : ''
            }`}
          />
        )}
        {node.type === 'folder' ? (
          <Folder className="w-4 h-4 mr-2 text-yellow-500" />
        ) : (
          <File className="w-4 h-4 mr-2 text-blue-500" />
        )}
        <span className="text-sm">{node.name}</span>
      </motion.div>
      <AnimatePresence>
        {isOpen && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child, index) => (
              <TreeNode key={child.name + index} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProjectStructurePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-200 pt-16`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`rounded-lg p-6 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h1 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Project Structure
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Directory Tree
              </h2>
              <div className="overflow-auto max-h-[600px]">
                {treeData.map((node, index) => (
                  <TreeNode key={node.name + index} node={node} />
                ))}
              </div>
            </div>
            <div>
              <Suspense fallback={
                <div className={`p-8 text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Loading visualization...
                </div>
              }>
                <ProjectStructureVisual />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
