import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { NotificationsProvider } from "./hooks/useNotifications";
import { AppLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthPage } from "./pages/AuthPage";
import { CreatePage } from "./pages/CreatePage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { HomePage } from "./pages/HomePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SavedTheoriesPage } from "./pages/SavedTheoriesPage";
import { SearchPage } from "./pages/SearchPage";
import { TheoryDetailPage } from "./pages/TheoryDetailPage";
import { TopTheoriesPage } from "./pages/TopTheoriesPage";

export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="top" element={<TopTheoriesPage />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="create" element={<CreatePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="saved" element={<SavedTheoriesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="theories/:theoryId" element={<TheoryDetailPage />} />
            <Route path="users/:username" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotificationsProvider>
    </AuthProvider>
  );
}
