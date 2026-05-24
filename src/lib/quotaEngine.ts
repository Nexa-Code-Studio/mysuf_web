import type { FraudAction, RiskLevel, VehicleType } from "@/types";

export const BASE_QUOTA_BY_VEHICLE_TYPE: Record<VehicleType, number> = {
  motorcycle: 40,
  passenger_car: 120,
  pickup: 180,
  truck: 300,
  box_cargo: 260,
  tanker: 400,
  van: 150,
};

export const RISK_MODIFIER_BY_LEVEL: Record<RiskLevel, number> = {
  SAFE: 1.0,
  SUSPICIOUS: 0.8,
  HIGH_RISK: 0.5,
  CRITICAL: 0,
};

export const ACTION_BY_RISK_LEVEL: Record<RiskLevel, FraudAction> = {
  SAFE: "ALLOW TRANSACTION",
  SUSPICIOUS: "WARNING",
  HIGH_RISK: "FREEZE ACCOUNT",
  CRITICAL: "BLOCK ACCOUNT",
};

export function getRiskLevelModifier(riskLevel: RiskLevel): number {
  return RISK_MODIFIER_BY_LEVEL[riskLevel];
}

export function calculateQuota(
  vehicleId: string,
  vehicleType: VehicleType,
  riskLevel: RiskLevel,
) {
  const baseQuota = BASE_QUOTA_BY_VEHICLE_TYPE[vehicleType] ?? 0;
  const riskModifier = getRiskLevelModifier(riskLevel);
  const finalQuota = Number((baseQuota * riskModifier).toFixed(2));

  return {
    vehicleId,
    baseQuota,
    riskModifier,
    finalQuota,
    riskLevel,
    action: ACTION_BY_RISK_LEVEL[riskLevel],
  };
}