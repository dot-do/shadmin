/**
 * AI Agents Management Application
 * Built with shadmin
 */

import { Admin, Layout } from 'shadmin'
// @ts-expect-error Resource not yet exported from shadmin
import { Resource } from 'react-admin'
import { dataProvider } from './dataProvider'
import { Dashboard } from './Dashboard'

// Agent resources
import { AgentList, AgentShow, AgentEdit, AgentCreate } from './resources/agents'

// Conversation resources
import { ConversationList, ConversationShow } from './resources/conversations'

// Tool resources
import { ToolList, ToolShow, ToolEdit, ToolCreate } from './resources/tools'

// Prompt resources
import { PromptList, PromptShow, PromptEdit, PromptCreate } from './resources/prompts'

export function App() {
  return (
    <Admin
      dataProvider={dataProvider as any}
      dashboard={Dashboard}
      layout={Layout}
      title="AI Agents Management"
    >
      <Resource
        name="agents"
        list={AgentList}
        show={AgentShow}
        edit={AgentEdit}
        create={AgentCreate}
      />
      <Resource
        name="conversations"
        list={ConversationList}
        show={ConversationShow}
      />
      <Resource
        name="tools"
        list={ToolList}
        show={ToolShow}
        edit={ToolEdit}
        create={ToolCreate}
      />
      <Resource
        name="prompts"
        list={PromptList}
        show={PromptShow}
        edit={PromptEdit}
        create={PromptCreate}
      />
    </Admin>
  )
}

export default App
