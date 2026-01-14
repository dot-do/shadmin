import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { Datagrid } from './Datagrid'
import { FilterButton } from './filter/FilterButton'
import { FilterForm } from './filter/FilterForm'
import { List } from './List'
import { Pagination } from './Pagination'
import { SimpleList } from './SimpleList'
import { DataProviderContextProvider } from '../../contexts/DataProviderContext'
import { ListContextProvider, type ListControllerResult } from '../../contexts/ListContext'
import { Button } from '../Button'
import { BooleanField } from '../field/BooleanField'
import { ChipField } from '../field/ChipField'
import { DateField } from '../field/DateField'
import { EmailField } from '../field/EmailField'
import { TextField } from '../field/TextField'

import type { DataProvider, RaRecord } from '../../types'
import type { Meta, StoryObj } from '@storybook/react'

// =============================================================================
// Mock Data
// =============================================================================

interface Post extends RaRecord {
  id: number
  title: string
  author: string
  email: string
  status: 'draft' | 'published' | 'archived'
  views: number
  featured: boolean
  createdAt: string
  updatedAt: string
  category: string
  content: string
}

const generatePosts = (count: number): Post[] => {
  const statuses: Post['status'][] = ['draft', 'published', 'archived']
  const categories = ['Technology', 'Business', 'Health', 'Science', 'Entertainment']
  const authors = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown', 'Charlie Davis']

  return Array.from({ length: count }, (_, i) => {
    const author = authors[i % 5] ?? 'Unknown'
    const category = categories[i % 5] ?? 'General'
    const status = statuses[i % 3] ?? 'draft'
    const titlePrefix = ['How to Build', 'Understanding', 'Guide to', 'Introduction to', 'Advanced'][i % 5] ?? 'About'

    return {
      id: i + 1,
      title: `Post ${i + 1}: ${titlePrefix} ${category}`,
      author,
      email: `${author.toLowerCase().replace(' ', '.')}@example.com.ai`,
      status,
      views: Math.floor(Math.random() * 10000),
      featured: i % 4 === 0,
      createdAt: new Date(2024, 0, 1 + i).toISOString(),
      updatedAt: new Date(2024, 5, 1 + i).toISOString(),
      category,
      content: `This is the content of post ${i + 1}. It contains detailed information about ${category}.`,
    }
  })
}

const mockPosts = generatePosts(50)

// =============================================================================
// Mock Data Provider
// =============================================================================

 
const createMockDataProvider = (data: Post[]): DataProvider => {
  return {
    getList: async (_resource, { pagination, sort, filter }) => {
      let filteredData = [...data]

      // Apply filters
      if (filter) {
        if (filter.q) {
          const query = String(filter.q).toLowerCase()
          filteredData = filteredData.filter(
            (item) =>
              item.title.toLowerCase().includes(query) ||
              item.author.toLowerCase().includes(query)
          )
        }
        if (filter.status) {
          filteredData = filteredData.filter((item) => item.status === filter.status)
        }
        if (filter.category) {
          filteredData = filteredData.filter((item) => item.category === filter.category)
        }
      }

      // Apply sorting
      if (sort?.field) {
        filteredData.sort((a, b) => {
          const field = sort.field as keyof Post
          const aVal = String(a[field] ?? '')
          const bVal = String(b[field] ?? '')
          if (aVal < bVal) return sort.order === 'ASC' ? -1 : 1
          if (aVal > bVal) return sort.order === 'ASC' ? 1 : -1
          return 0
        })
      }

      // Apply pagination
      const { page, perPage } = pagination
      const start = (page - 1) * perPage
      const paginatedData = filteredData.slice(start, start + perPage)

      // Cast to any to satisfy generic return type
      return {
        data: paginatedData as any,
        total: filteredData.length,
      }
    },
    getOne: async (_resource, { id }) => ({
      data: (data.find((item) => item.id === id) ?? { id }) as any,
    }),
    getMany: async (_resource, { ids }) => ({
      data: data.filter((item) => ids.includes(item.id)) as any,
    }),
    getManyReference: async () => ({ data: [] as any, total: 0 }),
    create: async (_resource, { data: newData }) => ({
      data: { id: Date.now(), ...newData } as any,
    }),
    update: async (_resource, { id, data: updateData }) => ({
      data: { id, ...updateData } as any,
    }),
    updateMany: async () => ({ data: [] }),
    delete: async (_resource, { id }) => ({
      data: data.find((item) => item.id === id) as any,
    }),
    deleteMany: async () => ({ data: [] }),
  }
}

