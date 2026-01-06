import {
  Show,
  TextField,
  UrlField,
  FunctionField,
  DateField,
  ReferenceManyField,
  Datagrid,
  EmailField,
} from 'shadmin'
import type { Company, Contact, Deal } from '../../dataProvider'

const statusColors: Record<Company['status'], string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  prospect: 'bg-purple-100 text-purple-800',
}

const sizeLabels: Record<Company['size'], string> = {
  small: 'Small (1-50 employees)',
  medium: 'Medium (51-200 employees)',
  large: 'Large (201-1000 employees)',
  enterprise: 'Enterprise (1000+ employees)',
}

export function CompanyShow() {
  return (
    <Show title="Company Details">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <TextField source="name" className="block text-lg font-semibold" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Industry</label>
                <TextField source="industry" className="block" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Website</label>
                <UrlField source="website" target="_blank" className="block text-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <TextField source="phone" className="block" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Business Details</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Size</label>
                <FunctionField
                  render={(record: Company) => (
                    <p className="block">{sizeLabels[record.size]}</p>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Annual Revenue</label>
                <FunctionField
                  source="revenue"
                  render={(record: Company) => (
                    <p className="block text-lg font-semibold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(record.revenue)}
                    </p>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <FunctionField
                  source="status"
                  render={(record: Company) => (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[record.status]}`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Street Address</label>
              <TextField source="address" className="block" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">City</label>
              <TextField source="city" className="block" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">State</label>
              <TextField source="state" className="block" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Country</label>
              <TextField source="country" className="block" />
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

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Contacts</h3>
          <ReferenceManyField reference="contacts" target="companyId">
            <Datagrid>
              <FunctionField
                source="firstName"
                label="Name"
                render={(record: Contact) => `${record.firstName} ${record.lastName}`}
              />
              <EmailField source="email" />
              <TextField source="title" />
              <TextField source="status" />
            </Datagrid>
          </ReferenceManyField>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Deals</h3>
          <ReferenceManyField reference="deals" target="companyId">
            <Datagrid>
              <TextField source="title" />
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
              <TextField source="stage" />
              <FunctionField
                source="probability"
                label="Probability"
                render={(record: Deal) => `${record.probability}%`}
              />
              <DateField source="expectedCloseDate" label="Expected Close" />
            </Datagrid>
          </ReferenceManyField>
        </div>
      </div>
    </Show>
  )
}
