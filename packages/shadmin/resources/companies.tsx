import { List, Datagrid, TextField, UrlField } from 'shadmin'

export const name = 'companies'

export const list = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="industry" />
      <UrlField source="website" />
    </Datagrid>
  </List>
)

export const icon = () => <span>🏢</span>
