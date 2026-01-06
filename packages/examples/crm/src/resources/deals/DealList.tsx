import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  FunctionField,
  DateField,
} from 'shadmin'
import type { Deal } from '../../dataProvider'

const stageColors: Record<Deal['stage'], string> = {
  prospecting: 'bg-gray-100 text-gray-800',
  qualification: 'bg-blue-100 text-blue-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-purple-100 text-purple-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800',
}

const stageLabels: Record<Deal['stage'], string> = {
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
}

export function DealList() {
  return (
    <List title="Deals">
      <Datagrid rowClick="show">
        <TextField source="title" />
        <ReferenceField source="companyId" reference="companies" label="Company">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="contactId" reference="contacts" label="Contact">
          <FunctionField
            render={(record: { firstName: string; lastName: string }) =>
              `${record.firstName} ${record.lastName}`
            }
          />
        </ReferenceField>
        <FunctionField
          source="value"
          label="Value"
          render={(record: Deal) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: record.currency,
            }).format(record.value)
          }
        />
        <FunctionField
          source="stage"
          label="Stage"
          render={(record: Deal) => (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${stageColors[record.stage]}`}
            >
              {stageLabels[record.stage]}
            </span>
          )}
        />
        <FunctionField
          source="probability"
          label="Probability"
          render={(record: Deal) => (
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${record.probability}%` }}
                />
              </div>
              <span className="text-sm">{record.probability}%</span>
            </div>
          )}
        />
        <DateField source="expectedCloseDate" label="Expected Close" />
      </Datagrid>
    </List>
  )
}
