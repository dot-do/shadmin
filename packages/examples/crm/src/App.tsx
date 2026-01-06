import { Admin, Resource } from 'shadmin'
import { dataProvider } from './dataProvider'
import { Dashboard } from './Dashboard'

// Contact resources
import { ContactList } from './resources/contacts/ContactList'
import { ContactShow } from './resources/contacts/ContactShow'
import { ContactEdit } from './resources/contacts/ContactEdit'
import { ContactCreate } from './resources/contacts/ContactCreate'

// Company resources
import { CompanyList } from './resources/companies/CompanyList'
import { CompanyShow } from './resources/companies/CompanyShow'
import { CompanyEdit } from './resources/companies/CompanyEdit'
import { CompanyCreate } from './resources/companies/CompanyCreate'

// Deal resources
import { DealList } from './resources/deals/DealList'
import { DealShow } from './resources/deals/DealShow'
import { DealEdit } from './resources/deals/DealEdit'
import { DealCreate } from './resources/deals/DealCreate'

// Activity resources
import { ActivityList } from './resources/activities/ActivityList'
import { ActivityShow } from './resources/activities/ActivityShow'
import { ActivityEdit } from './resources/activities/ActivityEdit'
import { ActivityCreate } from './resources/activities/ActivityCreate'

export function App() {
  return (
    <Admin dataProvider={dataProvider} dashboard={Dashboard}>
      <Resource
        name="contacts"
        list={ContactList}
        show={ContactShow}
        edit={ContactEdit}
        create={ContactCreate}
        options={{ label: 'Contacts' }}
      />
      <Resource
        name="companies"
        list={CompanyList}
        show={CompanyShow}
        edit={CompanyEdit}
        create={CompanyCreate}
        options={{ label: 'Companies' }}
      />
      <Resource
        name="deals"
        list={DealList}
        show={DealShow}
        edit={DealEdit}
        create={DealCreate}
        options={{ label: 'Deals' }}
      />
      <Resource
        name="activities"
        list={ActivityList}
        show={ActivityShow}
        edit={ActivityEdit}
        create={ActivityCreate}
        options={{ label: 'Activities' }}
      />
    </Admin>
  )
}
