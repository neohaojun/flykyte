import {
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  ClipboardCheck,
  CloudSun,
  FileWarning,
  Gauge,
  MapPinned,
  Plane,
  Radio,
  ShieldCheck,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";

export const drones = [
  {
    id: "FK-MI-104",
    model: "DJI Matrice 30T",
    serial: "M30T-4X9-1182",
    class: "Mini",
    status: "Available",
    flightHours: 118,
    threshold: 140,
    flights: 72,
    battery: 94,
    location: "Hangar A",
  },
  {
    id: "FK-SM-022",
    model: "Skydio X10D",
    serial: "X10D-9Q2-7741",
    class: "Small",
    status: "Loaned",
    flightHours: 86,
    threshold: 120,
    flights: 48,
    battery: 61,
    location: "Training Area East",
  },
  {
    id: "FK-MC-017",
    model: "Parrot Anafi USA",
    serial: "ANF-2K8-3904",
    class: "Micro",
    status: "Available",
    flightHours: 34,
    threshold: 80,
    flights: 29,
    battery: 88,
    location: "Hangar B",
  },
  {
    id: "FK-MI-091",
    model: "DJI Mavic 3 Enterprise",
    serial: "M3E-6F1-5509",
    class: "Mini",
    status: "Maintenance",
    flightHours: 152,
    threshold: 150,
    flights: 93,
    battery: 40,
    location: "Workshop",
  },
];

export const personnel = [
  { name: "CPT Tan Wei Ming", role: "Mission Commander", current: true, competencies: ["Small", "Mini"], expires: "28 Aug 2026" },
  { name: "3SG Lim Jia En", role: "UAS Operator", current: true, competencies: ["Mini", "Micro"], expires: "14 Oct 2026" },
  { name: "LTA Sarah Ng", role: "Safety Officer", current: false, competencies: ["Small"], expires: "12 Jun 2026" },
];

export const loans = [
  { drone: "FK-SM-022", operator: "3SG Lim Jia En", phase: "Execution", area: "Area Alpha", due: "Today 1730H" },
  { drone: "FK-MC-017", operator: "CPT Tan Wei Ming", phase: "Forceprep", area: "Area Bravo", due: "Tomorrow 0900H" },
];

export const flightLogs = [
  { date: "15 Jun", drone: "FK-SM-022", pilot: "3SG Lim", hours: "1.6h", area: "Area Alpha", outcome: "Nominal" },
  { date: "14 Jun", drone: "FK-MI-104", pilot: "CPT Tan", hours: "2.1h", area: "Area Charlie", outcome: "Battery swap" },
  { date: "12 Jun", drone: "FK-MC-017", pilot: "LTA Ng", hours: "0.8h", area: "Area Bravo", outcome: "Nominal" },
];

export const damageReports = [
  { id: "DR-2408", drone: "FK-MI-091", severity: "Moderate", status: "Under assessment", note: "Gimbal vibration after landing." },
  { id: "DR-2405", drone: "FK-MC-017", severity: "Low", status: "Closed", note: "Prop guard nick replaced." },
];

export const forecast = [
  { time: "0900", condition: "Clear", wind: "8 kt NE", risk: "Low" },
  { time: "1200", condition: "Cloud build-up", wind: "12 kt E", risk: "Medium" },
  { time: "1500", condition: "Showers nearby", wind: "16 kt ESE", risk: "High" },
];

export const phaseChecklists = {
  forceprep: [
    "Inspect airframe, propellers, gimbal, payload, batteries, controller, and spares.",
    "Confirm drone serial number against loan record and mission tasking.",
    "Verify operator currency and class competency for selected drone.",
    "Apply for airspace clearance and read the JOD.",
    "Link up with 205 SQN and confirm operating window.",
  ],
  execution: [
    "Call the controlling squadron before launch based on flying area.",
    "Confirm active airspace clearance, weather, NOTAM/JOD updates, and launch point.",
    "Record take-off time, battery state, observer position, and emergency actions.",
    "Maintain flight time tracking and return-to-home reserve.",
  ],
  post: [
    "Complete end-of-flight checklist and log total flight time.",
    "Inspect drone, batteries, payload, and controller for damage.",
    "File damage report using the damage report link when defects are found.",
    "Report incidents to GSOC and ops room when required.",
  ],
};

export const managementCards = [
  { label: "Fleet availability", value: "2 / 4", detail: "Available now", icon: Plane },
  { label: "Personnel current", value: "2 / 3", detail: "One expiring action", icon: UserCheck },
  { label: "Open loans", value: "2", detail: "One in execution", icon: ClipboardCheck },
  { label: "Weather risk", value: "Medium", detail: "Showers after 1500H", icon: CloudSun },
];

export const readinessSignals = [
  { label: "Airspace", value: "205 SQN link-up pending", icon: Radio },
  { label: "Safety", value: "Checklist 73% complete", icon: ShieldCheck },
  { label: "Maintenance", value: "FK-MI-091 over threshold", icon: Wrench },
  { label: "Incident line", value: "GSOC / ops room ready", icon: AlertTriangle },
];

export const droneClassMeta = [
  { name: "Small", ceiling: "Higher payload", requirement: "Mission commander endorsement", icon: Gauge },
  { name: "Mini", ceiling: "Standard operations", requirement: "Current UAS operator", icon: BatteryCharging },
  { name: "Micro", ceiling: "Rapid deployment", requirement: "Area supervisor approval", icon: MapPinned },
];

export const profileCompetencies = [
  { label: "Small drone", current: true, expires: "28 Aug 2026" },
  { label: "Mini drone", current: true, expires: "28 Aug 2026" },
  { label: "Micro drone", current: true, expires: "14 Oct 2026" },
  { label: "Safety compliance", current: true, expires: "01 Dec 2026" },
  { label: "Incident reporting", current: false, expires: "Refresher due" },
];

export const adminSections = [
  { id: "inventory", label: "Inventory", icon: Plane },
  { id: "personnel", label: "Personnel", icon: Users },
  { id: "logs", label: "Flight Logs", icon: ClipboardCheck },
  { id: "loans", label: "Loans", icon: CheckCircle2 },
  { id: "damage", label: "Damage", icon: FileWarning },
  { id: "forecast", label: "Forecast", icon: CloudSun },
] as const;

export type AdminSection = (typeof adminSections)[number]["id"];
