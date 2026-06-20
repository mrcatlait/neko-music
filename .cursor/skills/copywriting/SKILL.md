---
name: copywriting
description: >-
  Write and edit clear, user-facing copy for UI, docs, and marketing. Applies
  voice, tone, and microcopy standards for labels, buttons, empty states, errors,
  headings, and descriptions. Use when creating or editing user-facing text in
  templates, components, README, or any content shown to users.
---

# Copywriting

Write copy that helps users understand what something is, what they can do, and what to do next. Favor clarity over cleverness. Every word should earn its place.

## When to Apply

Use this skill whenever you write or edit user-facing text:

- UI labels, buttons, headings, placeholders, tooltips
- Empty, loading, success, and error states
- Form validation and helper text
- README sections, feature lists, announcements
- `aria-label` and other accessibility text

Skip for internal-only content: code comments, commit messages, API field names, log messages.

## Workflow

1. **Identify the copy type** (see [Copy types](#copy-types) below).
2. **Gather context**: user goal, screen state, prior action, and what happens next.
3. **Draft** using the voice principles and type-specific rules.
4. **Validate** with the checklist before finalizing.

## Voice Principles

| Principle | Do | Avoid |
|-----------|----|-------|
| Clarity | Plain language, concrete nouns and verbs | Jargon, metaphors, wordplay |
| Brevity | Short sentences; cut filler words | Long explanations in UI |
| Honesty | State what happened and what to do | False reassurance, vague promises |
| Respect | Neutral, helpful tone | Blaming the user, condescension |
| Ownership | Emphasize user control when relevant | Hype, lock-in language, dark patterns |

### Tone by Context

- **UI microcopy**: Direct and functional. Lead with the action or state.
- **Errors**: Calm and actionable. Say what failed, why (if known), and the next step. Never blame the user.
- **Empty states**: Explain what this area is for and how to populate it.
- **Marketing/docs**: Confident but grounded. Lead with user benefit, support with specifics.

### Style Rules

- Use **sentence case** for UI labels, headings, and buttons (`Import from YouTube`, not `Import From YouTube`).
- Prefer **active voice** and **present tense** (`Save changes`, not `Changes will be saved`).
- Use **second person** for instructions (`Enter a playlist URL`).
- One **primary action** per region; button labels are verbs (`Import`, `Retry`, not `OK`).
- No emojis in product copy.
- No engagement bait (`Great job!`, `Oops!`, `Uh oh!`).
- Avoid exclamation marks except rare celebratory moments.

## Material Design Word Choice

Follow [Material Design 3 global writing — word choice](https://m3.material.io/foundations/content-design/global-writing/word-choice) when picking words for UI copy. These rules extend the voice principles above with Material-specific guidance.

### Reading level and jargon

- Use **common words** understandable across reading levels (`Turn on`, not `Enable`).
- Avoid industry jargon and invented feature names when a simpler phrase works (`Preparing video…`, not `Buffering…`).
- Replace or define technical terms on first use in longer content.

### Consistency

- Use the **same verb** for the same action everywhere (`Remove photo`, not mixing `Delete` and `Remove`).
- Prefer familiar words over novelty — consistency builds recognition.
- Track preferred terms in a word list (feature names, actions, states to use vs. avoid).

### Tense and numbers

- Describe product behavior in the **present tense** (`Message sent`, not `Message has been sent`).
- Use **numerals** for numbers (`3 messages`, not `three messages`), except when mixing number uses (`Enter two 3s`).

### Pronouns and address

- Default to **second person** (`you`, `your`) — write as if the UI speaks directly to the user.
- **Do not mix** first and second person in the same phrase or screen (`Change your preferences in Account`, not `Change your preferences in My Account`).
- **Avoid `we` / `our`** — focus on what the user can do, not what the app does for them (`Get started with popular posts`, not `We're showing you popular posts`). Exception: when a real person acts on the user's behalf (`We'll review your appeal within a few days`).
- Use **`I` / `my` sparingly** — only when ownership must be explicit (legal acknowledgments: `I agree to the terms of service`).

### Referring to UI elements

- Name controls by their **visible label**, not control type (`Click Continue`, not `Click the Continue button`).
- Apply the same rule in instructions and accessibility text.

### Sentence structure

- **Lead with the objective**, then the action (`To remove a photo, drag it to the trash`, not the reverse).
- **Progressive disclosure** — state the essential detail first; add consequences in confirmations (`Remove downloaded book?` → body explains offline access).
- **Essential details only** — omit implementation caveats until the user needs them.
- Avoid absolutes like **"never"** when a factual statement works (`Your names aren't shared`, not `We'll never share your names`).

### Global writing

- Write **simple, clear English** — many users rely on English UI regardless of locale.
- Avoid **directional terms** (`left`, `right`) when localization may mirror the layout for RTL languages; prefer element names or neutral phrasing.
- Use **gender-neutral `they`** when gender is unknown; never combine forms like `his/her`.

### Material component priority

Match detail and tone to component urgency:

| Component | Priority | Copy approach |
|-----------|----------|---------------|
| Snackbar | Low | Brief; auto-dismisses; optional single action |
| Banner | Medium | Stays until dismissed or resolved |
| Dialog | High | Clear title states purpose; button text confirms action |

Dialog titles: brief statement or question. Snackbar labels: up to two lines on mobile, directly related to the process.

## Copy Types

### Headings and Descriptions

Answer in order: **What is this?** → **Why does it matter?** → **What can I do?**

```markdown
[Heading — noun phrase or task name, ≤8 words]
[Description — one sentence on purpose or outcome, ≤25 words]
```

### Buttons and Actions

- Start with a verb.
- Match the outcome, not the mechanism (`Import playlist`, not `Submit`).
- Destructive actions name the consequence (`Delete album`, not `Confirm`).
- Cancel/dismiss stays neutral (`Cancel`, `Close`).

### Form Labels and Helpers

- Labels name the field (`Playlist URL`, not `URL`).
- Placeholders show format, not repeat the label (`https://youtube.com/playlist?list=...`).
- Helper text explains constraints or why the field matters.
- Validation states the problem and fix (`Enter a valid URL starting with https://`).

### Empty States

```markdown
[Heading — what's missing]
[Description — how to add it, ≤20 words]
[Primary action button]
```

### Error States

```markdown
[Heading — what happened, no blame]
[Description — cause if known + next step]
[Primary action: Retry / Go back / Contact support]
```

Good: `Something went wrong on our side. Please retry in a moment.`
Bad: `Oops! You broke something. Try again.`

### Loading States

Name what's happening (`Importing playlist…`, `Saving changes…`). Use an ellipsis for in-progress actions.

### Accessibility Text

- `aria-label` describes purpose when visible text is insufficient (`aria-label="Play"`, `aria-label="Close dialog"`).
- Don't prepend "button" or "link" — screen readers announce the role.
- Mirror visible labels when possible; add context only when needed.

## Validation Checklist

Before finalizing copy, confirm:

- [ ] A new user understands the screen in one pass
- [ ] Every error includes a next step
- [ ] Button labels are verbs and match their outcome
- [ ] No jargon without explanation
- [ ] No blame, hype, or filler
- [ ] Sentence case and consistent terminology
- [ ] Copy fits the layout (flag if a label exceeds ~40 characters)
- [ ] Common words; no jargon or invented feature names
- [ ] Present tense; numerals for counts
- [ ] Second person only; no mixed `my`/`your` or unnecessary `we`
- [ ] UI elements referenced by label, not control type
- [ ] Objective leads the sentence; only essential details included

## Project Context

When writing for this repository, align with `.cursor/rules/project-goal.mdc`:

- Emphasize user ownership, local storage, and privacy where relevant
- Favor clarity over automation in feature descriptions
- Position as extensible and hackable, not feature-complete
- Target audience: self-hosters, privacy-focused users, audiophiles, developers

For UI copy, pair with `.cursor/rules/principles-of-visual-design.mdc`: copy hierarchy should match visual hierarchy (one primary message per region).

## Additional Resources

- Before/after examples: [examples.md](examples.md)
- Material Design 3: [Global writing — word choice](https://m3.material.io/foundations/content-design/global-writing/word-choice)
- Material Design 3: [Style guide — word choice (pronouns)](https://m3.material.io/foundations/content-design/style-guide/word-choice)
- Google Codelab: [Material's Communication Principles](https://codelabs.developers.google.com/codelabs/material-communication-guidance)
