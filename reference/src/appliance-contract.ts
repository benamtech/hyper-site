import { sha256 } from "./core.js";
import { buildValidationReport, finding, type ValidationAttribute, type ValidationReport } from "./validation-contracts.js";

export type AcceleratorSupportState = "optimized" | "compatibility-candidate";

export interface AcceleratorProfile {
  id: string;
  label: string;
  architecture: "blackwell" | "hopper" | "ampere" | "ada";
  minimumGpuMemoryGiB: number;
  minimumComputeCapability: number;
  supportState: AcceleratorSupportState;
  intendedWorkloads: readonly string[];
}

export const ACCELERATOR_PROFILES: readonly AcceleratorProfile[] = [
  {
    id: "rtx-pro-6000-blackwell-96gb",
    label: "NVIDIA RTX PRO 6000 Blackwell 96GB",
    architecture: "blackwell",
    minimumGpuMemoryGiB: 96,
    minimumComputeCapability: 12,
    supportState: "optimized",
    intendedWorkloads: ["corpus validation", "local specialist inference", "browser and render validation", "asset processing"],
  },
  {
    id: "h200-141gb",
    label: "NVIDIA H200 141GB",
    architecture: "hopper",
    minimumGpuMemoryGiB: 141,
    minimumComputeCapability: 9,
    supportState: "compatibility-candidate",
    intendedWorkloads: ["large local semantic models", "high-throughput corpus validation"],
  },
  {
    id: "h100-80gb",
    label: "NVIDIA H100 80GB",
    architecture: "hopper",
    minimumGpuMemoryGiB: 80,
    minimumComputeCapability: 9,
    supportState: "compatibility-candidate",
    intendedWorkloads: ["local specialist inference", "high-throughput corpus validation"],
  },
  {
    id: "a100-80gb",
    label: "NVIDIA A100 80GB",
    architecture: "ampere",
    minimumGpuMemoryGiB: 80,
    minimumComputeCapability: 8,
    supportState: "compatibility-candidate",
    intendedWorkloads: ["budget local specialist inference", "batch embeddings"],
  },
  {
    id: "rtx-5090-32gb",
    label: "NVIDIA RTX 5090 32GB",
    architecture: "blackwell",
    minimumGpuMemoryGiB: 32,
    minimumComputeCapability: 12,
    supportState: "compatibility-candidate",
    intendedWorkloads: ["asset processing", "small local validators", "browser and render validation"],
  },
  {
    id: "rtx-4090-24gb",
    label: "NVIDIA RTX 4090 24GB",
    architecture: "ada",
    minimumGpuMemoryGiB: 24,
    minimumComputeCapability: 8.9,
    supportState: "compatibility-candidate",
    intendedWorkloads: ["asset processing", "small local validators"],
  },
];

export interface ApplianceContract {
  id: string;
  optimizedProfileId: "rtx-pro-6000-blackwell-96gb";
  minimumSystemMemoryGiB: number;
  minimumLocalNvmeFreeGiB: number;
  minimumCudaVersion: string;
  minimumNodeMajor: number;
  requiredOs: "linux";
  requiredArchitecture: "x64";
  maximumTargetHourlyRateUsd: number;
  contractHash: string;
}

export interface ApplianceProbe {
  profileId: string;
  gpuVendor: string;
  gpuModel: string;
  gpuCount: number;
  gpuMemoryGiB: number;
  computeCapability: number;
  systemMemoryGiB: number;
  localNvmeFreeGiB: number;
  cudaVersion: string;
  nodeVersion: string;
  os: string;
  architecture: string;
  observedHourlyRateUsd?: number;
}

export interface ApplianceAssessment {
  contract: ApplianceContract;
  profile: AcceleratorProfile;
  validation: ValidationReport;
  assessmentHash: string;
}

