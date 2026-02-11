# Process

1. Decide which task to work on next. This should be the one YOU decide has the highest priority, not necessarily the first in the list.
2. Check any feedback loops, such as types and tests.
3. After completing each task, append to ${progressFile}:
   - Task completed and PRD item reference
   - Key decisions made and reasoning
   - Files changed
   - Any blockers or notes for next iteration.
   Keep entries concise. Sacrifice grammar for the sake of concision. This file helps future iterations skip exploration.
4. Make a git commit of that feature. Before committing, run ALL feedback loops: typecheck, lint, formatter, tests. Do NOT commit if any feedback loop fails. Fix issues first.
5. Keep changes small and focused:
   - One logical change per commit
   - If a task feels too large, break it into subtasks
   - Prefer multiple small commits over one large commit
   - Run feedback loops after each change, not at the end
   Quality over speed. Small steps compound into big progress.
6. ONLY WORK ON A SINGLE FEATURE.

# Task choice

When choosing the next task, prioritize in this order:
1. Architectural decisions and core abstractions
2. Integration points between modules
3. Unknown unknowns and spike work
4. Standard features and implementation
5. Polish, cleanup, and quick wins
Fail fast on risky work. Save easy wins for later.
