"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, ChevronRight, ClipboardCheck, FileWarning, ListChecks, Menu, Plane, Radio, Settings2, UserCircle, UserCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { adminSections, damageReports, droneClassMeta, drones, flightLogs, forecast, loans, personnel, phaseChecklists, profileCompetencies, readinessSignals, type AdminSection } from "@/lib/flykyte-data";

const phases = [
  { id: "forceprep", label: "Forceprep", icon: ListChecks },
  { id: "execution", label: "Execution", icon: Radio },
  { id: "post", label: "Post", icon: CheckCircle2 },
] as const;

type PhaseId = (typeof phases)[number]["id"];
type ViewMode = "user" | "admin";
type UserSection = "dashboard" | "profile";

function StatusBadge({ status }: { status: string }) {
  const tone = status === "Available"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    : status === "Maintenance"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
      : "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";

  return <Badge variant="outline" className={cn("whitespace-nowrap", tone)}>{status}</Badge>;
}

function ShellButton({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition",
        active ? "border border-border bg-accent text-accent-foreground shadow-soft" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ProfileDropdown({
  mode,
  activeUser,
  setMode,
  setActiveUser,
  setActiveAdmin,
}: {
  mode: ViewMode;
  activeUser: UserSection;
  setMode: (mode: ViewMode) => void;
  setActiveUser: (section: UserSection) => void;
  setActiveAdmin: (section: AdminSection) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const operator = personnel[1] ?? personnel[0];
  const initials = useMemo(
    () =>
      operator.name
        .split(/\s+/)
        .filter((part) => /^[A-Za-z]/.test(part))
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "FK",
    [operator.name],
  );

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function openDashboard() {
    setMode("user");
    setActiveUser("dashboard");
    setOpen(false);
  }

  function openProfile() {
    setMode("user");
    setActiveUser("profile");
    setOpen(false);
  }

  function openManagement() {
    setMode("admin");
    setActiveAdmin("inventory");
    setOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        onClick={() => setOpen((value) => !value)}
        className="rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-secondary text-xs font-semibold text-secondary-foreground">
            {initials}
          </span>
          <span className="hidden max-w-36 flex-col items-start sm:flex">
            <span className="truncate font-medium text-foreground">{operator.name}</span>
            <span className="truncate text-xs text-muted-foreground">{operator.role}</span>
          </span>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", open && "rotate-180")} />
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-white p-2 text-popover-foreground shadow-soft dark:bg-zinc-950"
        >
          <div className="flex items-center gap-3 rounded-xl px-3 py-3">
            <UserCircle2 className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-popover-foreground">{operator.name}</p>
              <p className="truncate text-xs text-muted-foreground">{operator.role}</p>
            </div>
          </div>
          <div className="grid gap-1 px-2 pb-2">
            <ProfileMenuItem active={mode === "user" && activeUser === "dashboard"} onClick={openDashboard}>
              <ClipboardCheck className="h-4 w-4" />Dashboard
            </ProfileMenuItem>
            <ProfileMenuItem active={mode === "user" && activeUser === "profile"} onClick={openProfile}>
              <UserCircle className="h-4 w-4" />Profile competencies
            </ProfileMenuItem>
            <ProfileMenuItem active={mode === "admin"} onClick={openManagement}>
              <Settings2 className="h-4 w-4" />Management view
            </ProfileMenuItem>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProfileMenuItem({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition",
        active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}

function TopBar({
  mode,
  activeUser,
  setMode,
  setActiveUser,
  setActiveAdmin,
}: {
  mode: ViewMode;
  activeUser: UserSection;
  setMode: (mode: ViewMode) => void;
  setActiveUser: (section: UserSection) => void;
  setActiveAdmin: (section: AdminSection) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
            <Plane className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-3xl font-semibold leading-none text-foreground">flykyte</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <ProfileDropdown
            mode={mode}
            activeUser={activeUser}
            setMode={setMode}
            setActiveUser={setActiveUser}
            setActiveAdmin={setActiveAdmin}
          />
        </div>
      </div>
    </header>
  );
}

function SidebarNav({
  mode,
  activeUser,
  activeAdmin,
  setMode,
  setActiveUser,
  setActiveAdmin,
  onNavigate,
}: {
  mode: ViewMode;
  activeUser: UserSection;
  activeAdmin: AdminSection;
  setMode: (mode: ViewMode) => void;
  setActiveUser: (section: UserSection) => void;
  setActiveAdmin: (section: AdminSection) => void;
  onNavigate?: () => void;
}) {
  function openUser(section: UserSection) {
    setMode("user");
    setActiveUser(section);
    onNavigate?.();
  }

  function openAdmin(section: AdminSection) {
    setMode("admin");
    setActiveAdmin(section);
    onNavigate?.();
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">User</p>
        <div className="space-y-2">
          <ShellButton active={mode === "user" && activeUser === "dashboard"} onClick={() => openUser("dashboard")}><ClipboardCheck className="h-4 w-4" />Dashboard</ShellButton>
          <ShellButton active={mode === "user" && activeUser === "profile"} onClick={() => openUser("profile")}><UserCircle className="h-4 w-4" />Profile</ShellButton>
        </div>
      </div>
      <div>
        <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">Admin</p>
        <div className="space-y-2">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <ShellButton
                key={section.id}
                active={mode === "admin" && activeAdmin === section.id}
                onClick={() => openAdmin(section.id)}
              >
                <Icon className="h-4 w-4" />{section.label}
              </ShellButton>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Sidebar(props: {
  mode: ViewMode;
  activeUser: UserSection;
  activeAdmin: AdminSection;
  setMode: (mode: ViewMode) => void;
  setActiveUser: (section: UserSection) => void;
  setActiveAdmin: (section: AdminSection) => void;
}) {
  return (
    <aside className="hidden h-[calc(100vh-73px)] w-72 shrink-0 flex-col border-r border-border bg-background px-4 py-6 lg:flex">
      <SidebarNav {...props} />
    </aside>
  );
}

function MobileSidebar({
  open,
  onClose,
  mode,
  activeUser,
  activeAdmin,
  setMode,
  setActiveUser,
  setActiveAdmin,
}: {
  open: boolean;
  onClose: () => void;
  mode: ViewMode;
  activeUser: UserSection;
  activeAdmin: AdminSection;
  setMode: (mode: ViewMode) => void;
  setActiveUser: (section: UserSection) => void;
  setActiveAdmin: (section: AdminSection) => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-border bg-background px-4 py-4 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card">
              <Plane className="h-4 w-4" />
            </div>
            <p className="truncate text-xl font-semibold text-foreground">flykyte</p>
          </div>
          <Button variant="outline" size="icon" aria-label="Close navigation" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SidebarNav
          mode={mode}
          activeUser={activeUser}
          activeAdmin={activeAdmin}
          setMode={setMode}
          setActiveUser={setActiveUser}
          setActiveAdmin={setActiveAdmin}
          onNavigate={onClose}
        />
      </aside>
    </div>
  );
}

function DronePicker({ selectedDroneId, setSelectedDroneId }: { selectedDroneId: string | null; setSelectedDroneId: (id: string) => void }) {
  const availableDrones = drones.filter((drone) => drone.status === "Available");

  return (
    <Card className="overflow-hidden animate-enter">
      <CardHeader className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-3xl">Loan Drone</CardTitle>
          </div>
          <Badge variant="secondary">{availableDrones.length} available</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
        {availableDrones.map((drone) => (
          <button
            key={drone.id}
            type="button"
            onClick={() => setSelectedDroneId(drone.id)}
            className={cn("grid gap-3 rounded-xl border p-4 text-left transition sm:grid-cols-[1fr_auto]", selectedDroneId === drone.id ? "border-foreground bg-accent" : "border-border bg-card hover:bg-accent/50")}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{drone.model}</p>
                <StatusBadge status={drone.status} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{drone.id} / {drone.location}</p>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground sm:justify-end">
              <Badge variant="outline">{drone.class}</Badge>
              <span className="inline-flex items-center gap-1 text-foreground">View details<ChevronRight className="h-4 w-4" /></span>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function LoanDetail({ selectedDrone, onBack }: { selectedDrone: (typeof drones)[number]; onBack: () => void }) {
  return (
    <Card className="animate-enter-soft">
      <CardHeader className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" className="-ml-3 mb-3" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />Back to available drones
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-3xl">{selectedDrone.model}</CardTitle>
              <StatusBadge status={selectedDrone.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{selectedDrone.id} / {selectedDrone.serial} / {selectedDrone.location}</p>
          </div>
          <Badge variant="outline">{selectedDrone.class}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-6 pt-0 sm:p-8 sm:pt-0">
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div className="rounded-xl border border-border p-3"><p className="text-muted-foreground">Flight hours</p><p className="mt-1 text-lg font-semibold">{selectedDrone.flightHours}h</p></div>
          <div className="rounded-xl border border-border p-3"><p className="text-muted-foreground">Threshold</p><p className="mt-1 text-lg font-semibold">{selectedDrone.threshold}h</p></div>
          <div className="rounded-xl border border-border p-3"><p className="text-muted-foreground">Flights</p><p className="mt-1 text-lg font-semibold">{selectedDrone.flights}</p></div>
          <div className="rounded-xl border border-border p-3"><p className="text-muted-foreground">Battery</p><p className="mt-1 text-lg font-semibold">{selectedDrone.battery}%</p></div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="flight-time">Flight time</Label><Input id="flight-time" placeholder="e.g. 1.4 hours" /></div>
          <div className="space-y-2"><Label htmlFor="notes">Mission notes</Label><Textarea id="notes" placeholder="Area, squadron contacted, defects, agencies informed..." /></div>
        </div>
      </CardContent>
    </Card>
  );
}

function PhaseChecklist({ activePhase, setActivePhase, checked, toggleCheck }: { activePhase: PhaseId; setActivePhase: (phase: PhaseId) => void; checked: Record<string, boolean>; toggleCheck: (key: string) => void }) {
  const items = phaseChecklists[activePhase];
  const complete = items.filter((_, index) => checked[`${activePhase}-${index}`]).length;

  return (
    <Card className="overflow-hidden animate-enter-soft animate-delay-1">
      <CardHeader className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-3xl">Mission Phases</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{complete} of {items.length} checks complete for this phase.</p>
          </div>
          <Button>Next Step<ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-2 pt-4 sm:grid-cols-3">
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <button key={phase.id} type="button" onClick={() => setActivePhase(phase.id)} className={cn("flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition", activePhase === phase.id ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-accent")}>
                <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{phase.label}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
        {items.map((item, index) => {
          const key = `${activePhase}-${index}`;
          return (
            <label key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:bg-accent/40">
              <Checkbox checked={Boolean(checked[key])} onChange={() => toggleCheck(key)} className="mt-0.5" />
              <span className={cn("text-sm leading-6", checked[key] && "text-muted-foreground line-through")}>{item}</span>
            </label>
          );
        })}
      </CardContent>
    </Card>
  );
}

function CurrentLoansCard() {
  return (
    <Card className="animate-enter-soft animate-delay-3">
      <CardHeader><CardTitle>Current Loans</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        {loans.map((loan) => (
          <div key={`${loan.drone}-${loan.operator}`} className="rounded-xl border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">{loan.drone}</p>
              <Badge>{loan.phase}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{loan.operator}</p>
            <p className="mt-1 text-xs text-muted-foreground">{loan.area} / Due {loan.due}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ProfileView() {
  return (
    <Card className="animate-enter">
      <CardHeader className="p-6 sm:p-8">
        <CardTitle className="text-3xl">Profile Competencies</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
        {profileCompetencies.map((item) => (
          <div key={item.label} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.expires}</p>
            </div>
            <Badge variant={item.current ? "secondary" : "outline"} className="gap-1.5">
              {item.current ? <Check className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              {item.current ? "Current" : "Action due"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function UserView() {
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<PhaseId>("forceprep");
  const [checked, setChecked] = useState<Record<string, boolean>>({ "forceprep-0": true, "forceprep-1": true, "forceprep-2": true });
  const selectedDrone = drones.find((drone) => drone.id === selectedDroneId) ?? null;

  function toggleCheck(key: string) {
    setChecked((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="grid gap-6">
      {selectedDrone ? (
        <>
          <LoanDetail selectedDrone={selectedDrone} onBack={() => setSelectedDroneId(null)} />
          <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
            <PhaseChecklist activePhase={activePhase} setActivePhase={setActivePhase} checked={checked} toggleCheck={toggleCheck} />
            <div className="grid content-start gap-6">
              <Card className="animate-enter-soft animate-delay-2">
                <CardHeader><CardTitle>Loan Status</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-border p-3"><p className="text-muted-foreground">Tracked time</p><p className="mt-1 text-lg font-semibold">0.0h</p></div>
                  <div className="rounded-xl border border-border p-3"><p className="text-muted-foreground">Battery</p><p className="mt-1 text-lg font-semibold">{selectedDrone.battery}%</p></div>
                </CardContent>
              </Card>
              <CurrentLoansCard />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {readinessSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <Card key={signal.label} className="animate-enter-soft">
                  <CardHeader className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary"><Icon className="h-4 w-4" /></div>
                      <div><CardTitle className="text-base">{signal.label}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{signal.value}</p></div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
          <DronePicker selectedDroneId={selectedDroneId} setSelectedDroneId={setSelectedDroneId} />
          <CurrentLoansCard />
        </div>
      )}
    </div>
  );
}

function InventoryPanel() {
  const availableDrones = drones.filter((drone) => drone.status === "Available").length;
  const thresholdAlerts = drones.filter((drone) => drone.flightHours >= drone.threshold).length;

  return (
    <Card className="overflow-hidden animate-enter">
      <CardHeader className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-3xl">Drone Inventory</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{availableDrones} / {drones.length} available now</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{availableDrones} available</Badge>
            <Badge variant={thresholdAlerts > 0 ? "outline" : "secondary"}>{thresholdAlerts} threshold alert{thresholdAlerts === 1 ? "" : "s"}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
        {drones.map((drone) => (
          <div key={drone.id} className="grid gap-4 rounded-xl border border-border p-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto]">
            <div><p className="font-semibold">{drone.model}</p><p className="mt-1 text-sm text-muted-foreground">{drone.serial}</p></div>
            <div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Class</p><p className="mt-1 text-sm font-medium">{drone.class}</p></div>
            <div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Flight Hours</p><p className="mt-1 text-sm font-medium">{drone.flightHours} / {drone.threshold}h</p></div>
            <div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Flights</p><p className="mt-1 text-sm font-medium">{drone.flights}</p></div>
            <StatusBadge status={drone.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PersonnelPanel() {
  const currentPersonnel = personnel.filter((person) => person.current).length;
  const actionDue = personnel.length - currentPersonnel;

  return (
    <Card className="animate-enter">
      <CardHeader className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-3xl">Personnel Details</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{currentPersonnel} / {personnel.length} current</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{currentPersonnel} current</Badge>
            <Badge variant={actionDue > 0 ? "outline" : "secondary"}>{actionDue} action due</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
        {personnel.map((person) => (
          <div key={person.name} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4">
            <div><p className="font-semibold">{person.name}</p><p className="mt-1 text-sm text-muted-foreground">{person.role} / {person.competencies.join(", ")}</p></div>
            <Badge variant={person.current ? "secondary" : "outline"}>{person.current ? "Current" : "Action due"} / {person.expires}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function FlightLogsPanel() {
  return (
    <Card className="animate-enter">
      <CardHeader className="p-6 sm:p-8"><CardTitle className="text-3xl">Flight Logs</CardTitle></CardHeader>
      <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
        {flightLogs.map((log) => (
          <div key={`${log.date}-${log.drone}`} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-5">
            <p className="font-medium">{log.date}</p><p className="text-sm">{log.drone}</p><p className="text-sm text-muted-foreground">{log.pilot}</p><p className="text-sm text-muted-foreground">{log.hours} / {log.area}</p><Badge variant="outline">{log.outcome}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LoansPanel() {
  return (
    <Card className="animate-enter">
      <CardHeader className="p-6 sm:p-8"><CardTitle className="text-3xl">Loans</CardTitle></CardHeader>
      <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
        {loans.map((loan) => (
          <div key={`${loan.drone}-${loan.operator}`} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4">
            <div><p className="font-semibold">{loan.drone} / {loan.operator}</p><p className="mt-1 text-sm text-muted-foreground">{loan.area} / Due {loan.due}</p></div>
            <Badge>{loan.phase}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DamagePanel() {
  return (
    <Card className="animate-enter">
      <CardHeader className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3"><CardTitle className="text-3xl">Damage Reports</CardTitle><Button variant="outline"><FileWarning className="h-4 w-4" />File Report</Button></div>
      </CardHeader>
      <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
        {damageReports.map((report) => (
          <div key={report.id} className="rounded-xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-semibold">{report.id} / {report.drone}</p><Badge variant="outline">{report.severity} / {report.status}</Badge></div>
            <p className="mt-2 text-sm text-muted-foreground">{report.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ForecastPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <Card className="animate-enter">
        <CardHeader className="p-6 sm:p-8"><CardTitle className="text-3xl">Forecast</CardTitle></CardHeader>
        <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
          {forecast.map((slot) => <div key={slot.time} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-4"><p className="font-semibold">{slot.time}H</p><p className="text-sm">{slot.condition}</p><p className="text-sm text-muted-foreground">{slot.wind}</p><Badge variant={slot.risk === "High" ? "outline" : "secondary"}>{slot.risk} risk</Badge></div>)}
        </CardContent>
      </Card>
      <Card className="animate-enter-soft">
        <CardHeader><CardTitle>Drone Classes</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {droneClassMeta.map((item) => {
            const Icon = item.icon;
            return <div key={item.name} className="rounded-xl border border-border p-4"><div className="flex items-center gap-3"><Icon className="h-4 w-4" /><p className="font-semibold">{item.name}</p></div><p className="mt-2 text-sm text-muted-foreground">{item.ceiling}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.requirement}</p></div>;
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPanel({ activeAdmin }: { activeAdmin: AdminSection }) {
  return (
    <div className="grid gap-6">
      {activeAdmin === "inventory" ? <InventoryPanel /> : null}
      {activeAdmin === "personnel" ? <PersonnelPanel /> : null}
      {activeAdmin === "logs" ? <FlightLogsPanel /> : null}
      {activeAdmin === "loans" ? <LoansPanel /> : null}
      {activeAdmin === "damage" ? <DamagePanel /> : null}
      {activeAdmin === "forecast" ? <ForecastPanel /> : null}
    </div>
  );
}

export function AppShell() {
  const [mode, setMode] = useState<ViewMode>("user");
  const [activeUser, setActiveUser] = useState<UserSection>("dashboard");
  const [activeAdmin, setActiveAdmin] = useState<AdminSection>("inventory");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pageTitle = useMemo(() => {
    if (mode === "admin") {
      return "Admin";
    }

    return activeUser === "profile" ? "Profile" : "Dashboard";
  }, [activeUser, mode]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopBar
        mode={mode}
        activeUser={activeUser}
        setMode={setMode}
        setActiveUser={setActiveUser}
        setActiveAdmin={setActiveAdmin}
      />
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        mode={mode}
        activeUser={activeUser}
        activeAdmin={activeAdmin}
        setMode={setMode}
        setActiveUser={setActiveUser}
        setActiveAdmin={setActiveAdmin}
      />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar
          mode={mode}
          activeUser={activeUser}
          activeAdmin={activeAdmin}
          setMode={setMode}
          setActiveUser={setActiveUser}
          setActiveAdmin={setActiveAdmin}
        />
        <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <Button variant="outline" size="icon" aria-label="Open navigation" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">{pageTitle}</p>
          </div>
          {mode === "user" ? (
            <div className="mb-6 hidden items-center justify-between gap-4 lg:flex">
              <h1 className="text-3xl font-semibold">{pageTitle}</h1>
            </div>
          ) : null}
          {mode === "user" ? (activeUser === "profile" ? <ProfileView /> : <UserView />) : <AdminPanel activeAdmin={activeAdmin} />}
        </section>
      </div>
    </main>
  );
}
