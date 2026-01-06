import {
  List,
  Datagrid,
  TextField,
  EmailField,
  ReferenceField,
  FunctionField,
} from 'shadmin'
import type { Contact } from '../../dataProvider'

const statusColors: Record<Contact['status'], string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  lead: 'bg-blue-100 text-blue-800',
}

export function ContactList() {
  return (
    <List title="Contacts">
      <Datagrid rowClick="show">
        <FunctionField
          source="firstName"
          label="Name"
          render={(record: Contact) => `${record.firstName} ${record.lastName}`}
        />
        <EmailField source="email" />
        <TextField source="title" />
        <ReferenceField source="companyId" reference="companies" label="Company">
          <TextField source="name" />
        </ReferenceField>
        <FunctionField
          source="status"
          label="Status"
          render={(record: Contact) => (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[record.status]}`}
            >
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </span>
          )}
        />
        <TextField source="phone" />
      </Datagrid>
    </List>
  )
}
