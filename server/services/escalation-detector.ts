import { getDb } from "../db.js";
import * as schema from "../../shared/schema.js";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { sendEmail } from "../utils/email.js";

interface EscalationResult {
  shouldEscalate: boolean;
  reason: 'frustrated' | 'requested_human' | 'low_confidence' | 'complex_query' | null;
  score: number;
}

export class EscalationDetector {
  private db = getDb();

  /**
   * تحليل ما إذا كانت المحادثة تحتاج تحويل للدعم البشري
   * Analyzes if conversation needs human escalation
   */
  async shouldEscalate(
    conversationId: string,
    latestMessage: string,
    aiResponse: string
  ): Promise<EscalationResult> {
    let score = 0;
    let reason: EscalationResult['reason'] = null;

    // 1. كشف طلب بشري مباشر - أولوية قصوى (100 نقطة)
    // Direct human request detection - highest priority
    const humanKeywords = [
      'بشر', 'إنسان', 'موظف', 'مسؤول', 'مدير', 'شخص حقيقي', 'شخص',
      'human', 'agent', 'support', 'employee', 'manager', 'person', 'real person'
    ];

    const requestsHuman = humanKeywords.some(kw =>
      latestMessage.toLowerCase().includes(kw)
    );

    if (requestsHuman) {
      console.log(`[Escalation] Direct human request detected in: "${latestMessage}"`);
      return {
        shouldEscalate: true,
        reason: 'requested_human',
        score: 100
      };
    }

    // 2. كشف الإحباط (30 نقطة لكل كلمة)
    // Frustration detection
    const frustrationKeywords = [
      'غبي', 'سيء', 'سخيف', 'مو فاهم', 'مو مفيد', 'ما تفهم', 'زفت', 'ما ينفع',
      'stupid', 'useless', 'terrible', 'worst', 'horrible', 'idiot', 'dumb', 'trash'
    ];

    const frustrationCount = frustrationKeywords.filter(kw =>
      latestMessage.toLowerCase().includes(kw)
    ).length;

    if (frustrationCount > 0) {
      score += frustrationCount * 30;
      reason = 'frustrated';
      console.log(`[Escalation] Frustration detected (${frustrationCount} keywords), score: ${score}`);
    }

    // 3. كشف تكرار السؤال (40 نقطة)
    // Repetition detection - user asking same question multiple times
    const conversationHistory = await this.getConversationHistory(conversationId, 5);
    const repeatedQuestions = this.detectRepetition(conversationHistory, latestMessage);

    if (repeatedQuestions > 1) {
      score += 40;
      reason = reason || 'complex_query';
      console.log(`[Escalation] Question repetition detected (${repeatedQuestions} times), score: ${score}`);
    }

    // 4. تقدير ثقة AI (30 نقطة للثقة المنخفضة)
    // AI confidence estimation
    const aiConfidence = this.estimateAIConfidence(aiResponse);
    if (aiConfidence < 0.6) {
      score += 30;
      reason = reason || 'low_confidence';
      console.log(`[Escalation] Low AI confidence (${aiConfidence.toFixed(2)}), score: ${score}`);
    }

    // 5. كشف الاستعلام المعقد (20 نقطة)
    // Complex query detection
    const questionCount = (latestMessage.match(/\?|؟/g) || []).length;
    const isLongMessage = latestMessage.length > 300;

    if (questionCount > 2 || isLongMessage) {
      score += 20;
      reason = reason || 'complex_query';
      console.log(`[Escalation] Complex query detected (${questionCount} questions, ${latestMessage.length} chars), score: ${score}`);
    }

    // 6. كشف مشاكل الطلبات والشحن (50 نقطة - أولوية عالية)
    // Order and shipping issues detection
    const orderKeywords = [
      'طلب', 'شحن', 'توصيل', 'تأخير', 'وين طلبي', 'متى يوصل', 'ما وصل',
      'order', 'shipping', 'delivery', 'delay', 'where is my order', 'not received'
    ];

    const hasOrderIssue = orderKeywords.some(kw =>
      latestMessage.toLowerCase().includes(kw)
    );

    if (hasOrderIssue) {
      score += 50;
      reason = 'complex_query';
      console.log(`[Escalation] Order/shipping issue detected, score: ${score}`);
    }

    const shouldEscalate = score >= 50;

    console.log(`[Escalation] Final decision: ${shouldEscalate ? 'ESCALATE' : 'CONTINUE AI'} (score: ${score}, reason: ${reason})`);

    return {
      shouldEscalate,
      reason,
      score,
    };
  }

