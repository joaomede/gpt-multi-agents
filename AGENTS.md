# AGENTS instructions

This project builds a multi-agent contextual chatroom. Follow these guidelines when contributing:

- Keep this file updated with project knowledge and guidelines.
- Update `README.md` whenever user documentation or instructions change.
- Store agent configuration files as JSON in the `agents/` directory.
- Run tests using `npm test` before committing changes. Add or modify tests in `tests/` to cover new functionality.
- The Vue 3 front-end is located in `frontend/` and bootstrapped with Vite. Vuetify provides styling and the OpenAI client library handles completions.
- A GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys the front-end to GitHub Pages for every commit pushed to a pull request.

Agent JSON files must include a `name`, `specialization`, `base_prompt` and `model` field. The front-end UI allows users to add, edit or delete these agent personas at runtime.

## Architecture Notes

- A single chatroom interface allows the user to select which agent responds.
- Every agent sees the full conversation history to maintain context.
- Messages display the agent name, specialization and content.
- The UI offers a numeric control to limit how many recent message blocks are
  included when sending prompts to the LLM.
- See the README for an example message array demonstrating the history passed
  to the OpenAI API.
- Conversations are persisted in `localStorage` as arrays of message blocks
  containing `author`, `specialization`, `content` and an optional `timestamp`.
  See `examples/example_conversation.json` for the expected format.
- The front-end is powered by Vue 3 and Vite (see the `frontend/` directory).
- Vuetify components provide the UI with the following structure: `ChatRoom`,
  `AgentSelector`, `MessageList`, `AgentEditor` and `SettingsPanel`.

