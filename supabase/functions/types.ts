/**
 * Represents a collection of records.
 */
export type Records = Record<string, string[]>;

/**
 * Represents the information of an HTTP response.
 */
export interface HttpHesponseInfo {
    status: number;
    headers: Record<string, string>;
    bodySize: number;
}

/**
 * Represents information about an HTTP path.
 */
export interface HttpPathInfo {
    url: string;
    response: HttpHesponseInfo;
}

/**
 * Represents information about an HTTP request.
 */
export interface HttpInfo {
    https: boolean;
    paths: Record<HttpPathInfo["url"], HttpPathInfo>;
}

/**
 * Represents a domain.
 */
export interface Domain {
    name: string;
    records: Records;
    subdomains: Domain[];
    http: HttpInfo;
}

/**
 * Represents the state of an audit report.
 */
export interface AuditReportState {
    domains: Record<Domain["name"], Domain>;
}

export interface FunctionRequest {
    state: AuditReportState;
    prompt: string;
}

export type LlmHttpPathEnumResponse = string[];

export type LlmDnsDomainEnumResponse = string[];
