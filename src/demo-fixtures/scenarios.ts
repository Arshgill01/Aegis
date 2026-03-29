import { indexById } from "./helpers";
import type {
  ExceptionCase,
  FinOpsScenarioPack,
  ScenarioCatalogEntry,
  ScenarioKey,
} from "./types";

export const scenarioKeys = [
  "safe-invoice-trusted-vendor",
  "unknown-vendor-escalation",
  "invoice-po-mismatch",
  "vendor-bank-change-hold",
  "missing-documentation-block",
  "threshold-exceeded-review",
] satisfies ScenarioKey[];

const scenarioCatalogEntries = {
  "safe-invoice-trusted-vendor": {
    key: "safe-invoice-trusted-vendor",
    title: "Trusted vendor invoice clears three-way match",
    summary:
      "BrightPath Studio's March retainer matches PO-24017 exactly and carries a complete evidence packet for low-risk release.",
    disposition: "autonomous",
    riskLevel: "low",
    primaryWorkerId: "worker-po-match",
    tags: ["safe", "trusted-vendor", "po-match"],
    watchpoints: [
      "PO amount, invoice amount, and signed statement of work align exactly.",
      "Vendor bank details have not changed since November 8, 2025.",
      "Payment amount remains below the autonomous release threshold.",
    ],
  },
  "unknown-vendor-escalation": {
    key: "unknown-vendor-escalation",
    title: "Unknown vendor invoice escalates before onboarding",
    summary:
      "Pinecrest Advisory's invoice arrived through email without a matching vendor record, approved onboarding request, or PO trail.",
    disposition: "escalate",
    riskLevel: "high",
    primaryWorkerId: "worker-vendor-review",
    tags: ["vendor-resolution", "unknown-vendor", "escalation"],
    watchpoints: [
      "Submitted vendor name does not map to an active vendor master record.",
      "No purchase order or procurement approval trail is attached to the packet.",
      "The only provenance is a forwarded email claiming executive sponsorship.",
    ],
  },
  "invoice-po-mismatch": {
    key: "invoice-po-mismatch",
    title: "PO-backed invoice exceeds approved amount",
    summary:
      "Ridgeway Industrial billed two extra units beyond PO-24054, creating a 7.8% total variance against the approved amount.",
    disposition: "review",
    riskLevel: "high",
    primaryWorkerId: "worker-po-match",
    tags: ["three-way-match", "variance", "controller-review"],
    watchpoints: [
      "Invoice total is 99660 USD against a PO total of 92450 USD.",
      "Receiving evidence confirms only the originally approved quantity arrived.",
      "Payment intent is prepared but contained in hold status pending tolerance review.",
    ],
  },
  "vendor-bank-change-hold": {
    key: "vendor-bank-change-hold",
    title: "Recent remittance change forces payment hold",
    summary:
      "Aperture Logistics submitted a new primary bank account on March 26, 2026, days before a 48300 USD release.",
    disposition: "block",
    riskLevel: "critical",
    primaryWorkerId: "worker-vendor-review",
    tags: ["bank-change", "remittance-drift", "payment-hold"],
    watchpoints: [
      "Destination bank account changed three days before scheduled execution.",
      "Remittance comparison shows new beneficiary and address details.",
      "Payment intent targets the newly added account rather than the prior settled account.",
    ],
  },
  "missing-documentation-block": {
    key: "missing-documentation-block",
    title: "Missing tax documentation blocks release",
    summary:
      "Bluefield Field Services completed the work and matched the PO, but the current W-9 remains missing from the packet.",
    disposition: "block",
    riskLevel: "high",
    primaryWorkerId: "worker-vendor-review",
    tags: ["missing-documentation", "compliance", "blocked"],
    watchpoints: [
      "Invoice and PO totals align for a routine maintenance visit.",
      "Site completion evidence exists, so the only blocker is compliance paperwork.",
      "The W-9 artifact is explicitly tracked as missing rather than assumed away.",
    ],
  },
  "threshold-exceeded-review": {
    key: "threshold-exceeded-review",
    title: "Matched invoice exceeds autonomous payment threshold",
    summary:
      "Cinder Cloud's quarterly invoice is fully supported, but 162480 USD exceeds the 150000 USD autonomous release threshold.",
    disposition: "review",
    riskLevel: "medium",
    primaryWorkerId: "worker-approval-coordinator",
    tags: ["spend-threshold", "controller-review", "matched-invoice"],
    watchpoints: [
      "Usage and contract evidence support the invoice amount.",
      "No vendor drift or PO mismatch is present in the packet.",
      "Only threshold policy prevents autonomous execution.",
    ],
  },
} satisfies Record<ScenarioKey, ScenarioCatalogEntry>;

