// Read package.json files from repositories
import { readFileSync } from 'fs';
import { join } from 'path';

interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export function readPackageJson(repoPath: string): PackageJson | null {
  try {
    const raw = readFileSync(join(repoPath, 'package.json'), 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    const error = e as Error;
    console.error(`Could not read package.json in ${repoPath}: ${error.message}`);
    return null;
  }
}

interface ReadAllPackagesResult {
  packages: (PackageJson | null)[];
  repoNames: string[];
}

export function readAllPackages(repoPaths: string[]): ReadAllPackagesResult {
  const packages = repoPaths.map(readPackageJson);
  const repoNames = repoPaths.map(p => p.replace(/\/+$/, '').split('/').pop() || p);

  return { packages, repoNames };
}
