import { Admin, Resource, useGetIdentity, useLogout } from 'shadmin'
import type { ReactNode } from 'react'
import { dataProvider } from './dataProvider'
import { authProvider, DEMO_CREDENTIALS } from './authProvider'
import { Dashboard } from './Dashboard'

// Resource imports
import { ProjectList, ProjectShow } from './resources/projects'
import { TicketList, TicketShow, TicketCreate } from './resources/tickets'
import { DocumentList, DocumentShow } from './resources/documents'

/**
 * Client Portal App
 *
 * A complete client-facing portal built with shadmin demonstrating:
 * - Authentication flow with demo credentials
 * - Client dashboard with overview
 * - Project tracking and progress
 * - Support ticket system
 * - Document management
 */

// Custom Login Page with demo credentials
function ClientLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Client Portal</h1>
          <p className="text-slate-400 mt-2">Sign in to access your dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <LoginForm />

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500 mb-3">Demo Accounts:</p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <div
                  key={cred.email}
                  className="p-3 bg-gray-50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    // Auto-fill demo credentials
                    const emailInput = document.getElementById('email') as HTMLInputElement
                    const passwordInput = document.getElementById('password') as HTMLInputElement
                    if (emailInput && passwordInput) {
                      emailInput.value = cred.email
                      passwordInput.value = cred.password
                    }
                  }}
                >
                  <div className="font-medium text-gray-900">{cred.email}</div>
                  <div className="text-gray-500">{cred.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Powered by{' '}
          <a href="https://github.com/nathanclevenger/shadmin" className="text-blue-400 hover:text-blue-300">
            shadmin
          </a>
        </p>
      </div>
    </div>
  )
}

function LoginForm() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const email = (form.elements.namedItem('email') as HTMLInputElement).value
        const password = (form.elements.namedItem('password') as HTMLInputElement).value

        try {
          await authProvider.login({ email, password })
          window.location.href = '/'
        } catch (error) {
          alert((error as Error).message)
        }
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="you@example.com.ai"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Sign In
      </button>
    </form>
  )
}

// Custom Layout for Client Portal
function ClientPortalLayout({ children }: { children: ReactNode }) {
  const { data: identity } = useGetIdentity()
  const logout = useLogout()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">Client Portal</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/projects">Projects</NavLink>
              <NavLink href="/tickets">Support</NavLink>
              <NavLink href="/documents">Documents</NavLink>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {identity && (
                <div className="flex items-center space-x-3">
                  {identity.avatar && (
                    <img
                      src={identity.avatar as string}
                      alt={identity.fullName || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="hidden md:block text-sm">
                    <div className="font-medium text-gray-900">{identity.fullName}</div>
                    <div className="text-gray-500">{identity.company as string}</div>
                  </div>
                </div>
              )}
              <button
                onClick={() => logout()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t px-4 py-2">
          <div className="flex space-x-4 overflow-x-auto">
            <MobileNavLink href="/">Dashboard</MobileNavLink>
            <MobileNavLink href="/projects">Projects</MobileNavLink>
            <MobileNavLink href="/tickets">Support</MobileNavLink>
            <MobileNavLink href="/documents">Documents</MobileNavLink>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>Need help? Contact support@example.com.ai</p>
            <p>
              Powered by{' '}
              <a href="https://github.com/nathanclevenger/shadmin" className="text-blue-600 hover:text-blue-700">
                shadmin
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const isActive = window.location.pathname === href || window.location.pathname.startsWith(href + '/')

  return (
    <a
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </a>
  )
}

function MobileNavLink({ href, children }: { href: string; children: ReactNode }) {
  const isActive = window.location.pathname === href || window.location.pathname.startsWith(href + '/')

  return (
    <a
      href={href}
      className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors ${
        isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </a>
  )
}

// Main App Component
export function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      layout={ClientPortalLayout}
      dashboard={Dashboard}
      loginPage={ClientLoginPage}
      title="Client Portal"
    >
      <Resource
        name="projects"
        list={ProjectList}
        show={ProjectShow}
        options={{ label: 'Projects' }}
      />
      <Resource
        name="tickets"
        list={TicketList}
        show={TicketShow}
        create={TicketCreate}
        options={{ label: 'Support Tickets' }}
      />
      <Resource
        name="documents"
        list={DocumentList}
        show={DocumentShow}
        options={{ label: 'Documents' }}
      />
    </Admin>
  )
}

export default App
