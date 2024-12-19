'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, GitBranch } from 'lucide-react';

interface FolderNodeProps {
  name: string;
  description: string;
  children?: React.ReactNode;
  depth?: number;
  type?: 'folder' | 'file';
}

const FolderNode: React.FC<FolderNodeProps> = ({ name, description, children, depth = 0, type = 'folder' }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className="mb-2"
      style={{ marginLeft: `${depth * 24}px` }}
    >
      <div 
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
          ${isDark ? 
            'bg-gray-800 hover:bg-gray-700 text-gray-200' : 
            'bg-gray-50 hover:bg-gray-100 text-gray-800'
          } ${type === 'file' ? 'border-l-2 border-blue-500' : ''}`}
        onClick={() => type === 'folder' && setIsOpen(!isOpen)}
      >
        <span className="mr-3 flex items-center">
          {type === 'folder' ? (
            isOpen ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : null}
          {type === 'folder' ? (
            isOpen ? (
              <FolderOpen className="w-5 h-5 text-yellow-500 ml-1" />
            ) : (
              <Folder className="w-5 h-5 text-yellow-500 ml-1" />
            )
          ) : (
            <File className="w-5 h-5 text-blue-500" />
          )}
        </span>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
        </div>
      </div>
      {isOpen && children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`ml-6 mt-2 border-l-2 ${isDark ? 'border-gray-700' : 'border-gray-200'} pl-4`}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

interface TreeBranchProps {
  from: string;
  to: string;
  description: string;
}

const TreeBranch: React.FC<TreeBranchProps> = ({ from, to, description }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`relative py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
      <div className="flex items-center space-x-4">
        <GitBranch className="w-5 h-5" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{from}</span>
            <motion.div
              className={`h-0.5 flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
            <span className="font-semibold">{to}</span>
          </div>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};

interface ComponentBoxProps {
  name: string;
  type: 'ui' | 'logic' | 'data';
  description: string;
}

const ComponentBox: React.FC<ComponentBoxProps> = ({ name, type, description }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgColor = {
    ui: isDark ? 'bg-blue-900/50' : 'bg-blue-50',
    logic: isDark ? 'bg-green-900/50' : 'bg-green-50',
    data: isDark ? 'bg-purple-900/50' : 'bg-purple-50'
  }[type];

  const borderColor = {
    ui: isDark ? 'border-blue-700' : 'border-blue-200',
    logic: isDark ? 'border-green-700' : 'border-green-200',
    data: isDark ? 'border-purple-700' : 'border-purple-200'
  }[type];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl shadow-lg ${bgColor} ${borderColor} border-2 backdrop-blur-sm`}
    >
      <h3 className={`font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{name}</h3>
      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{description}</p>
    </motion.div>
  );
};

export const ProjectStructureVisual: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`p-8 max-w-5xl mx-auto pt-24 dark:text-white text-black ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white  dark:text-white'}`}>
      <motion.h1 
        className="text-4xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Project Structure Visualization
      </motion.h1>
      
      {/* Folder Structure */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Directory Tree</h2>
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} backdrop-blur-sm`}>
          <FolderNode 
            name="digital-ecomm" 
            description="Root Directory"
          >
            <FolderNode 
              name="app" 
              description="Next.js App Router Directory"
              depth={1}
            >
              <FolderNode 
                name="api" 
                description="API Routes"
                depth={2}
              >
                <FolderNode 
                  name="auth.ts" 
                  description="Authentication endpoints"
                  depth={3}
                  type="file"
                />
              </FolderNode>
              <FolderNode 
                name="dashboard" 
                description="Admin dashboard pages"
                depth={2}
              />
            </FolderNode>
            <FolderNode 
              name="components" 
              description="Reusable UI Components"
              depth={1}
            />
          </FolderNode>
        </div>
      </section>

      {/* Component Relationships */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Component Dependencies</h2>
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} backdrop-blur-sm`}>
          <TreeBranch 
            from="App Layout" 
            to="Components" 
            description="base structure"
          />
          <TreeBranch 
            from="Pages" 
            to="Components" 
            description="imports and renders"
          />
          <TreeBranch 
            from="Components" 
            to="API" 
            description="makes requests"
          />
          <TreeBranch 
            from="API" 
            to="Database" 
            description="queries data"
          />
          <TreeBranch 
            from="Docs" 
            to="Components" 
            description="visualizes structure"
          />
          <TreeBranch 
            from="Documentation" 
            to="API Reference" 
            description="describes endpoints"
          />
        </div>
      </section>

      {/* Documentation Structure */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Documentation Overview</h2>
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} backdrop-blur-sm grid grid-cols-1 md:grid-cols-3 gap-6`}>
          <ComponentBox 
            name="Project Structure"
            type="ui"
            description="Directory organization, component relationships, and architecture overview"
          />
          <ComponentBox 
            name="API Documentation"
            type="logic"
            description="API endpoints, request/response formats, and authentication"
          />
          <ComponentBox 
            name="Dashboard Guide"
            type="data"
            description="Dashboard features, form handling, and data management"
          />
        </div>
      </section>

      {/* Component Types */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Component Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentBox 
            name="UI Layer"
            type="ui"
            description="Reusable interface components and layouts"
          />
          <ComponentBox 
            name="Logic Layer"
            type="logic"
            description="Business logic and state management"
          />
          <ComponentBox 
            name="Data Layer"
            type="data"
            description="Data fetching and persistence"
          />
        </div>
      </section>

      {/* Data Flow Visualization */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Data Flow</h2>
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} backdrop-blur-sm`}>
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg w-64 text-center font-medium
                ${isDark ? 'bg-blue-900/50 text-blue-100' : 'bg-blue-50 text-blue-900'}`}
            >
              User Interface
            </motion.div>
            <motion.div
              animate={{ height: [0, 40] }}
              transition={{ duration: 0.5 }}
              className={`w-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg w-64 text-center font-medium
                ${isDark ? 'bg-green-900/50 text-green-100' : 'bg-green-50 text-green-900'}`}
            >
              API Layer
            </motion.div>
            <motion.div
              animate={{ height: [0, 40] }}
              transition={{ duration: 0.5 }}
              className={`w-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg w-64 text-center font-medium
                ${isDark ? 'bg-purple-900/50 text-purple-100' : 'bg-purple-50 text-purple-900'}`}
            >
              Database
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectStructureVisual;
