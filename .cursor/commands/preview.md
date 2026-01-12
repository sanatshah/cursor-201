---
description: Create symbolic link to node_modules and run dev server
globs: web-photoshop/**
---

# Preview Command - Run Dev Server for Worktree

This command sets up the worktree environment by creating a symbolic link to node_modules from the non-worktree directory and starts the dev server on the default port.

## Process

### 1. Navigate to Worktree Directory

Get the worktree root directory and navigate to web-photoshop:

```bash
# Get the worktree root directory
WORKTREE_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

# Navigate to web-photoshop within the worktree
cd "$WORKTREE_DIR/web-photoshop"
```

### 2. Create Symbolic Link to node_modules

Check if `node_modules` exists and if it's already a symbolic link:

```bash
if [ -L node_modules ]; then
  echo "node_modules is already a symbolic link"
elif [ -d node_modules ]; then
  echo "Removing existing node_modules directory"
  rm -rf node_modules
fi
```

Create the symbolic link pointing to the non-worktree node_modules:

```bash
# Non-worktree node_modules path
NON_WORKTREE_NODE_MODULES="/Users/sunny/Documents/projects/cursor-201/web-photoshop/node_modules"

# Create symbolic link if it doesn't exist or isn't already linked correctly
if [ ! -L node_modules ] || [ "$(readlink node_modules)" != "$NON_WORKTREE_NODE_MODULES" ]; then
  ln -sf "$NON_WORKTREE_NODE_MODULES" node_modules
  echo "Created symbolic link to node_modules"
fi
```

### 3. Start Dev Server

Start the Vite dev server on the default port:

```bash
npm run dev
```

## Implementation Steps

1. **Navigate to worktree directory**

   - Get the worktree root directory using `git rev-parse --show-toplevel`
   - Navigate to `web-photoshop` within the worktree

   ```bash
   WORKTREE_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
   cd "$WORKTREE_DIR/web-photoshop"
   ```

2. **Check and create symbolic link**

   - Check if `node_modules` exists
   - If it's a directory (not a symlink), remove it
   - Create symbolic link to non-worktree node_modules

3. **Start dev server**
   - Run `npm run dev` on the default port

## Error Handling

- **node_modules doesn't exist in non-worktree:** Inform user that dependencies need to be installed in the main project first
- **Symbolic link creation fails:** Check permissions, inform user
- **npm run dev fails:** Check if node_modules is accessible, verify vite is installed

## Expected Output

When successful, you should see:

```
Created symbolic link to node_modules

  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

## Notes

- The symbolic link allows sharing node_modules between worktree and main project
- The dev server runs on the default Vite port (5174)
