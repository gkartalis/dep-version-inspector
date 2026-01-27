// Main orchestrator
import { writeFileSync } from 'fs';
import { readAllPackages } from './reader.js';
import { compareSection, compareCombined, compareShared, filterByMode } from './comparator.js';
import { formatGrouped, formatCombined } from './formatter.js';
import { CliOptions } from './cli.js';

export async function run(options: CliOptions): Promise<void> {
  const { repoPaths, mode, outPath, includeSections, grouped } = options;

  if (!repoPaths || !mode || !outPath || !includeSections) {
    throw new Error('Missing required options');
  }

  // Read all package.json files
  const { packages, repoNames } = readAllPackages(repoPaths);

  let output: string;

  if (mode === 'shared') {
    // Shared mode: show dependencies appearing in at least 2 repos
    const rows = compareShared(packages, repoNames);
    output = formatCombined(rows, repoNames, mode, ['dependencies', 'devDependencies', 'peerDependencies']);
  } else if (grouped) {
    // Grouped by section
    const sections = [];

    for (const section of includeSections) {
      let rows = compareSection(section, packages, repoNames);
      rows = filterByMode(rows, mode);

      sections.push({ section, rows });
    }

    output = formatGrouped(sections, repoNames, mode, includeSections);
  } else {
    // Combined
    let rows = compareCombined(includeSections, packages, repoNames);
    rows = filterByMode(rows, mode);

    output = formatCombined(rows, repoNames, mode, includeSections);
  }

  // Write output
  writeFileSync(outPath, output, 'utf8');

  const rowCount = output.split('\n').filter(line => line.startsWith('|') && !line.includes('---')).length - (grouped ? includeSections.length : 1);
  console.log(`✔ Wrote ${Math.max(0, rowCount)} dependencies to ${outPath}`);
}
