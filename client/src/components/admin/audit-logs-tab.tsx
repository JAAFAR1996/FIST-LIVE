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
// Using default English locale for dates
import { FileText, Loader2, User, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AuditLog {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes: Record<string, any> | null;
    createdAt: string;
}

async function fetchAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch("/api/admin/audit-logs", {
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch audit logs");
    }
    return res.json();
}

// Helper to translate action names to Arabic
function translateAction(action: string): string {
    const translations: Record<string, string> = {
        create: "إنشاء",
        update: "تحديث",
        delete: "حذف",
    };
    return translations[action] || action;
}

// Helper to translate entity types to Arabic
function translateEntityType(entityType: string): string {
    const translations: Record<string, string> = {
        product: "منتج",
        order: "طلب",
        user: "مستخدم",
        settings: "إعدادات",
        coupon: "كوبون",
        gallery: "معرض",
    };
    return translations[entityType] || entityType;
}

// Helper to get action badge variant
function getActionVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
    switch (action) {
        case "create":
            return "default";
        case "update":
            return "secondary";
        case "delete":
            return "destructive";
        default:
            return "outline";
    }
}

// Component to display changes in expandable format
function ChangesDisplay({ changes }: { changes: Record<string, any> | null }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!changes || Object.keys(changes).length === 0) {
        return <span className="text-muted-foreground text-xs">لا توجد تفاصيل</span>;
    }

    const entries = Object.entries(changes);
    const previewText = entries.slice(0, 2).map(([key]) => key).join(", ");
    const hasMore = entries.length > 2;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                        {isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </CollapsibleTrigger>
                <span className="text-xs text-muted-foreground">
                    {previewText}{hasMore ? ` (+${entries.length - 2})` : ""}
                </span>
            </div>
            <CollapsibleContent className="mt-2">
                <div className="bg-muted/50 rounded-md p-2 space-y-1 max-h-48 overflow-y-auto" dir="ltr">
                    {entries.map(([key, value]) => (
                        <div key={key} className="text-xs">
                            <span className="text-primary font-medium">{key}:</span>{" "}
                            <span className="text-muted-foreground">
                                {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </span>
                        </div>
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export function AuditLogsTab() {
    const { data: logs, isLoading, isError, refetch } = useQuery<AuditLog[]>({
        queryKey: ["admin-audit-logs"],
        queryFn: fetchAuditLogs,
        staleTime: 1000 * 60, // 1 minute
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-destructive">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>فشل في تحميل السجلات</p>
                <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                    إعادة المحاولة
                </Button>
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
                                            <span className="text-xs truncate max-w-[100px]" title={log.userId}>
                                                {log.userId === "admin" ? "مشرف" : log.userId.slice(0, 8)}...
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getActionVariant(log.action)}>
                                            {translateAction(log.action)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {translateEntityType(log.entityType)}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={log.entityId}>
                                                #{log.entityId.slice(0, 8)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <ChangesDisplay changes={log.changes} />
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm")}
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
