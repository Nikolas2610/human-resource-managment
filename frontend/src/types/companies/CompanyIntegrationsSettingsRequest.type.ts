import { CompanyIntegrationSettings } from "./CompanyIntegrationSettings.type";

export interface CompanyIntegrationSettingsRequest
    extends CompanyIntegrationSettings {
    id: number;
}