const mockDataProvider = createMockDataProvider(mockPosts)

// =============================================================================
// Wrapper Components
// =============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

interface ListWrapperProps {
  children: React.ReactNode
  dataProvider?: DataProvider
}

const ListWrapper = ({ children, dataProvider = mockDataProvider }: ListWrapperProps) => (
  <QueryClientProvider client={queryClient}>
    <DataProviderContextProvider dataProvider={dataProvider}>
      {children}
    </DataProviderContextProvider>
  </QueryClientProvider>
)

// Create a mock ListContext value for stories that need direct context control
const createMockListContext = (overrides: Partial<ListControllerResult<Post>> = {}): ListControllerResult<Post> => ({
  data: mockPosts.slice(0, 10),
  total: mockPosts.length,
  isLoading: false,
  isFetching: false,
  error: null,
  page: 1,
  perPage: 10,
  sort: { field: 'id', order: 'ASC' },
  filterValues: {},
  selectedIds: [],
  resource: 'posts',
  setPage: () => {},
  setPerPage: () => {},
  setSort: () => {},
  setFilters: () => {},
  onSelect: () => {},
  onToggleItem: () => {},
  onUnselectItems: () => {},
  refetch: () => {},
  ...overrides,
})

// =============================================================================
// Meta
// =============================================================================

const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The List component is the primary way to display collections of records in Shadmin.
It combines ListBase (data fetching, pagination, sorting, filtering) with ListView (Card UI container)
to provide a complete list solution.

Features:
- Automatic data fetching via DataProvider
- Built-in pagination support
- Sorting and filtering
- Selection support for bulk actions
- Multiple display options (Datagrid, SimpleList)
- Fully compatible with react-admin API
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof List>

// =============================================================================
// Basic List with Datagrid
// =============================================================================

/**
 * Basic List component with a Datagrid showing post records.
 * This is the most common usage pattern for displaying tabular data.
 */
export const BasicListWithDatagrid: Story = {
  render: () => (
    <ListWrapper>
      <List resource="posts" title="Posts">
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="author" />
          <ChipField source="status" />
          <DateField source="createdAt" />
        </Datagrid>
      </List>
    </ListWrapper>
  ),
  name: 'Basic List with Datagrid',
}

// =============================================================================
// List with Pagination
// =============================================================================

/**
 * List with visible pagination controls for navigating through large datasets.
 * The Pagination component integrates with ListContext automatically.
 */
export const ListWithPagination: Story = {
  render: () => (
    <ListWrapper>
      <List resource="posts" title="Posts with Pagination" perPage={5}>
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="author" />
          <ChipField source="status" />
        </Datagrid>
        <Pagination />
      </List>
    </ListWrapper>
  ),
  name: 'List with Pagination',
}

// =============================================================================
// List with Filters
// =============================================================================

/**
 * List with filter controls. Filters are passed as a component to the List
 * and appear in the header area next to the title.
 */
export const ListWithFilters: Story = {
  render: () => {
    const PostFilters = () => (
      <FilterForm>
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            placeholder="Search posts..."
            className="px-3 py-2 border rounded-md text-sm"
          />
          <select
            name="status"
            className="px-3 py-2 border rounded-md text-sm"
            defaultValue=""
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <Button type="submit" size="sm">Apply</Button>
        </div>
      </FilterForm>
    )

    return (
      <ListWrapper>
        <List
          resource="posts"
          title="Posts"
          filters={<PostFilters />}
        >
          <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <ChipField source="status" />
            <DateField source="createdAt" />
          </Datagrid>
          <Pagination />
        </List>
      </ListWrapper>
    )
  },
  name: 'List with Filters',
}

// =============================================================================
// SimpleList Alternative
// =============================================================================

/**
 * SimpleList provides a mobile-friendly alternative to Datagrid.
 * It displays records in a vertical list with primary, secondary, and tertiary text.
 */
export const SimpleListAlternative: Story = {
  render: () => (
    <ListWrapper>
      <List resource="posts" title="Posts (Mobile View)">
        <SimpleList<Post>
          primaryText={(record) => record.title}
          secondaryText={(record) => `By ${record.author}`}
          tertiaryText={(record) => new Date(record.createdAt).toLocaleDateString()}
          leftIcon={(record) => (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
              record.status === 'published' ? 'bg-green-500' :
              record.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}>
              {record.author.charAt(0)}
            </div>
          )}
        />
      </List>
    </ListWrapper>
  ),
  name: 'SimpleList Alternative',
}

