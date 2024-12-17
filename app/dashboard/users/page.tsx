"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { usePurchased } from "@/context/purchased-context";

interface User {
  id: number;
  name: string;
  email: string;
  purchasedItems?: any[];
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { purchasedItems } = usePurchased();

  useEffect(() => {
    // In a real app, fetch users from your API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) throw new Error('Failed to update user');

      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setIsEditing(false);
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const getUserPurchases = (userId: number) => {
    // For now, return all purchased items since we don't track user-specific purchases
    return purchasedItems;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="grid gap-6">
          {users.map(user => (
            <Card key={user.id} className="dark:bg-gray-800 border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold dark:text-white">
                  {user.name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(user)}
                    className="hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(user.id)}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label className="text-sm font-medium dark:text-gray-300">Email</Label>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium dark:text-gray-300">Purchased Items</Label>
                    <div className="mt-2 space-y-2">
                      {getUserPurchases(user.id).map(item => (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {item.name}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(item.downloadUrl, "_blank")}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle>
                {editingUser ? 'Edit User' : 'Add User'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editingUser?.name || ''}
                    onChange={e => setEditingUser(prev => prev ? {...prev, name: e.target.value} : null)}
                    className="dark:bg-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingUser?.email || ''}
                    onChange={e => setEditingUser(prev => prev ? {...prev, email: e.target.value} : null)}
                    className="dark:bg-gray-700"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingUser(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