export const APPLIANCE_VALIDATION: readonly ValidationAttribute[] = [
  {
    id: "appliance.profile",
    feature: "Explicit accelerator support profile",
    workflowStep: "doctor",
    algorithmChoice: "versioned optimized and compatibility-candidate profiles",
    userEffect: "the operator sees whether hardware is optimized or only a measured candidate",
    developerEffect: "performance claims cannot silently generalize across unrelated GPUs",
    validationVector: ["known profile", "vendor", "GPU count", "VRAM", "compute capability"],
    passVector: ["profile resolves", "hardware satisfies profile floor"],
    failVector: ["unknown profile", "insufficient VRAM", "insufficient compute capability"],
    simplerBaseline: "accept any CUDA GPU",
    severity: "hard",
  },
  {
    id: "appliance.host",
    feature: "Host capacity floor",
    workflowStep: "doctor",
    algorithmChoice: "explicit RAM and local NVMe thresholds",
    userEffect: "large transactions fail before paid generation starts",
    developerEffect: "checkpoint, corpus, browser, and emission workloads have a reproducible floor",
    validationVector: ["system RAM", "local NVMe free space"],
    passVector: ["RAM >= 128 GiB", "NVMe free >= 100 GiB"],
    failVector: ["memory pressure", "insufficient transaction space"],
    simplerBaseline: "check VRAM only",
    severity: "hard",
  },
  {
    id: "appliance.runtime",
    feature: "Supported runtime envelope",
    workflowStep: "doctor",
    algorithmChoice: "versioned CUDA, Node, OS, and architecture checks",
    userEffect: "the operator gets an early compatibility result",
    developerEffect: "CI and rented nodes share one explicit runtime boundary",
    validationVector: ["CUDA", "Node", "Linux", "x64"],
    passVector: ["CUDA >= 12.8", "Node >= 22", "linux x64"],
    failVector: ["unsupported CUDA", "unsupported Node", "unsupported platform"],
    simplerBaseline: "best-effort runtime detection",
    severity: "hard",
  },
  {
    id: "appliance.economics",
    feature: "Observed rental economics",
    workflowStep: "provision",
    algorithmChoice: "reported hourly price compared with a non-capability budget ceiling",
    userEffect: "the operator can reject an overpriced node without confusing price with hardware correctness",
    developerEffect: "market prices remain observations rather than source-code truth",
    validationVector: ["observed hourly price", "target ceiling"],
    passVector: ["price absent and visible as pending", "price <= target ceiling"],
    failVector: ["reported price exceeds target ceiling"],
    simplerBaseline: "hard-code one cloud price",
    severity: "soft",
  },
];

export function createMinimumApplianceContract(): ApplianceContract {
  const canonical = {
    id: "hyper-site-appliance-v1",
    optimizedProfileId: "rtx-pro-6000-blackwell-96gb" as const,
    minimumSystemMemoryGiB: 128,
    minimumLocalNvmeFreeGiB: 100,
    minimumCudaVersion: "12.8",
    minimumNodeMajor: 22,
    requiredOs: "linux" as const,
    requiredArchitecture: "x64" as const,
    maximumTargetHourlyRateUsd: 4,
  };
  return { ...canonical, contractHash: sha256(JSON.stringify(canonical)) };
}

export function assessAppliance(
  probe: ApplianceProbe,
  contract: ApplianceContract = createMinimumApplianceContract(),
): ApplianceAssessment {
  const profile = ACCELERATOR_PROFILES.find((item) => item.id === probe.profileId);
  if (!profile) throw new Error(`unknown accelerator profile ${probe.profileId}`);
  const profilePass = probe.gpuVendor.trim().toLowerCase() === "nvidia"
    && Number.isInteger(probe.gpuCount)
    && probe.gpuCount >= 1
    && probe.gpuMemoryGiB >= profile.minimumGpuMemoryGiB
    && probe.computeCapability >= profile.minimumComputeCapability;
  const hostPass = probe.systemMemoryGiB >= contract.minimumSystemMemoryGiB
    && probe.localNvmeFreeGiB >= contract.minimumLocalNvmeFreeGiB;
  const runtimePass = compareVersions(probe.cudaVersion, contract.minimumCudaVersion) >= 0
    && nodeMajor(probe.nodeVersion) >= contract.minimumNodeMajor
    && probe.os === contract.requiredOs
    && probe.architecture === contract.requiredArchitecture;
  const economicsState = probe.observedHourlyRateUsd === undefined
    ? "pending" as const
    : probe.observedHourlyRateUsd <= contract.maximumTargetHourlyRateUsd ? "pass" as const : "fail" as const;
  const validation = buildValidationReport(`appliance:${contract.id}:${profile.id}`, APPLIANCE_VALIDATION, [
    finding("appliance.profile", profilePass ? "pass" : "fail", `${profile.label}; support=${profile.supportState}; detected=${probe.gpuModel}`),
    finding("appliance.host", hostPass ? "pass" : "fail", `RAM=${probe.systemMemoryGiB}GiB; NVMe-free=${probe.localNvmeFreeGiB}GiB`),
    finding("appliance.runtime", runtimePass ? "pass" : "fail", `CUDA=${probe.cudaVersion}; Node=${probe.nodeVersion}; ${probe.os}/${probe.architecture}`),
    finding("appliance.economics", economicsState, probe.observedHourlyRateUsd === undefined
      ? "hourly price was not supplied"
      : `$${probe.observedHourlyRateUsd.toFixed(2)}/hr against $${contract.maximumTargetHourlyRateUsd.toFixed(2)}/hr ceiling`, {
      ...(probe.observedHourlyRateUsd === undefined ? {} : { measured: probe.observedHourlyRateUsd }),
      threshold: contract.maximumTargetHourlyRateUsd,
    }),
  ]);
  const canonical = { contractHash: contract.contractHash, profileId: profile.id, probe, validationHash: validation.reportHash };
  return { contract, profile, validation, assessmentHash: sha256(JSON.stringify(canonical)) };
}

function nodeMajor(version: string): number {
  const match = version.trim().match(/^v?(\d+)/);
  return match ? Number(match[1]) : Number.NaN;
}

function compareVersions(left: string, right: string): number {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  const length = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}
