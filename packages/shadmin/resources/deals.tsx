import { List, Datagrid, TextField, NumberField, ReferenceField } from 'shadmin'

export const name = 'deals'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceField source="companyId" reference="companies">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="value" options={{ style: 'currency', currency: 'USD' }} />
      <TextField source="stage" />
    </Datagrid>
  </List>
)

export const icon = () => <span>💰</span>
