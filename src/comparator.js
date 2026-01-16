// Version comparison logic

// Extract version number, removing ^ and ~ prefixes
export function normalizeVersion(version) {
  return version.replace(/^[\^~]/, '');
}

// Check if all versions match (ignoring ^ and ~)
export function versionsMatch(versions) {
  const nonEmpty = versions.filter(v => v !== '');

  if (nonEmpty.length === 0) return false;

  const normalized = nonEmpty.map(normalizeVersion);
  const firstVersion = normalized[0];
  return normalized.every(v => v === firstVersion);
}

// Collect all dependencies from packages for specific sections
export function collectDependencies(packages, includeSections) {
  const allDeps = new Set();

  packages.forEach(pkg => {
    if (!pkg) return;
    includeSections.forEach(section => {
      const deps = pkg[section] || {};
      Object.keys(deps).forEach(d => allDeps.add(d));
    });
  });

  return [...allDeps].sort();
}

// Build comparison data for a specific section
export function compareSection(section, packages, repoNames) {
  const sectionDeps = new Set();

  packages.forEach(pkg => {
    if (!pkg) return;
    const deps = pkg[section] || {};
    Object.keys(deps).forEach(d => sectionDeps.add(d));
  });

  const rows = [...sectionDeps].sort().map(dep => {
    const versions = repoNames.map((name, i) => {
      return packages[i]?.[section]?.[dep] || '';
    });

    const matches = versionsMatch(versions);

    return { dep, versions, matches };
  });

  return rows;
}

// Build comparison data for all sections combined
export function compareCombined(includeSections, packages, repoNames) {
  const allDeps = collectDependencies(packages, includeSections);

  const rows = allDeps.map(dep => {
    const versions = repoNames.map((name, i) => {
      let found = '';
      if (packages[i]) {
        for (const section of includeSections) {
          const v = packages[i][section]?.[dep];
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

// Filter rows based on mode
export function filterByMode(rows, mode) {
  if (mode === 'all') {
    return rows;
  } else if (mode === 'mismatches') {
    return rows.filter(r => !r.matches);
  } else if (mode === 'matches') {
    return rows.filter(r => r.matches);
  }
  return rows;
}
