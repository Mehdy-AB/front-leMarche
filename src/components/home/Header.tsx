"use client";

import { Session } from "next-auth";
import Image from 'next/image';
import { UserAvatar } from "../all/UserAvatar";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import DropDown from "../outher/DropDown";

export default function Header({ session }: { session: Session | null }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMessages, setMessages] = useState(true);
  return (
    <header className="border-b border-gray-200 z-20 relative">
      <div className="fixed bottom-[5%] right-[2%]">
        <button className="bg-white rounded-full border-2 group border-gray-300 hover:bg-gray-200 shadow-lg p-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left - Logo + Search */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-colorOne z-0 cursor-pointer text-2xl font-bold">leMarché</Link>
          <div className="relative hidden md:block w-96">
            <input
              type="text"
              placeholder="Rechercher sur leMarché"
              className="pl-4 pr-10 py-2 rounded-full bg-gray-100 focus:outline-none w-full"
            />

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute size-7 cursor-pointer right-2 top-1/2 -translate-y-1/2 text-white bg-colorOne p-1.5 rounded-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>

        {/* Right - Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <a href="/compte/new" className="bg-colorOne text-white px-4 py-2 rounded-full font-medium hover:bg-[#e64a19] transition-all duration-300">
            + Déposer une annonce
          </a>
          <div className="flex items-end space-x-6">
          {session ? (
            <>
              <Link href="/favoris" className="text-center justify-center flex flex-col hover:text-colorOne transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
                <p>Favoris</p>
              </Link>
              <Link href="/compte/messages" className="text-center justify-center flex flex-col hover:text-colorOne transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                <p>Messages</p>
              </Link>
              <div className="relative" id="user-avatar" onClick={() => setShowUserDropdown((prev) => !prev)}>
                {session.user.image?.url ? (
                  <Image
                    height={32}
                    width={32}
                    src={session.user.image.url}
                    alt="User"
                    className="rounded-full object-cover cursor-pointer mx-auto"
                  />
                ) : (
                  <UserAvatar height={32} userName={session.user.username} />
                )}
                <p className="text-center">{session.user.username}</p>

                {showUserDropdown && (
                  <DropDown setIsShow={setShowUserDropdown} notEff={["user-avatar"]}>
                    <div className="absolute top-full mt-2 right-0 bg-white rounded border shadow-md w-44 py-3">
                      <a href="/compte/parametres" className="block px-4 py-2 hover:bg-gray-100 hover:text-colorOne">
                        Paramètres
                      </a>
                      <a href="/compte/mes-annonces" className="block px-4 py-2 hover:bg-gray-100 hover:text-colorOne">
                        Mes Annonces
                      </a>
                      <a href="/aide" className="block px-4 py-2 hover:bg-gray-100 hover:text-colorOne">
                        Aide
                      </a>
                      <hr className="my-2 mx-4 border-gray-300" />
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-colorOne"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </DropDown>
                )}
              </div>
            </>
          ) : (
            <a href="/api/auth/signin" className="text-center hover:text-colorOne transition-all">
              <p>Se connecter</p>
            </a>
          )}
        </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setShowSidebar(true)} className="md:hidden text-colorOne">
          <Menu className="size-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="bg-white w-64 h-full p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-colorOne">Menu</h2>
              <button onClick={() => setShowSidebar(false)} className="text-gray-500 hover:text-black">
                <X className="size-6" />
              </button>
            </div>

            <a href="/compte/new" className="block font-medium text-colorOne">+ Déposer une annonce</a>
            {session ? (
              <>
                <a href="/favoris" className="block">Favoris</a>
                <a href="/compte/messages" className="block">Messages</a>
                <a href="/compte/parametres" className="block">Paramètres</a>
                <a href="/compte/mes-annonces" className="block">Mes Annonces</a>
                <a href="/aide" className="block">Aide</a>
                <button onClick={() => signOut()} className="text-left block w-full">Déconnexion</button>
              </>
            ) : (
              <a href="/api/auth/signin" className="block">Se connecter</a>
            )}
          </div>
          <div className="flex-1" onClick={() => setShowSidebar(false)}></div>
        </div>
      )}
    </header>
  );
}
