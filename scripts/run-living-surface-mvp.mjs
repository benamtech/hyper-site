#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { compileLivingSurface } from "../hyper-site/dist/index.js";

const output = resolve("validation/reports/living-surface-mvp");
mkdirSync(output, { recursive: true });

const source = {
  schemaVersion: 1,
  id: "amtech-estimate-employee",
  title: "Your estimate is ready",
  purpose: "A living AI employee surface that explains, proves and completes a bounded customer-estimate task.",
  currentTask: "Review and deliver the exterior-painting estimate",
  governanceThreshold: 0.6,
  evidenceIds: ["e:customer", "e:scope", "e:pricing"],
  informationObjects: [
    { id: "info:scope", title: "Scope", body: "Exterior preparation, priming, full repaint and trim touch-up.", visibility: "both", evidenceIds: ["e:scope"] },
    { id: "info:price", title: "Price construction", body: "Labor and materials are bound to approved estimating assumptions.", visibility: "operator", evidenceIds: ["e:pricing"] },
    { id: "info:customer", title: "Customer", body: "The public projection contains only assignment-scoped customer context.", visibility: "public", evidenceIds: ["e:customer"] },
  ],
  actions: [
    { id: "action:view", label: "View estimate", description: "Inspect the complete estimate and evidence summary.", visibility: "public", authority: "user", status: "available", risk: 0.1, agency: 1, evidenceIds: ["e:customer", "e:scope"] },
    { id: "action:request-change", label: "Request a change", description: "Ask the AI employee to revise scope or assumptions.", visibility: "both", authority: "mixed", status: "available", risk: 0.35, agency: 0.65, evidenceIds: ["e:scope"] },
    { id: "action:send", label: "Approve and send", description: "Send the final estimate to the customer after owner approval.", visibility: "operator", authority: "mixed", status: "available", risk: 0.9, agency: 0.35, evidenceIds: ["e:customer", "e:pricing"], approvalId: "approval:send" },
  ],
  approvals: [
    { id: "approval:send", actionId: "action:send", summary: "External delivery requires explicit owner approval.", requestedBy: "agent", status: "pending", visibility: "operator" },
  ],
  receipts: [],
  nodes: [
    { id: "node:status", kind: "status", title: "Draft complete", body: "The AI employee completed the bounded estimating task and retained the evidence trail.", visibility: "both", field: { visibility: 1, scale: 1, curvature: 0.1, density: 0.4, governance: 0.2, agency: 0.75, relevance: 1, valence: 0.8, urgency: 0.7 }, informationObjectIds: ["info:scope"], actionIds: ["action:view", "action:request-change"], evidenceIds: ["e:scope"] },
    { id: "node:customer", kind: "artifact", title: "Customer-ready artifact", body: "The public surface exposes the result without exposing private pricing controls.", visibility: "public", field: { visibility: 1, scale: 1, curvature: 0, density: 0.55, governance: 0.15, agency: 0.9, relevance: 0.9, valence: 0.75, urgency: 0.55 }, informationObjectIds: ["info:customer"], actionIds: [], evidenceIds: ["e:customer"] },
    { id: "node:approval", kind: "approval", title: "Owner decision gate", body: "The agent may prepare delivery but cannot cross the external-send boundary alone.", visibility: "operator", field: { visibility: 1, scale: 1, curvature: 0.9, density: 0.65, governance: 1, agency: 0.35, relevance: 0.98, valence: 0.45, urgency: 0.95 }, informationObjectIds: ["info:price"], actionIds: ["action:send"], evidenceIds: ["e:pricing"] },
  ],
  runtime: { status: "waiting-approval", activeAgents: 1, queueDepth: 0, pendingApprovals: 1, costUsd: 0.24, lastHeartbeatAt: new Date().toISOString() },
};

const publicBuild = compileLivingSurface(source, "public");
const operatorBuild = compileLivingSurface(source, "operator");
writeFileSync(resolve(output, "source.json"), `${JSON.stringify(source, null, 2)}\n`);
writeFileSync(resolve(output, "public.html"), publicBuild.html);
writeFileSync(resolve(output, "operator.html"), operatorBuild.html);
writeFileSync(resolve(output, "public-projection.json"), `${JSON.stringify(publicBuild.projection, null, 2)}\n`);
writeFileSync(resolve(output, "operator-projection.json"), `${JSON.stringify(operatorBuild.projection, null, 2)}\n`);
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  output,
  public: { stateHash: publicBuild.projection.stateHash, htmlHash: publicBuild.htmlHash, buildHash: publicBuild.buildHash, nodes: publicBuild.projection.state.nodes.length, actions: publicBuild.projection.state.actions.length },
  operator: { stateHash: operatorBuild.projection.stateHash, htmlHash: operatorBuild.htmlHash, buildHash: operatorBuild.buildHash, nodes: operatorBuild.projection.state.nodes.length, actions: operatorBuild.projection.state.actions.length },
  assertions: {
    privateDataAbsentFromPublicHtml: !publicBuild.html.includes("Price construction") && !publicBuild.html.includes("Approve and send"),
    approvalVisibleToOperator: operatorBuild.html.includes("Approval required"),
    deterministicStaticFallback: publicBuild.html.startsWith("<!doctype html>") && operatorBuild.html.startsWith("<!doctype html>"),
  },
};
report.passed = Object.values(report.assertions).every(Boolean);
writeFileSync(resolve(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exit(report.passed ? 0 : 1);