// =============================================================================
// Datagrid with Sorting
// =============================================================================

/**
 * Datagrid columns are sortable by default. Click on column headers to sort.
 * Sorting is handled automatically through the ListContext.
 */
export const DatagridWithSorting: Story = {
  render: () => (
    <ListWrapper>
      <List
        resource="posts"
        title="Sortable Posts"
        sort={{ field: 'createdAt', order: 'DESC' }}
      >
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="author" />
          <TextField source="views" />
          <ChipField source="status" />
          <DateField source="createdAt" />
        </Datagrid>
        <Pagination />
      </List>
    </ListWrapper>
  ),
  name: 'Datagrid with Sorting',
}

// =============================================================================
// Datagrid with Selection
// =============================================================================

/**
 * Enable row selection by setting bulkActionButtons prop on Datagrid.
 * This adds checkboxes for selecting individual or all rows.
 */
export const DatagridWithSelection: Story = {
  render: () => (
    <ListWrapper>
      <List resource="posts" title="Selectable Posts">
        <Datagrid bulkActionButtons={true} hover>
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="author" />
          <ChipField source="status" />
          <BooleanField source="featured" />
        </Datagrid>
        <Pagination />
      </List>
    </ListWrapper>
  ),
  name: 'Datagrid with Selection',
}

// =============================================================================
// Datagrid with Expandable Rows
// =============================================================================

/**
 * Expandable rows allow showing additional content when a row is clicked.
 * Use the expand prop to provide the expanded content template.
 */
export const DatagridWithExpandableRows: Story = {
  render: () => {
    const ExpandedContent = () => {
      // In real usage, this would use useRecordContext to get the current record
      return (
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2">Post Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Category:</span>
              <TextField source="category" />
            </div>
            <div>
              <span className="text-muted-foreground">Views:</span>
              <TextField source="views" />
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Content:</span>
              <TextField source="content" />
            </div>
          </div>
        </div>
      )
    }

    return (
      <ListWrapper>
        <List resource="posts" title="Expandable Posts">
          <Datagrid
            expand={<ExpandedContent />}
            isRowExpandable={(record: Post) => record.status === 'published'}
          >
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <ChipField source="status" />
            <DateField source="createdAt" />
          </Datagrid>
        </List>
      </ListWrapper>
    )
  },
  name: 'Datagrid with Expandable Rows',
}

// =============================================================================
// Empty State
// =============================================================================

/**
 * When the list has no data, an empty state is displayed.
 * Customize the empty state with the empty prop.
 */
export const EmptyState: Story = {
  render: () => {
    const emptyDataProvider = createMockDataProvider([])

    const CustomEmpty = () => (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first post.
        </p>
        <Button>Create Post</Button>
      </div>
    )

    return (
      <ListWrapper dataProvider={emptyDataProvider}>
        <List resource="posts" title="Empty Posts" empty={<CustomEmpty />}>
          <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
          </Datagrid>
        </List>
      </ListWrapper>
    )
  },
  name: 'Empty State',
}

// =============================================================================
// Loading State
// =============================================================================

/**
 * While data is being fetched, a loading skeleton is displayed.
 * The Datagrid shows animated placeholder rows during loading.
 */
export const LoadingState: Story = {
  render: () => {
    // Create a mock context that shows loading state
    const loadingContext = createMockListContext({
      data: undefined,
      isLoading: true,
      isFetching: true,
      total: undefined,
    })

    return (
      <ListContextProvider value={loadingContext}>
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Posts (Loading...)</h2>
          <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <ChipField source="status" />
            <DateField source="createdAt" />
          </Datagrid>
        </div>
      </ListContextProvider>
    )
  },
  name: 'Loading State',
}

// =============================================================================
// Datagrid with Row Click
// =============================================================================

/**
 * Handle row clicks for navigation or custom actions.
 * Use rowClick prop with 'edit', 'show', or a custom function.
 */
export const DatagridWithRowClick: Story = {
  render: () => (
    <ListWrapper>
      <List resource="posts" title="Clickable Posts">
        <Datagrid
          rowClick={(record, id) => {
            alert(`Clicked on post ${id}: ${record.title}`)
          }}
          hover
        >
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="author" />
          <ChipField source="status" />
          <DateField source="createdAt" />
        </Datagrid>
        <Pagination />
      </List>
    </ListWrapper>
  ),
  name: 'Datagrid with Row Click',
}

