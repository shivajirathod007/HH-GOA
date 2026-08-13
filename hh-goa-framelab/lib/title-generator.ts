// HH Goa FrameLab — Builder Title Generator
// Deterministic local generator — no LLM API calls

import type { BuilderTitle } from '@/types';

interface TitlePool {
  keywords: string[];
  titles: BuilderTitle[];
}

const TITLE_POOLS: TitlePool[] = [
  {
    keywords: ['security', 'infosec', 'cybersecurity', 'pentest', 'bug bounty', 'soc', 'appsec'],
    titles: [
      { title: 'Security Builder', emoji: '🛡️' },
      { title: 'Security Researcher', emoji: '🔍' },
      { title: 'Protocol Guardian', emoji: '🔐' },
      { title: 'Threat Hunter', emoji: '🎯' },
      { title: 'Security Architect', emoji: '🏗️' },
    ],
  },
  {
    keywords: ['ai', 'ml', 'machine learning', 'deep learning', 'nlp', 'llm', 'genai', 'generative ai', 'data science', 'computer vision'],
    titles: [
      { title: 'AI Builder', emoji: '🤖' },
      { title: 'AI Tinkerer', emoji: '🧪' },
      { title: 'Machine Learning Builder', emoji: '🧠' },
      { title: 'Neural Architect', emoji: '⚡' },
      { title: 'Model Craftsman', emoji: '🔬' },
    ],
  },
  {
    keywords: ['backend', 'server', 'api', 'node', 'python', 'go', 'rust', 'java', 'django', 'flask', 'express', 'fastapi'],
    titles: [
      { title: 'Systems Builder', emoji: '⚙️' },
      { title: 'Backend Architect', emoji: '🏛️' },
      { title: 'API Craftsman', emoji: '🔧' },
      { title: 'Server Engineer', emoji: '🖥️' },
      { title: 'Systems Architect', emoji: '📐' },
    ],
  },
  {
    keywords: ['frontend', 'react', 'vue', 'angular', 'svelte', 'next', 'css', 'ui', 'ux', 'design', 'tailwind', 'web'],
    titles: [
      { title: 'Interface Builder', emoji: '🎨' },
      { title: 'Frontend Architect', emoji: '✨' },
      { title: 'UI Engineer', emoji: '🖌️' },
      { title: 'Experience Builder', emoji: '💎' },
      { title: 'Pixel Craftsman', emoji: '🎯' },
    ],
  },
  {
    keywords: ['fullstack', 'full stack', 'full-stack', 'mern', 'mean', 'lamp', 'product'],
    titles: [
      { title: 'Full-Stack Builder', emoji: '🚀' },
      { title: 'Product Builder', emoji: '📦' },
      { title: 'Stack Architect', emoji: '🏗️' },
      { title: 'Product Engineer', emoji: '⚡' },
      { title: 'Full-Stack Architect', emoji: '🌐' },
    ],
  },
  {
    keywords: ['cloud', 'aws', 'gcp', 'azure', 'devops', 'infrastructure', 'kubernetes', 'docker', 'terraform', 'sre', 'platform'],
    titles: [
      { title: 'Cloud Builder', emoji: '☁️' },
      { title: 'Infrastructure Architect', emoji: '🏔️' },
      { title: 'Platform Engineer', emoji: '🔩' },
      { title: 'DevOps Builder', emoji: '🔄' },
      { title: 'Cloud Architect', emoji: '🌩️' },
    ],
  },
  {
    keywords: ['mobile', 'ios', 'android', 'flutter', 'react native', 'swift', 'kotlin'],
    titles: [
      { title: 'Mobile Builder', emoji: '📱' },
      { title: 'App Architect', emoji: '📲' },
      { title: 'Mobile Engineer', emoji: '🛠️' },
      { title: 'Native Builder', emoji: '⚡' },
    ],
  },
  {
    keywords: ['blockchain', 'web3', 'crypto', 'solidity', 'smart contract', 'defi', 'ethereum', 'solana'],
    titles: [
      { title: 'Protocol Hacker', emoji: '⛓️' },
      { title: 'Web3 Builder', emoji: '🌐' },
      { title: 'Smart Contract Architect', emoji: '📜' },
      { title: 'Chain Builder', emoji: '🔗' },
      { title: 'Protocol Builder', emoji: '🏗️' },
    ],
  },
  {
    keywords: ['data', 'analytics', 'database', 'sql', 'postgresql', 'mongodb', 'etl', 'data engineer'],
    titles: [
      { title: 'Data Builder', emoji: '📊' },
      { title: 'Data Architect', emoji: '🗄️' },
      { title: 'Pipeline Builder', emoji: '🔀' },
      { title: 'Data Engineer', emoji: '⚙️' },
    ],
  },
  {
    keywords: ['game', 'unity', 'unreal', 'gamedev'],
    titles: [
      { title: 'Game Builder', emoji: '🎮' },
      { title: 'Game Architect', emoji: '🕹️' },
      { title: 'World Builder', emoji: '🌍' },
    ],
  },
  {
    keywords: ['embedded', 'iot', 'hardware', 'arduino', 'raspberry', 'firmware'],
    titles: [
      { title: 'Hardware Hacker', emoji: '🔌' },
      { title: 'Embedded Builder', emoji: '🛠️' },
      { title: 'IoT Architect', emoji: '📡' },
    ],
  },
];

const FALLBACK_TITLES: BuilderTitle[] = [
  { title: 'Builder', emoji: '🔨' },
  { title: 'Code Architect', emoji: '🏗️' },
  { title: 'Digital Builder', emoji: '💻' },
  { title: 'Tech Builder', emoji: '⚡' },
  { title: 'Innovation Builder', emoji: '🚀' },
  { title: 'Hackathon Builder', emoji: '🔥' },
  { title: 'Open Source Builder', emoji: '🌐' },
  { title: 'Creative Technologist', emoji: '🎨' },
];

function findMatchingPool(stack: string): BuilderTitle[] {
  const lower = stack.toLowerCase().trim();
  
  for (const pool of TITLE_POOLS) {
    for (const keyword of pool.keywords) {
      if (lower.includes(keyword)) {
        return pool.titles;
      }
    }
  }
  
  return FALLBACK_TITLES;
}

export function generateBuilderTitle(stack: string): BuilderTitle {
  const pool = findMatchingPool(stack);
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export function generateBuilderTitleDeterministic(stack: string, seed: number): BuilderTitle {
  const pool = findMatchingPool(stack);
  const index = Math.abs(seed) % pool.length;
  return pool[index];
}
