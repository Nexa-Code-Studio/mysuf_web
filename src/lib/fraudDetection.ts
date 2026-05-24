import { differenceInMinutes, isSameDay, parseISO } from "date-fns";

import { calculateQuota } from "@/lib/quotaEngine";
import type {
  DashboardRiskItem,
  DetectedFraud,
  FraudAction,
  FuelTransaction,
  GovernmentDashboardSummary,
  RiskLevel,
  TransactionEvaluation,
} from "@/types";

const RAPID_PURCHASE_WINDOW_MINUTES = 30;
const MULTI_LOCATION_DISTANCE_KM = 30;
const HOUSEHOLD_DAILY_LITER_THRESHOLD = 120;

function haversineDistance(
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
): number {
  const earthRadiusKm = 6_371;
  const latitudeDelta = toRadians(endLatitude - startLatitude);
  const longitudeDelta = toRadians(endLongitude - startLongitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(startLatitude)) *
      Math.cos(toRadians(endLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore > 100) {
    return "CRITICAL";
  }

  if (riskScore >= 61) {
    return "HIGH_RISK";
  }

  if (riskScore >= 31) {
    return "SUSPICIOUS";
  }

  return "SAFE";
}

function getAction(riskLevel: RiskLevel): FraudAction {
  switch (riskLevel) {
    case "SAFE":
      return "ALLOW TRANSACTION";
    case "SUSPICIOUS":
      return "WARNING";
    case "HIGH_RISK":
      return "FREEZE ACCOUNT";
    case "CRITICAL":
      return "BLOCK ACCOUNT";
    default:
      return "ALLOW TRANSACTION";
  }
}

function getTransactionDate(transaction: FuelTransaction): Date {
  return parseISO(transaction.timestamp);
}

function getFamilyDayTransactions(
  currentTransaction: FuelTransaction,
  transactions: FuelTransaction[],
): FuelTransaction[] {
  const currentDate = getTransactionDate(currentTransaction);

  return transactions.filter(
    (transaction) =>
      transaction.familyId === currentTransaction.familyId &&
      isSameDay(getTransactionDate(transaction), currentDate) &&
      getTransactionDate(transaction) <= currentDate,
  );
}

function detectFraudsForTransaction(
  currentTransaction: FuelTransaction,
  transactions: FuelTransaction[],
): DetectedFraud[] {
  const currentDate = getTransactionDate(currentTransaction);
  const previousVehicleTransactions = transactions
    .filter(
      (transaction) =>
        transaction.vehicleId === currentTransaction.vehicleId &&
        getTransactionDate(transaction) < currentDate,
    )
    .sort((left, right) => getTransactionDate(left).getTime() - getTransactionDate(right).getTime());

  const detectedFrauds: DetectedFraud[] = [];
  const mostRecentVehicleTransaction = previousVehicleTransactions[previousVehicleTransactions.length - 1];

  if (mostRecentVehicleTransaction) {
    const minutesBetween = differenceInMinutes(currentDate, getTransactionDate(mostRecentVehicleTransaction));

    if (minutesBetween < RAPID_PURCHASE_WINDOW_MINUTES) {
      detectedFrauds.push({
        type: "RAPID_PURCHASE",
        points: 25,
        reason: `Pembelian ulang kendaraan ${currentTransaction.vehicleId} terjadi ${minutesBetween} menit setelah transaksi sebelumnya.`,
      });
    }

    const distanceKm = haversineDistance(
      currentTransaction.latitude,
      currentTransaction.longitude,
      mostRecentVehicleTransaction.latitude,
      mostRecentVehicleTransaction.longitude,
    );

    if (minutesBetween < RAPID_PURCHASE_WINDOW_MINUTES && distanceKm > MULTI_LOCATION_DISTANCE_KM) {
      detectedFrauds.push({
        type: "MULTI_LOCATION_ABUSE",
        points: 40,
        reason: `Perpindahan kendaraan ${currentTransaction.vehicleId} sejauh ${distanceKm.toFixed(1)} km dalam ${minutesBetween} menit tidak realistis.`,
      });
    }
  }

  const familyDayTransactions = getFamilyDayTransactions(currentTransaction, transactions);
  const uniqueVehiclesToday = new Set(familyDayTransactions.map((transaction) => transaction.vehicleId));
  const familyLitersToday = familyDayTransactions.reduce((sum, transaction) => sum + transaction.liters, 0);

  if (uniqueVehiclesToday.size > 3) {
    detectedFrauds.push({
      type: "HOUSEHOLD_ABUSE",
      points: 35,
      reason: `Lebih dari 3 kendaraan dalam KK ${currentTransaction.familyId} melakukan transaksi subsidi pada hari yang sama.`,
    });
  }

  if (familyLitersToday > HOUSEHOLD_DAILY_LITER_THRESHOLD) {
    detectedFrauds.push({
      type: "HOUSEHOLD_ABUSE",
      points: 35,
      reason: `Konsumsi harian KK ${currentTransaction.familyId} mencapai ${familyLitersToday} liter dan melewati ambang ${HOUSEHOLD_DAILY_LITER_THRESHOLD} liter.`,
    });
  }

  return detectedFrauds;
}

export function detectFraudForTransaction(
  currentTransaction: FuelTransaction,
  transactions: FuelTransaction[],
) {
  const detectedFrauds = detectFraudsForTransaction(currentTransaction, transactions);
  const riskScore = detectedFrauds.reduce((sum, fraud) => sum + fraud.points, 0);
  const riskLevel = getRiskLevel(riskScore);
  const riskModifier = riskLevel === "SAFE" ? 1 : riskLevel === "SUSPICIOUS" ? 0.8 : riskLevel === "HIGH_RISK" ? 0.5 : 0;
  const reasons =
    detectedFrauds.length > 0
      ? detectedFrauds.map((fraud) => fraud.reason)
      : ["Tidak ada pola anomali yang terdeteksi."];

  return {
    transactionId: currentTransaction.transactionId,
    userId: currentTransaction.userId,
    familyId: currentTransaction.familyId,
    vehicleId: currentTransaction.vehicleId,
    riskScore,
    riskLevel,
    riskModifier,
    detectedFrauds,
    action: getAction(riskLevel),
    reasons,
  };
}

export function evaluateTransactions(transactions: FuelTransaction[]): TransactionEvaluation[] {
  const sortedTransactions = [...transactions].sort(
    (left, right) => getTransactionDate(left).getTime() - getTransactionDate(right).getTime(),
  );

  return sortedTransactions.map((transaction) => {
    const fraudAssessment = detectFraudForTransaction(transaction, sortedTransactions);
    const quota = calculateQuota(transaction.vehicleId, transaction.vehicleType, fraudAssessment.riskLevel);

    return {
      ...transaction,
      riskScore: fraudAssessment.riskScore,
      riskLevel: fraudAssessment.riskLevel,
      riskModifier: fraudAssessment.riskModifier,
      detectedFrauds: fraudAssessment.detectedFrauds,
      action: fraudAssessment.action,
      baseQuota: quota.baseQuota,
      finalQuota: quota.finalQuota,
      reasons: fraudAssessment.reasons,
    };
  });
}

export function buildGovernmentDashboardSummary(
  transactions: TransactionEvaluation[],
): GovernmentDashboardSummary {
  const totalTransactions = transactions.length;
  const safeCount = transactions.filter((transaction) => transaction.riskLevel === "SAFE").length;
  const suspiciousCount = transactions.filter((transaction) => transaction.riskLevel === "SUSPICIOUS").length;
  const highRiskCount = transactions.filter((transaction) => transaction.riskLevel === "HIGH_RISK").length;
  const criticalCount = transactions.filter((transaction) => transaction.riskLevel === "CRITICAL").length;

  const buildRiskItems = (
    getKey: (transaction: TransactionEvaluation) => string,
  ): DashboardRiskItem[] => {
    const aggregation = new Map<string, DashboardRiskItem>();

    for (const transaction of transactions) {
      const key = getKey(transaction);
      const current = aggregation.get(key) ?? {
        label: key,
        score: 0,
        transactionCount: 0,
        fraudCount: 0,
      };

      current.score += transaction.riskScore;
      current.transactionCount += 1;
      current.fraudCount += transaction.detectedFrauds.length;
      aggregation.set(key, current);
    }

    return Array.from(aggregation.values()).sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.fraudCount - left.fraudCount;
    });
  };

  return {
    totalTransactions,
    safeCount,
    suspiciousCount,
    highRiskCount,
    criticalCount,
    topRiskyUsers: buildRiskItems((transaction) => transaction.userId).slice(0, 5),
    topRiskyFamilies: buildRiskItems((transaction) => transaction.familyId).slice(0, 5),
    stationsWithHighestFraudCount: buildRiskItems((transaction) => transaction.stationName)
      .filter((item) => item.fraudCount > 0)
      .sort((left, right) => right.fraudCount - left.fraudCount || right.score - left.score)
      .slice(0, 5),
  };
}