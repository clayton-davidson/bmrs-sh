// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-next';
import type { GetStarsByCrewData, GetStarsByCrewResponse, GetStarsByCrewError, GetBundledTonsByCrewData, GetBundledTonsByCrewResponse, GetBundledTonsByCrewError, GetRolledTonsByCrewData, GetRolledTonsByCrewResponse, GetRolledTonsByCrewError, GetBloomYardScrapTonsByCrewData, GetBloomYardScrapTonsByCrewResponse, GetBloomYardScrapTonsByCrewError, GetBonusByCrewData, GetBonusByCrewResponse, GetBonusByCrewError, MergeBonusByCrewData, MergeBonusByCrewResponse, MergeBonusByCrewError, GetIncidentByCrewData, GetIncidentByCrewResponse, GetIncidentByCrewError, MergeIncidentByCrewData, MergeIncidentByCrewResponse, MergeIncidentByCrewError, CalculateYieldsData, CalculateYieldsResponse, CalculateYieldsError, GetCobblesData, GetCobblesResponse, GetCobblesError, CalculateTheoreticalBonusesData, CalculateTheoreticalBonusesResponse, CalculateTheoreticalBonusesError, GetMeasurementTypesData, GetMeasurementTypesResponse, GetMeasurementTypesError, GetLatestMeasurementsData, GetLatestMeasurementsResponse, GetLatestMeasurementsError, GetHistoricalMeasurementsData, GetHistoricalMeasurementsResponse, GetHistoricalMeasurementsError, GetMechanicalWorkOrdersData, GetMechanicalWorkOrdersResponse, GetMechanicalWorkOrdersError, GetHomeSseEventsData } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

/**
 * Get stars by crew
 * Retrieves consolidated star counts by crew for a given date range
 */
export const getStarsByCrew = <ThrowOnError extends boolean = false>(options: Options<GetStarsByCrewData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetStarsByCrewResponse, GetStarsByCrewError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/stars-by-crew',
        ...options
    });
};

/**
 * Get bundled tons by crew
 * Retrieves bundled tons production by crew for a given date range
 */
export const getBundledTonsByCrew = <ThrowOnError extends boolean = false>(options: Options<GetBundledTonsByCrewData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetBundledTonsByCrewResponse, GetBundledTonsByCrewError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/bundled-tons-by-crew',
        ...options
    });
};

/**
 * Get rolled tons by crew
 * Retrieves rolled tons production by crew for a given date range
 */
export const getRolledTonsByCrew = <ThrowOnError extends boolean = false>(options: Options<GetRolledTonsByCrewData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetRolledTonsByCrewResponse, GetRolledTonsByCrewError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/rolled-tons-by-crew',
        ...options
    });
};

/**
 * Get bloom yard scrap tons by crew
 * Retrieves bloom yard scrap tons by crew for a given date range
 */
export const getBloomYardScrapTonsByCrew = <ThrowOnError extends boolean = false>(options: Options<GetBloomYardScrapTonsByCrewData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetBloomYardScrapTonsByCrewResponse, GetBloomYardScrapTonsByCrewError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/bloom-yard-scrap-tons-by-crew',
        ...options
    });
};

/**
 * Get bonus by crew
 * Retrieves production bonus data by crew for a given date range
 */
export const getBonusByCrew = <ThrowOnError extends boolean = false>(options: Options<GetBonusByCrewData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetBonusByCrewResponse, GetBonusByCrewError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/bonus-by-crew',
        ...options
    });
};

/**
 * Merge bonus by crew
 * Merges production bonus data by crew
 */
export const mergeBonusByCrew = <ThrowOnError extends boolean = false>(options: Options<MergeBonusByCrewData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<MergeBonusByCrewResponse, MergeBonusByCrewError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/bonus-by-crew',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get incident by crew
 * Retrieves incident data by crew for a given date range
 */
export const getIncidentByCrew = <ThrowOnError extends boolean = false>(options: Options<GetIncidentByCrewData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetIncidentByCrewResponse, GetIncidentByCrewError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/incident-by-crew',
        ...options
    });
};

/**
 * Merge incident by crew
 * Merges incident data by crew
 */
export const mergeIncidentByCrew = <ThrowOnError extends boolean = false>(options: Options<MergeIncidentByCrewData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<MergeIncidentByCrewResponse, MergeIncidentByCrewError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/incident-by-crew',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Calculate yields
 * Calculates weekly and year-to-date yields by crew for given date ranges
 */
export const calculateYields = <ThrowOnError extends boolean = false>(options: Options<CalculateYieldsData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<CalculateYieldsResponse, CalculateYieldsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/yields',
        ...options
    });
};

/**
 * Get cobbles
 * Retrieves cobbles data for a given date range
 */
export const getCobbles = <ThrowOnError extends boolean = false>(options: Options<GetCobblesData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetCobblesResponse, GetCobblesError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/cobbles',
        ...options
    });
};

/**
 * Calculate theoretical bonuses
 * Calculates theoretical bonuses based on production data and delays
 */
export const calculateTheoreticalBonuses = <ThrowOnError extends boolean = false>(options: Options<CalculateTheoreticalBonusesData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<CalculateTheoreticalBonusesResponse, CalculateTheoreticalBonusesError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/achievement/theoretical-bonuses',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get all measurement types
 * Retrieves all measurement types ordered by sort order
 */
export const getMeasurementTypes = <ThrowOnError extends boolean = false>(options?: Options<GetMeasurementTypesData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetMeasurementTypesResponse, GetMeasurementTypesError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/measurement/types',
        ...options
    });
};

/**
 * Get latest measurements
 * Retrieves the most recent reading for each measurement type
 */
export const getLatestMeasurements = <ThrowOnError extends boolean = false>(options?: Options<GetLatestMeasurementsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetLatestMeasurementsResponse, GetLatestMeasurementsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/measurement/latest',
        ...options
    });
};

/**
 * Get historical measurements
 * Retrieves historical measurements for a specific type from a given time
 */
export const getHistoricalMeasurements = <ThrowOnError extends boolean = false>(options: Options<GetHistoricalMeasurementsData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetHistoricalMeasurementsResponse, GetHistoricalMeasurementsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/measurement/historical/{typeId}',
        ...options
    });
};

/**
 * Get mechanical work orders
 * Retrieves all mechnical work orders ordered by sort order
 */
export const getMechanicalWorkOrders = <ThrowOnError extends boolean = false>(options: Options<GetMechanicalWorkOrdersData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetMechanicalWorkOrdersResponse, GetMechanicalWorkOrdersError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/work-order/mechnical',
        ...options
    });
};

export const getHomeSseEvents = <ThrowOnError extends boolean = false>(options?: Options<GetHomeSseEventsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/sse/home-events',
        ...options
    });
};