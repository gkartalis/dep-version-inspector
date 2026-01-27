// Version comparison logic

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export interface ComparisonRow {
  dep: string;
  versions: string[];
  matches: boolean;
}

type DependencySection = 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies';

// Extract version number, removing ^ and ~ prefixes
export function normalizeVersion(version: string): string {
  return version.replace(/^[\^~]/, '');
}

// Check if all versions match (ignoring ^ and ~)
export function versionsMatch(versions: string[]): boolean {
  const nonEmpty = versions.filter(v => v !== '');

  if (nonEmpty.length === 0) return false;

  const normalized = nonEmpty.map(normalizeVersion);
  const firstVersion = normalized[0];
  return normalized.every(v => v === firstVersion);
}

// Collect all dependencies from packages for specific sections
export function collectDependencies(packages: (PackageJson | null)[], includeSections: string[]): string[] {
  const allDeps = new Set<string>();

  packages.forEach(pkg => {
    if (!pkg) return;
    includeSections.forEach(section => {
      const deps = pkg[section] as Record<string, string> | undefined;
      if (deps) {
        Object.keys(deps).forEach(d => allDeps.add(d));
      }
    });
  });

  return [...allDeps].sort();
}

// Build comparison data for a specific section
export function compareSection(section: string, packages: (PackageJson | null)[], repoNames: string[]): ComparisonRow[] {
  const sectionDeps = new Set<string>();

  packages.forEach(pkg => {
    if (!pkg) return;
    const deps = pkg[section] as Record<string, string> | undefined;
    if (deps) {
      Object.keys(deps).forEach(d => sectionDeps.add(d));
    }
  });

  const rows = [...sectionDeps].sort().map(dep => {
    const versions = repoNames.map((name, i) => {
      const pkgSection = packages[i]?.[section] as Record<string, string> | undefined;
      return pkgSection?.[dep] || '';
    });

    const matches = versionsMatch(versions);

    return { dep, versions, matches };
  });

  return rows;
}

// Build comparison data for all sections combined
export function compareCombined(includeSections: string[], packages: (PackageJson | null)[], repoNames: string[]): ComparisonRow[] {
  const allDeps = collectDependencies(packages, includeSections);

  const rows = allDeps.map(dep => {
    const versions = repoNames.map((name, i) => {
      let found = '';
      if (packages[i]) {
        for (const section of includeSections) {
          const sectionDeps = packages[i]![section] as Record<string, string> | undefined;
          const v = sectionDeps?.[dep];
          if (v) {
            found = v;
            break;
          }
        }
      }
      return found;
    });

    const matches = versionsMatch(versions);

    return { dep, versions, matches };
  });

  return rows;
}

// Build comparison data for shared dependencies (appearing in at least 2 repos)
// Version priority: dependencies > devDependencies > peerDependencies
export function compareShared(packages: (PackageJson | null)[], repoNames: string[]): ComparisonRow[] {
  // Collect all unique dependencies across all sections
  const allDeps = new Set<string>();

  packages.forEach(pkg => {
    if (!pkg) return;
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(section => {
      const deps = pkg[section] as Record<string, string> | undefined;
      if (deps) {
        Object.keys(deps).forEach(d => allDeps.add(d));
      }
    });
  });

  const rows: ComparisonRow[] = [];

  allDeps.forEach(dep => {
    const versions: string[] = [];
    let repoCount = 0;

    // For each repo, find the version with priority: dependencies > devDependencies > peerDependencies
    repoNames.forEach((name, i) => {
      const pkg = packages[i];
      let version = '';

      if (pkg) {
        // Check in order of priority
        const dependencies = pkg['dependencies'] as Record<string, string> | undefined;
        const devDependencies = pkg['devDependencies'] as Record<string, string> | undefined;
        const peerDependencies = pkg['peerDependencies'] as Record<string, string> | undefined;

        if (dependencies?.[dep]) {
          version = dependencies[dep];
        } else if (devDependencies?.[dep]) {
          version = devDependencies[dep];
        } else if (peerDependencies?.[dep]) {
          version = peerDependencies[dep];
        }

        if (version) {
          repoCount++;
        }
      }

      versions.push(version);
    });

    // Only include if dependency appears in at least 2 repos
    if (repoCount >= 2) {
      const matches = versionsMatch(versions);
      rows.push({ dep, versions, matches });
    }
  });

  return rows.sort((a, b) => a.dep.localeCompare(b.dep));
}

// Filter rows based on mode
export function filterByMode(rows: ComparisonRow[], mode: string): ComparisonRow[] {
  if (mode === 'all') {
    return rows;
  } else if (mode === 'mismatches') {
    return rows.filter(r => !r.matches);
  } else if (mode === 'matches') {
    return rows.filter(r => r.matches);
  }
  return rows;
}
