import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  FunctionField,
  DateField,
} from 'shadmin'
import type { Activity } from '../../dataProvider'

const typeIcons: Record<Activity['type'], string> = {
  call: '\uD83D\uDCDE',
  email: '\u2709\uFE0F',
  meeting: '\uD83D\uDCC5',
  task: '\u2705',
  note: '\uD83D\uDCDD',
}

const priorityColors: Record<Activity['priority'], string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

export function ActivityList() {
  return (
    <List title="Activities">
      <Datagrid rowClick="show">
        <FunctionField
          source="type"
          label="Type"
          render={(record: Activity) => (
            <span className="flex items-center gap-2">
              <span>{typeIcons[record.type]}</span>
              <span className="capitalize">{record.type}</span>
            </span>
          )}
        />
        <TextField source="subject" />
        <ReferenceField source="contactId" reference="contacts" label="Contact">
          <FunctionField
            render={(record: { firstName: string; lastName: string }) =>
              `${record.firstName} ${record.lastName}`
            }
          />
        </ReferenceField>
        <ReferenceField source="companyId" reference="companies" label="Company">
          <TextField source="name" />
        </ReferenceField>
        <DateField source="dueDate" showTime label="Due Date" />
        <FunctionField
          source="priority"
          label="Priority"
          render={(record: Activity) => (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${priorityColors[record.priority]}`}
            >
              {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
            </span>
          )}
        />
        <FunctionField
          source="completed"
          label="Status"
          render={(record: Activity) => (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                record.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {record.completed ? 'Completed' : 'Pending'}
            </span>
          )}
        />
      </Datagrid>
    </List>
  )
}
