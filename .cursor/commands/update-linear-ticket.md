---
description: Plan implementation for a Linear ticket by analyzing its description and creating a detailed implementation plan with data flow
globs: **/*
---

# Linear Ticket Implementation Planning

Analyze a Linear ticket from the current branch name and create a comprehensive implementation plan with detailed data flow specification.

## Process

### 1. Get Current Branch Name

First, determine the current git branch name:

```bash
git branch --show-current
```

Or if that's not available:

```bash
git rev-parse --abbrev-ref HEAD
```

### 2. Extract Linear Ticket Identifier

Extract the Linear ticket identifier from the branch name. Common branch name formats:

- `LIN-123` - Direct ticket ID
- `feature/LIN-123` - Feature branch with ticket ID
- `LIN-123-feature-name` - Ticket ID with description
- `fix/LIN-123-bug-fix` - Fix branch with ticket ID
- `LIN-123/feature-name` - Ticket ID with slash separator

**Extraction Pattern:**

- Look for patterns matching `LIN-\d+` (e.g., `LIN-123`, `LIN-456`)
- The ticket identifier is the full match (e.g., `LIN-123`)

### 3. Fetch the Linear Ticket

Use the Linear MCP tool to fetch the ticket details:

**Tool:** `mcp_Linear_get_issue`

- **Parameter:** `id` - The Linear issue identifier (e.g., `LIN-123`)

This will return:

- Title
- Description
- Status
- Assignee
- Labels
- Related issues
- Any other relevant metadata

### 4. Analyze the Ticket Description

Analyze the ticket description to understand:

- **Requirements:** What needs to be built or fixed
- **Scope:** What parts of the system are affected
- **Dependencies:** What other systems/components are involved
- **User Stories:** Who is the user and what do they need
- **Acceptance Criteria:** What defines completion

### 5. Explore the Codebase

Based on the ticket description, explore relevant parts of the codebase:

### 6. Create Implementation Plan

Generate a comprehensive implementation plan with the following structure:

```markdown
# Implementation Plan for [Ticket Title]

## Overview

[Brief summary of what needs to be implemented]

## Requirements Analysis

[Breakdown of requirements from the ticket description]

## Architecture Considerations

[High-level architectural decisions and patterns to use]

### Additional Data Flows

[Repeat for each major feature or component]

## File Structure

### New Files to Create

- `path/to/new/file.ts` - [Purpose and description]
- `path/to/new/component.tsx` - [Purpose and description]

### Files to Modify

- `path/to/existing/file.ts` - [What changes are needed]
- `path/to/existing/component.tsx` - [What changes are needed]

## Implementation Steps

1. **[Step Name]**

   - Create/modify: `path/to/file`
   - Purpose: [What this step accomplishes]
   - Dependencies: [What needs to be done first]

2. **[Step Name]**
   - Create/modify: `path/to/file`
   - Purpose: [What this step accomplishes]
   - Dependencies: [What needs to be done first]

[Continue for all steps]

## Testing Strategy

### Unit Tests

- [ ] Test: [What to test]
- [ ] Location: `path/to/test/file.test.ts`

### Integration Tests

- [ ] Test: [What to test]
- [ ] Location: `path/to/test/file.test.ts`

### Manual Testing

- [ ] Scenario: [Test scenario]
- [ ] Expected: [Expected behavior]

## Dependencies

### External Dependencies

- [Package name] - [Purpose]

### Internal Dependencies

- [Module/Component] - [Purpose]

## Risk Assessment

- **Risk:** [Potential issue]
  - **Impact:** [How it affects the implementation]
  - **Mitigation:** [How to address it]

## Open Questions

- [ ] [Question about unclear requirements]
- [ ] [Question about technical approach]
```

## Data Flow Specification Guidelines

When specifying data flow, include:

### 1. Complete End-to-End Flow

Trace data from user interaction to database and back:

- **User Input** → **Frontend Component** → **Hook/State** → **API Call** → **Backend Handler** → **Repository** → **Database** → **Response** → **State Update** → **UI Update**

### 2. Component-Level Details

For each step, specify:

- **Component/Service Name:** Exact file or function
- **Input Data:** What data enters this step
- **Processing:** What transformation or logic occurs
- **Output Data:** What data exits this step
- **Side Effects:** Any state changes, API calls, or other effects

### 3. Data Transformations

Document how data changes at each step:

- **Format Changes:** JSON structure, type conversions
- **Enrichment:** Additional data added
- **Filtering:** Data removed or filtered
- **Validation:** Validation rules applied

### 4. Error Handling

Specify error handling at each step:

- **Validation Errors:** Where and how input is validated
- **API Errors:** How backend errors are handled
- **Network Errors:** How connection issues are handled
- **User Feedback:** How errors are communicated to users

```

## Implementation Plan Output Format

The final plan should be comprehensive and include:

1. **Clear Overview** - What is being built
2. **Detailed Data Flows** - Step-by-step data movement
3. **File Structure** - What files to create/modify
4. **Implementation Steps** - Ordered list of tasks
5. **Testing Strategy** - How to verify the implementation
6. **Dependencies** - What's needed to complete the work
7. **Risk Assessment** - Potential issues and mitigations

## When to Use This Command

Use this command:

- ✅ **Before starting implementation** - To understand the full scope
- ✅ **When requirements are unclear** - To break down complex features
- ✅ **For large features** - To plan multi-step implementations
- ✅ **When coordinating with team** - To share implementation approach

**Do NOT use if:**

- ❌ The branch name doesn't contain a Linear ticket identifier
- ❌ The ticket doesn't exist or can't be found
- ❌ The ticket is too vague or lacks description

## Error Handling

If any step fails:

- **Branch name not found:** Inform user, suggest checking git status
- **No ticket ID in branch:** Inform user, suggest creating branch with ticket ID
- **Ticket not found:** Inform user that ticket doesn't exist
- **Ticket lacks description:** Inform user, suggest adding description to ticket

Always provide clear feedback about what happened and what information is needed to proceed.

```
