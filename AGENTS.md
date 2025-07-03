# AGENTS instructions

This project builds a multi-agent contextual chatroom. Follow these guidelines when contributing:

- Keep this file updated with project knowledge and guidelines.
- Update `README.md` whenever user documentation or instructions change.
- Store agent configuration files as JSON in the `agents/` directory.
- Run tests using `npm test` before committing changes. Add or modify tests in `tests/` to cover new functionality.
- The Vue 3 front-end is located in `frontend/` and bootstrapped with Vite 7 and `@vitejs/plugin-vue` 6 for compatibility with the Vuetify plugin. Vuetify provides styling and the OpenAI client library handles completions. Material Design Icons are provided by the `@mdi/font` package and configured in `frontend/src/main.js`. Dialogs are wrapped in Vuetify cards to avoid transparent backgrounds.
- A GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys the front-end to GitHub Pages for every commit pushed to a pull request.
  The workflow installs Node.js 22 so the build matches the expected runtime.

Agent JSON files must include a `name`, `specialization`, `base_prompt` and `model` field. The `model` value is chosen from a predefined list in the Agent Editor. Supported options include `gpt-4o`, `gpt-4.1`, `o1-pro` and others. The front-end UI allows users to add, edit or delete these agent personas at runtime. Existing agents can be selected and updated using the same form that adds new ones.

## Architecture Notes

- A single chatroom interface allows the user to select which agent responds.
- A single chatroom interface fills the browser viewport and scrolls as needed,
  automatically jumping to the newest message.
- Every agent sees the full conversation history to maintain context.
- Messages display the agent name, specialization and content.
- The UI offers a numeric control to limit how many recent message blocks are
  included when sending prompts to the LLM.
- The chatroom uses a gradient background and an animated Send button for a more engaging UI.
- See the README for an example message array demonstrating the history passed
  to the OpenAI API.
- Conversations are persisted in `localStorage` as arrays of message blocks
  containing `author`, `specialization`, `content` and an optional `timestamp`.
  See `examples/example_conversation.json` for the expected format.
  - The front-end is powered by Vue 3 and Vite 7 (see the `frontend/` directory).
- Vuetify components provide the UI with the following structure: `ChatRoom`,
  `AgentSelector`, `MessageList`, `AgentEditor`, `SettingsPanel` and `ApiKeyDialog`.
  Agent management, settings and API key editing are presented in dialogs opened
  from icons in the chatroom header so the interface stays uncluttered.

