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

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
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

// Scope badges component
const ScopeBadges = ({ scopes }: { scopes: string[] }) => {
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
      <FunctionField<ApiKey>
        source="status"
        render={(record) => <StatusBadge status={record.status} />}
      />
      <FunctionField<ApiKey>
        source="scopes"
        render={(record) => <ScopeBadges scopes={record.scopes} />}
      />
      <FunctionField<ApiKey>
        source="requestCount"
        render={(record) => record.requestCount.toLocaleString()}
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
          <FunctionField<ApiKey>
            source="status"
            render={(record) => <StatusBadge status={record.status} />}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Key Prefix</label>
          <TextField source="prefix" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Scopes</label>
          <FunctionField<ApiKey>
            source="scopes"
            render={(record) => <ScopeBadges scopes={record.scopes} />}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Rate Limit</label>
          <FunctionField<ApiKey>
            source="rateLimit"
            render={(record) => `${record.rateLimit.toLocaleString()} req/hour`}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Total Requests</label>
          <FunctionField<ApiKey>
            source="requestCount"
            render={(record) => record.requestCount.toLocaleString()}
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
          <FunctionField<ApiKey>
            source="expiresAt"
            render={(record) => record.expiresAt ? new Date(record.expiresAt).toLocaleString() : 'Never'}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
        <FunctionField<ApiKey>
          render={(record) => (
            <CodeSnippet
              language="bash"
              code={`curl -X GET "https://api.example.com/v1/data" \\
  -H "Authorization: Bearer ${record.prefix}..." \\
  -H "Content-Type: application/json"`}
            />
          )}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">SDK Example</h3>
        <FunctionField<ApiKey>
          render={(record) => (
            <CodeSnippet
              language="javascript"
              code={`import { Client } from '@example/sdk';

const client = new Client({
  apiKey: '${record.prefix}...',
});

// Make authenticated requests
const data = await client.getData();
console.log(data);`}
            />
          )}
        />
      </div>
    </div>
  </Show>
)
