"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Search, Users } from "lucide-react";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-green-400 border-t-transparent
                        rounded-full animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <Users className="text-blue-400" />
          Users
        </h2>
        <p className="text-zinc-400 mt-1">Total: {users.length} users</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2
                                     text-zinc-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-zinc-900 text-white rounded-xl pl-11 pr-4 py-3
                     border border-zinc-800 focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-6 py-4 text-zinc-400 text-sm font-medium">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-zinc-400 text-sm font-medium">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-zinc-400 text-sm font-medium">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-zinc-400 text-sm font-medium">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/50
                             transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 bg-green-500/20 rounded-full
                                      flex items-center justify-center text-green-400
                                      font-bold text-sm"
                      >
                        {user.full_name?.[0]?.toUpperCase() ||
                          user.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium">
                        {user.full_name || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              Koi user nahi mila!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
