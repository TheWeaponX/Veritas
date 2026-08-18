import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateOwnProfile } from '../../services/users';

export default function Profile() {
  const { profile, refreshProfile } = useAuth();

  const [name, setName] = useState(profile?.name ?? '');
  const [biography, setBiography] = useState(profile?.biography ?? '');
  const [institution, setInstitution] = useState(profile?.institution ?? '');
  const [profileImage, setProfileImage] = useState(profile?.profile_image ?? '');
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [interestInput, setInterestInput] = useState('');
  const [links, setLinks] = useState<{ label: string; url: string }[]>(profile?.professional_links ?? []);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profile) return null;

  function addInterest() {
    const v = interestInput.trim();
    if (!v) return;
    setInterests((prev) => [...new Set([...prev, v])]);
    setInterestInput('');
  }

  function addLink() {
    if (!linkLabel.trim() || !linkUrl.trim()) return;
    setLinks((prev) => [...prev, { label: linkLabel.trim(), url: linkUrl.trim() }]);
    setLinkLabel('');
    setLinkUrl('');
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateOwnProfile(profile!.id, {
        name,
        biography: biography || null,
        institution: institution || null,
        profile_image: profileImage || null,
        interests,
        professional_links: links,
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold mb-1">Meu perfil</h1>
      <p className="text-sm text-ink-500 mb-8">
        Visível publicamente em <code className="font-mono text-xs">/autores/{profile.slug}</code>
      </p>

      <div className="flex flex-col gap-5">
        <Field label="Nome">
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </Field>

        <Field label="Foto de perfil (URL da imagem)">
          <input value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://..." className="input" />
        </Field>

        <Field label="Instituição">
          <input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Universidade, empresa, etc." className="input" />
        </Field>

        <Field label="Biografia">
          <textarea value={biography} onChange={(e) => setBiography(e.target.value)} rows={4} className="input resize-none" />
        </Field>

        <Field label="Áreas de interesse">
          <div className="flex flex-wrap gap-2 mb-2">
            {interests.map((i) => (
              <span key={i} className="specimen-tag !normal-case">
                {i}
                <button onClick={() => setInterests((prev) => prev.filter((x) => x !== i))} className="ml-1">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              placeholder="Ex: Astrofísica"
              className="input flex-1"
            />
            <button onClick={addInterest} className="text-sm text-brass-600 hover:text-brass-500">Adicionar</button>
          </div>
        </Field>

        <Field label="Links profissionais">
          <div className="flex flex-col gap-2 mb-2">
            {links.map((l, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm border border-ink-100 rounded-sm px-3 py-1.5">
                <span>{l.label} — <span className="text-ink-500">{l.url}</span></span>
                <button onClick={() => setLinks((prev) => prev.filter((_, i) => i !== idx))}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} placeholder="Ex: ORCID" className="input" />
            <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="input" />
          </div>
          <button onClick={addLink} className="mt-2 flex items-center gap-1.5 text-sm text-brass-600 hover:text-brass-500">
            <Plus size={14} /> Adicionar link
          </button>
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-ink-900 text-paper-50 text-sm font-medium px-4 py-2 rounded-sm hover:bg-ink-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar perfil'}
          </button>
          {saved && <span className="text-sm text-teal-600">Salvo!</span>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-ink-700 font-medium">{label}</span>
      {children}
    </label>
  );
}
