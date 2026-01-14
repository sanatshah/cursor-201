---
description: Update Notion documentation pages in the Product + Engineering/Documentation folder based on changes in the current branch
globs: **/*
---

# Update Notion Documentation

Analyze changes in the current branch and update the corresponding Notion documentation pages in the **Product + Engineering/Documentation** folder.

## Workspace Root

All file paths in this document are relative to the workspace root:

**Workspace Root:** `/Users/sunny/Documents/projects/cursor-201`

## Notion Documentation Structure

The documentation lives in Notion at:
- **Parent Folder:** Product + Engineering
- **Documentation Page ID:** `2d123878-bf06-809e-9fd5-f540098c576a`
- **Documentation URL:** https://www.notion.so/2d123878bf06809e9fd5f540098c576a

### Documentation Sub-Pages

| Page Name | Page ID | Purpose |
|-----------|---------|---------|
| PDOS | `2d123878-bf06-802d-969d-c5f8bda31d08` | PDOS system documentation |
| Actions API | `2d823878-bf06-80b4-935b-d73097d0952f` | Actions API documentation |
| Workflows | `2d823878-bf06-80fc-b18e-dd86fe798dd3` | Workflow documentation |
| Conversations | `2d823878-bf06-809e-9ead-ff6c76fa4e51` | Conversation system documentation |
| Arc Agent | `2d923878-bf06-8009-a5e5-f5888ec8394c` | Arc Agent documentation |

## Process

### 1. Identify Branch and Changed Files

First, determine what has changed in the current branch:

#### 1.1 Get Current Branch Information

Use the `run_terminal_cmd` tool to get the current branch:

```bash
# Get current branch name
git branch --show-current
```

#### 1.2 Determine Base Branch

```bash
# Check if main exists
git show-ref --verify --quiet refs/heads/main && echo "main" || echo "master"
```

#### 1.3 Get Changed Files

```bash
# Get all changed files
BASE_BRANCH="main"
git diff --name-only --diff-filter=ACMR origin/${BASE_BRANCH}...HEAD
```

#### 1.4 Filter Relevant Files

Focus on files that would affect documentation:
- Source code files (`src/`)
- Configuration files
- API changes
- New components or tools

### 2. Map Changes to Documentation Pages

Based on the changed files, determine which Notion documentation pages need updating:

| Changed Code Area | Notion Page to Update |
|-------------------|----------------------|
| `app/pdos/` or PDOS-related | PDOS (`2d123878-bf06-802d-969d-c5f8bda31d08`) |
| `app/healthnode/src/actions/` or action handlers | Actions API (`2d823878-bf06-80b4-935b-d73097d0952f`) |
| Workflow-related files | Workflows (`2d823878-bf06-80fc-b18e-dd86fe798dd3`) |
| Conversation/messaging files | Conversations (`2d823878-bf06-809e-9ead-ff6c76fa4e51`) |
| Agent/AI-related files | Arc Agent (`2d923878-bf06-8009-a5e5-f5888ec8394c`) |

### 3. Fetch Current Notion Documentation

For each affected documentation page, fetch the current content:

**Tool:** `mcp_Notion_notion-fetch`

- **Parameter:** `id` - The page ID (e.g., `2d123878-bf06-802d-969d-c5f8bda31d08`)

This will return the current content of the Notion page in Markdown format.

### 4. Analyze Changed Code

For each changed file area, analyze the code to understand:

- What functionality was added/modified
- New APIs or endpoints
- Changed data structures
- New components or patterns
- Updated configurations

Use `read_file` and `codebase_search` tools to understand the changes.

### 5. Prepare Documentation Updates

For each affected Notion page, prepare updates that:

1. **Preserve Existing Content:** Keep content not affected by changes
2. **Update Changed Sections:** Modify sections that relate to changed code
3. **Add New Sections:** Add documentation for new features
4. **Remove Outdated Content:** Remove documentation for removed features

### 6. Update Notion Pages

Use the Notion MCP tools to update the documentation:

#### 6.1 Update Existing Page Content

**Tool:** `mcp_Notion_notion-update-page`

For replacing specific content:
```json
{
  "page_id": "page-id-here",
  "command": "replace_content_range",
  "selection_with_ellipsis": "## Old Section...end of section",
  "new_str": "## Updated Section\nNew content here"
}
```

For inserting new content:
```json
{
  "page_id": "page-id-here",
  "command": "insert_content_after",
  "selection_with_ellipsis": "## Previous section...",
  "new_str": "\n## New Section\nContent to insert"
}
```

For replacing entire page content:
```json
{
  "page_id": "page-id-here",
  "command": "replace_content",
  "new_str": "# Page Title\n\nNew full content"
}
```

#### 6.2 Create New Sub-Pages (if needed)

**Tool:** `mcp_Notion_notion-create-pages`

```json
{
  "parent": {"page_id": "2d123878-bf06-809e-9fd5-f540098c576a"},
  "pages": [{
    "properties": {"title": "New Feature Documentation"},
    "content": "# New Feature\n\nDocumentation content..."
  }]
}
```

### 7. Documentation Content Guidelines

When updating Notion documentation:

#### 7.1 Structure

Use clear hierarchical headings:
```markdown
# Main Title

## Overview
Brief description of the feature/system

## Architecture
High-level architecture explanation

## API Reference
Detailed API documentation

## Usage Examples
Code examples and use cases

## Configuration
Configuration options and settings
```

#### 7.2 Code Blocks

Include code examples where relevant:
```markdown
## Example Usage

\`\`\`typescript
// Example code here
const result = await api.callEndpoint(params);
\`\`\`
```

#### 7.3 Tables

Use tables for structured data:
```markdown
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
```

#### 7.4 Links

Link to related documentation:
```markdown
See also: [Related Feature](https://notion.so/page-id)
```

### 8. Verification

After updating, verify the changes:

1. **Fetch updated pages** to confirm changes were applied
2. **Check formatting** is correct
3. **Verify links** work correctly
4. **Ensure completeness** - all changes are documented

### 9. Summary Output

After completing updates, provide a summary:

```markdown
## Notion Documentation Updates Summary

### Pages Updated
- [Page Name](URL) - Description of changes

### New Pages Created
- [Page Name](URL) - Purpose

### Sections Modified
- Page: Section Name - What changed

### Notes
- Any important observations or follow-up items
```

## When to Use This Command

Use this command:

- ✅ **Before merging a branch** - To sync documentation with code changes
- ✅ **After implementing a feature** - To document new functionality
- ✅ **When refactoring** - To update affected documentation
- ✅ **When fixing bugs** - If the fix changes documented behavior
- ✅ **During code review** - To ensure documentation is current

**Do NOT use if:**

- ❌ No code changes were made in the branch
- ❌ Changes don't affect documented systems
- ❌ Only tests or non-functional code changed

## Error Handling

If any step fails:

- **Git detection fails:** Default to comparing with `main` branch
- **No changes detected:** Inform user that no documentation updates are needed
- **Notion fetch fails:** Check page ID is correct, verify permissions
- **Notion update fails:** May be permission issue, inform user
- **Page not found:** May need to create new page instead of updating

## Quick Reference

### Page IDs

| Page | ID |
|------|-----|
| Documentation (parent) | `2d123878-bf06-809e-9fd5-f540098c576a` |
| PDOS | `2d123878-bf06-802d-969d-c5f8bda31d08` |
| Actions API | `2d823878-bf06-80b4-935b-d73097d0952f` |
| Workflows | `2d823878-bf06-80fc-b18e-dd86fe798dd3` |
| Conversations | `2d823878-bf06-809e-9ead-ff6c76fa4e51` |
| Arc Agent | `2d923878-bf06-8009-a5e5-f5888ec8394c` |

### MCP Tools

| Action | Tool |
|--------|------|
| Fetch page | `mcp_Notion_notion-fetch` |
| Update page | `mcp_Notion_notion-update-page` |
| Create page | `mcp_Notion_notion-create-pages` |
| Search Notion | `mcp_Notion_notion-search` |
