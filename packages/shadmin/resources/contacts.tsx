import { List, Datagrid, TextField, EmailField, ReferenceField } from 'shadmin'

export const name = 'contacts'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <EmailField source="email" />
      <ReferenceField source="companyId" reference="companies">
        <TextField source="name" />
      </ReferenceField>
    </Datagrid>
  </List>
)

export const icon = () => <span>👤</span>
