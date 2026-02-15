CREATE TABLE IF NOT EXISTS todo (
  id text PRIMARY KEY,
  workspace_id text NOT NULL,
  text text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at_ms bigint NOT NULL,
  updated_at_ms bigint NOT NULL,
  created_by text NOT NULL
);

CREATE INDEX IF NOT EXISTS todo_workspace_created_idx
  ON todo (workspace_id, created_at_ms);

CREATE INDEX IF NOT EXISTS todo_workspace_updated_idx
  ON todo (workspace_id, updated_at_ms);

CREATE TABLE IF NOT EXISTS todo_event (
  id text PRIMARY KEY,
  todo_id text NOT NULL,
  workspace_id text NOT NULL,
  user_id text NOT NULL,
  action text NOT NULL,
  at_ms bigint NOT NULL,
  payload_json jsonb
);

CREATE INDEX IF NOT EXISTS todo_event_workspace_at_idx
  ON todo_event (workspace_id, at_ms DESC);
