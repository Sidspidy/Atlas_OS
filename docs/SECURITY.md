# Atlas OS — Security Specification

## 1. Core Security Principles

Atlas OS interacts directly with local files, processes, and network resources. Security is enforced through multi-layered isolation.

---

## 2. Desktop IPC & Boundary Security

- **Context Isolation:** `contextIsolation: true` and `nodeIntegration: false` enforced on all WebContents renderers.
- **Validated IPC Channels:** Communication between renderer and main process occurs strictly over registered channel handlers with schema-validated input payloads.
- **No Direct Shell Access:** Renderer applications cannot execute arbitrary shell scripts. All terminal execution requests are routed through the main process Command Validator and Permission Engine.

---

## 3. Command Execution & Permission Engine

Every tool and terminal command is categorized into risk levels:

| Risk Level | Operations | Action |
|---|---|---|
| **Low** | `pwd`, `ls`, `git status`, `docker ps`, `read_file` | Allowed automatically |
| **Medium** | `git commit`, `npm test`, `build`, `write_file` | Audited, optional confirmation |
| **High** | `rm`, `rmdir`, `git reset --hard`, system config edit | **Requires Explicit User Approval** |

---

## 4. Privacy & Secret Storage

- **API Keys & Credentials:** Stored securely using native platform keychains (Windows Credential Manager / Keytar).
- **Filesystem Isolation:** Indexing occurs only in user-approved directory scopes. System directories (`C:\Windows`, system binaries, environment secrets `.env`) are excluded by default.
- **Audit Logging:** All autonomous tool invocations and user permissions are logged to local audit storage.