  /**
   * تقدير ثقة AI في الإجابة
   * Estimate AI confidence in response
   */
  private estimateAIConfidence(response: string): number {
    // كلمات غامضة تدل على عدم اليقين
    // Vague words indicating uncertainty
    const vagueWords = [
      'ممكن', 'ربما', 'أعتقد', 'غالباً', 'قد', 'من المحتمل',
      'maybe', 'perhaps', 'probably', 'might', 'could be', 'I think'
    ];

    const vagueCount = vagueWords.filter(w =>
      response.toLowerCase().includes(w)
    ).length;

    // مؤشرات على إجابة محددة
    // Indicators of specific answer
    const hasSpecificInfo = /\d+|\$|IQD|د\.ع/.test(response);
    const hasProductNames = response.length > 50 && !response.includes('عذراً') && !response.includes('sorry');

    let confidence = 0.8; // نقطة بداية

    // تقليل الثقة مع كلمات غامضة
    confidence -= vagueCount * 0.15;

    // زيادة الثقة مع معلومات محددة
    if (hasSpecificInfo) confidence += 0.1;
    if (hasProductNames) confidence += 0.05;

    // التأكد من البقاء في النطاق [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * كشف تكرار الأسئلة
   * Detect repeated questions
   */
  private detectRepetition(history: any[], currentMessage: string): number {
    // فحص التشابه مع رسائل المستخدم السابقة
    const similarMessages = history.filter(h => {
      if (h.role !== 'user') return false;
      const similarity = this.stringSimilarity(h.content, currentMessage);
      return similarity > 0.7; // تشابه أكثر من 70%
    });

    return similarMessages.length;
  }

  /**
   * حساب التشابه بين نصين
   * Calculate string similarity using Jaccard coefficient
   */
  private stringSimilarity(str1: string, str2: string): number {
    // تنظيف وتقسيم النصوص
    const words1 = new Set(str1.toLowerCase().split(/\s+/));
    const words2 = new Set(str2.toLowerCase().split(/\s+/));

    // حساب التقاطع والاتحاد
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    // معامل Jaccard
    return intersection.size / union.size;
  }

  /**
   * جلب سجل المحادثة
   * Get conversation history
   */
  private async getConversationHistory(conversationId: string, limit: number = 10) {
    try {
      const messages = await this.db
        .select()
        .from(schema.chatMessages)
        .where(eq(schema.chatMessages.conversationId, conversationId))
        .orderBy(desc(schema.chatMessages.createdAt))
        .limit(limit);

      return messages.reverse(); // أقدم إلى أحدث
    } catch (error) {
      console.error('[Escalation] Error fetching conversation history:', error);
      return [];
    }
  }

  /**
   * إنشاء تذكرة دعم
   * Create support ticket
   */
  async createSupportTicket(
    conversationId: string,
    userId: string | null,
    reason: string,
    sentiment: string,
    aiConfidence: number
  ): Promise<string> {
    try {
      // جلب معلومات المستخدم
      let user = null;
      if (userId) {
        const userResult = await this.db
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, userId))
          .limit(1);
        user = userResult[0];
      }

      // تحديد الأولوية بناءً على السبب
      let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
      if (reason === 'frustrated') priority = 'high';
      if (reason === 'requested_human') priority = 'urgent';

      // إنشاء التذكرة
      const ticketResult = await this.db.insert(schema.supportTickets).values({
        conversationId,
        userId,
        customerName: user?.fullName || 'زائر',
        customerEmail: user?.email,
        status: 'open',
        priority,
        escalationReason: reason,
        aiConfidence: aiConfidence.toString(),
        sentiment,
        category: 'product_question',
      }).returning();

      const ticket = ticketResult[0];

      console.log(`[Escalation] Support ticket created: ${ticket.id} (priority: ${priority})`);

      // إرسال إشعار للمسؤولين
      await this.notifyAdmins(ticket.id, priority, user?.fullName || 'زائر');

      return ticket.id;
    } catch (error) {
      console.error('[Escalation] Error creating support ticket:', error);
      throw error;
    }
  }

  /**
   * إشعار المسؤولين بتذكرة جديدة
   * Notify admins about new ticket
   */
  private async notifyAdmins(ticketId: string, priority: string, customerName: string) {
    try {
      // جلب المسؤولين
      const admins = await this.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.role, 'admin'));

      if (admins.length === 0) {
        console.warn('[Escalation] No admins found to notify');
        return;
      }

      // إرسال بريد إلكتروني لكل مسؤول
      for (const admin of admins) {
        try {
          await sendEmail({
            to: admin.email,
            subject: `🔔 تذكرة دعم جديدة - AQUAVO [${priority.toUpperCase()}]`,
            html: `
              <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">تذكرة دعم جديدة تحتاج انتباهك</h2>

                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>رقم التذكرة:</strong> ${ticketId}</p>
                  <p><strong>الأولوية:</strong> <span style="color: ${priority === 'urgent' ? '#dc2626' : priority === 'high' ? '#ea580c' : '#059669'};">${priority}</span></p>
                  <p><strong>العميل:</strong> ${customerName}</p>
                </div>

                <p>تم تحويل المحادثة من الذكاء الاصطناعي إلى الدعم البشري.</p>

                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin?tab=support"
                   style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
                  فتح لوحة التحكم
                </a>

                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  هذا إشعار تلقائي من نظام AQUAVO
                </p>
              </div>
            `,
          });

          console.log(`[Escalation] Email notification sent to ${admin.email}`);
        } catch (emailError) {
          console.error(`[Escalation] Failed to send email to ${admin.email}:`, emailError);
        }
      }

      // TODO: إرسال Web Push notifications إذا كان متاحاً
      // Send Web Push notifications if available

    } catch (error) {
      console.error('[Escalation] Error notifying admins:', error);
      // لا نرمي الخطأ لأن فشل الإشعار لا يجب أن يوقف إنشاء التذكرة
      // Don't throw - notification failure shouldn't stop ticket creation
    }
  }

  /**
   * تحديث حالة التذكرة
   * Update ticket status
   */
  async updateTicketStatus(
    ticketId: string,
    status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed',
    assignedToUserId?: string
  ) {
    try {
      const updates: any = {
        status,
        updatedAt: new Date()
      };

      if (assignedToUserId) {
        updates.assignedToUserId = assignedToUserId;
      }

      if (status === 'resolved' || status === 'closed') {
        updates.resolvedAt = new Date();
      }

      await this.db
        .update(schema.supportTickets)
        .set(updates)
        .where(eq(schema.supportTickets.id, ticketId));

      console.log(`[Escalation] Ticket ${ticketId} updated to status: ${status}`);
    } catch (error) {
      console.error('[Escalation] Error updating ticket status:', error);
      throw error;
    }
  }

  /**
   * جلب التذاكر المفتوحة
   * Get open tickets
   */
  async getOpenTickets() {
    try {
      const tickets = await this.db
        .select()
        .from(schema.supportTickets)
        .where(
          and(
            eq(schema.supportTickets.status, 'open'),
            gte(schema.supportTickets.createdAt, sql`now() - interval '7 days'`)
          )
        )
        .orderBy(desc(schema.supportTickets.createdAt));

      return tickets;
    } catch (error) {
      console.error('[Escalation] Error fetching open tickets:', error);
      return [];
    }
  }
}
