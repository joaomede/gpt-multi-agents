# gpt-multi-agents

## Core Objective

Build a multi-agent contextual chatroom where a user can interact with multiple configured agents (personas). The user chooses which agent responds to each question. Every agent receives the entire conversation history, including:

- The most recent user question
- All prior agent responses with their names and specializations

This history allows every reply to remain context aware and continuous.

## Architecture Overview

The application exposes a single chatroom interface. A user selects which agent
should respond via a dropdown or similar selector. Each response shows the
agent name, its specialization and the message content. All agents can see the
entire conversation history so they can provide contextual answers.

Users may also manage agents through the front-end UI. New personas can be
added or existing ones edited and deleted without restarting the application.
Each agent definition includes a base prompt describing how it should behave.

To keep conversations concise, the UI exposes a numeric control that limits the
amount of history sent to the LLM. Only the last *N* message blocks (user
question plus agent responses) are forwarded, ensuring consistent context while
avoiding overly long prompts.

## Project Layout

- `agents/` – JSON configuration files for the available personas.
- `tests/` – automated tests run with `npm test`.
- `frontend/` – Vue 3 application bootstrapped with Vite and styled with Vuetify.
- `AGENTS.md` – repository guidelines and knowledge base.

## Front-End Components

The UI is composed of several Vue components:

- **ChatRoom** – manages conversation state and brings everything together.
- **AgentSelector** – choose which agent should answer next.
- **MessageList** – displays the conversation history.
- **AgentEditor** – create, edit or delete agent personas.
- **SettingsPanel** – control how many previous messages are used as context.

## Adding Agents

Agent personas are defined as JSON files stored in the `agents/` directory. Each
file must provide a `name`, a `specialization` describing the agent's
expertise, a `base_prompt` that sets its persona and a `model` field. Example:

```json
{
  "name": "HelperBot",
  "specialization": "general knowledge",
  "base_prompt": "You are a friendly assistant who answers briefly.",
  "model": "gpt-3.5-turbo"
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

The Vue 3 front-end lives in the `frontend/` directory and is configured with Vite and Vuetify for styling.
To start a development server:

```bash
cd frontend
npm install
npm run dev
```
This launches the app at `http://localhost:5173` by default.

### Configuring OpenAI Access

The chatroom uses the OpenAI API to generate agent responses. Provide your API key by storing it in `localStorage` under the key `openai_api_key` before interacting with the chatroom. The key is persisted locally so you only need to set it once.

## Running Tests

Install dependencies and run the test suite using npm:

```bash
npm test
```

Every new feature should include tests to ensure correct behavior. The tests verify example configuration files and the front-end package manifest.

## Continuous Deployment

Each commit pushed to a pull request triggers a GitHub Actions workflow that runs the tests, builds the Vue front end and deploys the resulting `frontend/dist` directory to GitHub Pages. See `.github/workflows/deploy.yml` for the full configuration.

