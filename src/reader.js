// Read package.json files from repositories
import { readFileSync } from 'fs';
import { join } from 'path';

export function readPackageJson(repoPath) {
  try {
    const raw = readFileSync(join(repoPath, 'package.json'), 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Could not read package.json in ${repoPath}: ${e.message}`);
    return null;
  }
}

export function readAllPackages(repoPaths) {
  const packages = repoPaths.map(readPackageJson);
  const repoNames = repoPaths.map(p => p.replace(/\/+$/, '').split('/').pop() || p);

  return { packages, repoNames };
}
