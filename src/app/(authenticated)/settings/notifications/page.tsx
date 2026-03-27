'use client';

/**
 * OVERSCITE Global — User Notification Preferences
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Class-based channel preferences where policy permits.
 * Mandatory notices cannot be suppressed.
 *
 * Implementation Status: PARTIAL
 * Preference persistence: SCAFFOLD — backend callable stub.
 */

import React, { useState } from 'react';
import { Bell, BellOff, CheckCircle2, Info, Mail, MessageSquare, Monitor, Phone } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { NOTIFICATION_CLASS_POLICY_TABLE } from '@/lib/notifications/notificationClassPolicy';
import type { NotificationClass, NotificationChannel } from '@/lib/types/notifications';

// Channel icon map
const CHANNEL_ICONS: Record<NotificationChannel, React.ElementType> = {
  email:            Mail,
  in_app:           Monitor,
  sms:              Phone,
  admin_board:      Monitor,
  webhook_internal: MessageSquare,
};

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  email:            'Email',
  in_app:           'In-App',
  sms:              'SMS',
  admin_board:      'Admin Board',
  webhook_internal: 'Webhook',
};

// Split policies into customer-facing and admin-only buckets
const CUSTOMER_POLICIES = Object.values(NOTIFICATION_CLASS_POLICY_TABLE).filter((p) => p.is_customer_facing);
const ADMIN_POLICIES    = Object.values(NOTIFICATION_CLASS_POLICY_TABLE).filter((p) => !p.is_customer_facing);

export default function NotificationPreferencesPage() {
  // Scaffold local state — not persisted until backend callable is wired
  const [prefs, setPrefs] = useState<Record<NotificationClass, boolean>>(() =>
    Object.fromEntries(
      Object.keys(NOTIFICATION_CLASS_POLICY_TABLE).map((k) => [k, true]),
    ) as Record<NotificationClass, boolean>,
  );

  function togglePref(cls: NotificationClass, isMandatory: boolean) {
    if (isMandatory) return; // Cannot suppress mandatory notices
    setPrefs((p) => ({ ...p, [cls]: !p[cls] }));
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notification Preferences"
        status="partial"
        description="Configure your notification channel preferences for each governed notification class. Mandatory contractual, financial, and safety notices cannot be suppressed regardless of preference settings. Changes are displayed locally but preference persistence requires backend callable integration — current state is scaffold. Admin-only notification classes are shown for reference but cannot be configured from user settings."
      />

      {/* Mandatory notice banner */}
      <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/10 rounded-lg px-4 py-3 text-xs text-blue-400/80">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          Mandatory notices (marked <Badge variant="outline" className="text-[10px] ml-0.5 mr-0.5">Required</Badge>) cannot be suppressed. These include
          transactional receipts, payment warnings, payout notices, and refund/dispute case updates.
        </p>
      </div>

      {/* Customer-facing preferences */}
      <Card className="bg-card/40 backdrop-blur-sm border-white/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-white/40" />
            Your Notification Classes
          </CardTitle>
          <CardDescription className="text-xs">
            These notifications are addressed to you as an OVERSCITE account holder.
            [SCAFFOLD] — preference persistence not yet wired to backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CUSTOMER_POLICIES.map((policy) => {
            const enabled = prefs[policy.notification_class] ?? true;
            return (
              <div
                key={policy.notification_class}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium">{policy.label}</p>
                    {policy.is_mandatory && (
                      <Badge variant="outline" className="text-[10px]">Required</Badge>
                    )}
                  </div>
                  <p className="text-xs text-white/40">{policy.description}</p>
                  <div className="flex gap-2 mt-1.5">
                    {policy.allowed_channels
                      .filter((c) => c !== 'admin_board' && c !== 'webhook_internal')
                      .map((ch) => {
                        const Icon = CHANNEL_ICONS[ch];
                        const isMandatory = policy.mandatory_channels.includes(ch);
                        return (
                          <span
                            key={ch}
                            className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${
                              isMandatory ? 'text-white/60 bg-white/5' : 'text-white/30 bg-white/3'
                            }`}
                          >
                            <Icon className="h-2.5 w-2.5" />
                            {CHANNEL_LABELS[ch]}
                            {isMandatory && <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />}
                          </span>
                        );
                      })}
                  </div>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => togglePref(policy.notification_class, policy.is_mandatory)}
                  disabled={policy.is_mandatory}
                  aria-label={`Toggle ${policy.label}`}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Admin-only reference */}
      <Card className="bg-card/40 backdrop-blur-sm border-white/5 opacity-50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BellOff className="h-4 w-4 text-white/40" />
            Admin-Only Notification Classes
          </CardTitle>
          <CardDescription className="text-xs">
            These classes are restricted to authorized admin roles and cannot be configured from user settings.
            Contact your organization administrator for routing adjustments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {ADMIN_POLICIES.map((policy) => (
            <div key={policy.notification_class} className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-medium text-white/40">{policy.label}</p>
                <p className="text-[10px] text-white/20">{policy.description}</p>
              </div>
              <Badge variant="outline" className="text-[10px] text-white/30">Admin Only</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
