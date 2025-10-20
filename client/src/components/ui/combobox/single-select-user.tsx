"use client";

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { userService } from '@/services/admin/userService';
import { User as UserType } from '@/types/admin/user.interface';

interface SelectedUser {
  value: string;
  label: string;
  email?: string | null;
  phoneNumber?: string | null;
}

interface SingleSelectUserProps {
  selectedUser?: SelectedUser | null;
  onSelectionChange: (user: SelectedUser | null) => void;
  placeholder?: string;
  className?: string;
}

export function SingleSelectUser({
  selectedUser,
  onSelectionChange,
  placeholder = "Chọn người dùng...",
  className,
}: SingleSelectUserProps) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load users from API
  const loadUsers = async (page: number = 1, search: string = '') => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await userService.getAll({
        page,
        limit: 20,
        search: search.trim() || undefined,
      });

      if (page === 1) {
        setUsers(response.data || []);
      } else {
        setUsers(prev => [...prev, ...(response.data || [])]);
      }

      // Check if there are more pages
      const totalPages = response.metadata?.totalPages || 1;
      setHasMore(page < totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading users:', error);
      if (page === 1) {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers(1, searchTerm);
  }, [searchTerm]);

  // Load more users when scrolling
  const loadMore = () => {
    if (hasMore && !loading) {
      loadUsers(currentPage + 1, searchTerm);
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setHasMore(true);
  };

  // Handle user selection
  const handleSelect = (user: UserType) => {
    const selectedUserData: SelectedUser = {
      value: user.id,
      label: user.name || user.email || 'Unnamed User',
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    
    onSelectionChange(selectedUserData);
    setOpen(false);
  };

  // Handle remove selection
  const handleRemove = () => {
    onSelectionChange(null);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    //   user.phone?.includes(searchTerm)
    );
  });

  return (
    <div className={cn("w-full", className)}>
      {/* Selected user display */}
      {selectedUser ? (
        <div className="mb-3">
          <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2 text-sm">
            <User className="w-4 h-4" />
            <span className="font-medium">{selectedUser.label}</span>
            {selectedUser.email && (
              <span className="text-xs text-gray-600">({selectedUser.email})</span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        </div>
      ) : null}

      {/* User selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !selectedUser && "text-muted-foreground"
            )}
          >
            {selectedUser ? selectedUser.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onValueChange={handleSearch}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList className="max-h-60">
              {loading && filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center py-6 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span className="ml-2">Đang tải...</span>
                </div>
              ) : (
                <>
                  <CommandEmpty>Không tìm thấy người dùng nào.</CommandEmpty>
                  <CommandGroup>
                    {filteredUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => handleSelect(user)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <User className="w-4 h-4 text-gray-500" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {user.name || 'Unnamed User'}
                            </div>
                            {user.email && (
                              <div className="text-xs text-gray-600 truncate">
                                {user.email}
                              </div>
                            )}
                            {/* {user.phone && (
                              <div className="text-xs text-gray-500">
                                {user.phone}
                              </div>
                            )} */}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedUser?.value === user.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  
                  {/* Load more button */}
                  {hasMore && !loading && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={loadMore}
                      >
                        Tải thêm...
                      </Button>
                    </div>
                  )}
                  
                  {/* Loading more indicator */}
                  {loading && filteredUsers.length > 0 && (
                    <div className="flex items-center justify-center py-2 text-sm border-t">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900"></div>
                      <span className="ml-2">Đang tải thêm...</span>
                    </div>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
