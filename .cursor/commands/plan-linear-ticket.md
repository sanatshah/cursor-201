---
description: Plan implementation for a Linear ticket by analyzing its description and creating a detailed implementation plan with data flow
globs: **/*
---

# Linear Ticket Implementation Planning

Analyze a Linear ticket from the current branch name and create a comprehensive implementation plan with detailed data flow specification.

## Workspace Root

All file paths in this document are relative to the workspace root:

**Workspace Root:** `/Users/sunny/Documents/projects/cursor-201`

## Process

### 1. Get Current Branch Name

First, navigate to the workspace root.

Then, determine the current git branch name:

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

### 3.5. Update Ticket Status to "Agent in Progress"

After fetching the ticket, update its status to "Agent in Progress" to indicate that the agent is working on planning the implementation:

**Tool:** `mcp_Linear_update_issue`

- **Parameter:** `id` - The Linear issue identifier (e.g., `LIN-123`)
- **Parameter:** `state` - Set to `"Agent in Progress"` (the status name)

**Note:** If the status name "Agent in Progress" doesn't exist in your Linear workspace, you may need to:

- Use the exact status name as it appears in your Linear workspace
- Or use `mcp_Linear_list_issue_statuses` to find the correct status name/ID for the ticket's team
- The status can be provided as a name (string) or ID

**Error Handling:**

- If the status update fails, log a warning but continue with the planning process
- The planning should proceed even if the status update is unsuccessful

### 4. Analyze the Ticket Description

Analyze the ticket description to understand:

- **Requirements:** What needs to be built or fixed
- **Scope:** What parts of the system are affected
- **Dependencies:** What other systems/components are involved
- **User Stories:** Who is the user and what do they need
- **Acceptance Criteria:** What defines completion

### 5. Explore the Codebase

Based on the ticket description, explore relevant parts of the codebase:

- **Frontend Components:** Search for existing UI components in `/Users/sunny/Documents/projects/cursor-201/app/shared/src/` or `/Users/sunny/Documents/projects/cursor-201/app/web/`
- **Backend Actions:** Check `/Users/sunny/Documents/projects/cursor-201/app/healthnode/src/actions/` for existing actions
- **PDOS Actions:** Review `/Users/sunny/Documents/projects/cursor-201/app/pdos/src/storage/data/` for data operations
- **Database Schema:** Check `/Users/sunny/Documents/projects/cursor-201/app/healthnode/prisma/` for data models
- **API Routes:** Look at `/Users/sunny/Documents/projects/cursor-201/app/healthnode/src/api/` for existing endpoints
- **Shared Types:** Review `/Users/sunny/Documents/projects/cursor-201/app/shared-types/src/` for type definitions

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

## Data Flow Specification

### [Feature/Component Name] Data Flow

#### Step 1: [User Action/Trigger]

- **Component:** [Frontend component or user action]
- **Action:** [What the user does or what triggers the flow]
- **Data:** [Initial data or input]

#### Step 2: [Frontend Processing]

- **Component:** [Specific component or hook]
- **Action:** [What happens in the frontend]
- **Data Transformation:** [How data is transformed]
- **API Call:** [If applicable, what API endpoint is called]

#### Step 3: [API/Backend Processing]

- **Endpoint:** [API route or action path]
- **Handler:** [Backend handler or action function]
- **Validation:** [Input validation steps]
- **Business Logic:** [Core processing logic]

#### Step 4: [Data Layer]

- **Repository:** [Repository class used]
- **Database Operation:** [CRUD operation type]
- **Data Model:** [Prisma model or data structure]
- **Query/Transaction:** [Specific database operations]

#### Step 5: [Response Processing]

- **Data Transformation:** [How response data is formatted]
- **Error Handling:** [Error handling approach]
- **Response Format:** [Structure of response data]

#### Step 6: [Frontend Update]

- **State Management:** [How state is updated - MobX, React state, etc.]
- **UI Update:** [How the UI reflects the changes]
- **User Feedback:** [Loading states, success/error messages]

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

### 5. State Management

Document state management:

- **Local State:** React component state
- **Global State:** MobX stores, context, or other global state
- **Server State:** Cached API responses
- **State Updates:** When and how state changes

### 6. PDOS Actions Integration

If using PDOS actions, specify:

- **Action Path:** e.g., `actions.user.get`
- **Storage Key:** How the storage key is generated
- **Table Instance:** Which storage table is used
- **Data Caching:** How data is cached and invalidated

## Example Data Flow

Here's an example of a detailed data flow specification:

````markdown
### User Profile Update Data Flow

#### Step 1: User Submits Form

- **Component:** `/Users/sunny/Documents/projects/cursor-201/app/shared/src/pages/ProfilePage.tsx`
- **Action:** User fills out profile form and clicks "Save"
- **Data:** `{ name: string, email: string, phone?: string }`

#### Step 2: Form Validation

- **Component:** `ProfilePage.tsx` (form validation)
- **Action:** Client-side validation using form library
- **Data Transformation:** Validates required fields, email format
- **Error Handling:** Shows validation errors inline

#### Step 3: API Call via PDOS Action

- **Hook:** `usePDOSAction` from `/Users/sunny/Documents/projects/cursor-201/app/cosmos/components/usePDOSActions.ts`
- **Action Path:** `actions.user.update`
- **Storage Key:** Generated from `getKey("actions.user.update", [{ id, data }])`
- **Table Instance:** `pdos().storage("user")`
- **API Call:** POST to `${gatewayURL}/api/actions` with:
  ```json
  {
    "path": "actions.user.update",
    "args": [{ "id": "user-123", "data": { "name": "...", "email": "..." } }]
  }
  ```
````

#### Step 4: Backend Action Handler

- **Endpoint:** `/Users/sunny/Documents/projects/cursor-201/app/healthnode/src/api/actions.ts` (POST `/api/actions`)
- **Handler:** Routes to `/Users/sunny/Documents/projects/cursor-201/app/healthnode/src/actions/user/user.ts` → `user_update`
- **Validation:** Validates user ID, checks permissions
- **Business Logic:** Updates user data

#### Step 5: Repository Update

- **Repository:** `/Users/sunny/Documents/projects/cursor-201/app/healthnode/src/db/repository/User.ts`
- **Method:** `updateById(userId, data)`
- **Database Operation:** Prisma `user.update()` with `where: { id }` and `data: { ... }`
- **Data Model:** `User` model from Prisma schema

#### Step 6: Response Processing

- **Response Format:** `{ success: true, data: User }`
- **Error Handling:** Catches database errors, returns appropriate error response
- **Data Transformation:** Serializes Prisma model to JSON

#### Step 7: Frontend State Update

- **MobX Store:** `pdos().storage("user").data` automatically updated
- **Reactive Update:** Components using `usePDOSAction` automatically re-render
- **UI Update:** Form shows success message, updated data displayed

#### Step 8: User Feedback

- **Component:** `ProfilePage.tsx`
- **Action:** Shows toast notification "Profile updated successfully"
- **State:** Form resets or shows updated values

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
