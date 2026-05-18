'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Truck, 
  AlertTriangle, 
  BarChart3, 
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  BellRing,
  FolderPlus,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const MAIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/shipments', label: 'All Shipments', icon: Truck },
  { href: '/admin/escalations', label: 'Escalations', icon: AlertTriangle },
  { href: '/admin/analytics', label: 'Global Analytics', icon: BarChart3 },
  { href: '/admin/tenants', label: 'Tenants & Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

type Client = { id: string; name: string; priority: string; color: string; };
type Region = { id: string; name: string; isExpanded: boolean; clients: Client[]; };

const INITIAL_REGIONS: Region[] = [
  {
    id: 'reg_mh', name: 'Maharashtra', isExpanded: true,
    clients: [
      { id: 'cli_acme', name: 'Acme Logistics', priority: 'High', color: 'bg-red-500' },
      { id: 'cli_globex', name: 'Globex Corp', priority: 'Medium', color: 'bg-amber-500' },
    ]
  },
  {
    id: 'reg_dl', name: 'Delhi NCR', isExpanded: true,
    clients: [
      { id: 'cli_stark', name: 'Stark Ind.', priority: 'Normal', color: 'bg-emerald-500' },
    ]
  },
  {
    id: 'reg_ka', name: 'Karnataka', isExpanded: true, clients: []
  }
];

const getStateCode = (name: string) => {
  const codes: Record<string, string> = { 'Maharashtra': 'MH', 'Delhi NCR': 'DL', 'Karnataka': 'KA' };
  return codes[name] || name.substring(0, 2).toUpperCase();
};

const getInitials = (name: string) => {
  const words = name.trim().split(' ').filter(w => w.length > 0);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

type ActionDialogState = {
  isOpen: boolean;
  type: 'edit_state' | 'add_client' | 'delete_state' | 'edit_client' | 'delete_client' | 'create_state' | null;
  regionId?: string;
  clientId?: string;
  initialValue?: string;
};

export function AdminSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) {
  const pathname = usePathname();
  const [regions, setRegions] = useState<Region[]>(INITIAL_REGIONS);
  const [draggedClientId, setDraggedClientId] = useState<string | null>(null);
  const [dragTargetRegionId, setDragTargetRegionId] = useState<string | null>(null);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Broadcast State
  const [broadcastRegion, setBroadcastRegion] = useState<Region | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Action Dialog State
  const [actionDialog, setActionDialog] = useState<ActionDialogState>({ isOpen: false, type: null });
  const [actionInputValue, setActionInputValue] = useState('');

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleRegion = (regionId: string) => {
    setRegions(prev => prev.map(r => r.id === regionId ? { ...r, isExpanded: !r.isExpanded } : r));
  };

  const handleDragStart = (e: React.DragEvent, clientId: string, regionId: string) => {
    e.dataTransfer.setData('clientId', clientId);
    e.dataTransfer.setData('sourceRegionId', regionId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedClientId(clientId);
  };

  const handleDragOver = (e: React.DragEvent, regionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragTargetRegionId !== regionId) setDragTargetRegionId(regionId);
  };

  const handleDragLeave = (e: React.DragEvent, regionId: string) => {
    e.preventDefault();
    if (dragTargetRegionId === regionId) setDragTargetRegionId(null);
  };

  const handleDrop = (e: React.DragEvent, targetRegionId: string) => {
    e.preventDefault();
    setDragTargetRegionId(null);
    setDraggedClientId(null);
    
    const clientId = e.dataTransfer.getData('clientId');
    const sourceRegionId = e.dataTransfer.getData('sourceRegionId');
    if (!clientId || !sourceRegionId || sourceRegionId === targetRegionId) return;

    setRegions(prev => {
      const newRegions = [...prev];
      const sourceRegion = newRegions.find(r => r.id === sourceRegionId);
      const targetRegion = newRegions.find(r => r.id === targetRegionId);
      if (!sourceRegion || !targetRegion) return prev;
      
      const clientIndex = sourceRegion.clients.findIndex(c => c.id === clientId);
      if (clientIndex === -1) return prev;
      
      const [clientToMove] = sourceRegion.clients.splice(clientIndex, 1);
      targetRegion.clients.push(clientToMove);
      targetRegion.isExpanded = true;
      return newRegions;
    });
    toast.success("Client moved successfully.");
  };

  const handleDragEnd = () => {
    setDraggedClientId(null);
    setDragTargetRegionId(null);
  };

  const openBroadcastDialog = (e: React.MouseEvent, region: Region) => {
    e.stopPropagation();
    setBroadcastRegion(region);
    setBroadcastMessage('');
  };

  const handleSendBroadcast = () => {
    if (!broadcastRegion) return;
    if (!broadcastMessage.trim()) {
      toast.error("Please enter a message before sending.");
      return;
    }
    
    toast.success(`Emergency broadcast sent to all active clients in ${broadcastRegion.name}.`, {
      description: "Message delivered to dashboards and via email.",
      icon: <BellRing className="h-4 w-4 text-red-500" />
    });
    setBroadcastRegion(null);
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId(prev => prev === id ? null : id);
  };

  const promptAction = (type: ActionDialogState['type'], regionId?: string, clientId?: string, initialValue: string = '') => {
    setActiveMenuId(null);
    setActionInputValue(initialValue);
    setActionDialog({ isOpen: true, type, regionId, clientId, initialValue });
  };

  const submitAction = () => {
    const { type, regionId, clientId } = actionDialog;
    const value = actionInputValue.trim();

    if (type === 'create_state') {
      if (!value) return toast.error("State name cannot be empty.");
      const newRegion: Region = { id: `reg_${Date.now()}`, name: value, isExpanded: true, clients: [] };
      setRegions(prev => [...prev, newRegion]);
      toast.success("New state created.");
    } 
    else if (type === 'edit_state' && regionId) {
      if (!value) return toast.error("State name cannot be empty.");
      setRegions(prev => prev.map(r => r.id === regionId ? { ...r, name: value } : r));
      toast.success("State name updated.");
    }
    else if (type === 'add_client' && regionId) {
      if (!value) return toast.error("Client name cannot be empty.");
      const newClient: Client = { id: `cli_${Date.now()}`, name: value, priority: 'Normal', color: 'bg-blue-500' };
      setRegions(prev => prev.map(r => r.id === regionId ? { ...r, clients: [...r.clients, newClient], isExpanded: true } : r));
      toast.success("Client added successfully.");
    }
    else if (type === 'edit_client' && regionId && clientId) {
      if (!value) return toast.error("Client name cannot be empty.");
      setRegions(prev => prev.map(r => r.id === regionId ? {
        ...r, clients: r.clients.map(c => c.id === clientId ? { ...c, name: value } : c)
      } : r));
      toast.success("Client name updated.");
    }
    else if (type === 'delete_state' && regionId) {
      setRegions(prev => prev.filter(r => r.id !== regionId));
      toast.success("State deleted.");
    }
    else if (type === 'delete_client' && regionId && clientId) {
      setRegions(prev => prev.map(r => r.id === regionId ? {
        ...r, clients: r.clients.filter(c => c.id !== clientId)
      } : r));
      toast.success("Client removed.");
    }
    
    setActionDialog({ isOpen: false, type: null });
  };

  return (
    <>
      <aside ref={sidebarRef} className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-[#1e212b] border-r border-gray-200 dark:border-[#2a2e3d] flex flex-col z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 sm:px-5 border-b border-gray-200 dark:border-[#2a2e3d] flex-shrink-0 transition-all duration-300 overflow-hidden relative`}>
          <Link href="/admin" className={`flex items-center gap-3 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#292F54] dark:bg-[#2b3358] text-sm font-extrabold text-white flex-shrink-0">
              MA
            </span>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold leading-tight text-[#111827] dark:text-white">Admin Hub</p>
              <p className="text-[10px] font-medium text-[#f37a2a]">Global View</p>
            </div>
          </Link>
          <button 
            onClick={onToggle} 
            className={`p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a2e3d] rounded-lg transition-colors flex-shrink-0 ${isCollapsed ? '' : 'ml-2'}`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        </div>

        <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-1 overflow-y-auto overflow-x-hidden transition-all duration-300 hide-scrollbar`}>
          <div className="mb-4">
            {!isCollapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Overview
              </p>
            )}
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 ${isCollapsed ? 'justify-center px-0 py-3 mb-2' : 'px-3 py-2 mb-1'} rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-[#f37a2a]/10 text-[#f37a2a] dark:bg-[#f37a2a]/20 dark:text-[#f37a2a] font-semibold'
                      : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#2a2e3d] hover:text-[#111827] dark:hover:text-white font-medium'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${isActive ? 'text-[#f37a2a]' : 'text-[#94a3b8] group-hover:text-[#64748b] dark:group-hover:text-[#cbd5e1]'}`} />
                  {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 border-t border-gray-200 dark:border-[#2a2e3d] pt-4">
            {!isCollapsed ? (
              <div className="flex items-center justify-between px-3 mb-2 whitespace-nowrap">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority Clients
                </p>
                <button 
                  onClick={() => promptAction('create_state')}
                  title="New State"
                  className="text-gray-400 hover:text-[#f37a2a] transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2a2e3d]"
                >
                  <FolderPlus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center mb-4 text-xs font-semibold text-gray-500 uppercase">
                 PIN
              </div>
            )}
            
            <div className="space-y-2 mt-3">
              {regions.map((region) => (
                <div 
                  key={region.id} 
                  className={`rounded-lg transition-colors border ${
                    dragTargetRegionId === region.id 
                      ? 'border-[#f37a2a] bg-[#f37a2a]/5 dark:bg-[#f37a2a]/10' 
                      : 'border-transparent'
                  }`}
                  onDragOver={(e) => handleDragOver(e, region.id)}
                  onDragLeave={(e) => handleDragLeave(e, region.id)}
                  onDrop={(e) => handleDrop(e, region.id)}
                >
                  <div 
                    className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2a2e3d] rounded-lg group ${isCollapsed ? 'justify-center p-2 mx-1 bg-gray-50 dark:bg-[#2a2e3d]/30' : 'px-2 py-1.5'} relative`}
                    onClick={() => toggleRegion(region.id)}
                    title={isCollapsed ? `Expand ${region.name}` : undefined}
                  >
                    {!isCollapsed ? (
                      <>
                        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                          {region.isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="text-sm font-semibold text-[#111827] dark:text-white truncate">
                            {region.name}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">
                            ({region.clients.length})
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => openBroadcastDialog(e, region)}
                            title={`Notify all in ${region.name}`}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <BellRing className="h-3 w-3" />
                          </button>
                          
                          <div className="relative">
                            <button 
                              onClick={(e) => toggleMenu(e, region.id)}
                              className="p-1 text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                            
                            {activeMenuId === region.id && (
                              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#16181d] border border-gray-200 dark:border-[#2a2e3d] rounded-lg shadow-lg py-1 z-[70]" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={(e) => { e.preventDefault(); promptAction('edit_state', region.id, undefined, region.name); }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#111827] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a2e3d]"
                                >
                                  <Edit2 className="h-3 w-3" /> Edit State
                                </button>
                                <button 
                                  onClick={(e) => { e.preventDefault(); promptAction('add_client', region.id); }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#111827] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a2e3d]"
                                >
                                  <UserPlus className="h-3 w-3" /> Add Client
                                </button>
                                <button 
                                  onClick={(e) => { e.preventDefault(); promptAction('delete_state', region.id); }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-3 w-3" /> Delete State
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-[#111827] dark:text-white">{getStateCode(region.name)}</span>
                    )}
                  </div>
                  
                  {region.isExpanded && (
                    <div className={`${isCollapsed ? 'mt-2 space-y-2' : 'pl-6 pr-2 mt-1 space-y-1 pb-1'}`}>
                      {region.clients.length === 0 && !isCollapsed ? (
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 italic py-1 px-2 border border-dashed border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-[#16181d]/50 pointer-events-none whitespace-nowrap overflow-hidden">
                          Drag clients here
                        </div>
                      ) : (
                        region.clients.map((client) => {
                          const clientHref = `/admin/clients/${client.id}?name=${encodeURIComponent(client.name)}`;
                          const isActive = pathname.startsWith(clientHref);
                          const isBeingDragged = draggedClientId === client.id;
                          const menuId = `${region.id}_${client.id}`;
                          
                          return (
                            <div
                              key={client.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, client.id, region.id)}
                              onDragEnd={handleDragEnd}
                              className={`${isBeingDragged ? 'opacity-40 scale-95' : 'opacity-100'} transition-all duration-200 cursor-grab active:cursor-grabbing relative`}
                            >
                              <Link
                                href={clientHref}
                                onClick={(e) => isBeingDragged && e.preventDefault()}
                                title={isCollapsed ? client.name : undefined}
                                className={`flex items-center transition-all duration-150 group relative ${
                                  isCollapsed 
                                   ? 'justify-center w-10 h-10 mx-auto rounded-full' 
                                   : 'justify-between px-2.5 py-1.5 rounded-lg pr-1'
                                } ${
                                  isActive
                                    ? (isCollapsed ? 'bg-[#f37a2a]/20 text-[#f37a2a]' : 'bg-gray-100 dark:bg-[#2a2e3d] text-[#111827] dark:text-white font-semibold shadow-sm')
                                    : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/50 hover:text-[#111827] dark:hover:text-white font-medium'
                                }`}
                              >
                                {!isCollapsed ? (
                                  <>
                                    <div className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap pr-2">
                                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${client.color}`} title={`Priority: ${client.priority}`} />
                                      <span className="text-sm truncate max-w-[100px]">{client.name}</span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity relative">
                                      <button 
                                        onClick={(e) => toggleMenu(e, menuId)}
                                        className="p-1 text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors rounded"
                                      >
                                        <MoreVertical className="h-3 w-3" />
                                      </button>
                                      
                                      {activeMenuId === menuId && (
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#16181d] border border-gray-200 dark:border-[#2a2e3d] rounded-lg shadow-lg py-1 z-[70]" onClick={(e) => e.stopPropagation()}>
                                          <button 
                                            onClick={(e) => { e.preventDefault(); promptAction('edit_client', region.id, client.id, client.name); }}
                                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#111827] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a2e3d]"
                                          >
                                            <Edit2 className="h-3 w-3" /> Edit Name
                                          </button>
                                          <button 
                                            onClick={(e) => { e.preventDefault(); promptAction('delete_client', region.id, client.id); }}
                                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                                          >
                                            <Trash2 className="h-3 w-3" /> Delete Client
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full relative">
                                    <span className={`absolute top-0 right-0 w-2 h-2 rounded-full border border-white dark:border-[#1e212b] ${client.color}`} />
                                    <span className="text-[10px] font-bold tracking-tight">{getInitials(client.name)}</span>
                                  </div>
                                )}
                              </Link>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Broadcast Dialog */}
      <Dialog open={!!broadcastRegion} onOpenChange={(open) => !open && setBroadcastRegion(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1e212b] border-gray-200 dark:border-[#2a2e3d]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#111827] dark:text-white">
              <BellRing className="h-5 w-5 text-red-500" />
              State-wide Broadcast
            </DialogTitle>
            <DialogDescription className="text-[#64748b] dark:text-[#94a3b8]">
              Send an emergency alert to all clients associated with <strong className="text-[#111827] dark:text-white">{broadcastRegion?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <textarea
              className="w-full h-32 rounded-lg border border-gray-200 dark:border-[#2a2e3d] bg-gray-50 dark:bg-[#16181d] p-3 text-sm text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
              placeholder="Describe the issue (e.g., Regional delay due to heavy rainfall...)"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            />
            <p className="text-xs text-amber-600 dark:text-amber-500 font-medium bg-amber-50 dark:bg-amber-500/10 p-2 rounded-md">
              Warning: This message will immediately push a high-priority alert to all clients associated with this state, not just the pinned ones.
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={() => setBroadcastRegion(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#2a2e3d] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendBroadcast}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Send className="h-4 w-4" />
              Broadcast Alert
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog (Edit/Add/Delete) */}
      <Dialog open={actionDialog.isOpen} onOpenChange={(open) => !open && setActionDialog({ isOpen: false, type: null })}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#1e212b] border-gray-200 dark:border-[#2a2e3d]">
          <DialogHeader>
            <DialogTitle className="text-[#111827] dark:text-white flex items-center gap-2">
              {actionDialog.type === 'edit_state' && <><Edit2 className="h-4 w-4 text-[#f37a2a]" /> Edit State Name</>}
              {actionDialog.type === 'add_client' && <><UserPlus className="h-4 w-4 text-[#f37a2a]" /> Add New Client</>}
              {actionDialog.type === 'delete_state' && <><Trash2 className="h-4 w-4 text-red-500" /> Delete State</>}
              {actionDialog.type === 'edit_client' && <><Edit2 className="h-4 w-4 text-[#f37a2a]" /> Edit Client Name</>}
              {actionDialog.type === 'delete_client' && <><Trash2 className="h-4 w-4 text-red-500" /> Remove Client</>}
              {actionDialog.type === 'create_state' && <><FolderPlus className="h-4 w-4 text-[#f37a2a]" /> Create New State</>}
            </DialogTitle>
            <DialogDescription className="text-[#64748b] dark:text-[#94a3b8]">
               {actionDialog.type === 'delete_state' && 'Are you sure you want to delete this state and remove all its pinned clients?'}
               {actionDialog.type === 'delete_client' && 'Are you sure you want to remove this client from the priority list?'}
               {actionDialog.type !== 'delete_state' && actionDialog.type !== 'delete_client' && 'Enter the required information below.'}
            </DialogDescription>
          </DialogHeader>
          
          {(actionDialog.type === 'edit_state' || actionDialog.type === 'add_client' || actionDialog.type === 'edit_client' || actionDialog.type === 'create_state') && (
            <div className="py-4">
              <input
                autoFocus
                type="text"
                className="w-full rounded-lg border border-gray-200 dark:border-[#2a2e3d] bg-gray-50 dark:bg-[#16181d] px-3 py-2 text-sm text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#f37a2a]/20"
                placeholder={actionDialog.type.includes('client') ? "Client name..." : "State name..."}
                value={actionInputValue}
                onChange={(e) => setActionInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitAction(); }}
              />
            </div>
          )}

          <DialogFooter className="mt-2">
            <button
              onClick={() => setActionDialog({ isOpen: false, type: null })}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#2a2e3d] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitAction}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2 shadow-sm ${
                actionDialog.type?.startsWith('delete') ? 'bg-red-500 hover:bg-red-600' : 'bg-[#f37a2a] hover:bg-[#d96a20]'
              }`}
            >
              {actionDialog.type?.startsWith('delete') ? 'Confirm Delete' : 'Save Changes'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
