// Markdown formatter

import { ComparisonRow } from './comparator.js';

interface SectionData {
  section: string;
  rows: ComparisonRow[];
}

function buildHeader(repoNames: string[], mode: string, includeSections: string[]): string {
  const date = new Date().toISOString().split('T')[0];

  let header = `# Dependency Comparison Report\n\n`;
  header += `**Generated:** ${date}\n\n`;
  header += `**Repositories:** ${repoNames.join(', ')}\n\n`;
  header += `**Mode:** ${mode}\n\n`;
  header += `**Sections:** ${includeSections.join(', ')}\n\n`;
  header += `---\n\n`;

  return header;
}

function buildTable(rows: ComparisonRow[], repoNames: string[], mode: string): string {
  if (rows.length === 0) {
    return '';
  }

  const headers = ['Dependency', ...repoNames];
  if (mode === 'all') {
    headers.push('Match');
  }

  const divider = headers.map(() => '---');

  let table = `| ${headers.join(' | ')} |\n`;
  table += `| ${divider.join(' | ')} |\n`;

  rows.forEach(row => {
    const cells = [row.dep, ...row.versions];

    if (mode === 'all') {
      cells.push(row.matches ? '✅' : '');
    }

    table += `| ${cells.join(' | ')} |\n`;
  });

  return table;
}

export function formatGrouped(sections: SectionData[], repoNames: string[], mode: string, includeSections: string[]): string {
  const header = buildHeader(repoNames, mode, includeSections);

  let output = '';
  let totalRows = 0;

  sections.forEach(({ section, rows }) => {
    if (rows.length > 0) {
      output += `## ${section}\n\n`;
      output += buildTable(rows, repoNames, mode);
      output += '\n';
      totalRows += rows.length;
    }
  });

  if (output === '') {
    if (mode === 'mismatches') {
      return header + 'All dependencies match across repositories!\n';
    } else if (mode === 'matches') {
      return header + 'No matching dependencies found.\n';
    }
  }

  return header + output;
}

export function formatCombined(rows: ComparisonRow[], repoNames: string[], mode: string, includeSections: string[]): string {
  const header = buildHeader(repoNames, mode, includeSections);

  if (rows.length === 0) {
    if (mode === 'mismatches') {
      return header + 'All dependencies match across repositories!\n';
    } else if (mode === 'matches') {
      return header + 'No matching dependencies found.\n';
    }
    return header + 'No dependencies found.\n';
  }

  return header + buildTable(rows, repoNames, mode);
}
