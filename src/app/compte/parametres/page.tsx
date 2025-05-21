'use client'
import { useState } from "react";
import Header from "@/components/home/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/home/Footer";
import ProfileSettingsFr from "@/components/paramaters/ProfileSettingsFr";
import NotificationsSettingsFr from "@/components/paramaters/NotificationsSettingsFr";
import SecuritySettingsFr from "@/components/paramaters/SecuritySettingsFr";

export default function SettingsPageFr() {
  const session = useSession();
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState<'Profile' | 'Sécurité' | 'Notifications'>('Profile');
  const pages={
    'Profile':<ProfileSettingsFr/>,
    'Sécurité':<SecuritySettingsFr/>,
    'Notifications':<NotificationsSettingsFr/>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session.data}/>

      <div className="flex-1 px-4 py-6 md:px-10 lg:px-40 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-4">
          <nav className="flex md:flex-col flex-row justify-around md:justify-start space-y-0 md:space-y-2 text-sm font-medium">
            {[
              { id: 'Profile', label: 'Profile' },
              { id: 'Sécurité', label: 'Sécurité' },
              { id: 'Notifications', label: 'Notifications' }
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setSelectedPage(id as typeof selectedPage)}
                className={`text-primary font-semibold flex items-center px-3 py-1 rounded transition ${
                  selectedPage === id
                    ? 'border shadow-sm text-colorOne'
                    : 'hover:underline hover:text-colorOne'
                }`}
              >
                <span className="mr-2 size-5">
                    {label==='Notifications'&&<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                    </svg>}
                    {label==='Profile'&&<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>}
                    {label==='Sécurité'&&<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>}
                </span>
                {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-10">
          {pages[selectedPage]}
        </main>
      </div>

      <Footer />
    </div>
  );
}
