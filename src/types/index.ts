export type UserRole =
	| "SPBU_ADMIN"
	| "GOV_ADMIN"
	| "COMPANY_ADMIN"
	| "SUPER_ADMIN";

export type VehicleType = "motorcycle" | "passenger_car" | "pickup" | "truck";

export type FraudType =
	| "RAPID_PURCHASE"
	| "MULTI_LOCATION_ABUSE"
	| "HOUSEHOLD_ABUSE";

export type RiskLevel = "SAFE" | "SUSPICIOUS" | "HIGH_RISK" | "CRITICAL";

export type FraudAction =
	| "ALLOW TRANSACTION"
	| "WARNING"
	| "FREEZE ACCOUNT"
	| "BLOCK ACCOUNT";

export interface FuelTransaction {
	transactionId: string;
	userId: string;
	familyId: string;
	vehicleId: string;
	vehicleType: VehicleType;
	stationId: string;
	stationName: string;
	latitude: number;
	longitude: number;
	liters: number;
	timestamp: string;
}

export interface FamilyVehicle {
	vehicleId: string;
	vehicleType: VehicleType;
	njkb: number;
}

export interface DetectedFraud {
	type: FraudType;
	points: number;
	reason: string;
}

export interface TransactionEvaluation extends FuelTransaction {
	riskScore: number;
	riskLevel: RiskLevel;
	riskModifier: number;
	detectedFrauds: DetectedFraud[];
	action: FraudAction;
	baseQuota: number;
	finalQuota: number;
	reasons: string[];
}

export interface EligibilityResult {
	familyId: string;
	totalNJKB: number;
	threshold: number;
	eligible: boolean;
	vehicles: FamilyVehicle[];
}

export interface DashboardRiskItem {
	label: string;
	score: number;
	transactionCount: number;
	fraudCount: number;
}

export interface GovernmentDashboardSummary {
	totalTransactions: number;
	safeCount: number;
	suspiciousCount: number;
	highRiskCount: number;
	criticalCount: number;
	topRiskyUsers: DashboardRiskItem[];
	topRiskyFamilies: DashboardRiskItem[];
	stationsWithHighestFraudCount: DashboardRiskItem[];
}
