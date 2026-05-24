import type { EligibilityResult, FamilyVehicle, FuelTransaction, VehicleType } from "@/types";

export const MAX_NJKB_PER_FAMILY = 300_000_000;

export const DEFAULT_NJKB_BY_VEHICLE_TYPE: Record<VehicleType, number> = {
  motorcycle: 25_000_000,
  passenger_car: 180_000_000,
  pickup: 120_000_000,
  truck: 300_000_000,
};

export function calculateFamilyEligibility(
  familyId: string,
  vehicles: FamilyVehicle[],
  threshold: number = MAX_NJKB_PER_FAMILY,
): EligibilityResult {
  const totalNJKB = vehicles.reduce((sum, vehicle) => sum + vehicle.njkb, 0);

  return {
    familyId,
    totalNJKB,
    threshold,
    eligible: totalNJKB <= threshold,
    vehicles,
  };
}

export function buildFamilyEligibilitySummaries(
  transactions: FuelTransaction[],
  threshold: number = MAX_NJKB_PER_FAMILY,
): EligibilityResult[] {
  const familyMap = new Map<string, Map<string, FamilyVehicle>>();

  for (const transaction of transactions) {
    if (!familyMap.has(transaction.familyId)) {
      familyMap.set(transaction.familyId, new Map<string, FamilyVehicle>());
    }

    const familyVehicles = familyMap.get(transaction.familyId)!;
    if (!familyVehicles.has(transaction.vehicleId)) {
      familyVehicles.set(transaction.vehicleId, {
        vehicleId: transaction.vehicleId,
        vehicleType: transaction.vehicleType,
        njkb: DEFAULT_NJKB_BY_VEHICLE_TYPE[transaction.vehicleType] ?? 0,
      });
    }
  }

  return Array.from(familyMap.entries())
    .map(([familyId, vehicleMap]) =>
      calculateFamilyEligibility(familyId, Array.from(vehicleMap.values()), threshold),
    )
    .sort((left, right) => left.familyId.localeCompare(right.familyId));
}