// =============================================================================
// Datagrid with Custom Row Styles
// =============================================================================

/**
 * Apply custom styles to rows based on record data.
 * Use rowStyle prop to return CSS properties for each row.
 */
export const DatagridWithCustomRowStyles: Story = {
  render: () => (
    <ListWrapper>
      <List resource="posts" title="Styled Posts">
        <Datagrid
          rowStyle={(record: Post) => ({
            backgroundColor: record.featured
              ? 'rgba(255, 215, 0, 0.1)'
              : record.status === 'archived'
              ? 'rgba(128, 128, 128, 0.1)'
              : undefined,
          })}
          hover
        >
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="author" />
          <ChipField source="status" />
          <BooleanField source="featured" />
          <DateField source="createdAt" />
        </Datagrid>
        <Pagination />
      </List>
    </ListWrapper>
  ),
  name: 'Datagrid with Custom Row Styles',
}

// =============================================================================
// List with Actions
// =============================================================================

/**
 * Add action buttons to the list header using the actions prop.
 * Common actions include Create, Export, and Refresh buttons.
 */
export const ListWithActions: Story = {
  render: () => {
    const ListActions = () => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button size="sm">
          Create Post
        </Button>
      </div>
    )

    return (
      <ListWrapper>
        <List
          resource="posts"
          title="Posts"
          actions={<ListActions />}
        >
          <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <ChipField source="status" />
            <DateField source="createdAt" />
          </Datagrid>
          <Pagination />
        </List>
      </ListWrapper>
    )
  },
  name: 'List with Actions',
}

// =============================================================================
// Datagrid Size Variants
// =============================================================================

/**
 * The Datagrid supports different size variants: default, sm (compact), and lg (large).
 */
export const DatagridSizeVariants: Story = {
  render: () => {
    const SmallContext = createMockListContext({ data: mockPosts.slice(0, 5) })
    const DefaultContext = createMockListContext({ data: mockPosts.slice(0, 5) })
    const LargeContext = createMockListContext({ data: mockPosts.slice(0, 5) })

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Small (sm)</h3>
          <ListContextProvider value={SmallContext}>
            <Datagrid size="sm">
              <TextField source="id" />
              <TextField source="title" />
              <TextField source="author" />
              <ChipField source="status" />
            </Datagrid>
          </ListContextProvider>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Default</h3>
          <ListContextProvider value={DefaultContext}>
            <Datagrid size="default">
              <TextField source="id" />
              <TextField source="title" />
              <TextField source="author" />
              <ChipField source="status" />
            </Datagrid>
          </ListContextProvider>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Large (lg)</h3>
          <ListContextProvider value={LargeContext}>
            <Datagrid size="lg">
              <TextField source="id" />
              <TextField source="title" />
              <TextField source="author" />
              <ChipField source="status" />
            </Datagrid>
          </ListContextProvider>
        </div>
      </div>
    )
  },
  name: 'Datagrid Size Variants',
}

// =============================================================================
// Datagrid with All Features
// =============================================================================

/**
 * Complete example combining multiple features: selection, sorting, hover,
 * row styles, and expandable content.
 */
export const DatagridWithAllFeatures: Story = {
  render: () => {
    const ExpandedContent = () => (
      <div className="p-4 bg-muted/30 rounded-lg">
        <h4 className="font-semibold mb-2">Additional Details</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block">Category</span>
            <TextField source="category" />
          </div>
          <div>
            <span className="text-muted-foreground block">Views</span>
            <TextField source="views" />
          </div>
          <div>
            <span className="text-muted-foreground block">Updated</span>
            <DateField source="updatedAt" />
          </div>
          <div className="col-span-3">
            <span className="text-muted-foreground block">Content</span>
            <TextField source="content" />
          </div>
        </div>
      </div>
    )

    const PostFilters = () => (
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1.5 border rounded-md text-sm w-48"
        />
        <select className="px-3 py-1.5 border rounded-md text-sm" defaultValue="">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    )

    const ListActions = () => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Export</Button>
        <Button size="sm">Create Post</Button>
      </div>
    )

    return (
      <ListWrapper>
        <List
          resource="posts"
          title="Complete Posts List"
          sort={{ field: 'createdAt', order: 'DESC' }}
          perPage={10}
          filters={<PostFilters />}
          actions={<ListActions />}
        >
          <Datagrid
            bulkActionButtons={true}
            hover
            expand={<ExpandedContent />}
            rowStyle={(record: Post) => ({
              backgroundColor: record.featured ? 'rgba(255, 215, 0, 0.08)' : undefined,
            })}
          >
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <EmailField source="email" />
            <ChipField source="status" />
            <BooleanField source="featured" />
            <DateField source="createdAt" />
          </Datagrid>
          <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />
        </List>
      </ListWrapper>
    )
  },
  name: 'Datagrid with All Features',
}

