import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Component, type ReactNode } from 'react'
import { StoreProvider } from './context/Store.tsx'
import { AdminLayout } from './layouts/AdminLayout.tsx'
import { SiteLayout } from './layouts/SiteLayout.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { AccountPage } from './pages/AccountPage.tsx'
import { CartPage } from './pages/CartPage.tsx'
import { CheckoutPage } from './pages/CheckoutPage.tsx'
import { ContactPage } from './pages/ContactPage.tsx'
import { FavoritesPage } from './pages/FavoritesPage.tsx'
import { FoodPage } from './pages/FoodPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { MenuPage } from './pages/MenuPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { OrderSuccessPage } from './pages/OrderSuccessPage.tsx'
import { ReserveDone, ReservePage } from './pages/ReservePage.tsx'
import { TrackPage } from './pages/TrackPage.tsx'
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx'
import { CategoriesAdminPage } from './pages/admin/CategoriesAdminPage.tsx'
import { CustomersAdminPage } from './pages/admin/CustomersAdminPage.tsx'
import { DashboardPage } from './pages/admin/DashboardPage.tsx'
import { MenuAdminPage } from './pages/admin/MenuAdminPage.tsx'
import { OrdersAdminPage } from './pages/admin/OrdersAdminPage.tsx'
import { ReportsPage } from './pages/admin/ReportsPage.tsx'
import { SettingsPage } from './pages/admin/SettingsPage.tsx'
import { TablesAdminPage } from './pages/admin/TablesAdminPage.tsx'
import { ErrorState } from './components/ui.tsx'

class Boundary extends Component<{ children: ReactNode }, { bad: boolean }> {
  state = { bad: false }
  static getDerivedStateFromError() {
    return { bad: true }
  }
  render() {
    if (this.state.bad) return <ErrorState onRetry={() => location.reload()} />
    return this.props.children
  }
}

function basename() {
  const base = import.meta.env.BASE_URL
  if (!base || base === '/' || base === './') return undefined
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter basename={basename()}>
        <Boundary>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="food/:id" element={<FoodPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order/:id" element={<OrderSuccessPage />} />
              <Route path="track" element={<TrackPage />} />
              <Route path="track/:id" element={<TrackPage />} />
              <Route path="reserve" element={<ReservePage />} />
              <Route path="reserve/:id" element={<ReserveDone />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="orders" element={<OrdersAdminPage />} />
              <Route path="menu" element={<MenuAdminPage />} />
              <Route path="categories" element={<CategoriesAdminPage />} />
              <Route path="tables" element={<TablesAdminPage />} />
              <Route path="customers" element={<CustomersAdminPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Boundary>
      </BrowserRouter>
    </StoreProvider>
  )
}
