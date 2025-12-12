import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Star, Trash2, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type Review = {
    id: string;
    userId: string | null;
    productId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    status: string; // approved, pending, rejected
};

export default function ReviewsManagement() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: reviews, isLoading } = useQuery<Review[]>({
        queryKey: ["/api/reviews/admin"], // Needs backend endpoint
    });

    // Mocking delete mutation for now
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/reviews/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/reviews/admin"] });
            toast({ title: "تم حذف المراجعة بنجاح" });
        },
        onError: () => {
            toast({ title: "فشل حذف المراجعة", variant: "destructive" });
        }
    });

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6" />
                    إدارة المراجعات
                </CardTitle>
                <CardDescription>مراجعة وتقييم تعليقات العملاء</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">المنتج ID</TableHead>
                                <TableHead className="text-right">التقييم</TableHead>
                                <TableHead className="text-right w-[40%]">التعليق</TableHead>
                                <TableHead className="text-center">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews?.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell>#{review.productId}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            {review.rating} <Star className="h-3 w-3 fill-current" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{review.comment}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="hover:text-red-500" onClick={() => deleteMutation.mutate(review.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!reviews || reviews.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        لا توجد مراجعات حالياً
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
