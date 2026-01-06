import {
  Show,
  TextField,
  ReferenceField,
  FunctionField,
  DateField,
  ReferenceManyField,
  Datagrid,
} from 'shadmin'
import type { Deal, Activity } from '../../dataProvider'

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

export function DealShow() {
  return (
    <Show title="Deal Details">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Deal Information</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <TextField source="title" className="block text-lg font-semibold" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <TextField source="description" className="block whitespace-pre-wrap" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Stage</label>
                <FunctionField
                  source="stage"
                  render={(record: Deal) => (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${stageColors[record.stage]}`}
                    >
                      {stageLabels[record.stage]}
                    </span>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Financial Details</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Deal Value</label>
                <FunctionField
                  source="value"
                  render={(record: Deal) => (
                    <p className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: record.currency,
                      }).format(record.value)}
                    </p>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Probability</label>
                <FunctionField
                  source="probability"
                  render={(record: Deal) => (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${record.probability}%` }}
                        />
                      </div>
                      <span className="text-lg font-semibold">{record.probability}%</span>
                    </div>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Weighted Value
                </label>
                <FunctionField
                  render={(record: Deal) => (
                    <p className="text-lg">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: record.currency,
                      }).format(record.value * (record.probability / 100))}
                    </p>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Related Records</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <ReferenceField source="companyId" reference="companies">
                  <TextField source="name" className="block text-primary font-medium" />
                </ReferenceField>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Primary Contact</label>
                <ReferenceField source="contactId" reference="contacts">
                  <FunctionField
                    render={(record: { firstName: string; lastName: string; email: string }) => (
                      <div>
                        <p className="font-medium">{`${record.firstName} ${record.lastName}`}</p>
                        <p className="text-sm text-muted-foreground">{record.email}</p>
                      </div>
                    )}
                  />
                </ReferenceField>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Timeline</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Expected Close Date
                </label>
                <DateField source="expectedCloseDate" className="block text-lg" />
              </div>
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Activities</h3>
          <ReferenceManyField reference="activities" target="dealId">
            <Datagrid>
              <TextField source="type" />
              <TextField source="subject" />
              <DateField source="dueDate" showTime />
              <FunctionField
                source="priority"
                label="Priority"
                render={(record: Activity) => {
                  const colors = {
                    low: 'bg-gray-100 text-gray-800',
                    medium: 'bg-yellow-100 text-yellow-800',
                    high: 'bg-red-100 text-red-800',
                  }
                  return (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[record.priority]}`}
                    >
                      {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                    </span>
                  )
                }}
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
          </ReferenceManyField>
        </div>
      </div>
    </Show>
  )
}
