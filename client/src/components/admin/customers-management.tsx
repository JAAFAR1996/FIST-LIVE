import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from "@shared/schema";
import { Loader2, User as UserIcon, Mail, Trophy, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CustomersManagement() {
    const { data: users, isLoading } = useQuery<User[]>({
        queryKey: ["/api/users"], // Assuming you have or will enable this endpoint for admins
    });

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-6 w-6" />
                    إدارة العملاء
                </CardTitle>
                <CardDescription>عرض وإدارة حسابات المستخدمين المسجلين</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">المستخدم</TableHead>
                                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                <TableHead className="text-center">نقاط الولاء</TableHead>
                                <TableHead className="text-right">الدور</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium text-right">{user.fullName || "مستخدم"}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="text-right">{user.email}</span>
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
                                            <Trophy className="h-4 w-4" />
                                            {/* Loyalty points not in DB yet */}
                                            0
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={user.role === 'admin' ? "destructive" : "secondary"}>
                                            {user.role === 'admin' ? "أدمن" : "عميل"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!users || users.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        لا يوجد عملاء مسجلين بعد
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
