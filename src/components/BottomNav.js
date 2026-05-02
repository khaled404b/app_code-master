'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, FileText, Settings, LogOut, Eye, ClipboardList, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function BottomNav() {
  const pathname = usePathname();
  const { user, logout, canEdit } = useAuth();

  const navItems = [
    { href: '/', icon: Home, label: 'الرئيسية' },
    { href: '/clients', icon: Users, label: 'العملاء' },
    { href: '/tasks', icon: Briefcase, label: 'الأعمال' },
    { href: '/invoices', icon: FileText, label: 'الفواتير' },
    { href: '/supervision', icon: Eye, label: 'الإشراف' },
    { href: '/offers', icon: ClipboardList, label: 'العروض' },
    { href: '/deliveries', icon: Send, label: 'التسليم' },
    { href: '/settings', icon: Settings, label: 'الإعدادات' },
  ];

  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="avatar" style={{ background: user?.color || '#2563eb', width: '34px', height: '34px', fontSize: '13px' }}>
            {user?.name?.[0]}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.2 }}>{user?.name}</div>
            <div style={{
              fontSize: '11px', fontWeight: 700, lineHeight: 1,
              color: canEdit ? '#059669' : '#d97706',
            }}>
              {canEdit ? '● تعديل وعرض' : '● عرض فقط'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
            background: canEdit ? '#ecfdf5' : '#fffbeb',
            color: canEdit ? '#059669' : '#d97706',
          }}>
            {canEdit ? 'محرر' : 'مشاهد'}
          </span>
          <button onClick={logout} className="icon-btn" style={{ width: '34px', height: '34px' }}>
            <LogOut size={15} color="#dc2626" />
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className={`nav-item ${isActive(href) ? 'active' : ''}`}>
            <Icon className="nav-icon" strokeWidth={isActive(href) ? 2.5 : 1.8} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
