import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import {
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Building,
  Save,
  X,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BankAccountModal({ isOpen, onClose }: BankAccountModalProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "BCA",
      accountNumber: "1234567890",
      accountName: "Anggit Ganteng",
      isDefault: true,
    },
    {
      id: "2",
      bankName: "Mandiri",
      accountNumber: "0987654321",
      accountName: "Anggit Ganteng",
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const bankOptions = [
    "BCA",
    "Mandiri",
    "BRI",
    "BNI",
    "CIMB Niaga",
    "Danamon",
    "Permata",
    "OCBC NISP",
    "Maybank",
    "BTN",
    "Jenius",
    "Jago",
  ];

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newAccount.bankName ||
      !newAccount.accountNumber ||
      !newAccount.accountName
    ) {
      toast.error("Semua field harus diisi!");
      return;
    }

    if (newAccount.accountNumber.length < 8) {
      toast.error("Nomor rekening minimal 8 digit!");
      return;
    }

    if (!privacyAccepted) {
      toast.error("Anda harus menyetujui kebijakan privasi!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newId = (accounts.length + 1).toString();
      setAccounts((prev) => [
        ...prev,
        {
          id: newId,
          ...newAccount,
          isDefault: false,
        },
      ]);

      setNewAccount({ bankName: "", accountNumber: "", accountName: "" });
      setShowAddForm(false);
      setIsLoading(false);
      toast.success("Rekening berhasil ditambahkan!");
    }, 1000);
  };

  const handleDeleteAccount = (id: string) => {
    const account = accounts.find((acc) => acc.id === id);
    if (account?.isDefault) {
      toast.error("Tidak dapat menghapus rekening utama!");
      return;
    }

    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    toast.success("Rekening berhasil dihapus!");
  };

  const handleSetDefault = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        isDefault: acc.id === id,
      }))
    );
    toast.success("Rekening utama berhasil diubah!");
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return accountNumber.slice(0, 4) + "****" + accountNumber.slice(-2);
  };

  const getBankColor = (bankName: string) => {
    const colors: { [key: string]: string } = {
      BCA: "bg-blue-100 text-blue-800 border-blue-300",
      Mandiri: "bg-yellow-100 text-yellow-800 border-yellow-300",
      BRI: "bg-green-100 text-green-800 border-green-300",
      BNI: "bg-orange-100 text-orange-800 border-orange-300",
      default: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return colors[bankName] || colors.default;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="text-purple-600" size={20} />
            Kelola Rekening Bank
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Accounts */}
          <div className="space-y-3">
            {accounts.map((account) => (
              <Card
                key={account.id}
                className={`${
                  account.isDefault ? "ring-2 ring-green-500 ring-offset-2" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getBankColor(account.bankName)}>
                          {account.bankName}
                        </Badge>
                        {account.isDefault && (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <Check size={12} className="mr-1" />
                            Utama
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium text-gray-900">
                        {account.accountName}
                      </p>
                      <p className="text-sm text-gray-500 font-mono">
                        {maskAccountNumber(account.accountNumber)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!account.isDefault && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSetDefault(account.id)}
                          className="w-8 h-8"
                        >
                          <Check size={14} />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteAccount(account.id)}
                        className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={account.isDefault}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Account Button */}
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              className="w-full gap-2 h-12 border-dashed border-2"
            >
              <Plus size={16} />
              Tambah Rekening Baru
            </Button>
          )}

          {/* Add New Account Form */}
          {showAddForm && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <form onSubmit={handleAddAccount} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bank</Label>
                    <Select
                      value={newAccount.bankName}
                      onValueChange={(value) =>
                        setNewAccount((prev) => ({ ...prev, bankName: value }))
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankOptions.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            <div className="flex items-center gap-2">
                              <Building size={14} />
                              {bank}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Nomor Rekening</Label>
                    <Input
                      id="accountNumber"
                      value={newAccount.accountNumber}
                      onChange={(e) =>
                        setNewAccount((prev) => ({
                          ...prev,
                          accountNumber: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                      placeholder="Masukkan nomor rekening"
                      className="bg-white font-mono"
                      maxLength={20}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountName">Nama Rekening</Label>
                    <Input
                      id="accountName"
                      value={newAccount.accountName}
                      onChange={(e) =>
                        setNewAccount((prev) => ({
                          ...prev,
                          accountName: e.target.value,
                        }))
                      }
                      placeholder="Nama sesuai rekening"
                      className="bg-white"
                    />
                  </div>

                  {/* Privacy Policy Checkbox */}
                  <div className="flex items-start gap-3 pt-2 px-1">
                    <Checkbox
                      id="privacy"
                      checked={privacyAccepted}
                      onCheckedChange={(checked) =>
                        setPrivacyAccepted(checked as boolean)
                      }
                      className="mt-1 flex-shrink-0 w-6 h-6 rounded"
                    />
                    <div className="text-xs text-gray-600 leading-relaxed flex-1 min-w-0">
                      <label htmlFor="privacy" className="cursor-pointer block">
                        Saya menyetujui{" "}
                        <span className="text-blue-600 font-medium">
                          Kebijakan Privasi
                        </span>{" "}
                        dan memberikan izin untuk menyimpan data rekening saya
                        dengan aman.
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewAccount({
                          bankName: "",
                          accountNumber: "",
                          accountName: "",
                        });
                        setPrivacyAccepted(false);
                      }}
                      className="flex-1 gap-2"
                      disabled={isLoading}
                    >
                      <X size={16} />
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                      disabled={isLoading || !privacyAccepted}
                    >
                      <Save size={16} />
                      {isLoading ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 Rekening yang ditandai "Utama" akan digunakan untuk pencairan
              saldo secara otomatis.
            </p>
          </div>

          {/* Privacy Policy */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">
              🔒 Kebijakan Privasi
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Data rekening Anda disimpan dengan aman dan terenkripsi</p>
              <p>• Informasi hanya digunakan untuk proses pencairan saldo</p>
              <p>• Data tidak akan dibagikan ke pihak ketiga tanpa izin Anda</p>
              <p>• Anda dapat menghapus rekening kapan saja</p>
            </div>
          </div>

          {/* Close Button */}
          <Button variant="outline" onClick={onClose} className="w-full gap-2">
            <X size={16} />
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
