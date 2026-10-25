import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';
import { RequireAuth, RequireEditor, RequireAdmin } from './components/layout/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchPage from './pages/SearchPage';
import ThemePage from './pages/ThemePage';
import ThemesPage from './pages/ThemesPage'; 
import ArticlePage from './pages/ArticlePage';
import AuthorsList from './pages/AuthorsList';
import AuthorPage from './pages/AuthorPage';
import EditionsArchive from './pages/EditionsArchive';
import EditionPage from './pages/EditionPage';
import About from './pages/About';
import EditorialPolicy from './pages/EditorialPolicy';
import AuthorGuidelines from './pages/AuthorGuidelines';

import DashboardHome from './pages/dashboard/DashboardHome';
import ArticleEditor from './pages/dashboard/ArticleEditor';
import Profile from './pages/dashboard/Profile';

import AdminHome from './pages/admin/AdminHome';
import AdminReviews from './pages/admin/AdminReviews';
import AdminUsers from './pages/admin/AdminUsers';
import AdminThemesTags from './pages/admin/AdminThemesTags';
import AdminEditions from './pages/admin/AdminEditions';
import AdminRejected from './pages/admin/AdminRejected';
import { AdminClassics } from './pages/admin/AdminClassics'; // <-- Nova importação

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/pesquisa" element={<SearchPage />} />
        
        <Route path="/temas" element={<ThemesPage />} />
        
        <Route path="/temas/:slug" element={<ThemePage />} />
        <Route path="/artigos/:slug" element={<ArticlePage />} />
        <Route path="/autores" element={<AuthorsList />} />
        <Route path="/autores/:slug" element={<AuthorPage />} />
        <Route path="/edicoes" element={<EditionsArchive />} />
        <Route path="/edicoes/:number" element={<EditionPage />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/politica-editorial" element={<EditorialPolicy />} />
        <Route path="/diretrizes-autores" element={<AuthorGuidelines />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/artigos/editar/:id" element={<ArticleEditor />} />
        <Route path="/dashboard/perfil" element={<Profile />} />
      </Route>

      <Route
        element={
          <RequireEditor>
            <AdminLayout />
          </RequireEditor>
        }
      >
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/revisoes" element={<AdminReviews />} />
        <Route path="/admin/temas" element={<AdminThemesTags />} />
        <Route path="/admin/classicos" element={<AdminClassics />} /> {/* <-- Nova rota */}
        <Route
          path="/admin/edicoes"
          element={
            <RequireAdmin>
              <AdminEditions />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/rejeitados"
          element={
            <RequireAdmin>
              <AdminRejected />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RequireAdmin>
              <AdminUsers />
            </RequireAdmin>
          }
        />
      </Route>
    </Routes>
  );
}
