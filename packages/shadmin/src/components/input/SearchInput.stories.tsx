import { useState, useCallback } from 'react'

import { SearchInput } from './SearchInput'
import { ListContext, type ListControllerResult } from '../../contexts/ListContext'

import type { RaRecord } from '../../types'
import type { Meta, StoryObj } from '@storybook/react'

/**
 * Mock ListContext provider for stories
 */
function ListContextWrapper({
  children,
  initialFilters = {},
}: {
  children: React.ReactNode
  initialFilters?: Record<string, unknown>
}) {
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>(initialFilters)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])

  const setFilters = useCallback((newFilters: Record<string, unknown>) => {
    setFilterValues(newFilters)
  }, [])

  const contextValue: ListControllerResult<RaRecord> = {
    filterValues,
    setFilters,
    page,
    setPage,
    perPage: 10,
    setPerPage: () => {},
    sort: { field: 'id', order: 'ASC' as const },
    setSort: () => {},
    total: 100,
    data: [],
    isLoading: false,
    isFetching: false,
    error: null,
    selectedIds,
    onSelect: setSelectedIds,
    onToggleItem: (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]),
    onUnselectItems: () => setSelectedIds([]),
    refetch: () => {},
    resource: 'test',
  }

  return (
    <ListContext.Provider value={contextValue}>
      <div className="p-4">
        {children}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Current filters: {JSON.stringify(filterValues)}</p>
          <p>Page: {page}</p>
        </div>
      </div>
    </ListContext.Provider>
  )
}

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Inputs/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A debounced search input component that integrates with ListContext for filtering list data. Commonly used in list toolbars and filter forms.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ListContextWrapper>
        <Story />
      </ListContextWrapper>
    ),
  ],
  argTypes: {
    source: {
      control: 'text',
      description: 'The filter key name in filterValues',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    debounce: {
      control: 'number',
      description: 'Debounce delay in milliseconds',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    alwaysOn: {
      control: 'boolean',
      description: 'If true, the input is always displayed',
    },
    hideable: {
      control: 'boolean',
      description: 'If true, shows a remove button to hide the filter',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic search input with default settings
 */
export const Default: Story = {
  args: {
    source: 'q',
    placeholder: 'Search...',
  },
}

/**
 * Search input with custom placeholder
 */
export const CustomPlaceholder: Story = {
  args: {
    source: 'search',
    placeholder: 'Search products...',
  },
}

/**
 * Search input with custom source key
 */
export const CustomSource: Story = {
  args: {
    source: 'name_contains',
    placeholder: 'Filter by name...',
  },
}

/**
 * Search input with shorter debounce delay
 */
export const ShortDebounce: Story = {
  args: {
    source: 'q',
    placeholder: 'Quick search...',
    debounce: 200,
  },
}

/**
 * Search input with longer debounce delay
 */
export const LongDebounce: Story = {
  args: {
    source: 'q',
    placeholder: 'Search (slow debounce)...',
    debounce: 1000,
  },
}

/**
 * Disabled search input
 */
export const Disabled: Story = {
  args: {
    source: 'q',
    placeholder: 'Search disabled...',
    disabled: true,
  },
}

/**
 * Search input with alwaysOn flag
 */
export const AlwaysOn: Story = {
  args: {
    source: 'q',
    placeholder: 'Always visible search...',
    alwaysOn: true,
  },
}

/**
 * Hideable search input with remove button
 */
export const Hideable: Story = {
  args: {
    source: 'q',
    placeholder: 'Hideable search...',
    hideable: true,
    onHide: (source: string) => console.log('Hidden filter:', source),
  },
}

/**
 * Search input with pre-filled value
 */
export const WithInitialValue: Story = {
  args: {
    source: 'q',
    placeholder: 'Search...',
  },
  decorators: [
    (Story) => (
      <ListContextWrapper initialFilters={{ q: 'initial search' }}>
        <Story />
      </ListContextWrapper>
    ),
  ],
}

/**
 * Search input with custom width using className
 */
export const CustomWidth: Story = {
  args: {
    source: 'q',
    placeholder: 'Wide search...',
    className: 'w-96',
  },
}

/**
 * Multiple search inputs for different fields
 */
export const MultipleSearchInputs: Story = {
  render: () => (
    <ListContextWrapper>
      <div className="space-y-4">
        <SearchInput source="q" placeholder="Search all..." />
        <SearchInput source="title" placeholder="Search by title..." />
        <SearchInput source="author" placeholder="Search by author..." />
      </div>
    </ListContextWrapper>
  ),
}

/**
 * Search input standalone (without ListContext)
 */
export const Standalone: Story = {
  render: () => (
    <div className="p-4">
      <SearchInput source="q" placeholder="Standalone search..." />
      <p className="mt-4 text-sm text-muted-foreground">
        This search input works without ListContext (uses local state only)
      </p>
    </div>
  ),
  decorators: [], // No ListContext wrapper
}
