---
name: jot-cli
description: Use this skill only when the user explicitly mentions jot, asks you to use the jot CLI, or gives you jot note instructions, a jot note ID, or a jot share link. Explains how to register a jot instance, read notes, apply text edits, create and manage comment threads, and work in both owner and shared-note modes.
compatibility: Requires the jot CLI (`jot`) to be installed and network access to a jot server or share link.
---

# jot CLI

Use this skill only for explicit jot tasks. Do not activate it for generic note-taking, markdown editing, or commenting tasks unless the user explicitly mentions **jot**.

Jot is a collaborative markdown note system with inline comment threads. The CLI has two modes:

- **Owner mode**: register with a base URL and API key, then operate on any note
- **Shared-note mode**: register with a share URL, then operate on that one shared note only

## If `jot` is not installed

If a `jot ...` command fails because the executable is missing, tell the user to install it:

```bash
npm install -g @mariozechner/jot
```

Assume it is already installed unless command execution proves otherwise.

## Common workflow

1. Determine whether the user gave you:
   - an **owner instance URL + API key**, or
   - a **share URL**
2. Register a local instance name with `jot register ...`
3. Use the registered name for subsequent commands
4. Read the note before editing or replying when you need note content, thread IDs, or message IDs

## Register an instance

### Owner mode

Use this when you have the server base URL and an API key.

```bash
jot register <name> <baseUrl> <apiKey>
```

Example:

```bash
jot register my-jot https://jot.iroh.io <YOUR_API_KEY>
```

### Shared-note mode

Use this when you have a share link.

```bash
jot register <name> <shareUrl>
```

Example:

```bash
jot register shared https://jot.example.com/s/abc123
```

## Instance management

```bash
jot instances
jot unregister <name>
```

## Owner mode commands

After registration, use:

```bash
jot <instance> ...
```

### Find notes

```bash
jot <instance> list
jot <instance> search <query>
```

Examples:

```bash
jot my-jot list
jot my-jot search roadmap
```

### Read a note

```bash
jot <instance> read <noteId>
```

This prints:
- title
- note ID
- updated time or line window info
- markdown content
- comment threads with thread IDs and message IDs

Example:

```bash
jot my-jot read fummg62m
```

For large notes, you can read a slice:

```bash
jot <instance> read <noteId> --offset=<lineNumber> --limit=<lineCount>
```

Example:

```bash
jot my-jot read fummg62m --offset=1 --limit=200
```

### Create a note

```bash
jot <instance> create [title]
```

Example:

```bash
jot my-jot create "My note title"
```

### Edit a note with targeted replacements

Use JSON edits of the form:

```json
[{"oldText":"...","newText":"..."}]
```

Command:

```bash
jot <instance> edit <noteId> '<json-edits>'
```

Example:

```bash
jot my-jot edit fummg62m '[{"oldText":"old line","newText":"new line"}]'
```

Use `edit` when you want targeted replacements instead of replacing the whole note.

### Replace the full note markdown or update title

```bash
jot <instance> update <noteId> title <newTitle>
jot <instance> update <noteId> markdown <newMarkdown>
```

Examples:

```bash
jot my-jot update fummg62m title "Revised plan"
jot my-jot update fummg62m markdown "# New content"
```

### Comment on text

Use an exact quoted snippet from the note.

```bash
jot <instance> comment <noteId> <quotedText> <commentBody>
```

Example:

```bash
jot my-jot comment fummg62m "quoted text" "comment body"
```

### Reply to a specific message

You need both the thread ID and the parent message ID. Get them from `read` output.

```bash
jot <instance> reply <noteId> <threadId> <messageId> <replyBody>
```

Example:

```bash
jot my-jot reply fummg62m <thread-id> <message-id> "reply"
```

### Edit or delete a comment

```bash
jot <instance> edit-comment <noteId> <messageId> <newBody>
jot <instance> delete-comment <noteId> <messageId>
```

Examples:

```bash
jot my-jot edit-comment fummg62m <message-id> "new body"
jot my-jot delete-comment fummg62m <message-id>
```

### Resolve, reopen, or delete a thread

```bash
jot <instance> resolve <noteId> <threadId>
jot <instance> reopen <noteId> <threadId>
jot <instance> delete-thread <noteId> <threadId>
```

Examples:

```bash
jot my-jot resolve fummg62m <thread-id>
jot my-jot reopen fummg62m <thread-id>
jot my-jot delete-thread fummg62m <thread-id>
```

### Get or set sharing

```bash
jot <instance> share <noteId>
jot <instance> share <noteId> none
jot <instance> share <noteId> view
jot <instance> share <noteId> comment
jot <instance> share <noteId> edit
```

Examples:

```bash
jot my-jot share fummg62m
jot my-jot share fummg62m comment
```

### Delete a note

```bash
jot <instance> delete <noteId>
```

Example:

```bash
jot my-jot delete fummg62m
```

## Shared-note mode commands

In shared-note mode, the registered instance already points to one specific shared note, so the commands do **not** take a note ID.

### Read the shared note

```bash
jot <instance> read
```

Example:

```bash
jot shared read
```

### Edit the shared note

```bash
jot <instance> edit '<json-edits>'
```

Example:

```bash
jot shared edit '[{"oldText":"foo","newText":"bar"}]'
```

### Comment on text in the shared note

Use `--name="..."` to set the displayed author name if needed.

```bash
jot <instance> comment <quotedText> <commentBody> [--name="Name"]
```

Example:

```bash
jot shared comment "quoted text" "comment body" --name="My Agent"
```

### Reply in the shared note

```bash
jot <instance> reply <threadId> <messageId> <replyBody> [--name="Name"]
```

Example:

```bash
jot shared reply <thread-id> <message-id> "reply" --name="My Agent"
```

## Practical guidance

- Use `read` first when you need current content, thread IDs, message IDs, or exact quoted text.
- For comments, quote text that appears exactly in the note.
- For edits, prefer precise `oldText` / `newText` replacements.
- In shared-note mode, available commands are limited to `read`, `edit`, `comment`, and `reply`.
- In owner mode, you can also list, search, share, update, and delete notes.

## Quick reference

```bash
# Install if missing
npm install -g @mariozechner/jot

# Register
jot register my-jot https://jot.iroh.io <YOUR_API_KEY>
jot register shared https://jot.example.com/s/abc123

# Inspect configured instances
jot instances

# Owner mode
jot my-jot list
jot my-jot search roadmap
jot my-jot read fummg62m
jot my-jot create "My note title"
jot my-jot edit fummg62m '[{"oldText":"...","newText":"..."}]'
jot my-jot comment fummg62m "quoted text" "comment body"
jot my-jot reply fummg62m <thread-id> <message-id> "reply"
jot my-jot edit-comment fummg62m <message-id> "new body"
jot my-jot delete-comment fummg62m <message-id>
jot my-jot resolve fummg62m <thread-id>
jot my-jot reopen fummg62m <thread-id>
jot my-jot delete-thread fummg62m <thread-id>
jot my-jot share fummg62m
jot my-jot share fummg62m comment
jot my-jot update fummg62m title "New title"
jot my-jot update fummg62m markdown "# Replacement markdown"
jot my-jot delete fummg62m

# Shared-note mode
jot shared read
jot shared edit '[{"oldText":"foo","newText":"bar"}]'
jot shared comment "quoted text" "comment body" --name="My Agent"
jot shared reply <thread-id> <message-id> "reply" --name="My Agent"

# Built-in command help
jot --help
```
