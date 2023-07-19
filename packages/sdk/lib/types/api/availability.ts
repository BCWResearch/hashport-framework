export type Availability = {
  hederaStatus: HederaStatusAvailability;
  validators: ValidatorsAvailability;
};

export type HederaStatusAvailability = {
  description: string;
  indicator: string;
  timeStamp: string;
};

export type ValidatorsAvailability = {
  available: boolean;
  majority: boolean;
};
