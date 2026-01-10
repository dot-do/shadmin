import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  NumberInput,
  DateInput,
} from 'shadmin'

const stageChoices = [
  { id: 'prospecting', name: 'Prospecting' },
  { id: 'qualification', name: 'Qualification' },
  { id: 'proposal', name: 'Proposal' },
  { id: 'negotiation', name: 'Negotiation' },
  { id: 'closed_won', name: 'Closed Won' },
  { id: 'closed_lost', name: 'Closed Lost' },
]

const currencyChoices = [
  { id: 'USD', name: 'USD ($)' },
  { id: 'EUR', name: 'EUR (€)' },
  { id: 'GBP', name: 'GBP (£)' },
  { id: 'JPY', name: 'JPY (¥)' },
]

const probabilityChoices = [
  { id: 0, name: '0%' },
  { id: 10, name: '10%' },
  { id: 20, name: '20%' },
  { id: 30, name: '30%' },
  { id: 40, name: '40%' },
  { id: 50, name: '50%' },
  { id: 60, name: '60%' },
  { id: 70, name: '70%' },
  { id: 75, name: '75%' },
  { id: 80, name: '80%' },
  { id: 90, name: '90%' },
  { id: 100, name: '100%' },
]

export function DealEdit() {
  return (
    <Edit title="Edit Deal">
      <SimpleForm>
        <TextInput source="title" label="Deal Title" required />
        <TextInput source="description" label="Description" multiline rows={3} />

        <h4 className="text-md font-semibold mt-4 mb-2">Related Records</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReferenceInput source="companyId" reference="companies" label="Company">
            <SelectInput optionText="name" />
          </ReferenceInput>
          <ReferenceInput source="contactId" reference="contacts" label="Primary Contact">
            <SelectInput
              optionText={(record: { firstName: string; lastName: string }) =>
                `${record.firstName} ${record.lastName}`
              }
            />
          </ReferenceInput>
        </div>

        <h4 className="text-md font-semibold mt-4 mb-2">Financial Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NumberInput source="value" label="Deal Value" min={0} required />
          <SelectInput source="currency" label="Currency" choices={currencyChoices} required />
          <SelectInput
            source="probability"
            label="Probability"
            choices={probabilityChoices}
            required
          />
        </div>

        <h4 className="text-md font-semibold mt-4 mb-2">Pipeline</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput source="stage" label="Stage" choices={stageChoices} required />
          <DateInput source="expectedCloseDate" label="Expected Close Date" required />
        </div>
      </SimpleForm>
    </Edit>
  )
}
