import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { FileText, Loader2, User } from "lucide-react";

interface AuditLog {
    id: number;
    userId: number;
    action: string;
    entityType: string;
    entityId: number;
    details: any;
    createdAt: string;
}

export function AuditLogsTab() {
    const { data: logs, isLoading } = useQuery<AuditLog[]>({
        queryKey: ["/api/admin/audit-logs"],
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    سجل النشاطات
                </CardTitle>
                <CardDescription>
                    تتبع جميع الإجراءات التي تمت في لوحة التحكم
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">المستخدم</TableHead>
                                <TableHead className="text-right">الإجراء</TableHead>
                                <TableHead className="text-right">الكيان</TableHead>
                                <TableHead className="text-right">التفاصيل</TableHead>
                                <TableHead className="text-right">التاريخ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs?.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-primary/10 p-1 rounded-full">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <span>مستخدم #{log.userId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{log.action}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {log.entityType} #{log.entityId}
                                        </span>
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate" dir="ltr">
                                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                            {JSON.stringify(log.details)}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", { locale: ar })}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!logs?.length && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        لا توجد سجلات نشاط حتى الآن
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