// =============================================================================
// Standalone Pagination
// =============================================================================

/**
 * Pagination can be used standalone with manual props,
 * without requiring a ListContext.
 */
export const StandalonePagination: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const total = 127

    return (
      <div className="p-4 border rounded-lg">
        <div className="text-sm text-muted-foreground mb-4">
          Showing page {page} of {Math.ceil(total / perPage)} (perPage: {perPage})
        </div>
        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          setPage={setPage}
          setPerPage={setPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </div>
    )
  },
  name: 'Standalone Pagination',
}

// =============================================================================
// SimpleList with Custom Link Component
// =============================================================================

/**
 * SimpleList can be customized with different link components and icons.
 */
export const SimpleListCustomized: Story = {
  render: () => (
    <ListWrapper>
      <List resource="posts" title="Customized SimpleList">
        <SimpleList<Post>
          primaryText={(record) => record.title}
          secondaryText={(record) => (
            <span className="flex items-center gap-2">
              <span>{record.author}</span>
              <span className="text-muted-foreground">|</span>
              <span className={`px-2 py-0.5 rounded text-xs ${
                record.status === 'published' ? 'bg-green-100 text-green-800' :
                record.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {record.status}
              </span>
            </span>
          )}
          tertiaryText={(record) => `${record.views.toLocaleString()} views`}
          leftIcon={(record) => (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold text-lg">
              {record.title.charAt(0)}
            </div>
          )}
          rightIcon={() => (
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          linkType={false}
          rowClick={(id, _resource, record) => {
            alert(`Navigate to post ${id}: ${record.title}`)
            return ''
          }}
        />
        <Pagination />
      </List>
    </ListWrapper>
  ),
  name: 'SimpleList Customized',
}

// =============================================================================
// Filter Button Demo
// =============================================================================

/**
 * FilterButton shows an icon and badge indicating active filter count.
 * Use with FilterForm for complete filter functionality.
 */
export const FilterButtonDemo: Story = {
  render: () => {
    const contextWithFilters = createMockListContext({
      filterValues: { status: 'published', category: 'Technology' },
    })
    const contextWithoutFilters = createMockListContext({
      filterValues: {},
    })

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-medium mb-2">With Active Filters (2)</h3>
          <ListContextProvider value={contextWithFilters}>
            <FilterButton />
          </ListContextProvider>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Without Active Filters</h3>
          <ListContextProvider value={contextWithoutFilters}>
            <FilterButton />
          </ListContextProvider>
        </div>
      </div>
    )
  },
  name: 'Filter Button Demo',
}

// =============================================================================
// Datagrid Columns Configuration
// =============================================================================

/**
 * Datagrid columns can be configured explicitly using the columns prop
 * as an alternative to using child components.
 */
export const DatagridWithColumnsConfig: Story = {
  render: () => {
    const context = createMockListContext()

    return (
      <ListContextProvider value={context}>
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Posts (Explicit Columns)</h2>
          <Datagrid
            columns={[
              { source: 'id', label: 'ID', sortable: true },
              { source: 'title', label: 'Title', sortable: true },
              { source: 'author', label: 'Author', sortable: true },
              {
                source: 'status',
                label: 'Status',
                sortable: true,
                render: ({ record }) => (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    (record as Post).status === 'published' ? 'bg-green-100 text-green-800' :
                    (record as Post).status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {String((record as Post).status)}
                  </span>
                ),
              },
              {
                source: 'createdAt',
                label: 'Created',
                sortable: true,
                render: ({ record }) => new Date(String((record as Post).createdAt)).toLocaleDateString(),
              },
            ]}
          />
        </div>
      </ListContextProvider>
    )
  },
  name: 'Datagrid with Columns Config',
}
