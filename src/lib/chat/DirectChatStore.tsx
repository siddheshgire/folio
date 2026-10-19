"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ChatMessage } from "@/components/groups/ChatFeed";
import { PreviewDocument } from "@/components/viewer/DocumentPreviewModal";
import { useAuth } from "@/lib/auth/AuthContext";

export interface CampusUser {
  id: string;
  email: string;
  displayName: string;
  joinedAt: string;
  online: boolean;
}

export interface DirectChat {
  id: string;
  friendEmail: string;
  friendName: string;
  createdAt: string;
  messages: ChatMessage[];
  resources: PreviewDocument[];
}

interface DirectChatContextType {
  campusUsers: CampusUser[];
  directChats: DirectChat[];
  registerCampusUser: (email: string, displayName: string) => void;
  startOrGetDirectChat: (friendEmail: string, friendName?: string) => DirectChat;
  getDirectChat: (id: string) => DirectChat | undefined;
  sendDirectMessage: (chatId: string, content: string, voiceNoteDuration?: string) => void;
  sendDirectResource: (chatId: string, resource: PreviewDocument) => void;
}

const DirectChatContext = createContext<DirectChatContextType | undefined>(undefined);

const CAMPUS_USERS_STORAGE = "folio_campus_users";
const DIRECT_CHATS_STORAGE = "folio_direct_chats";

export function DirectChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [campusUsers, setCampusUsers] = useState<CampusUser[]>([]);
  const [directChats, setDirectChats] = useState<DirectChat[]>([]);

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(CAMPUS_USERS_STORAGE);
      if (savedUsers) {
        setCampusUsers(JSON.parse(savedUsers));
      } else {
        // Start clean with no mock data
        setCampusUsers([]);
      }

      const savedChats = localStorage.getItem(DIRECT_CHATS_STORAGE);
      if (savedChats) {
        setDirectChats(JSON.parse(savedChats));
      } else {
        setDirectChats([]);
      }
    } catch (e) {
      setCampusUsers([]);
      setDirectChats([]);
    }
  }, []);

  // Whenever the active logged in user is authenticated, register them in campus users
  useEffect(() => {
    if (user?.email) {
      registerCampusUser(user.email, user.displayName || user.email.split("@")[0]);
    }
  }, [user?.email]);

  const saveChats = (updated: DirectChat[]) => {
    setDirectChats(updated);
    try {
      localStorage.setItem(DIRECT_CHATS_STORAGE, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const registerCampusUser = (email: string, displayName: string) => {
    const trimmed = email.trim().toLowerCase();
    setCampusUsers((prev) => {
      const exists = prev.some((u) => u.email.toLowerCase() === trimmed);
      if (exists) {
        return prev.map((u) => (u.email.toLowerCase() === trimmed ? { ...u, online: true } : u));
      }
      const newUser: CampusUser = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email: trimmed,
        displayName: displayName || trimmed.split("@")[0],
        joinedAt: "Just now",
        online: true,
      };
      const updated = [newUser, ...prev];
      try {
        localStorage.setItem(CAMPUS_USERS_STORAGE, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const startOrGetDirectChat = (friendEmail: string, friendName?: string) => {
    const cleanEmail = friendEmail.trim().toLowerCase();
    const displayName = friendName || cleanEmail.split("@")[0];

    const existing = directChats.find(
      (c) => c.friendEmail.toLowerCase() === cleanEmail
    );
    if (existing) return existing;

    const newChat: DirectChat = {
      id: "dm_" + Math.random().toString(36).substring(2, 9),
      friendEmail: cleanEmail,
      friendName: displayName,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      messages: [
        {
          id: "m_dm_start",
          sender: "System",
          senderColor: "bg-brand-600",
          content: `This is the start of your private, end-to-end conversation with ${displayName} (${cleanEmail}). Chat, send voice notes, and share notes freely.`,
          timestamp: "Just now",
          isMe: false,
        },
      ],
      resources: [],
    };

    const updated = [newChat, ...directChats];
    saveChats(updated);
    return newChat;
  };

  const getDirectChat = (id: string) => {
    return directChats.find((c) => c.id === id);
  };

  const sendDirectMessage = (chatId: string, content: string, voiceNoteDuration?: string) => {
    const newMsg: ChatMessage = {
      id: "m_" + Date.now(),
      sender: user?.displayName ? `${user.displayName} (You)` : "You",
      senderColor: "bg-brand-600",
      content,
      voiceNoteDuration,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      reactions: {},
    };

    const updated = directChats.map((c) => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });
    saveChats(updated);
  };

  const sendDirectResource = (chatId: string, resource: PreviewDocument) => {
    const dropMsg: ChatMessage = {
      id: "m_drop_" + Date.now(),
      sender: user?.displayName ? `${user.displayName} (You)` : "You",
      senderColor: "bg-brand-600",
      content: `Shared file: ${resource.title}`,
      timestamp: "Just now",
      isMe: true,
      resource,
      reactions: { "🔥": 1 },
    };

    const updated = directChats.map((c) => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, dropMsg],
          resources: [resource, ...c.resources],
        };
      }
      return c;
    });
    saveChats(updated);
  };

  return (
    <DirectChatContext.Provider
      value={{
        campusUsers,
        directChats,
        registerCampusUser,
        startOrGetDirectChat,
        getDirectChat,
        sendDirectMessage,
        sendDirectResource,
      }}
    >
      {children}
    </DirectChatContext.Provider>
  );
}

export function useDirectChat() {
  const context = useContext(DirectChatContext);
  if (!context) {
    throw new Error("useDirectChat must be used within a DirectChatProvider");
  }
  return context;
}
