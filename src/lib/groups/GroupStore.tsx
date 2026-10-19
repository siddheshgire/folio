"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PreviewDocument } from "@/components/viewer/DocumentPreviewModal";
import { ChatMessage } from "@/components/groups/ChatFeed";
import { useAuth } from "@/lib/auth/AuthContext";
import { realtimeEngine } from "@/lib/realtime/broadcast";

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
        setGroups([]);
      }
    } catch (e) {
      setGroups([]);
    }
    setLoading(false);
  }, []);

  // Listen to cross-tab real-time sync
  useEffect(() => {
    const unsubscribe = realtimeEngine.subscribe((event) => {
      if (event.type === "GROUP_MESSAGE") {
        setGroups((prev) =>
          prev.map((g) => {
            if (g.id === event.groupId) {
              const alreadyHas = g.messages.some((m) => m.id === event.message.id);
              if (alreadyHas) return g;
              return {
                ...g,
                messages: [...g.messages, event.message],
              };
            }
            return g;
          })
        );
      } else if (event.type === "GROUP_RESOURCE") {
        setGroups((prev) =>
          prev.map((g) => {
            if (g.id === event.groupId) {
              return {
                ...g,
                resources: [event.resource, ...g.resources],
              };
            }
            return g;
          })
        );
      } else if (event.type === "GROUP_MEMBER_ADDED") {
        setGroups((prev) =>
          prev.map((g) => {
            if (g.id === event.groupId) {
              return {
                ...g,
                members: [...g.members, event.member],
              };
            }
            return g;
          })
        );
      }
    });

    return () => unsubscribe();
  }, []);

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
          content: `Welcome to ${name}! This is your private circle to chat freely, discuss exams, and upload any PDF, PPT, DOCX, Code or AI links.`,
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

    const joinAnnouncement: ChatMessage = {
      id: "m_joined_" + Date.now(),
      sender: "System",
      senderColor: "bg-emerald-600",
      content: `${newMember.displayName} was added to the group by registered email (${trimmed}).`,
      timestamp: "Just now",
      isMe: false,
    };

    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          members: [...g.members, newMember],
          messages: [...g.messages, joinAnnouncement],
        };
      }
      return g;
    });

    saveGroups(updated);

    // Broadcast in real-time to other tabs
    realtimeEngine.broadcast({
      type: "GROUP_MEMBER_ADDED",
      groupId,
      member: newMember,
    });
    realtimeEngine.broadcast({
      type: "GROUP_MESSAGE",
      groupId,
      message: joinAnnouncement,
    });

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

    // Broadcast across all open tabs/windows in zero milliseconds
    realtimeEngine.broadcast({
      type: "GROUP_MESSAGE",
      groupId,
      message: fullMsg,
    });
  };

  const addResource = (groupId: string, resource: PreviewDocument, shareInChat = true) => {
    let dropMsg: ChatMessage | null = null;
    if (shareInChat) {
      dropMsg = {
        id: "m_drop_" + Date.now(),
        sender: user?.displayName ? `${user.displayName} (You)` : "You",
        senderColor: "bg-brand-600",
        content: `Shared study resource: ${resource.title}`,
        timestamp: "Just now",
        isMe: true,
        resource,
        reactions: { "🔥": 1 },
      };
    }

    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          resources: [resource, ...g.resources],
          messages: dropMsg ? [...g.messages, dropMsg] : g.messages,
        };
      }
      return g;
    });
    saveGroups(updated);

    // Broadcast real-time
    realtimeEngine.broadcast({
      type: "GROUP_RESOURCE",
      groupId,
      resource,
    });
    if (dropMsg) {
      realtimeEngine.broadcast({
        type: "GROUP_MESSAGE",
        groupId,
        message: dropMsg,
      });
    }
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
