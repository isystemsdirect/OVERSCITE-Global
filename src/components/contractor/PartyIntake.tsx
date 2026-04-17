'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Briefcase, FileSearch, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { resolveRequirements } from '@/lib/contractor/resolutionService';
import type { RoleClass, JurisdictionProfile, ProjectScopeProfile } from '@/lib/contractor/types';
import { toast } from "@/components/ui/use-toast";
import { emitUiAudit } from '@/lib/audit/ui-audit-bridge';

export default function PartyIntake() {
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    partyName: '',
    role: 'prime_contractor',
    state: 'CA',
    value: 5000,
  });

  const handleCompute = async () => {
    setIsComputing(true);
    // Simulate LARI pipeline delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const jurisdiction: JurisdictionProfile = {
      state: form.state,
      local_overlay_required: false,
      controlling_authority: 'CSLB',
      rule_version_date: '2026-01-01'
    };

    const scope: ProjectScopeProfile = {
      project_type: 'residential',
      trade_scope: ['general'],
      estimated_value: form.value,
      permit_required: true,
      specialty_flags: []
    };

    const requirements = resolveRequirements(form.role as RoleClass, jurisdiction, scope);
    setResult(requirements);
    setIsComputing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-black/60 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#F5C242]">Entity Classification</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Party Name</Label>
              <Input 
                className="bg-white/5 border-white/10 text-xs" 
                placeholder="Legal entity or person" 
                value={form.partyName}
                onChange={(e) => setForm({ ...form, partyName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Role Class</Label>
              <Select defaultValue={form.role} onValueChange={(val) => setForm({ ...form, role: val })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-xs">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-xs">
                  <SelectItem value="prime_contractor">Prime Contractor</SelectItem>
                  <SelectItem value="subcontractor">Subcontractor</SelectItem>
                  <SelectItem value="specialty_trade_entity">Specialty Trade</SelectItem>
                  <SelectItem value="qualifying_person">Qualifying Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#F5C242]">Jurisdiction & Trade</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">State</Label>
              <Input 
                className="bg-white/5 border-white/10 text-xs" 
                placeholder="e.g. CA" 
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Project Value ($)</Label>
              <Input 
                type="number"
                className="bg-white/5 border-white/10 text-xs uppercase" 
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Local Overlay</Label>
              <div className="p-2 rounded bg-white/5 text-[10px] text-white/20 italic">
                Optional resolving based on City/County
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-black/60 border-[#F5C242]/20 backdrop-blur-xl border animate-in zoom-in-95 duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-[#F5C242]">Resolved Requirement Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">Mandatory Licenses</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.mandatory_licenses.length > 0 ? (
                      result.mandatory_licenses.map((lic: string) => (
                        <span key={lic} className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 text-[10px] font-medium border border-blue-500/20">
                          {lic}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-white/20 italic">No state license required.</span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">Verification Posture</span>
                  <div className="pt-1 flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-widest">Unverified Status Required</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-zinc-900/50 border border-white/5">
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-tighter mb-1 block underline">Governed Reasoning (LARI_CONTRACTOR)</span>
                <ul className="space-y-1">
                  {result.notes.map((note: string, idx: number) => (
                    <li key={idx} className="text-[10px] text-white/60 leading-relaxed font-mono">• {note}</li>
                  ))}
                  {result.notes.length === 0 && (
                    <li className="text-[10px] text-white/20 italic font-mono uppercase tracking-tighter">• No specific jurisdictional notes triggered.</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card className="bg-[#F5C242]/5 border-[#F5C242]/10 backdrop-blur-xl flex flex-col items-center p-6 text-center">
          <FileSearch className="w-12 h-12 text-[#F5C242] mb-4 opacity-70" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#F5C242] mb-2">Compliance Engine</h3>
          <p className="text-[10px] text-white/40 mb-6 uppercase tracking-wider font-mono">
            {isComputing ? 'Computing LARI signal...' : result ? 'Packet computed' : 'Awaiting normalized packet...'}
          </p>
          <Button 
            disabled={isComputing}
            className="w-full bg-[#F5C242] text-black hover:bg-[#F5C242]/90 font-bold text-xs uppercase tracking-widest transition-all"
            onClick={handleCompute}
          >
            {isComputing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Compute Requirements'}
          </Button>
        </Card>

        <div className="p-4 rounded border border-white/5 bg-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-white/30" />
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Rule Resolution</span>
          </div>
          <p className="text-[10px] text-white/30 italic leading-relaxed">
            Requirement profiles are computed from role + trade + jurisdiction + value. No national license assumption. 
          </p>
        </div>

        {result && (
          <div className="mt-4">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/20"
              onClick={async () => {
                await emitUiAudit({
                  type: 'UI_MUTATION_REQUESTED',
                  actorId: 'human-operator-1',
                  action: 'SUBMIT_TO_AIRLOCK',
                  targetId: form.partyName || 'anonymous-party'
                });

                toast({
                  title: "Intake Airlock Triggered",
                  description: `Contractor '${form.partyName}' registered with TRUTH STATE: [candidate]. Pending human oversight.`,
                });
              }}
            >
              Submit to Governance Airlock
            </Button>
            <p className="mt-2 text-[9px] text-white/40 text-center uppercase tracking-widest">
              Forces initial Truth State: CANDIDATE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
