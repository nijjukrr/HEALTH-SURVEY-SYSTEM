import { Platform } from 'react-native';

/**
 * Service to interact with the WHO Global Health Observatory (GHO) OData API.
 * 
 * Documentation: https://www.who.int/data/gho/info/gho-odata-api
 */

const BASE_URL = Platform.OS === 'web'
    ? 'http://localhost:3000/api/who'
    : 'https://ghoapi.azureedge.net/api';

export interface GhoDataPoint {
    Id: number;
    IndicatorCode: string;
    SpatialDimType: string;
    SpatialDim: string; // e.g., 'IND' for India, 'GLOBAL'
    TimeDimType: string;
    TimeDim: number; // Year
    Value: string;
    NumericValue: number | null;
    Date: string;
}

export interface GhoApiResponse {
    '@odata.context': string;
    value: GhoDataPoint[];
}

/**
 * Fetches the latest Cholera cases for a specific country or globally.
 * 
 * @param spatialDim Country code (e.g., 'IND') or leave empty for global/all.
 * @param top Number of latest records to retrieve.
 * @returns A promise resolving to an array of reported cholera cases data points.
 */
export const fetchCholeraCases = async (spatialDim?: string, top: number = 20): Promise<GhoDataPoint[]> => {
    try {
        // CHOLERA_0000000001: Number of reported cases of cholera
        let url = `${BASE_URL}/CHOLERA_0000000001?$top=${top}&$orderby=TimeDim desc`;

        if (spatialDim) {
            url += `&$filter=SpatialDim eq '${spatialDim}'`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`GHO API Error: ${response.status}`);
        }

        const data: GhoApiResponse = await response.json();
        return data.value;
    } catch (error) {
        console.error('Failed to fetch cholera cases:', error);
        return [];
    }
};

/**
 * Fetches the latest Cholera deaths for a specific country or globally.
 */
export const fetchCholeraDeaths = async (spatialDim?: string, top: number = 20): Promise<GhoDataPoint[]> => {
    try {
        // CHOLERA_0000000002: Number of reported deaths from cholera
        let url = `${BASE_URL}/CHOLERA_0000000002?$top=${top}&$orderby=TimeDim desc`;

        if (spatialDim) {
            url += `&$filter=SpatialDim eq '${spatialDim}'`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`GHO API Error: ${response.status}`);
        }

        const data: GhoApiResponse = await response.json();
        return data.value;
    } catch (error) {
        console.error('Failed to fetch cholera deaths:', error);
        return [];
    }
};
