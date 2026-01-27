// CLI argument parser

export interface CliOptions {
  help?: boolean;
  error?: string;
  repoPaths?: string[];
  mode?: string;
  outPath?: string;
  includeSections?: string[];
  grouped?: boolean;
}

export function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2);

  if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
    return { help: true };
  }

  // Parse flags
  const modeFlag = args.find(a => a.startsWith('--mode='));
  const mode = modeFlag ? modeFlag.split('=')[1] : 'mismatches';

  const outFlag = args.find(a => a.startsWith('--out='));
  const outPath = outFlag ? outFlag.split('=')[1] : 'REPORT.md';

  const includeFlag = args.find(a => a.startsWith('--include='));
  const includeSections = (includeFlag
    ? includeFlag.split('=')[1]
    : 'dependencies,devDependencies'
  ).split(',').map(s => s.trim()).filter(Boolean);

  const grouped = !args.includes('--combined');

  // Get repo paths (non-flag arguments)
  const repoPaths = args.filter(a => !a.startsWith('--'));

  if (repoPaths.length < 2) {
    return { error: 'At least 2 repository paths are required' };
  }

  // Validate mode
  const validModes = ['all', 'mismatches', 'matches', 'shared'];
  if (!validModes.includes(mode)) {
    return { error: `Invalid mode: ${mode}. Must be one of: ${validModes.join(', ')}` };
  }

  return {
    repoPaths,
    mode,
    outPath,
    includeSections,
    grouped
  };
}

export function showHelp(): string {
  return `
dev-version-inspector - Compare dependency versions across multiple repositories

Usage:
  dev-version-inspector <repo1> <repo2> [repo3...] [options]

Arguments:
  <repo1> <repo2> ...     Paths to repositories to compare (minimum 2 required)

Options:
  --mode=<type>           Comparison mode (default: mismatches)
                          Possible values:
                            all        - Show all dependencies with match indicators (✅)
                            mismatches - Show only dependencies with different versions
                            matches    - Show only dependencies with matching versions
                            shared     - Show dependencies appearing in at least 2 repos with unified versions

  --out=<file>            Output file path (default: REPORT.md)
                          Example: --out=my-report.md

  --include=<sections>    Dependency sections to check (default: dependencies,devDependencies)
                          Possible values (comma-separated):
                            dependencies
                            devDependencies
                            peerDependencies
                            optionalDependencies
                          Example: --include=dependencies,peerDependencies

  --grouped               Group output by dependency section (default: enabled)
                          Creates separate tables for each section type

  --combined              Combine all sections into one table
                          Overrides --grouped behavior

  --help, -h              Show this help message

Examples:
  # Basic usage - show mismatches across 3 repos
  dev-version-inspector ../repo1 ../repo2 ../repo3

  # Show all dependencies with match indicators
  dev-version-inspector ../repo1 ../repo2 --mode=all

  # Show only matching dependencies
  dev-version-inspector ../repo1 ../repo2 --mode=matches

  # Show shared dependencies across repos with unified versions
  dev-version-inspector ../repo1 ../repo2 ../repo3 --mode=shared

  # Check specific sections and save to custom file
  dev-version-inspector ../repo1 ../repo2 --include=dependencies --out=deps.md

  # Combine all sections into one table
  dev-version-inspector ../repo1 ../repo2 --combined

  # Complex example with multiple options
  dev-version-inspector ../repo1 ../repo2 ../repo3 --mode=all --include=dependencies,devDependencies --out=full-report.md
`;
}
