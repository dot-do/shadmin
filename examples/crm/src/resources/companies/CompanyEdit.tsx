import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
} from 'shadmin'

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'prospect', name: 'Prospect' },
]

const sizeChoices = [
  { id: 'small', name: 'Small (1-50)' },
  { id: 'medium', name: 'Medium (51-200)' },
  { id: 'large', name: 'Large (201-1000)' },
  { id: 'enterprise', name: 'Enterprise (1000+)' },
]

const industryChoices = [
  { id: 'Technology', name: 'Technology' },
  { id: 'Software', name: 'Software' },
  { id: 'Manufacturing', name: 'Manufacturing' },
  { id: 'Biotechnology', name: 'Biotechnology' },
  { id: 'Healthcare', name: 'Healthcare' },
  { id: 'Finance', name: 'Finance' },
  { id: 'Retail', name: 'Retail' },
  { id: 'Conglomerate', name: 'Conglomerate' },
  { id: 'Other', name: 'Other' },
]

export function CompanyEdit() {
  return (
    <Edit title="Edit Company">
      <SimpleForm>
        <TextInput source="name" label="Company Name" required />
        <SelectInput source="industry" label="Industry" choices={industryChoices} required />
        <TextInput source="website" label="Website" type="url" />
        <TextInput source="phone" label="Phone" />

        <h4 className="text-md font-semibold mt-4 mb-2">Address</h4>
        <TextInput source="address" label="Street Address" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput source="city" label="City" />
          <TextInput source="state" label="State" />
          <TextInput source="country" label="Country" />
        </div>

        <h4 className="text-md font-semibold mt-4 mb-2">Business Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput source="size" label="Company Size" choices={sizeChoices} required />
          <SelectInput source="status" label="Status" choices={statusChoices} required />
        </div>
        <NumberInput source="revenue" label="Annual Revenue (USD)" min={0} />
      </SimpleForm>
    </Edit>
  )
}
