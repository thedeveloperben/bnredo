export enum WindErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_CLUB = 'INVALID_CLUB',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  CALCULATION_FAILED = 'CALCULATION_FAILED',
  SENSOR_UNAVAILABLE = 'SENSOR_UNAVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export class WindError extends Error {
  type: WindErrorType;
  context?: Record<string, unknown>;

  constructor(type: WindErrorType, message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'WindError';
    this.type = type;
    this.context = context;
  }
}

export const WindErrorFactory = {
  invalidInput(message: string, field: string, value: unknown): WindError {
    return new WindError(WindErrorType.INVALID_INPUT, message, { field, value });
  },

  invalidClub(clubName: string, context?: Record<string, unknown>): WindError {
    return new WindError(
      WindErrorType.INVALID_CLUB,
      `Invalid or unknown club: ${clubName}`,
      { clubName, ...context }
    );
  },

  invalidParameters(message: string, context?: Record<string, unknown>): WindError {
    return new WindError(WindErrorType.INVALID_PARAMETERS, message, context);
  },

  calculationFailed(message: string, context?: Record<string, unknown>): WindError {
    return new WindError(WindErrorType.CALCULATION_FAILED, message, context);
  },

  sensorUnavailable(sensor: string, context?: Record<string, unknown>): WindError {
    return new WindError(
      WindErrorType.SENSOR_UNAVAILABLE,
      `${sensor} sensor is not available on this device`,
      { sensor, ...context }
    );
  },

  networkError(message: string, context?: Record<string, unknown>): WindError {
    return new WindError(WindErrorType.NETWORK_ERROR, message, context);
  },
};

export const WindErrorHandler = {
  isWindError(error: unknown): error is WindError {
    return error instanceof WindError;
  },

  getUserMessage(error: WindError): string {
    switch (error.type) {
      case WindErrorType.INVALID_INPUT:
        return 'Please check your input values and try again.';
      case WindErrorType.INVALID_CLUB:
        return 'The selected club is not recognized. Please select a different club.';
      case WindErrorType.INVALID_PARAMETERS:
        return 'Invalid calculation parameters. Please try again.';
      case WindErrorType.CALCULATION_FAILED:
        return 'Unable to calculate wind effect. Please try again.';
      case WindErrorType.SENSOR_UNAVAILABLE:
        return 'Required sensor is not available on this device.';
      case WindErrorType.NETWORK_ERROR:
        return 'Network error. Please check your connection and try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  },
};
