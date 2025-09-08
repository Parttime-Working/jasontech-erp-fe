"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Shield, Key, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface Permission {
  id: number;
  module_name: string;
  resource: string;
  action: string;
  code: string;
  display_name: string;
  description: string;
  status: string;
  auto_registered: boolean;
  created_at: string;
  updated_at: string;
}

export default function PermissionManagementPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    module_name: "",
    resource: "",
    action: "",
    code: "",
    display_name: "",
    description: "",
    status: "active"
  });
  const router = useRouter();

  // 獲取權限列表
  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/permissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPermissions(data.data || data);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('獲取權限列表失敗:', error);
    }
  };

  useEffect(() => {
    fetchPermissions().then(() => setLoading(false));
  }, []);

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/login');
        return;
      }

      const url = selectedPermission ? `/api/permissions/${selectedPermission.id}` : '/api/permissions';
      const method = selectedPermission ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPermissions();
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setSelectedPermission(null);
        setFormData({
          module_name: "",
          resource: "",
          action: "",
          code: "",
          display_name: "",
          description: "",
          status: "active"
        });
      } else {
        const error = await response.json();
        alert(error.error || '操作失敗');
      }
    } catch (error) {
      console.error('操作失敗:', error);
      alert('操作失敗');
    }
  };

  // 處理編輯
  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setFormData({
      module_name: permission.module_name,
      resource: permission.resource,
      action: permission.action,
      code: permission.code,
      display_name: permission.display_name,
      description: permission.description,
      status: permission.status
    });
    setIsEditDialogOpen(true);
  };

  // 處理刪除
  const handleDelete = async (permissionId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/permissions/${permissionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchPermissions();
      } else {
        const error = await response.json();
        alert(error.error || '刪除失敗');
      }
    } catch (error) {
      console.error('刪除失敗:', error);
      alert('刪除失敗');
    }
  };

  // 處理新增權限
  const handleCreate = () => {
    setSelectedPermission(null);
    setFormData({
      module_name: "",
      resource: "",
      action: "",
      code: "",
      display_name: "",
      description: "",
      status: "active"
    });
    setIsCreateDialogOpen(true);
  };

  // 按模組分組權限
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const module = permission.module_name;
    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Key className="h-8 w-8 text-blue-600" />
              權限管理
            </h1>
            <p className="text-gray-600">管理系統權限和存取控制</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新增權限
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總權限數</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{permissions.length}</div>
              <p className="text-xs text-muted-foreground">
                系統中的權限總數
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">活躍權限</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {permissions.filter(p => p.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                目前活躍的權限
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">模組數量</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(groupedPermissions).length}
              </div>
              <p className="text-xs text-muted-foreground">
                不同的功能模組
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">自動註冊</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {permissions.filter(p => p.auto_registered).length}
              </div>
              <p className="text-xs text-muted-foreground">
                系統自動註冊的權限
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Permissions by Module */}
        {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
          <Card key={module} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {module.charAt(0).toUpperCase() + module.slice(1)} 模組
                <Badge variant="secondary">{modulePermissions.length} 個權限</Badge>
              </CardTitle>
              <CardDescription>
                {module} 模組的所有權限設定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>權限代碼</TableHead>
                    <TableHead>顯示名稱</TableHead>
                    <TableHead>資源</TableHead>
                    <TableHead>操作</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>類型</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modulePermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-mono text-sm">
                        {permission.code}
                      </TableCell>
                      <TableCell>{permission.display_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {permission.resource}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {permission.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={permission.status === 'active' ? 'default' : 'secondary'}>
                          {permission.status === 'active' ? '活躍' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {permission.auto_registered ? (
                          <Badge variant="outline">自動註冊</Badge>
                        ) : (
                          <Badge variant="secondary">手動建立</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(permission)}
                            disabled={permission.auto_registered}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={permission.auto_registered}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>確認刪除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  確定要刪除權限 "{permission.display_name}" 嗎？此操作無法復原。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(permission.id)}>
                                  刪除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        {/* Create Permission Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>新增權限</DialogTitle>
              <DialogDescription>
                創建新的系統權限
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="module_name" className="text-right">
                    模組名稱
                  </Label>
                  <Input
                    id="module_name"
                    value={formData.module_name}
                    onChange={(e) => setFormData({ ...formData, module_name: e.target.value })}
                    className="col-span-3"
                    placeholder="例如: hr, finance, project"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resource" className="text-right">
                    資源
                  </Label>
                  <Input
                    id="resource"
                    value={formData.resource}
                    onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                    className="col-span-3"
                    placeholder="例如: employees, projects"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="action" className="text-right">
                    操作
                  </Label>
                  <Input
                    id="action"
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className="col-span-3"
                    placeholder="例如: view, create, edit, delete"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    權限代碼
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="col-span-3"
                    placeholder="例如: hr.employees.view"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="display_name" className="text-right">
                    顯示名稱
                  </Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="col-span-3"
                    placeholder="例如: 查看員工資訊"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    描述
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                    placeholder="權限的詳細描述"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    狀態
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">活躍</SelectItem>
                      <SelectItem value="inactive">停用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">創建權限</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Permission Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>編輯權限</DialogTitle>
              <DialogDescription>
                修改權限資訊
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_module_name" className="text-right">
                    模組名稱
                  </Label>
                  <Input
                    id="edit_module_name"
                    value={formData.module_name}
                    onChange={(e) => setFormData({ ...formData, module_name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_resource" className="text-right">
                    資源
                  </Label>
                  <Input
                    id="edit_resource"
                    value={formData.resource}
                    onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_action" className="text-right">
                    操作
                  </Label>
                  <Input
                    id="edit_action"
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_code" className="text-right">
                    權限代碼
                  </Label>
                  <Input
                    id="edit_code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_display_name" className="text-right">
                    顯示名稱
                  </Label>
                  <Input
                    id="edit_display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_description" className="text-right">
                    描述
                  </Label>
                  <Textarea
                    id="edit_description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_status" className="text-right">
                    狀態
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">活躍</SelectItem>
                      <SelectItem value="inactive">停用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">更新權限</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
