import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { listAllUsers, updateUserRole } from '../../services/users';
import type { UserProfile, UserRole } from '../../types/database.types';

const ROLE_LABEL: Record<UserRole, string> = {
  reader: 'Leitor',
  author: 'Autor',
  editor: 'Editor',
  admin: 'Admin',
};

export default function AdminUsers() {
  const { profile: me } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listAllUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  async function handleRoleChange(user: UserProfile, role: UserRole) {
    setError(null);
    setSavingId(user.id);
    try {
      const updated = await updateUserRole(user.id, role);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    } catch (e: any) {
      setError(`Não foi possível alterar ${user.name}: ${e.message}`);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Usuários</h1>
      <p className="text-sm text-ink-500 mb-8">
        Defina quem é leitor, autor, editor ou admin. O admin supremo (marcado com{' '}
        <Shield size={12} className="inline text-brass-600" />) não pode ser alterado por outros admins.
      </p>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-500">Carregando...</p>
      ) : (
        <div className="border border-ink-100 rounded-sm bg-paper-50 divide-y divide-ink-100">
          {users.map((u) => {
            const isSelf = u.id === me?.id;
            const locked = u.is_super_admin && !isSelf;
            return (
              <div key={u.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    {u.name}
                    {u.is_super_admin && <Shield size={13} className="text-brass-600 shrink-0" />}
                    {isSelf && <span className="text-xs text-ink-500">(você)</span>}
                  </p>
                  <p className="text-xs text-ink-500 truncate">{u.email}</p>
                </div>

                {locked ? (
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-500">
                    {ROLE_LABEL[u.role]} · protegido
                  </span>
                ) : (
                  <select
                    value={u.role}
                    disabled={savingId === u.id}
                    onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                    className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm bg-white disabled:opacity-50"
                  >
                    {(['reader', 'author', 'editor', 'admin'] as UserRole[]).map((r) => (
                      <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
