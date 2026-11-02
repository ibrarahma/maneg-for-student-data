import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Calendar } from 'lucide-react';
import { Notice, dataService, User } from '../services/dataService';

export const NoticesModule: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState<Notice['audience']>('Everyone');
  const [priority, setPriority] = useState<Notice['priority']>('High');

  const loadData = async () => {
    const data = await dataService.getNotices();
    setNotices(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.createNotice({
      title,
      description,
      date: new Date().toISOString().slice(0, 10),
      audience,
      priority,
      authorName: currentUser.name
    });
    setIsAddOpen(false);
    setTitle('');
    setDescription('');
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete notice?')) {
      await dataService.deleteNotice(id);
      loadData();
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notice Board & Announcements</h2>
          <p className="text-xs text-slate-500">Official circulars, holiday notifications, and school alerts</p>
        </div>
        {['super_admin', 'admin'].includes(currentUser.role) && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Notice</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((n) => (
          <div key={n.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  n.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {n.priority} Priority · {n.audience}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{n.date}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{n.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
              <span>By: {n.authorName}</span>
              {['super_admin', 'admin'].includes(currentUser.role) && (
                <button onClick={() => handleDelete(n.id)} className="text-slate-400 hover:text-rose-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5">
            <h3 className="font-bold text-sm mb-3">Publish Notice</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Notice Title *</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" placeholder="Title..." />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Audience</label>
                <select value={audience} onChange={(e) => setAudience(e.target.value as any)} className="w-full p-2 border rounded">
                  <option value="Everyone">Everyone</option>
                  <option value="Teachers">Teachers</option>
                  <option value="Students">Students</option>
                  <option value="Parents">Parents</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Description *</label>
                <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" placeholder="Detailed message..." />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1 bg-slate-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1 bg-teal-600 text-white rounded font-semibold">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
