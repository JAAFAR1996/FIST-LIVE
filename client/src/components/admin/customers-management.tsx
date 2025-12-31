import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from "@shared/schema";
import { Loader2, User as UserIcon, Mail, Calendar, Users, ShieldCheck, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function CustomersManagement() {
    const { data: users, isLoading } = useQuery<User[]>({
        queryKey: ["/api/admin/users"],
    });

    const [search, setSearch] = useState("");

    // Filter users by search term
    const filteredUsers = users?.filter(user =>
        user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    ) || [];

    // Statistics
    const totalUsers = users?.length || 0;
    const adminCount = users?.filter(u => u.role === 'admin').length || 0;
    const customerCount = totalUsers - adminCount;

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{totalUsers}</p>
                                <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <UserIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-600">{customerCount}</p>
                                <p className="text-sm text-muted-foreground">العملاء</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-500/10">
                                <ShieldCheck className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-red-600">{adminCount}</p>
                                <p className="text-sm text-muted-foreground">المشرفون</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-6 w-6" />
                                إدارة العملاء
                            </CardTitle>
                            <CardDescription>عرض وإدارة حسابات المستخدمين المسجلين</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="بحث بالاسم أو البريد..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pr-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">المستخدم</TableHead>
                                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                    <TableHead className="text-center">تاريخ التسجيل</TableHead>
                                    <TableHead className="text-center">الدور</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-primary">
                                                        {(user.fullName || user.email).charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                {user.fullName || "مستخدم"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
                                                <Calendar className="h-4 w-4" />
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : "غير متوفر"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={user.role === 'admin' ? "destructive" : "secondary"}>
                                                {user.role === 'admin' ? "أدمن" : "عميل"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            {search ? "لا توجد نتائج للبحث" : "لا يوجد عملاء مسجلين بعد"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
