# gpt-multi-agents

[🌐 Live Demo](https://joaomede.github.io/gpt-multi-agents/)

## Core Objective

Build a multi-agent contextual chatroom where a user can interact with multiple configured agents (personas). The user chooses which agent responds to each question. Every agent receives the entire conversation history, including:

- The most recent user question
- All prior agent responses with their names and specializations

This history allows every reply to remain context aware and continuous.

## Architecture Overview

The application exposes a single chatroom interface. A user selects which agent
should respond via a dropdown or similar selector. Each response shows the
agent name, its specialization and the message content. The chatroom fills the
entire page and the message list scrolls as the conversation grows, automatically
jumping to the latest message. All agents can see the
entire conversation history so they can provide contextual answers. User
questions are typed into a growing text area for comfortable multi-line input.

Users may also manage agents through the front-end UI. New personas can be
added or existing ones edited and deleted without restarting the application.
Each agent definition includes a base prompt describing how it should behave.
Agent management and other settings are accessed from buttons in a left sidebar
that also contains the agent selector. The sidebar occupies one quarter of the
page width. Buttons open dialogs for history settings, agent editing and API
key configuration. The gear icon opens the Settings dialog where you can choose
how many recent messages are used as context; click **Save** to confirm your
change.

To keep conversations concise, the UI exposes a numeric control that limits the
amount of history sent to the LLM. Only the last *N* message blocks (user
question plus agent responses) are forwarded, ensuring consistent context while
avoiding overly long prompts.

## Project Layout

- `agents/` – JSON configuration files for the available personas.
- `tests/` – automated tests run with `npm test`.
- `frontend/` – Vue 3 application bootstrapped with Vuetify and Vite 7.
- `AGENTS.md` – repository guidelines and knowledge base.

## Front-End Components

The UI is composed of several Vue components:

- **ChatRoom** – manages conversation state and brings everything together.
- **AgentSelector** – choose which agent should answer next.
- **MessageList** – displays the conversation history.
- **AgentEditor** – create new agents or select existing ones to edit or delete with a save/cancel flow.
- **SettingsPanel** – control how many previous messages are used as context. Use the **Save** button to apply the new value and close the dialog.

Dialogs are wrapped in Vuetify cards to avoid transparent backgrounds. The chatroom features a gradient background and animated Send button.

## Adding Agents

Agent personas are defined as JSON files stored in the `agents/` directory. Each
file must provide a `name`, a `specialization` describing the agent's
expertise, a `base_prompt` that sets its persona and a `model` field. The model
is selected from a predefined list available in the Agent Editor. Supported
models include `gpt-4o`, `gpt-4.1`, `o1-pro` and many others.
Example:

```json
{
  "name": "HelperBot",
  "specialization": "general knowledge",
  "base_prompt": "You are a friendly assistant who answers briefly.",
  "model": "gpt-4o"
}
```

## Example API Messages

The conversation history is sent to the OpenAI API as an array of messages. Each
agent sees the previous responses so it can answer in context:

```json
[
  { "role": "system", "content": "You are Dana, a digital marketing strategist." },

  { "role": "user", "content": "Which channels would be most effective for product X?" },
  { "role": "assistant", "content": "Agent Alex (Finance): Product X targets a high-income audience, suggesting segmented campaigns on LinkedIn and Google Ads." },
  { "role": "assistant", "content": "Agent Lucia (UX Designer): The experience should prioritize mobile-first navigation, especially for social media access." },

  { "role": "user", "content": "How does this impact the content strategy?" }
]
```

## Caching and Conversation Storage

Agents and conversations are stored locally in the browser's `localStorage`.
Each conversation is represented as an array of message blocks containing:

- `author` – the user or agent name
- `specialization` – the agent's expertise (empty for user messages)
- `content` – the text of the message
- `timestamp` – ISO formatted date string

An example conversation file can be found in `examples/example_conversation.json`.

## Front-End Setup

The Vue 3 front-end lives in the `frontend/` directory and is configured with Vuetify and Vite. We use Vite 7 along with `@vitejs/plugin-vue` 6 for improved compatibility with Vue 3 and Vuetify. The UI uses Material Design Icons via the `@mdi/font` package. Development and CI use **Node.js 22**.
To start a development server:

```bash
cd frontend
npm install
npm run dev
```
This launches the app at `http://localhost:5173` by default.

### Configuring OpenAI Access

The chatroom uses the OpenAI API to generate agent responses. A button with a key icon in the sidebar opens a dialog where you can enter or update your API key. The value is persisted in `localStorage` under the key `openai_api_key`.

## Running Tests

Install dependencies and run the test suite using npm:

```bash
npm test
```

Every new feature should include tests to ensure correct behavior. The tests verify example configuration files and the front-end package manifest.

## Continuous Deployment

Each commit pushed to a pull request triggers a GitHub Actions workflow that runs the tests, builds the Vue front end and deploys the resulting `frontend/dist` directory to GitHub Pages. See `.github/workflows/deploy.yml` for the full configuration.
The workflow installs **Node.js 22** to match local development.

