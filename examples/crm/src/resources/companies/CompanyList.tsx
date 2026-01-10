import {
  List,
  Datagrid,
  TextField,
  UrlField,
  FunctionField,
} from 'shadmin'
import type { Company } from '../../dataProvider'

const statusColors: Record<Company['status'], string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  prospect: 'bg-purple-100 text-purple-800',
}

const sizeLabels: Record<Company['size'], string> = {
  small: 'Small (1-50)',
  medium: 'Medium (51-200)',
  large: 'Large (201-1000)',
  enterprise: 'Enterprise (1000+)',
}

export function CompanyList() {
  return (
    <List title="Companies">
      <Datagrid rowClick="show">
        <TextField source="name" />
        <TextField source="industry" />
        <FunctionField
          source="size"
          label="Size"
          render={(record) => sizeLabels[record.size]}
        />
        <FunctionField
          source="revenue"
          label="Revenue"
          render={(record) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(record.revenue)
          }
        />
        <TextField source="city" />
        <FunctionField
          source="status"
          label="Status"
          render={(record) => (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[record.status]}`}
            >
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </span>
          )}
        />
        <UrlField source="website" target="_blank" />
      </Datagrid>
    </List>
  )
}
