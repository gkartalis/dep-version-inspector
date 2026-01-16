// npm registry checker for latest versions

import { ComparisonRow } from './comparator.js';

interface NpmRegistryResponse {
  version: string;
  [key: string]: unknown;
}

export interface EnrichedComparisonRow extends ComparisonRow {
  latest: string | null;
}

export async function fetchLatestVersion(packageName: string): Promise<string | null> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json() as NpmRegistryResponse;
    return data.version;
  } catch (e) {
    const error = e as Error;
    console.error(`Could not fetch latest version for ${packageName}: ${error.message}`);
    return null;
  }
}

export async function enrichWithLatestVersions(rows: ComparisonRow[]): Promise<EnrichedComparisonRow[]> {
  const enrichedRows: EnrichedComparisonRow[] = [];

  for (const row of rows) {
    const latest = await fetchLatestVersion(row.dep);
    enrichedRows.push({ ...row, latest });
  }

  return enrichedRows;
}
