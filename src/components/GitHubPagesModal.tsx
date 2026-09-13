import React, { useState } from 'react';
import {
  X,
  Github,
  Check,
  Copy,
  Download,
  ExternalLink,
  Terminal,
  FileCode,
  Sparkles,
} from 'lucide-react';

export const GitHubPagesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [ghUser, setGhUser] = useState('bahaay3k');
  const [ghRepo, setGhRepo] = useState('personal-instagram');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);

  const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Application
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const bashCommands = `# 1. Initialize git in your local project folder (after exporting ZIP or from AI Studio)
git init
git add .
git commit -m "feat: my personal instagram portfolio & grid studio"

# 2. Link to your GitHub repo
git branch -M main
git remote add origin https://github.com/${ghUser}/${ghRepo}.git

# 3. Push to GitHub (Automated GitHub Actions will build & deploy!)
git push -u origin main
`;

  const handleCopyWorkflow = () => {
    navigator.clipboard?.writeText(workflowContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyBash = () => {
    navigator.clipboard?.writeText(bashCommands);
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  const handleDownloadWorkflowFile = () => {
    const blob = new Blob([workflowContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const liveUrl = `https://${ghUser}.github.io/${ghRepo}/`;

  return (
    <div
      id="github-pages-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="github-pages-modal-card"
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Deploy to Your GitHub Pages
              </h2>
              <p className="text-xs text-neutral-500">
                Full-featured, free hosting for your personal Instagram website
              </p>
            </div>
          </div>
          <button
            id="close-gh-modal-btn"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1.5 rounded-full"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Repo Config Inputs */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Customize with your GitHub Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">GitHub Username</label>
                <input
                  type="text"
                  value={ghUser}
                  onChange={e => setGhUser(e.target.value.trim())}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Repository Name</label>
                <input
                  type="text"
                  value={ghRepo}
                  onChange={e => setGhRepo(e.target.value.trim())}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <span>Your site will be live at:</span>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-pink-600 dark:text-pink-400 font-medium hover:underline flex items-center gap-1"
              >
                {liveUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Option A: 1-Click Export in AI Studio */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Method 1: Direct Export from AI Studio (Easiest)</span>
            </div>
            <ol className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2 list-decimal list-inside leading-relaxed">
              <li>In the top right menu of the AI Studio builder, click the <strong>Settings</strong> gear or <strong>Share</strong> button.</li>
              <li>Select <strong>Export to GitHub</strong>.</li>
              <li>Authorize and choose your GitHub repository: <code>{ghUser}/{ghRepo}</code>.</li>
              <li>Once exported, in GitHub go to <strong>Settings &rarr; Pages</strong> and enable <strong>GitHub Actions</strong>!</li>
            </ol>
          </div>

          {/* Option B: GitHub Actions automated workflow */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                <FileCode className="w-4 h-4 text-blue-500" />
                <span>GitHub Actions Workflow (<code>.github/workflows/deploy.yml</code>)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="copy-workflow-btn"
                  onClick={handleCopyWorkflow}
                  className="px-2.5 py-1 text-xs border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1 font-medium"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy YAML'}</span>
                </button>
                <button
                  id="download-workflow-btn"
                  onClick={handleDownloadWorkflowFile}
                  className="px-2.5 py-1 text-xs bg-neutral-900 dark:bg-white text-white dark:text-black rounded-md hover:opacity-90 flex items-center gap-1 font-medium shadow-xs"
                >
                  <Download className="w-3 h-3" />
                  <span>Download deploy.yml</span>
                </button>
              </div>
            </div>

            <pre className="bg-neutral-900 text-neutral-200 p-3.5 rounded-lg text-[11px] font-mono overflow-x-auto max-h-56 leading-normal">
              {workflowContent}
            </pre>
          </div>

          {/* Option C: Push via Command Line */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                <Terminal className="w-4 h-4 text-emerald-600" />
                <span>Pushing via Terminal</span>
              </div>
              <button
                id="copy-bash-btn"
                onClick={handleCopyBash}
                className="px-2.5 py-1 text-xs border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1 font-medium"
              >
                {copiedBash ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBash ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>

            <pre className="bg-neutral-900 text-emerald-400 p-3.5 rounded-lg text-[11px] font-mono overflow-x-auto leading-normal">
              {bashCommands}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end bg-neutral-50 dark:bg-neutral-900">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl text-xs font-semibold"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
