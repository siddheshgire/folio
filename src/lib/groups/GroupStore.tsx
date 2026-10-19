"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PreviewDocument } from "@/components/viewer/DocumentPreviewModal";
import { ChatMessage } from "@/components/groups/ChatFeed";
import { useAuth } from "@/lib/auth/AuthContext";

export interface GroupMember {
  email: string;
  displayName: string;
  role: "admin" | "member";
  joinedAt: string;
  online?: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  academicYear?: string;
  semester?: number;
  inviteCode: string;
  createdById: string;
  createdByEmail: string;
  createdAt: string;
  members: GroupMember[];
  resources: PreviewDocument[];
  messages: ChatMessage[];
}

interface GroupContextType {
  groups: StudyGroup[];
  loading: boolean;
  createGroup: (name: string, description: string, academicYear?: string) => StudyGroup;
  getGroup: (id: string) => StudyGroup | undefined;
  addMemberByEmail: (groupId: string, email: string, role?: "admin" | "member") => { success: boolean; error?: string };
  removeMember: (groupId: string, email: string) => void;
  addMessage: (groupId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  addResource: (groupId: string, resource: PreviewDocument, shareInChat?: boolean) => void;
  deleteGroup: (groupId: string) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

const STORAGE_KEY = "folio_user_groups";

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setGroups(JSON.parse(saved));
      } else {
        // Start completely clean - 0 groups!
        setGroups([]);
      }
    } catch (e) {
      setGroups([]);
    }
    setLoading(false);
  }, []);

  // Save to local storage whenever groups change
  const saveGroups = (updated: StudyGroup[]) => {
    setGroups(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save groups", e);
    }
  };

  const createGroup = (name: string, description: string, academicYear = "Current Term") => {
    const creatorEmail = user?.email || "student@campus.edu";
    const creatorName = user?.displayName || creatorEmail.split("@")[0];

    const newGroup: StudyGroup = {
      id: "grp_" + Math.random().toString(36).substring(2, 9),
      name,
      description,
      academicYear,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdById: user?.id || "usr_default",
      createdByEmail: creatorEmail,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      members: [
        {
          email: creatorEmail,
          displayName: `${creatorName} (You)`,
          role: "admin",
          joinedAt: "Created circle",
          online: true,
        },
      ],
      resources: [],
      messages: [
        {
          id: "m_welcome",
          sender: "System",
          senderColor: "bg-brand-600",
          content: `Welcome to ${name}! This is your private circle to chat freely, discuss exams, and upload original-quality study notes.`,
          timestamp: "Just now",
          isMe: false,
        },
      ],
    };

    const updated = [newGroup, ...groups];
    saveGroups(updated);
    return newGroup;
  };

  const getGroup = (id: string) => {
    return groups.find((g) => g.id === id);
  };

  const addMemberByEmail = (groupId: string, email: string, role: "admin" | "member" = "member") => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      return { success: false, error: "Please provide a valid email address" };
    }

    const group = groups.find((g) => g.id === groupId);
    if (!group) return { success: false, error: "Group not found" };

    const alreadyMember = group.members.some((m) => m.email.toLowerCase() === trimmed);
    if (alreadyMember) {
      return { success: false, error: "This email is already in this study group" };
    }

    const newMember: GroupMember = {
      email: trimmed,
      displayName: trimmed.split("@")[0],
      role,
      joinedAt: "Just now",
      online: true,
    };

    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          members: [...g.members, newMember],
          messages: [
            ...g.messages,
            {
              id: "m_joined_" + Date.now(),
              sender: "System",
              senderColor: "bg-emerald-600",
              content: `${newMember.displayName} was added to the group by registered email (${trimmed}).`,
              timestamp: "Just now",
              isMe: false,
            },
          ],
        };
      }
      return g;
    });

    saveGroups(updated);
    return { success: true };
  };

  const removeMember = (groupId: string, email: string) => {
    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter((m) => m.email.toLowerCase() !== email.toLowerCase()),
        };
      }
      return g;
    });
    saveGroups(updated);
  };

  const addMessage = (groupId: string, message: Omit<ChatMessage, "id" | "timestamp">) => {
    const fullMsg: ChatMessage = {
      ...message,
      id: "m_" + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          messages: [...g.messages, fullMsg],
        };
      }
      return g;
    });
    saveGroups(updated);
  };

  const addResource = (groupId: string, resource: PreviewDocument, shareInChat = true) => {
    const updated = groups.map((g) => {
      if (g.id === groupId) {
        const newResources = [resource, ...g.resources];
        let newMessages = g.messages;

        if (shareInChat) {
          const dropMsg: ChatMessage = {
            id: "m_drop_" + Date.now(),
            sender: user?.displayName ? `${user.displayName} (You)` : "You",
            senderColor: "bg-brand-600",
            content: `Shared study resource: ${resource.title}`,
            timestamp: "Just now",
            isMe: true,
            resource,
            reactions: { "🔥": 1 },
          };
          newMessages = [...g.messages, dropMsg];
        }

        return {
          ...g,
          resources: newResources,
          messages: newMessages,
        };
      }
      return g;
    });
    saveGroups(updated);
  };

  const deleteGroup = (groupId: string) => {
    const updated = groups.filter((g) => g.id !== groupId);
    saveGroups(updated);
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        loading,
        createGroup,
        getGroup,
        addMemberByEmail,
        removeMember,
        addMessage,
        addResource,
        deleteGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
}
