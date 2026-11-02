import React, { useState } from 'react';
import { Menu, Search, Bell, Calendar, User as UserIcon } from 'lucide-react';
import { User, dataService } from '../services/dataService';

interface HeaderProps {
  currentUser: User;
  onOpenMobileSidebar: () => void;
  onSelectSearchResult?: (type: string, id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenMobileSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    students: any[];
    staff: any[];
    payments: any[];
    notices: any[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const res = await dataService.globalSearch(q);
      setSearchResults(res);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Global Search Bar */}
        <div className="relative w-48 sm:w-72 md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search students, admissions, fees..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />

          {searchResults && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 max-h-80 overflow-y-auto">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Search Results ({searchResults.students.length + searchResults.staff.length + searchResults.payments.length})
              </div>

              {searchResults.students.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-teal-800">Students</div>
                  {searchResults.students.map(s => (
                    <div key={s.id} className="text-xs py-1 px-2 hover:bg-teal-50 rounded flex justify-between">
                      <span className="font-medium text-slate-800">{s.name} ({s.admissionNo})</span>
                      <span className="text-slate-500">{s.className} - {s.section}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.staff.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-emerald-800">Staff</div>
                  {searchResults.staff.map(st => (
                    <div key={st.id} className="text-xs py-1 px-2 hover:bg-emerald-50 rounded flex justify-between">
                      <span className="font-medium text-slate-800">{st.name} ({st.employeeId})</span>
                      <span className="text-slate-500">{st.designation}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.students.length === 0 && searchResults.staff.length === 0 && (
                <div className="text-xs text-slate-400 py-2 text-center">No matching records found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>Wednesday, 30 Sep 2026</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-medium text-xs border border-teal-200">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500 capitalize">{currentUser.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
