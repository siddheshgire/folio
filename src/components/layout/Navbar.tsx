"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, MessageSquare, BookOpen, Sparkles, Menu, X, ArrowRight, Lock } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-sky p-0.5 shadow-lg shadow-brand-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0B0F19]">
              <BookOpen className="h-4 w-4 text-brand-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-lg">FOLIO</span>
              <span className="rounded-full bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-400 border border-brand-500/20">
                v1.0
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#chat-experience" className="hover:text-white transition flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            Group Chat
          </a>
          <a href="#study-vault" className="hover:text-white transition flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-accent-sky" />
            Study Vault
          </a>
          <a href="#mfa-security" className="hover:text-white transition flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-brand-400" />
            MFA & Privacy
          </a>
          <a href="#academic-flow" className="hover:text-white transition">
            Taxonomy
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            End-to-End Private
          </div>
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:shadow-brand-500/40 hover:from-brand-500 hover:to-brand-600 active:scale-95"
          >
            <span>Enter StudyVault</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-[#111827] px-4 py-4 space-y-3">
          <a
            href="#chat-experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white font-medium py-1.5"
          >
            Group Chat
          </a>
          <a
            href="#study-vault"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white font-medium py-1.5"
          >
            Study Vault
          </a>
          <a
            href="#mfa-security"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white font-medium py-1.5"
          >
            MFA & Security
          </a>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 block w-full rounded-xl bg-brand-600 py-2.5 text-center font-semibold text-white"
          >
            Sign In / Join Group
          </Link>
        </div>
      )}
    </header>
  );
}