export const scenarioCatalog = scenarioKeys.map((key) => scenarioCatalogEntries[key]);

export const scenarioCatalogByKey = Object.fromEntries(
  scenarioCatalog.map((entry) => [entry.key, entry]),
) as Record<ScenarioKey, ScenarioCatalogEntry>;

export const exceptionCaseFixtures = [
  {
    id: "exception-unknown-vendor-pinecrest",
    scenarioKey: "unknown-vendor-escalation",
    type: "unknown_vendor",
    severity: "high",
    headline: "Vendor identity could not be resolved",
    summary:
      "Pinecrest Advisory LLC is not present in vendor master data, and the packet lacks onboarding or procurement approval evidence.",
    detectedAtStage: "vendor resolution",
    ownerRole: "Vendor Review Worker",
    recommendedAction: "Escalate to procurement for vendor creation or reject the invoice as unauthorized work.",
    affectedRecordIds: ["invoice-pinecrest-8831"],
    artifactIds: [
      "artifact-invoice-pinecrest-8831-pdf",
      "artifact-email-pinecrest-introduction",
      "artifact-intake-note-pinecrest-unresolved",
    ],
  },
  {
    id: "exception-po-variance-ridgeway",
    scenarioKey: "invoice-po-mismatch",
    type: "po_mismatch",
    severity: "high",
    headline: "Invoice exceeds approved PO quantity and value",
    summary:
      "Ridgeway billed 27 units against a 25-unit order, driving the payment packet above the approved purchase order total.",
    detectedAtStage: "three-way match",
    ownerRole: "PO Match Worker",
    recommendedAction: "Route to AP Controller for tolerance decision with receiving evidence attached.",
    affectedRecordIds: [
      "invoice-ridgeway-7710",
      "po-ridgeway-24054",
      "payment-intent-ridgeway-7710",
    ],
    artifactIds: [
      "artifact-invoice-ridgeway-7710-pdf",
      "artifact-po-24054-pdf",
      "artifact-receiving-ridgeway-batch-17",
    ],
  },
  {
    id: "exception-bank-change-aperture",
    scenarioKey: "vendor-bank-change-hold",
    type: "bank_change_hold",
    severity: "critical",
    headline: "Recent bank change conflicts with prior remittance profile",
    summary:
      "The scheduled Aperture payment targets a bank account added on March 26, 2026, without completed out-of-band confirmation.",
    detectedAtStage: "payment release review",
    ownerRole: "Vendor Review Worker",
    recommendedAction: "Hold release and require verified callback or treasury confirmation before reopening the packet.",
    affectedRecordIds: [
      "vendor-aperture-logistics",
      "invoice-aperture-1127",
      "payment-intent-aperture-1127",
    ],
    artifactIds: [
      "artifact-bank-change-aperture-mar-26",
      "artifact-remittance-comparison-aperture",
      "artifact-vendor-aperture-master-snapshot",
    ],
  },
  {
    id: "exception-missing-w9-bluefield",
    scenarioKey: "missing-documentation-block",
    type: "missing_documentation",
    severity: "high",
    headline: "Required tax document is missing from the packet",
    summary:
      "Bluefield's work evidence is present, but the 2026 W-9 is still missing and prevents the release path from opening.",
    detectedAtStage: "compliance check",
    ownerRole: "Vendor Review Worker",
    recommendedAction: "Block the workflow until the vendor supplies the current W-9 and the packet is refreshed.",
    affectedRecordIds: [
      "vendor-bluefield-field-services",
      "invoice-bluefield-9044",
      "payment-intent-bluefield-9044",
    ],
    artifactIds: [
      "artifact-w9-bluefield-2026",
      "artifact-invoice-bluefield-9044-pdf",
      "artifact-site-completion-note-hel-118",
    ],
  },
  {
    id: "exception-threshold-review-cinder",
    scenarioKey: "threshold-exceeded-review",
    type: "threshold_exceeded",
    severity: "medium",
    headline: "Payment amount requires named controller review",
    summary:
      "The Cinder Cloud packet is otherwise clean, but the release amount exceeds the autonomous threshold by 12480 USD.",
    detectedAtStage: "approval routing",
    ownerRole: "Approval Coordinator",
    recommendedAction: "Send the release packet to the controller for threshold sign-off before execution resumes.",
    affectedRecordIds: [
      "invoice-cinder-3308",
      "payment-intent-cinder-3308",
      "po-cinder-24088",
    ],
    artifactIds: [
      "artifact-invoice-cinder-3308-pdf",
      "artifact-consumption-report-cinder-feb",
      "artifact-msa-cinder-cloud",
    ],
  },
] satisfies ExceptionCase[];

