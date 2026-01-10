import { Admin, Resource } from 'shadmin'
import { dataProvider } from './dataProvider'
import { Dashboard } from './Dashboard'
import { ApiKeyList, ApiKeyCreate, ApiKeyEdit, ApiKeyShow } from './resources/api-keys'
import { WebhookList, WebhookCreate, WebhookEdit } from './resources/webhooks'
import { LogList, LogShow } from './resources/logs'
import { UsageList, UsageShow } from './resources/usage'

export function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      dashboard={Dashboard}
      title="Developer Dashboard"
    >
      <Resource
        name="api-keys"
        list={ApiKeyList}
        create={ApiKeyCreate}
        edit={ApiKeyEdit}
        show={ApiKeyShow}
      />
      <Resource
        name="webhooks"
        list={WebhookList}
        create={WebhookCreate}
        edit={WebhookEdit}
      />
      <Resource
        name="logs"
        list={LogList}
        show={LogShow}
      />
      <Resource
        name="usage"
        list={UsageList}
        show={UsageShow}
      />
    </Admin>
  )
}
