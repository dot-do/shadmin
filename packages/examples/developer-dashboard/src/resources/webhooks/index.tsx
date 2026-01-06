import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  SelectArrayInput,
} from 'shadmin'
import type { Webhook } from '../../dataProvider'
import { CodeSnippet } from '../../components/CodeSnippet'

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>
      {status}
    </span>
  )
}

// Event badges component
const EventBadges = ({ events }: { events: string[] }) => {
  return (
    <div className="flex gap-1 flex-wrap">
      {events.slice(0, 3).map(event => (
        <span
          key={event}
          className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
        >
          {event}
        </span>
      ))}
      {events.length > 3 && (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          +{events.length - 3} more
        </span>
      )}
    </div>
  )
}

// Success rate indicator
const SuccessRate = ({ rate }: { rate: number }) => {
  const color = rate >= 99 ? 'text-green-600' : rate >= 95 ? 'text-yellow-600' : 'text-red-600'
  return (
    <span className={`font-medium ${color}`}>
      {rate.toFixed(1)}%
    </span>
  )
}

export const WebhookList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <FunctionField<Webhook>
        source="url"
        render={(record) => (
          <span className="font-mono text-sm text-gray-600 truncate max-w-xs block">
            {record.url}
          </span>
        )}
      />
      <FunctionField<Webhook>
        source="status"
        render={(record) => <StatusBadge status={record.status} />}
      />
      <FunctionField<Webhook>
        source="events"
        render={(record) => <EventBadges events={record.events} />}
      />
      <FunctionField<Webhook>
        source="successRate"
        render={(record) => <SuccessRate rate={record.successRate} />}
      />
      <FunctionField<Webhook>
        source="failureCount"
        render={(record) => (
          <span className={record.failureCount > 0 ? 'text-red-600' : 'text-gray-500'}>
            {record.failureCount}
          </span>
        )}
      />
      <DateField source="lastTriggered" showTime />
    </Datagrid>
  </List>
)

const eventChoices = [
  { id: 'order.created', name: 'order.created' },
  { id: 'order.updated', name: 'order.updated' },
  { id: 'order.completed', name: 'order.completed' },
  { id: 'order.cancelled', name: 'order.cancelled' },
  { id: 'user.created', name: 'user.created' },
  { id: 'user.updated', name: 'user.updated' },
  { id: 'user.deleted', name: 'user.deleted' },
  { id: 'payment.succeeded', name: 'payment.succeeded' },
  { id: 'payment.failed', name: 'payment.failed' },
  { id: 'refund.created', name: 'refund.created' },
  { id: 'event.*', name: 'event.* (all events)' },
]

export const WebhookCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput
        source="url"
        required
        helperText="HTTPS endpoint that will receive webhook events"
      />
      <SelectArrayInput
        source="events"
        choices={eventChoices}
        required
        helperText="Select the events you want to receive"
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Webhook Payload Example</h4>
        <CodeSnippet
          language="json"
          code={`{
  "id": "evt_1234567890",
  "type": "order.created",
  "created": 1704499200,
  "data": {
    "object": {
      "id": "ord_abc123",
      "amount": 9999,
      "currency": "usd",
      "status": "pending"
    }
  }
}`}
        />
      </div>
    </SimpleForm>
  </Create>
)

export const WebhookEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput
        source="url"
        required
        helperText="HTTPS endpoint that will receive webhook events"
      />
      <SelectInput
        source="status"
        choices={[
          { id: 'active', name: 'Active' },
          { id: 'paused', name: 'Paused' },
        ]}
      />
      <SelectArrayInput
        source="events"
        choices={eventChoices}
        required
        helperText="Select the events you want to receive"
      />

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Signing Secret</h4>
          <p className="text-sm text-gray-600 mb-2">
            Use this secret to verify webhook signatures
          </p>
          <FunctionField<Webhook>
            render={(record) => (
              <CodeSnippet
                language="text"
                code={record.secret}
              />
            )}
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Signature Verification (Node.js)</h4>
          <FunctionField<Webhook>
            render={(record) => (
              <CodeSnippet
                language="javascript"
                code={`import crypto from 'crypto';

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', '${record.secret}')
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// In your webhook handler
app.post('/webhooks', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhook(
    JSON.stringify(req.body),
    signature,
    process.env.WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process the webhook
  const { type, data } = req.body;
  console.log(\`Received event: \${type}\`);

  res.json({ received: true });
});`}
              />
            )}
          />
        </div>
      </div>
    </SimpleForm>
  </Edit>
)
