import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  BooleanInput,
  DateTimeInput,
} from 'shadmin'

const typeChoices = [
  { id: 'call', name: 'Call' },
  { id: 'email', name: 'Email' },
  { id: 'meeting', name: 'Meeting' },
  { id: 'task', name: 'Task' },
  { id: 'note', name: 'Note' },
]

const priorityChoices = [
  { id: 'low', name: 'Low' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
]

export function ActivityEdit() {
  return (
    <Edit title="Edit Activity">
      <SimpleForm>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput source="type" label="Activity Type" choices={typeChoices} required />
          <SelectInput source="priority" label="Priority" choices={priorityChoices} required />
        </div>

        <TextInput source="subject" label="Subject" required />
        <TextInput source="description" label="Description" multiline rows={4} />

        <h4 className="text-md font-semibold mt-4 mb-2">Related Records</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReferenceInput source="contactId" reference="contacts" label="Contact">
            <SelectInput
              optionText={(record: { firstName: string; lastName: string }) =>
                `${record.firstName} ${record.lastName}`
              }
            />
          </ReferenceInput>
          <ReferenceInput source="companyId" reference="companies" label="Company">
            <SelectInput optionText="name" />
          </ReferenceInput>
          <ReferenceInput source="dealId" reference="deals" label="Deal">
            <SelectInput optionText="title" />
          </ReferenceInput>
        </div>

        <h4 className="text-md font-semibold mt-4 mb-2">Scheduling</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateTimeInput source="dueDate" label="Due Date" required />
          <div className="flex items-center pt-6">
            <BooleanInput source="completed" label="Mark as Completed" />
          </div>
        </div>
      </SimpleForm>
    </Edit>
  )
}
