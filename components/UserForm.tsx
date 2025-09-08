"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  username: string;
  email: string;
  level: string;
  last_login_at: string | null;
  created_at: string;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

const createUserSchema = z.object({
  username: z.string().min(1, "使用者名稱為必填"),
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().min(8, "密碼至少需要8個字符"),
  level: z.enum(["user", "admin", "super_admin"]).optional(),
});

const editUserSchema = z.object({
  username: z.string().min(1, "使用者名稱為必填"),
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().optional(),
  level: z.enum(["user", "admin", "super_admin"]).optional(),
});

type UserFormData = z.infer<typeof createUserSchema | typeof editUserSchema>;

export default function UserForm({ isOpen, onClose, onSuccess, user }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const isEditing = !!user;

  useEffect(() => {
    // 確保只在客戶端執行
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCurrentUserRole(null);
        return;
      }

      const decoded: { level?: string } = jwtDecode(token);

      // 如果 token 中沒有 level 字段，清除狀態
      if (!decoded.level) {
        setCurrentUserRole(null);
      } else {
        setCurrentUserRole(decoded.level);
      }
    } catch (error) {
      // 靜默處理 token 解析錯誤，避免洩露敏感信息
      setCurrentUserRole(null);
    }
  }, []);

  const canEditRole = currentUserRole === "admin";
  const isSuperAdmin = user?.id === 1 && user?.level === "super_admin";

  // 檢查是否正在編輯自己的帳號
  const isEditingSelf = (() => {
    if (typeof window === 'undefined') return false;
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const decoded: { user_id?: number } = jwtDecode(token);
      return decoded.user_id === user?.id;
    } catch {
      return false;
    }
  })();

  // 超級管理員可以編輯其他用戶的角色，但不能編輯自己的角色
  const canEditThisUserRole = canEditRole && !isEditingSelf;

  const form = useForm<UserFormData>({
    resolver: zodResolver(isEditing ? editUserSchema : createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      level: "user",
    },
  });

  // 當 user prop 改變時，重置表單值
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || "",
        email: user.email || "",
        password: "",
        level: (user.level as "user" | "admin" | "super_admin") || "user",
      });
    } else {
      // 新增用戶時重置為空值
      form.reset({
        username: "",
        email: "",
        password: "",
        level: "user",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("未經授權");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        username: data.username,
        email: data.email,
        ...(data.password && { password: data.password }),
        ...(data.level && { level: data.level }),
      };

      if (isEditing && user) {
        await axios.put(`/api/users/${user.id}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('/api/users', submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      onSuccess();
      onClose();
      form.reset();
    } catch (error) {
      console.error("User operation error:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "操作失敗");
      } else {
        alert("操作失敗");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "編輯使用者" : "新增使用者"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "修改使用者資訊" : "建立新的使用者帳號"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>使用者名稱</FormLabel>
                  <FormControl>
                    <Input placeholder="輸入使用者名稱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電子郵件</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="輸入電子郵件" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? "新密碼 (可選)" : "密碼"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={isEditing ? "留空表示不修改密碼" : "輸入密碼"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={!canEditThisUserRole}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="user">一般用戶</option>
                      <option value="admin">管理員</option>
                      <option value="super_admin">最高管理員</option>
                    </select>
                  </FormControl>
                  {!canEditRole && (
                    <p className="text-sm text-muted-foreground">
                      只有管理員可以修改使用者角色
                    </p>
                  )}
                  {canEditRole && isEditingSelf && (
                    <p className="text-sm text-muted-foreground">
                      無法修改自己的角色
                    </p>
                  )}
                  {canEditRole && isSuperAdmin && !isEditingSelf && (
                    <p className="text-sm text-muted-foreground">
                      無法修改系統最高管理員的角色
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "處理中..." : (isEditing ? "更新" : "建立")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
