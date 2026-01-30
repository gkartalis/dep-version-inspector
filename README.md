# dev-version-inspector

Compare package.json dependency versions across multiple repositories to identify mismatches and keep dependencies in sync.

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
| `--mode=<type>` | Comparison mode: `all`, `mismatches`, `matches`, `shared` | `mismatches` |
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

### Show Shared Dependencies

Show all dependencies that appear in at least 2 repositories with unified versions:

```bash
npx dev-version-inspector ../repo1 ../repo2 ../repo3 --mode=shared
```

This mode automatically combines `dependencies`, `devDependencies`, and `peerDependencies` sections, prioritizing versions in this order: dependencies > devDependencies > peerDependencies.

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

### Shared Mode

Shows dependencies that appear in at least 2 repositories, with a unified view across all dependency sections. This mode:
- Automatically combines `dependencies`, `devDependencies`, and `peerDependencies`
- Filters to show only dependencies present in 2 or more repos
- Uses version priority: `dependencies` > `devDependencies` > `peerDependencies` when a dependency exists in multiple sections of the same repo
- Shows all repos in the table (with empty cells for repos that don't have the dependency)
- Eliminates duplicate entries

Perfect for identifying common dependencies across multiple projects and spotting version inconsistencies.

## Development

### Project Structure

```
dev-version-inspector/
├── bin/
│   └── dev-version-inspector.js  # CLI entry point
├── src/                          # TypeScript source files
│   ├── cli.ts                    # Argument parsing
│   ├── reader.ts                 # Read package.json files
│   ├── comparator.ts             # Version comparison logic
│   ├── registry.ts               # npm registry checks
│   ├── formatter.ts              # Markdown formatting
│   └── index.ts                  # Main orchestrator
├── dist/                         # Compiled JavaScript (generated)
│   ├── *.js                      # Compiled code
│   ├── *.d.ts                    # Type definitions
│   └── *.js.map                  # Source maps
├── tests/                        # Test files
├── tsconfig.json                 # TypeScript configuration
├── package.json
└── README.md
```

### Setup for Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build TypeScript:
   ```bash
   npm run build
   ```

### Running Tests

```bash
npm test
```

### Building

The project uses TypeScript. Compile the source code:

```bash
npm run build
```

This compiles `src/*.ts` files to `dist/*.js` with type definitions.

## Publishing to npm

For maintainers publishing updates:

1. Update version in `package.json`:
   ```bash
   npm version patch  # or minor, or major
   ```

2. Build and publish:
   ```bash
   npm publish
   ```

   The `prepublishOnly` script automatically runs `npm run build` before publishing.

3. Push tags to GitHub:
   ```bash
   git push && git push --tags
   ```

## License

MIT
