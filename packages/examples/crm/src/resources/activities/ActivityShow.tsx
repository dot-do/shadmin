import {
  Show,
  TextField,
  ReferenceField,
  FunctionField,
  DateField,
  BooleanField,
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

export function ActivityShow() {
  return (
    <Show title="Activity Details">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Activity Information</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <FunctionField
                  source="type"
                  render={(record: Activity) => (
                    <p className="flex items-center gap-2 text-lg">
                      <span>{typeIcons[record.type]}</span>
                      <span className="capitalize">{record.type}</span>
                    </p>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <TextField source="subject" className="block text-lg font-semibold" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <TextField source="description" className="block whitespace-pre-wrap" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Status</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                <DateField source="dueDate" showTime className="block text-lg" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <FunctionField
                  source="priority"
                  render={(record: Activity) => (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${priorityColors[record.priority]}`}
                    >
                      {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                    </span>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Completion Status</label>
                <FunctionField
                  source="completed"
                  render={(record: Activity) => (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        record.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {record.completed ? 'Completed' : 'Pending'}
                    </span>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Related Records</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact</label>
              <ReferenceField source="contactId" reference="contacts">
                <FunctionField
                  render={(record: { firstName: string; lastName: string; email: string }) => (
                    <div>
                      <p className="font-medium text-primary">{`${record.firstName} ${record.lastName}`}</p>
                      <p className="text-sm text-muted-foreground">{record.email}</p>
                    </div>
                  )}
                />
              </ReferenceField>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company</label>
              <ReferenceField source="companyId" reference="companies">
                <TextField source="name" className="block text-primary font-medium" />
              </ReferenceField>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Deal</label>
              <ReferenceField source="dealId" reference="deals" emptyText="No deal linked">
                <TextField source="title" className="block text-primary font-medium" />
              </ReferenceField>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created</label>
            <DateField source="createdAt" showTime className="block" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <DateField source="updatedAt" showTime className="block" />
          </div>
        </div>
      </div>
    </Show>
  )
}
