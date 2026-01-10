import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  SelectArrayInput,
} from 'shadmin'

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'lead', name: 'Lead' },
]

const tagChoices = [
  { id: 'decision-maker', name: 'Decision Maker' },
  { id: 'technical', name: 'Technical' },
  { id: 'executive', name: 'Executive' },
  { id: 'finance', name: 'Finance' },
  { id: 'procurement', name: 'Procurement' },
  { id: 'operations', name: 'Operations' },
  { id: 'it', name: 'IT' },
  { id: 'research', name: 'Research' },
  { id: 'project-management', name: 'Project Management' },
]

export function ContactCreate() {
  return (
    <Create title="Create Contact">
      <SimpleForm>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput source="firstName" label="First Name" required />
          <TextInput source="lastName" label="Last Name" required />
        </div>
        <TextInput source="email" label="Email" type="email" required />
        <TextInput source="phone" label="Phone" />
        <TextInput source="title" label="Job Title" />
        <ReferenceInput source="companyId" reference="companies" label="Company">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <SelectInput
          source="status"
          label="Status"
          choices={statusChoices}
          defaultValue="lead"
          required
        />
        <SelectArrayInput source="tags" label="Tags" choices={tagChoices} />
        <TextInput source="notes" label="Notes" multiline rows={4} />
      </SimpleForm>
    </Create>
  )
}
