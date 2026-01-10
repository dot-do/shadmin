import {
  Show,
  TextField,
  EmailField,
  ReferenceField,
  FunctionField,
  DateField,
  ArrayField,
  ReferenceManyField,
  Datagrid,
} from 'shadmin'
import type { Contact } from '../../dataProvider'

const statusColors: Record<Contact['status'], string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  lead: 'bg-blue-100 text-blue-800',
}

export function ContactShow() {
  return (
    <Show title="Contact Details">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <FunctionField
                  render={(record: Contact) => (
                    <p className="text-lg">{`${record.firstName} ${record.lastName}`}</p>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <EmailField source="email" className="block" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <TextField source="phone" className="block" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <TextField source="title" className="block" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Organization</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <ReferenceField source="companyId" reference="companies">
                  <TextField source="name" className="block text-primary" />
                </ReferenceField>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <FunctionField
                  source="status"
                  render={(record: Contact) => (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[record.status]}`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tags</label>
                <ArrayField source="tags">
                  <FunctionField
                    render={(record: { tags: string[] }) => (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(record.tags || []).map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  />
                </ArrayField>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Notes</h3>
          <TextField source="notes" className="block whitespace-pre-wrap" />
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

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Related Deals</h3>
          <ReferenceManyField reference="deals" target="contactId">
            <Datagrid>
              <TextField source="title" />
              <FunctionField
                source="value"
                label="Value"
                render={(record: { value: number; currency: string }) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: record.currency,
                  }).format(record.value)
                }
              />
              <TextField source="stage" />
              <DateField source="expectedCloseDate" label="Expected Close" />
            </Datagrid>
          </ReferenceManyField>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Activities</h3>
          <ReferenceManyField reference="activities" target="contactId">
            <Datagrid>
              <TextField source="type" />
              <TextField source="subject" />
              <DateField source="dueDate" showTime />
              <FunctionField
                source="completed"
                label="Status"
                render={(record: { completed: boolean }) => (
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
