import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, RefreshCw, CheckCircle, Save } from 'lucide-react';
import { SchoolSettings, AuditLog, dataService, User } from '../services/dataService';

export const SettingsModule: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'audit'>('settings');

  const loadData = async () => {
    const [st, logs] = await Promise.all([
      dataService.getSettings(),
      dataService.getAuditLogs()
    ]);
    setSettings(st);
    setAuditLogs(logs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await dataService.updateSettings(settings);
    setToast('School settings updated successfully.');
  };

  const handleResetData = async () => {
    if (confirm('Are you sure you want to reset all records to the original demo state?')) {
      await dataService.resetToSeedData();
      window.location.reload();
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Administration & Settings</h2>
          <p className="text-xs text-slate-500">Configure institution profile and monitor secure audit logs</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${activeTab === 'settings' ? 'bg-teal-600 text-white' : 'bg-white border text-slate-700'}`}
          >
            School Profile
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${activeTab === 'audit' ? 'bg-teal-600 text-white' : 'bg-white border text-slate-700'}`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {activeTab === 'settings' ? (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs max-w-2xl">
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block mb-1 font-semibold text-slate-700">Institution Name</label>
              <input value={settings.schoolName} onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-slate-700">Tagline / Motto</label>
              <input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Official Phone</label>
                <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Official Email</label>
                <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-slate-700">Campus Address</label>
              <textarea rows={2} value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Affiliation No</label>
                <input value={settings.affiliationNo} onChange={(e) => setSettings({ ...settings, affiliationNo: e.target.value })} className="w-full p-2 border rounded font-mono" />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Current Session</label>
                <input value={settings.academicSession} disabled className="w-full p-2 border rounded bg-slate-50 font-mono" />
              </div>
            </div>
            <div className="pt-3 border-t flex justify-between items-center">
              <button
                type="button"
                onClick={handleResetData}
                className="px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 rounded flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Database</span>
              </button>
              <button type="submit" className="px-4 py-1.5 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-4 w-44">Timestamp</th>
                <th className="py-2.5 px-4 w-32">Module</th>
                <th className="py-2.5 px-4 w-36">Action</th>
                <th className="py-2.5 px-4">Details</th>
                <th className="py-2.5 px-4 w-32">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 text-slate-400">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">{log.module}</td>
                  <td className="py-2.5 px-4 text-teal-800 font-bold">{log.action}</td>
                  <td className="py-2.5 px-4 text-slate-600 font-sans text-xs">{log.details}</td>
                  <td className="py-2.5 px-4 text-slate-500 font-sans">{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
