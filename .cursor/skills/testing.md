---
name: testing
description: Tests the web-photoshop application using the internal Cursor browser. Automatically opens and tests new features when they are added.
---

# Application Testing Skill

This skill provides automated testing capabilities for the web-photoshop application using the internal Cursor browser. It should be used whenever new features are added to verify they work correctly.

## When to Use

- **Always use this skill** when a new feature, tool, or component is added to the application
- Use when making changes to existing features that need visual verification
- Use to verify UI interactions, tool functionality, and canvas operations
- Use to test edge cases and user workflows

## Dev Server Configuration

- **Default URL**: `http://localhost:5174`
- **Framework**: Vite + React
- **Application**: Web Photoshop (canvas-based image editing tool)

### Starting the Dev Server

To start the development server with the default port (5174):
```bash
npm run dev
```

To start the dev server with a custom port:
```bash
npm run dev -- --port <port-number>
# Example: npm run dev -- --port 3000
```

**Note**: When using a custom port, update the URL in browser navigation commands accordingly (e.g., `http://localhost:3000`). The `--` passes arguments to the underlying Vite command.

## Testing Workflow

### 1. Initial Setup

When starting a testing session:

1. **Start the dev server** (if not already running):
   - Run `npm run dev` for default port (5174)
   - Or run `npm run dev -- --port <port>` for a custom port (e.g., `npm run dev -- --port 3000`)
   - Wait for the server to start and note the port number

2. **Navigate to the application**:
   - Open `http://localhost:<port>` in the Cursor browser (default: `http://localhost:5174`)
   - Wait for the page to fully load
   - Take a snapshot to verify the initial state

2. **Verify Core Components**:
   - Check that the Toolbar is visible and contains all expected tools
   - Verify the Canvas is rendered and visible
   - Confirm the Properties Panel is displayed
   - Ensure Color Swatches are visible

### 2. Testing New Tools

When a new tool is added, test the following:

1. **Tool Registration**:
   - Verify the tool icon appears in the Toolbar
   - Check that the tool button is clickable
   - Confirm the tool title/hint is displayed correctly

2. **Tool Activation**:
   - Click the tool button
   - Verify the tool becomes active (visual feedback)
   - Check that the cursor changes appropriately
   - Confirm the Properties Panel updates for the tool

3. **Tool Functionality**:
   - Test basic tool operation on the canvas
   - Verify tool parameters (size, opacity, color) work correctly
   - Test edge cases (canvas boundaries, different settings)
   - Check for visual artifacts or errors

4. **Tool Switching**:
   - Switch between different tools
   - Verify state is maintained correctly
   - Check that canvas operations work with each tool

### 3. Testing UI Components

For new UI components or changes:

1. **Visual Verification**:
   - Take a snapshot to verify layout
   - Check responsive behavior (if applicable)
   - Verify styling and visual consistency

2. **Interaction Testing**:
   - Test all interactive elements (buttons, sliders, inputs)
   - Verify state updates correctly
   - Check for console errors

3. **Integration Testing**:
   - Verify components work together correctly
   - Test data flow between components
   - Check that events are handled properly

### 4. Testing Canvas Operations

For canvas-related features:

1. **Drawing Operations**:
   - Test drawing with different tools
   - Verify brush strokes appear correctly
   - Check opacity and color application
   - Test eraser functionality

2. **Canvas State**:
   - Test clear canvas operation
   - Verify export functionality
   - Check canvas persistence (if applicable)

3. **Performance**:
   - Monitor for lag during operations
   - Check console for errors or warnings
   - Verify smooth interactions

## Standard Test Checklist

When testing a new feature, verify:

- [ ] Feature is visible and accessible
- [ ] Feature works as expected with default settings
- [ ] Feature works with different parameter values
- [ ] No console errors or warnings
- [ ] Visual feedback is correct
- [ ] Integration with other features works
- [ ] Edge cases are handled gracefully
- [ ] Performance is acceptable

## Browser Testing Commands

Use these MCP browser tools for testing:

- `browser_navigate`: Navigate to `http://localhost:<port>` (default: `http://localhost:5174`)
- `browser_snapshot`: Capture accessibility snapshot of current state
- `browser_click`: Click buttons, tools, or interactive elements
- `browser_type`: Type into input fields
- `browser_hover`: Hover over elements to see tooltips
- `browser_console_messages`: Check for JavaScript errors
- `browser_network_requests`: Monitor network activity
- `browser_take_screenshot`: Capture visual state for documentation

## Testing Examples

### Example: Testing a New Brush Tool Feature

```markdown
1. Start dev server: npm run dev (or npm run dev -- --port <port>)
2. Navigate to http://localhost:<port> (default: 5174)
3. Take snapshot to see initial state
3. Click the Brush tool button
4. Verify tool is active (check snapshot)
5. Adjust brush size in Properties Panel
6. Click and drag on canvas
7. Verify brush stroke appears
8. Check console for errors
9. Test with different colors and opacity
10. Verify all interactions work smoothly
```

### Example: Testing Toolbar Updates

```markdown
1. Start dev server: npm run dev (or npm run dev -- --port <port>)
2. Navigate to http://localhost:<port> (default: 5174)
3. Take snapshot
3. Verify all expected tools are visible
4. Click each tool to verify activation
5. Check tooltips/hints are displayed
6. Verify visual feedback on selection
7. Test keyboard shortcuts (if applicable)
```

## Error Handling

If errors are encountered during testing:

1. **Check Console Messages**:
   - Use `browser_console_messages` to see JavaScript errors
   - Look for React errors or warnings
   - Check for WebGL errors (if canvas-related)

2. **Verify Network Requests**:
   - Use `browser_network_requests` to check for failed requests
   - Verify all assets load correctly

3. **Document Issues**:
   - Take screenshots of errors
   - Note the steps that led to the error
   - Report findings for debugging

## Best Practices

1. **Always test after adding features**: Don't assume code works without visual verification
2. **Test incrementally**: Test each feature as it's added, not all at once
3. **Use snapshots**: Take snapshots before and after changes to compare
4. **Check console**: Always verify no errors are introduced
5. **Test user workflows**: Simulate how users would actually use the feature
6. **Document findings**: Note any issues or unexpected behavior

## Integration with Development

This testing skill should be used:

- **After each feature addition**: Immediately test new features
- **Before committing changes**: Verify everything works
- **When debugging**: Use browser tools to investigate issues
- **For regression testing**: Verify existing features still work

## Notes

- The dev server must be running before testing (default: `http://localhost:5174`)
- Use `npm run dev` for default port or `npm run dev -- --port <port>` for a custom port
- Always verify the correct port number when navigating to the application
- Some features may require specific browser capabilities (WebGL, Canvas API)
- Performance testing should be done with realistic data sizes
- Visual regression testing can be done by comparing screenshots
