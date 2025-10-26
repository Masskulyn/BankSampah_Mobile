import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Search, Users, Mail, Phone, MapPin, TrendingUp, Calendar, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
  lastLogin: string;
  balance: number;
  totalEarnings: number;
  wasteDeposited: number;
  role?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const usersData = localStorage.getItem("ecobank_users");
    const allUsers = usersData ? JSON.parse(usersData) : [];
    // Filter out admin users
    const regularUsers = allUsers.filter((u: User) => u.role !== 'admin');
    setUsers(regularUsers);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const getStatusBadge = (lastLogin: string) => {
    const lastLoginDate = new Date(lastLogin);
    const daysDiff = (Date.now() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff <= 1) {
      return <Badge className="bg-green-100 text-green-700 border-green-200">Aktif Hari Ini</Badge>;
    } else if (daysDiff <= 7) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Aktif Minggu Ini</Badge>;
    } else if (daysDiff <= 30) {
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Aktif Bulan Ini</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Tidak Aktif</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <Card className="p-6 bg-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900">Manajemen Pengguna</h3>
            <p className="text-sm text-gray-500">{users.length} pengguna terdaftar</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari nama, email, telepon, atau kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Total Sampah</TableHead>
                <TableHead>Bergabung</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5" />
                        {user.city}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.lastLogin)}</TableCell>
                    <TableCell>
                      <p className="font-medium text-green-600">
                        Rp {user.balance.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Total: Rp {user.totalEarnings.toLocaleString('id-ID')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{user.wasteDeposited} kg</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                        className="border-gray-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Tidak ada pengguna yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card key={user.id} className="p-4 border border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                    {getStatusBadge(user.lastLogin)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Saldo</p>
                    <p className="font-medium text-green-600">
                      Rp {user.balance.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Total Sampah</p>
                    <p className="font-medium text-gray-900">{user.wasteDeposited} kg</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewUser(user)}
                  className="w-full h-10 border-gray-300 text-xs md:text-sm px-3"
                >
                  <Eye className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">Lihat Detail</span>
                </Button>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Tidak ada pengguna yang ditemukan
            </div>
          )}
        </div>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={showUserDetail} onOpenChange={setShowUserDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.id}</p>
                  {getStatusBadge(selectedUser.lastLogin)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Telepon</p>
                    <p className="font-medium text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Kota</p>
                    <p className="font-medium text-gray-900">{selectedUser.city}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Saldo Saat Ini</p>
                    <p className="text-2xl font-bold text-green-600">
                      Rp {selectedUser.balance.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Pendapatan</p>
                    <p className="font-medium text-gray-900">
                      Rp {selectedUser.totalEarnings.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Sampah Disetor</p>
                    <p className="font-medium text-gray-900">{selectedUser.wasteDeposited} kg</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bergabung Sejak</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Login Terakhir</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedUser.lastLogin)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
