# dev-version-inspector

Compare dependency versions across multiple repositories to identify mismatches and keep dependencies in sync.

## Quick Example

```bash
npx dev-version-inspector ../repo1 ../repo2 ../repo3
```

This generates a markdown report showing which dependencies have mismatched versions across your repositories.

## Installation

### Quick Start with npx (Recommended)

No installation required! Use npx to run it directly:

```bash
npx dev-version-inspector <repo1> <repo2> [repo3...] [options]
```

### Global Installation

```bash
npm install -g dev-version-inspector
dev-version-inspector <repo1> <repo2> [options]
```

### Project Installation

```bash
npm install --save-dev dev-version-inspector
npx dev-version-inspector <repo1> <repo2> [options]
```

## Usage

```bash
npx dev-version-inspector <repo1> <repo2> [repo3...] [options]
```

Or if installed globally:

```bash
dev-version-inspector <repo1> <repo2> [repo3...] [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--mode=<type>` | Comparison mode: `all`, `mismatches`, `matches` | `mismatches` |
| `--out=<file>` | Output file path | `REPORT.md` |
| `--include=<sections>` | Dependency sections to check (comma-separated) | `dependencies,devDependencies` |
| `--grouped` | Group output by dependency section | `true` (default) |
| `--combined` | Combine all sections into one table | `false` |
| `--help`, `-h` | Show help message | - |

### Available Dependency Sections

- `dependencies`
- `devDependencies`
- `peerDependencies`
- `optionalDependencies`

## Examples

### Basic Usage - Show Mismatches

Compare dependencies across three repositories and show only mismatches:

```bash
npx dev-version-inspector ../repo1 ../repo2 ../repo3
```

### Show All Dependencies

Include both matching and mismatching dependencies:

```bash
npx dev-version-inspector ../repo1 ../repo2 --mode=all
```

### Show Only Matches

See which dependencies are already aligned:

```bash
npx dev-version-inspector ../repo1 ../repo2 --mode=matches
```

### Combined Output

Show all dependencies in a single table instead of grouped by section:

```bash
npx dev-version-inspector ../repo1 ../repo2 --combined
```

### Custom Output and Sections

```bash
npx dev-version-inspector ../repo1 ../repo2 \
  --include=dependencies,peerDependencies \
  --out=deps-report.md
```

## Output Modes

### Mismatches Mode (Default)

Shows only dependencies that have different versions across repositories. Useful for identifying what needs to be aligned.

### All Mode

Shows all dependencies with a match indicator (✅) for those that are aligned. Provides complete overview.

### Matches Mode

Shows only dependencies that are already aligned across all repositories. Useful for validation.

## Development

### Project Structure

```
dev-version-inspector/
├── bin/
│   └── dev-version-inspector.js  # CLI entry point
├── src/
│   ├── cli.js                    # Argument parsing
│   ├── reader.js                 # Read package.json files
│   ├── comparator.js             # Version comparison logic
│   ├── registry.js               # npm registry checks
│   ├── formatter.js              # Markdown formatting
│   └── index.js                  # Main orchestrator
├── tests/                        # Test files
├── package.json
└── README.md
```

### Running Tests

```bash
npm test
```

## License

MIT
