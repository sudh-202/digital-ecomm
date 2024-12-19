import React from 'react';
import { motion } from 'framer-motion';

interface FolderNodeProps {
  name: string;
  description: string;
  children?: React.ReactNode;
  depth?: number;
}

const FolderNode: React.FC<FolderNodeProps> = ({ name, description, children, depth = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className="mb-2"
      style={{ marginLeft: `${depth * 20}px` }}
    >
      <div 
        className="flex items-center p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">
          {isOpen ? "📂" : "📁"}
        </span>
        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {isOpen && children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-4 mt-2 border-l-2 border-gray-300 pl-4"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

interface ConnectionLineProps {
  from: string;
  to: string;
  description: string;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ from, to, description }) => {
  return (
    <div className="flex items-center my-2 text-gray-600">
      <div className="font-semibold">{from}</div>
      <div className="mx-2 flex-1 border-t-2 border-dashed relative">
        <span className="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white px-2 text-sm">
          {description}
        </span>
      </div>
      <div className="font-semibold">{to}</div>
    </div>
  );
};

interface ComponentBoxProps {
  name: string;
  type: 'ui' | 'logic' | 'data';
  description: string;
}

const ComponentBox: React.FC<ComponentBoxProps> = ({ name, type, description }) => {
  const bgColor = {
    ui: 'bg-blue-100',
    logic: 'bg-green-100',
    data: 'bg-purple-100'
  }[type];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg shadow-md ${bgColor}`}
    >
      <h3 className="font-bold mb-2">{name}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </motion.div>
  );
};

export const ProjectStructureVisual: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Project Structure Visualization</h1>
      
      {/* Folder Structure */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Folder Structure</h2>
        <FolderNode 
          name="app" 
          description="Next.js App Router Directory"
        >
          <FolderNode 
            name="api" 
            description="API Routes"
            depth={1}
          >
            <FolderNode 
              name="auth" 
              description="Authentication endpoints"
              depth={2}
            />
            <FolderNode 
              name="products" 
              description="Product management endpoints"
              depth={2}
            />
          </FolderNode>
          <FolderNode 
            name="dashboard" 
            description="Admin dashboard pages"
            depth={1}
          />
        </FolderNode>

        <FolderNode 
          name="components" 
          description="Reusable UI Components"
        >
          <FolderNode 
            name="ui" 
            description="Base UI components"
            depth={1}
          />
          <FolderNode 
            name="forms" 
            description="Form components"
            depth={1}
          />
        </FolderNode>
      </section>

      {/* Component Relationships */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Component Relationships</h2>
        <div className="space-y-4">
          <ConnectionLine 
            from="Pages" 
            to="Components" 
            description="imports and renders"
          />
          <ConnectionLine 
            from="Components" 
            to="API" 
            description="makes requests"
          />
          <ConnectionLine 
            from="API" 
            to="Database" 
            description="queries data"
          />
        </div>
      </section>

      {/* Component Types */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Component Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ComponentBox 
            name="UI Components"
            type="ui"
            description="Reusable interface elements like buttons, inputs, and cards"
          />
          <ComponentBox 
            name="Logic Components"
            type="logic"
            description="Components handling business logic and state management"
          />
          <ComponentBox 
            name="Data Components"
            type="data"
            description="Components responsible for data fetching and manipulation"
          />
        </div>
      </section>

      {/* Data Flow Visualization */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Flow</h2>
        <div className="relative p-4 border-2 border-gray-200 rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-blue-100 rounded-lg w-48 text-center"
            >
              User Interface
            </motion.div>
            <motion.div
              animate={{ rotate: 90 }}
              className="h-8 w-0.5 bg-gray-400"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-green-100 rounded-lg w-48 text-center"
            >
              API Layer
            </motion.div>
            <motion.div
              animate={{ rotate: 90 }}
              className="h-8 w-0.5 bg-gray-400"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-purple-100 rounded-lg w-48 text-center"
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