export const exceptionCaseFixturesById = indexById(exceptionCaseFixtures);

export const scenarioPacks = [
  {
    key: "safe-invoice-trusted-vendor",
    catalog: scenarioCatalogByKey["safe-invoice-trusted-vendor"],
    workerIds: ["worker-intake", "worker-po-match", "worker-execution"],
    records: {
      invoiceId: "invoice-brightpath-2048",
      vendorId: "vendor-brightpath-studio",
      purchaseOrderId: "po-brightpath-24017",
      paymentIntentId: "payment-intent-brightpath-2048",
      artifactIds: [
        "artifact-invoice-brightpath-2048-pdf",
        "artifact-po-24017-pdf",
        "artifact-sow-brightpath-q2-retainer",
        "artifact-vendor-brightpath-master-snapshot",
      ],
    },
    currentStage: "Ready for controlled execution",
    nextAction: "Execution Worker can release the ACH payment after the final shadow-to-execute handoff.",
    controlObjective: "Demonstrate visible low-risk autonomy with complete evidence and no hidden jumps.",
    amountAtRisk: 18420,
    exceptionCaseIds: [],
    storyBeats: [
      {
        title: "Intake assembles a complete packet",
        detail:
          "The invoice, approved PO, and signed statement of work arrive together, so the worker starts with a coherent packet.",
        ownerWorkerId: "worker-intake",
      },
      {
        title: "Three-way match clears without tolerance drift",
        detail:
          "PO Match Worker confirms the amount, scope, and vendor profile align exactly with the approved procurement trail.",
        ownerWorkerId: "worker-po-match",
      },
      {
        title: "Execution proceeds under controlled release",
        detail:
          "The payment intent is below threshold and points to a long-standing ACH account, making this the demo-safe happy path.",
        ownerWorkerId: "worker-execution",
      },
    ],
  },
  {
    key: "unknown-vendor-escalation",
    catalog: scenarioCatalogByKey["unknown-vendor-escalation"],
    workerIds: ["worker-intake", "worker-vendor-review", "worker-risk"],
    records: {
      invoiceId: "invoice-pinecrest-8831",
      artifactIds: [
        "artifact-invoice-pinecrest-8831-pdf",
        "artifact-email-pinecrest-introduction",
        "artifact-intake-note-pinecrest-unresolved",
      ],
    },
    currentStage: "Holding on vendor identity resolution",
    nextAction:
      "Vendor Review Worker escalates the packet to procurement for vendor creation or formal rejection.",
    controlObjective: "Stop payment preparation until vendor identity and procurement provenance are explicit.",
    amountAtRisk: 27850,
    exceptionCaseIds: ["exception-unknown-vendor-pinecrest"],
    storyBeats: [
      {
        title: "Inbound invoice arrives outside the normal procurement path",
        detail:
          "The packet enters through a shared mailbox instead of the vendor portal, immediately reducing confidence in provenance.",
        ownerWorkerId: "worker-intake",
      },
      {
        title: "Vendor lookup fails against master data",
        detail:
          "Vendor Review Worker cannot map Pinecrest Advisory LLC to an active supplier profile or approved onboarding request.",
        ownerWorkerId: "worker-vendor-review",
      },
      {
        title: "Risk lane frames the escalation context",
        detail:
          "The exception is recorded as unresolved vendor identity rather than generic suspicious activity, keeping the next step concrete.",
        ownerWorkerId: "worker-risk",
      },
    ],
  },
  {
    key: "invoice-po-mismatch",
    catalog: scenarioCatalogByKey["invoice-po-mismatch"],
    workerIds: [
      "worker-intake",
      "worker-po-match",
      "worker-risk",
      "worker-approval-coordinator",
    ],
    records: {
      invoiceId: "invoice-ridgeway-7710",
      vendorId: "vendor-ridgeway-industrial",
      purchaseOrderId: "po-ridgeway-24054",
      paymentIntentId: "payment-intent-ridgeway-7710",
      artifactIds: [
        "artifact-invoice-ridgeway-7710-pdf",
        "artifact-po-24054-pdf",
        "artifact-receiving-ridgeway-batch-17",
      ],
    },
    currentStage: "Awaiting controller review on variance hold",
    nextAction:
      "Approval Coordinator packages the variance and receiving evidence for AP Controller tolerance review.",
    controlObjective: "Show a visible three-way match hold before any ERP posting or payment execution occurs.",
    amountAtRisk: 99660,
    exceptionCaseIds: ["exception-po-variance-ridgeway"],
    storyBeats: [
      {
        title: "Invoice references a real PO",
        detail:
          "The packet looks legitimate at intake because the vendor and PO are both known, keeping the later mismatch more believable.",
        ownerWorkerId: "worker-intake",
      },
      {
        title: "PO Match Worker detects quantity drift",
        detail:
          "Invoice quantities exceed the approved order and the total lands 7210 USD above the PO-backed amount.",
        ownerWorkerId: "worker-po-match",
      },
      {
        title: "Approval hold contains the payment path",
        detail:
          "Risk and approval context are attached before the payment intent can move past hold status.",
        ownerWorkerId: "worker-approval-coordinator",
      },
    ],
  },
  {
    key: "vendor-bank-change-hold",
    catalog: scenarioCatalogByKey["vendor-bank-change-hold"],
    workerIds: [
      "worker-intake",
      "worker-vendor-review",
      "worker-risk",
      "worker-approval-coordinator",
    ],
    records: {
      invoiceId: "invoice-aperture-1127",
      vendorId: "vendor-aperture-logistics",
      purchaseOrderId: "po-aperture-24061",
      paymentIntentId: "payment-intent-aperture-1127",
      artifactIds: [
        "artifact-invoice-aperture-1127-pdf",
        "artifact-po-24061-pdf",
        "artifact-bank-change-aperture-mar-26",
        "artifact-remittance-comparison-aperture",
        "artifact-vendor-aperture-master-snapshot",
      ],
    },
    currentStage: "Blocked on remittance verification",
    nextAction:
      "Vendor Review Worker requires out-of-band confirmation before any approval packet can reopen the payment.",
    controlObjective: "Demonstrate a hard stop when remittance data changes immediately before release.",
    amountAtRisk: 48300,
    exceptionCaseIds: ["exception-bank-change-aperture"],
    storyBeats: [
      {
        title: "Commercial documents still look clean",
        detail:
          "The invoice and PO align, which makes the remittance drift the real source of control pressure.",
        ownerWorkerId: "worker-intake",
      },
      {
        title: "Vendor Review Worker spots a new destination account",
        detail:
          "The payment intent points to the account added on March 26, 2026 rather than Aperture's historically settled account.",
        ownerWorkerId: "worker-vendor-review",
      },
      {
        title: "The hold is explicit and irreversible without verification",
        detail:
          "Aegis blocks release instead of downgrading the issue to a soft review queue, preserving the seriousness of bank-detail drift.",
        ownerWorkerId: "worker-risk",
      },
    ],
  },
  {
    key: "missing-documentation-block",
    catalog: scenarioCatalogByKey["missing-documentation-block"],
    workerIds: ["worker-intake", "worker-vendor-review"],
    records: {
      invoiceId: "invoice-bluefield-9044",
      vendorId: "vendor-bluefield-field-services",
      purchaseOrderId: "po-bluefield-24072",
      paymentIntentId: "payment-intent-bluefield-9044",
      artifactIds: [
        "artifact-invoice-bluefield-9044-pdf",
        "artifact-po-24072-pdf",
        "artifact-site-completion-note-hel-118",
        "artifact-w9-bluefield-2026",
      ],
    },
    currentStage: "Blocked before payment packet assembly",
    nextAction:
      "The workflow stays blocked until Bluefield submits the current W-9 and the packet is refreshed.",
    controlObjective: "Keep missing compliance evidence visible as a non-bypassable control gate.",
    amountAtRisk: 22140,
    exceptionCaseIds: ["exception-missing-w9-bluefield"],
    storyBeats: [
      {
        title: "Operational proof is present",
        detail:
          "The site completion note shows the work happened, making this a paperwork block rather than a service-delivery dispute.",
        ownerWorkerId: "worker-intake",
      },
      {
        title: "Vendor compliance check fails cleanly",
        detail:
          "Vendor Review Worker sees the W-9 artifact tracked as missing, so the packet cannot be promoted into release review.",
        ownerWorkerId: "worker-vendor-review",
      },
      {
        title: "The block remains legible for later approval UI",
        detail:
          "No approval path opens yet, which keeps the difference between missing evidence and review-worthy work easy to animate later.",
        ownerWorkerId: "worker-vendor-review",
      },
    ],
  },
  {
    key: "threshold-exceeded-review",
    catalog: scenarioCatalogByKey["threshold-exceeded-review"],
    workerIds: [
      "worker-intake",
      "worker-po-match",
      "worker-approval-coordinator",
      "worker-execution",
    ],
    records: {
      invoiceId: "invoice-cinder-3308",
      vendorId: "vendor-cinder-cloud",
      purchaseOrderId: "po-cinder-24088",
      paymentIntentId: "payment-intent-cinder-3308",
      artifactIds: [
        "artifact-invoice-cinder-3308-pdf",
        "artifact-po-24088-pdf",
        "artifact-consumption-report-cinder-feb",
        "artifact-msa-cinder-cloud",
      ],
    },
    currentStage: "Pending controller review on spend threshold",
    nextAction:
      "Approval Coordinator routes the release packet to Priya Shah for threshold sign-off before execution resumes.",
    controlObjective: "Show a review-worthy workflow that is safe in substance but still gated by spend policy.",
    amountAtRisk: 162480,
    exceptionCaseIds: ["exception-threshold-review-cinder"],
    storyBeats: [
      {
        title: "The packet clears matching and evidence review",
        detail:
          "Invoice, PO, usage report, and contract all align, making this a credible non-exceptional invoice.",
        ownerWorkerId: "worker-po-match",
      },
      {
        title: "Control posture changes at the release threshold",
        detail:
          "The autonomous path stops only because the payment intent crosses the 150000 USD approval ceiling.",
        ownerWorkerId: "worker-approval-coordinator",
      },
      {
        title: "Execution waits on named human approval",
        detail:
          "Execution Worker stays ready but inactive until the controller explicitly reopens the packet.",
        ownerWorkerId: "worker-execution",
      },
    ],
  },
] satisfies FinOpsScenarioPack[];

export const scenarioPacksByKey = Object.fromEntries(
  scenarioPacks.map((scenario) => [scenario.key, scenario]),
) as Record<ScenarioKey, FinOpsScenarioPack>;

export const scenarioFixtureGroups = {
  scenarioKeys,
  scenarioCatalog,
  exceptionCases: exceptionCaseFixtures,
  scenarioPacks,
} as const;
