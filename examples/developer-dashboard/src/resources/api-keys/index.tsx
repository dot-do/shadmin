import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  Create,
  Edit,
  Show,
  SimpleForm,
  TextInput,
  SelectInput,
  SelectArrayInput,
  NumberInput,
  DateTimeInput,
} from 'shadmin'
import type { ApiKey } from '../../dataProvider'
import { CodeSnippet } from '../../components/CodeSnippet'

// Render helpers
const renderStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    revoked: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>
      {status}
    </span>
  )
}

const renderScopeBadges = (scopes: string[]) => {
  const scopeColors: Record<string, string> = {
    read: 'bg-blue-100 text-blue-800',
    write: 'bg-yellow-100 text-yellow-800',
    delete: 'bg-red-100 text-red-800',
  }
  return (
    <div className="flex gap-1 flex-wrap">
      {scopes.map(scope => (
        <span
          key={scope}
          className={`px-2 py-0.5 rounded text-xs font-medium ${scopeColors[scope] || 'bg-gray-100 text-gray-800'}`}
        >
          {scope}
        </span>
      ))}
    </div>
  )
}

export const ApiKeyList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="name" />
      <TextField source="prefix" />
      <FunctionField
        render={(record) => {
          const r = record as ApiKey | undefined
          return r ? renderStatusBadge(r.status) : null
        }}
      />
      <FunctionField
        render={(record) => {
          const r = record as ApiKey | undefined
          return r ? renderScopeBadges(r.scopes) : null
        }}
      />
      <FunctionField
        render={(record) => {
          const r = record as ApiKey | undefined
          return r ? r.requestCount.toLocaleString() : null
        }}
      />
      <DateField source="lastUsed" showTime />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
)

const scopeChoices = [
  { id: 'read', name: 'Read' },
  { id: 'write', name: 'Write' },
  { id: 'delete', name: 'Delete' },
]

export const ApiKeyCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" required />
      <SelectArrayInput source="scopes" choices={scopeChoices} required />
      <NumberInput source="rateLimit" defaultValue={1000} helperText="Requests per hour" />
      <DateTimeInput source="expiresAt" helperText="Leave empty for no expiration" />
    </SimpleForm>
  </Create>
)

export const ApiKeyEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" required />
      <SelectArrayInput source="scopes" choices={scopeChoices} required />
      <SelectInput
        source="status"
        choices={[
          { id: 'active', name: 'Active' },
          { id: 'revoked', name: 'Revoked' },
        ]}
      />
      <NumberInput source="rateLimit" helperText="Requests per hour" />
      <DateTimeInput source="expiresAt" helperText="Leave empty for no expiration" />
    </SimpleForm>
  </Edit>
)

export const ApiKeyShow = () => (
  <Show>
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Name</label>
          <TextField source="name" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <FunctionField
            render={(record) => {
              const r = record as ApiKey | undefined
              return r ? renderStatusBadge(r.status) : null
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Key Prefix</label>
          <TextField source="prefix" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Scopes</label>
          <FunctionField
            render={(record) => {
              const r = record as ApiKey | undefined
              return r ? renderScopeBadges(r.scopes) : null
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Rate Limit</label>
          <FunctionField
            render={(record) => {
              const r = record as ApiKey | undefined
              return r ? `${r.rateLimit.toLocaleString()} req/hour` : null
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Total Requests</label>
          <FunctionField
            render={(record) => {
              const r = record as ApiKey | undefined
              return r ? r.requestCount.toLocaleString() : null
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Created</label>
          <DateField source="createdAt" showTime />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Last Used</label>
          <DateField source="lastUsed" showTime />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Expires</label>
          <FunctionField
            render={(record) => {
              const r = record as ApiKey | undefined
              return r?.expiresAt ? new Date(r.expiresAt).toLocaleString() : 'Never'
            }}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
        <FunctionField
          render={(record) => {
            const r = record as ApiKey | undefined
            if (!r) return null
            return (
              <CodeSnippet
                language="bash"
                code={`curl -X GET "https://api.example.com/v1/data" \\
  -H "Authorization: Bearer ${r.prefix}..." \\
  -H "Content-Type: application/json"`}
              />
            )
          }}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">SDK Example</h3>
        <FunctionField
          render={(record) => {
            const r = record as ApiKey | undefined
            if (!r) return null
            return (
              <CodeSnippet
                language="javascript"
                code={`import { Client } from '@example/sdk';

const client = new Client({
  apiKey: '${r.prefix}...',
});

// Make authenticated requests
const data = await client.getData();
console.log(data);`}
              />
            )
          }}
        />
      </div>
    </div>
  </Show>
)
