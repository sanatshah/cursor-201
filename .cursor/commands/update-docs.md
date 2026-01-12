---
description: Update documentation in the docs folder by analyzing only the changes in the current branch and updating relevant documentation
globs: **/*
---

# Update Documentation (Branch Changes Only)

Analyze only the changes in the current branch and update documentation files in the `docs/` folder to reflect those specific changes.

## Overview

This command focuses on **incremental documentation updates** by:
1. Detecting what files changed in the current branch (compared to base branch)
2. Analyzing only those changed files
3. Updating only the relevant documentation sections
4. Preserving documentation for unchanged code

**Key Principle**: Only update documentation for code that changed in this branch. Do not modify documentation for unchanged code.

## Process

### 1. Identify Branch and Changed Files

First, determine what has changed in the current branch:

#### 1.1 Get Current Branch Information

Use the `run_terminal_cmd` tool to get the current branch:

```bash
# Get current branch name
git branch --show-current

# Or if using git rev-parse
git rev-parse --abbrev-ref HEAD
```

#### 1.2 Determine Base Branch

Identify the base branch for comparison (typically `main`, `master`, or `develop`):

**Strategy 1: Check for common base branches**
```bash
# Check if main exists
git show-ref --verify --quiet refs/heads/main && echo "main" || echo "master"

# Or check remote branches
git branch -r | grep -E 'origin/(main|master|develop)' | head -1 | sed 's|origin/||' | sed 's| ||'
```

**Strategy 2: Use merge-base**
```bash
# Find common ancestor with main
git merge-base HEAD origin/main 2>/dev/null && echo "main" || \
git merge-base HEAD origin/master 2>/dev/null && echo "master" || \
echo "main"  # default fallback
```

**Default**: If automatic detection fails, default to `main` (or `master` if `main` doesn't exist).

#### 1.3 Get Changed Files

Get the list of files changed in the current branch compared to the base branch:

**Basic command:**
```bash
# Get all changed files (added, modified, deleted)
BASE_BRANCH="main"  # or detected base branch
git diff --name-status origin/${BASE_BRANCH}...HEAD

# Or if base branch is local
git diff --name-status ${BASE_BRANCH}...HEAD
```

**Get only modified and added files (exclude deleted):**
```bash
git diff --name-only --diff-filter=ACMR origin/${BASE_BRANCH}...HEAD
```

**Get files with change statistics:**
```bash
git diff --stat origin/${BASE_BRANCH}...HEAD
```

#### 1.4 Filter Relevant Files

Filter out files that don't need documentation updates:
- **Exclude**: `node_modules/`, `.git/`, build artifacts, test files (unless they introduce new patterns), documentation files themselves
- **Include**: Source code files, configuration files, new components, new tools, API changes

**Filter command:**
```bash
# Get only source files that changed (exclude tests and docs)
git diff --name-only --diff-filter=ACMR origin/${BASE_BRANCH}...HEAD | \
  grep -E '\.(js|jsx|ts|tsx|py|java|go|rs|json|yaml|yml)$' | \
  grep -v -E '(test|spec|__tests__|\.test\.|\.spec\.|docs/)'
```

**Store changed files for analysis:**
Use the output to create a list of files to analyze. Only these files should be used for documentation updates.

### 2. Analyze Changed Files

For each changed file, analyze what changed:

#### 2.1 Get File Diffs

```bash
# Get detailed diff for a specific file
git diff origin/main...HEAD -- path/to/file

# Get diff statistics
git diff --stat origin/main...HEAD
```

#### 2.2 Categorize Changes

Categorize changes to determine what documentation needs updating:

- **New Components** → Update `docs/Architecture/Components.md`
- **New Tools** → Update `docs/Architecture/Tools.md`
- **API Changes** → Update API documentation
- **Configuration Changes** → Update configuration docs
- **Data Flow Changes** → Update `docs/Architecture/DataFlow.md`
- **New Features** → Update feature documentation
- **Refactoring** → Update relevant architecture docs

#### 2.3 Identify Affected Documentation

For each changed file, identify which documentation files are affected:

- Component files → `docs/Architecture/Components.md`
- Tool files → `docs/Architecture/Tools.md`
- Hook files → `docs/Architecture/DataFlow.md` or Components.md
- Configuration files → Configuration documentation
- New features → Feature documentation or `docs/Welcome.md`

### 3. Explore the Documentation Structure

Examine the existing documentation structure to understand what needs updating:

```bash
find docs -type f -name "*.md" | sort
```

Or use the list_dir tool to explore:
- `docs/` - Root documentation folder
- `docs/Architecture/` - Architecture documentation
- Any other subdirectories

### 4. Analyze Changed Code

For each changed file, use targeted analysis:

#### 4.1 Read Changed Files

Read the changed files to understand:
- What was added
- What was modified
- What was removed
- New patterns or architectures introduced

#### 4.2 Use Focused Codebase Search

Use codebase_search to understand only the changed areas:
- New component relationships (only for changed components)
- New tool implementations (only for changed tools)
- Modified data flow (only for changed hooks/components)
- New API endpoints (only for changed API files)
- New configuration options (only for changed config files)

#### 4.3 Identify Impact Scope

Determine the scope of documentation updates needed:
- **Local changes** - Only update specific sections
- **Architectural changes** - May require broader updates
- **New features** - May require new documentation sections

### 5. Identify Documentation Gaps (Scoped to Changes)

Compare the changed code with existing documentation to identify:
- **Missing documentation** - New features/components not documented
- **Outdated documentation** - Docs that don't match changed implementation
- **Incomplete documentation** - Changed features missing important details
- **Affected sections** - Which specific sections need updates

### 6. Update Existing Documentation (Targeted Updates)

For each affected documentation file, update **only the sections related to changed code**:

#### Architecture Documentation (`docs/Architecture/`)

Update only relevant sections:
- **Component sections** - Only for changed/new components
- **Tool sections** - Only for changed/new tools
- **Data flow sections** - Only for changed hooks/data flow
- **File structure** - Only if structure changed (new directories/files)
- **Design patterns** - Only if new patterns were introduced
- **API endpoints** - Only for changed/new endpoints
- **Configuration** - Only for changed config options

#### General Documentation (`docs/`)

Update only if changes affect:
- **Overview** - Only if major features were added/removed
- **Getting started** - Only if setup process changed
- **Features** - Only if new features were added
- **Usage** - Only if usage patterns changed

**Important**: Do NOT update sections that are unrelated to the branch changes.

### 7. Create Missing Documentation (Only for New Changes)

If documentation is missing for **new** aspects introduced in this branch:

- **New architecture docs** - Only for new architectural patterns introduced
- **Feature documentation** - Only for new features added in this branch
- **API documentation** - Only for new endpoints added in this branch
- **Configuration docs** - Only for new configuration options added

**Do NOT create documentation for existing features** - only document what's new in this branch.

### 8. Documentation Update Guidelines (Change-Focused)

When updating documentation, focus only on what changed:

#### File Structure Updates

- Update directory trees **only if new files/directories were added**
- Include **only new or changed files** in the structure
- Show relationships **only for changed components**
- Update file paths **only if paths changed**

#### Code Examples

- Use actual code from **changed files only**
- Show **before/after** if documenting modifications
- Show **new code** if documenting additions
- Include relevant imports and dependencies **for changed code**

#### Architecture Diagrams

- Update diagrams **only for changed areas**
- Use ASCII art or clear text descriptions **for new patterns**
- Show data flow **only for changed data flow**
- Include **only changed/new components** in diagrams

#### Component Descriptions

- Update **only changed components**
- Describe **new/changed** purpose and behavior
- Include **new/changed** props/parameters
- Show **new/changed** usage patterns
- Document **new/changed** dependencies

#### Tool/Feature Documentation

- List **only new or changed tools/features**
- Describe **only changed implementations**
- Show **new/changed** usage
- Document **only new/changed** configuration options

### 9. Documentation Format

Follow these formatting guidelines:

#### Markdown Structure

```markdown
# Main Title

## Section Title

### Subsection Title

**Bold** for emphasis
- Bullet points for lists
- Code blocks for examples

#### Code Blocks

Use code references for existing code:
```startLine:endLine:filepath
// actual code from codebase
```

Use markdown code blocks for examples:
```javascript
// example code
```
```

#### Consistency

- Use consistent heading levels
- Use consistent code block formats
- Use consistent terminology
- Follow existing documentation style

### 10. Specific Documentation Files (Update Only Changed Sections)

#### `docs/Architecture/Tools.md`

Update this file **only if tools were changed or added**:
- **New tool implementations** - Add sections for new tools
- **Changed tool structure** - Update only affected tool sections
- **Changed tool registration** - Update only if registration pattern changed
- **Changed tool execution** - Update only if execution flow changed
- **New tools** - Add to tool list
- **Changed tool interfaces** - Update only changed interfaces
- **Changed tool dependencies** - Update only if dependencies changed

**Do NOT update sections for unchanged tools.**

#### `docs/Welcome.md`

Update this file **only if changes affect**:
- **New major features** - Add to overview
- **Changed project structure** - Update only if structure changed
- **Changed setup process** - Update only if getting started steps changed
- **Changed project status** - Update only if status changed

#### Other Architecture Docs

For any other architecture documentation:
- Update **only sections related to changed code**
- Add **only missing sections for new features**
- Remove **only outdated information for changed features**
- Improve clarity **only for changed sections**

**Do NOT update sections unrelated to branch changes.**

### 11. Verification (Change-Focused)

After updating documentation:

1. **Check accuracy** - Verify all information about changed code is correct
2. **Check completeness** - Ensure all changed aspects are documented
3. **Check consistency** - Ensure consistent formatting and terminology with existing docs
4. **Check links** - Verify all internal links work (especially new ones)
5. **Check code examples** - Verify all code examples from changed files are valid
6. **Check scope** - Verify only changed sections were updated (not unrelated sections)

### 12. Documentation Output

The updated documentation should:

- **Accurately reflect** the changes in the branch
- **Be focused** - Cover only the changed aspects
- **Be clear** - Easy to understand what changed
- **Be organized** - Well-integrated with existing documentation
- **Be up-to-date** - Reflect branch changes accurately
- **Be consistent** - Follow established patterns and style
- **Be minimal** - Only update what's necessary for the branch changes

## When to Use This Command

Use this command:

- ✅ **Before merging a branch** - To document branch changes
- ✅ **When adding new features in a branch** - To document new functionality
- ✅ **When refactoring in a branch** - To update architecture docs for changes
- ✅ **When preparing a PR** - To ensure docs reflect branch changes
- ✅ **After completing feature work** - To document what was added/changed
- ✅ **When branch changes affect documentation** - To keep docs in sync with branch

**Do NOT use if:**

- ❌ No changes were made in the current branch
- ❌ Branch changes don't affect documentation
- ❌ Only documentation files were changed (no code changes)
- ❌ Only minor formatting/typo fixes were made

## Error Handling

If any step fails:

- **Git branch detection fails:** Default to comparing with `main` or `master`, or ask user for base branch
- **No changes detected:** Inform user that no code changes were found in the branch
- **Documentation not found:** Create new documentation files **only for new features** in the branch
- **Changed code unclear:** Use codebase_search to explore **only the changed files**
- **Missing information:** Document what's available in changed code, note what's missing
- **Conflicting information:** Verify with changed code, update accordingly

Always provide clear feedback about:
- What files changed in the branch
- What documentation was updated
- What sections were modified
- What new documentation was created (if any)

## Examples

### Example 1: Update Tools Documentation for New Tool

After adding a new tool in a branch:
1. Detect branch changes: `git diff --name-only origin/main...HEAD`
2. Identify new tool file (e.g., `src/tools/newTool.js`)
3. Analyze only the new tool implementation
4. Update `docs/Architecture/Tools.md`:
   - Add new tool to tool list (only)
   - Add new tool implementation details (only)
   - Update "Adding a New Tool" section if pattern changed (only)
   - Update architecture diagram to include new tool (only)
5. **Do NOT update** sections for existing unchanged tools

### Example 2: Update Architecture Documentation for Refactored Component

After refactoring a component in a branch:
1. Detect branch changes: `git diff --name-only origin/main...HEAD`
2. Identify changed component files
3. Analyze only the changed component structure
4. Update relevant architecture docs **only for changed components**:
   - Update component breakdown (only changed component)
   - Update data flow diagrams (only if data flow changed)
   - Update file structure (only if files moved/renamed)
   - Update design patterns (only if new patterns introduced)
5. **Do NOT update** sections for unchanged components

### Example 3: Create Missing Documentation for New Feature

When a new feature was added in a branch:
1. Detect branch changes: `git diff --name-only origin/main...HEAD`
2. Identify new feature files
3. Analyze only the new feature implementation
4. Create appropriate documentation **only for the new feature**:
   - Feature overview (new section)
   - Usage instructions (new section)
   - Architecture details (only if architecture changed)
   - Examples (only for new feature)
5. **Do NOT create** documentation for existing features

## Best Practices

1. **Focus on branch changes** - Only update docs for code changed in the branch
2. **Be targeted** - Update only relevant sections, not entire documentation files
3. **Be accurate** - Verify information against changed code in the branch
4. **Be clear** - Use clear language and examples from changed code
5. **Be organized** - Integrate changes logically with existing documentation
6. **Be consistent** - Follow established patterns and style
7. **Be minimal** - Don't update unrelated sections
8. **Use git diff** - Always check what actually changed before updating docs
9. **Scope updates** - Only touch documentation sections related to changed code
10. **Preserve existing content** - Don't modify documentation for unchanged code
