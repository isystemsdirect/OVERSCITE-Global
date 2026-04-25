"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHomeCanon = validateHomeCanon;
const oversciteHomeCanon_1 = require("./oversciteHomeCanon");
function validateHomeCanon() {
    const canon = oversciteHomeCanon_1.OVERSCITE_HOME_CANON;
    // 1. Validate governance scope
    if (canon.governance?.scope !== 'HOME_INSPECTION_ONLY') {
        throw new Error(`Invalid governance scope: ${canon.governance?.scope}`);
    }
    // 2. Validate metadata_required
    if (!canon.inspection_structure?.metadata_required || canon.inspection_structure.metadata_required.length === 0) {
        throw new Error('metadata_required is missing or empty');
    }
    // 3. Validate domains
    if (!canon.domains || Object.keys(canon.domains).length === 0) {
        throw new Error('domains are missing or empty');
    }
    const allDomains = { ...canon.domains, ...canon.ancillary_modules };
    const domainCount = Object.keys(allDomains).length;
    // 5. Enforce domain count
    if (domainCount < 1) {
        throw new Error(`Expected at least 1 domain, but found ${domainCount}`);
    }
    // 6. Validate each domain
    for (const domainName in allDomains) {
        const domain = allDomains[domainName];
        if (!domain.required_fields || domain.required_fields.length === 0) {
            throw new Error(`required_fields are missing or empty for domain ${domainName}`);
        }
        if (!domain.defect_categories || domain.defect_categories.length === 0) {
            throw new Error(`defect_categories are missing or empty for domain ${domainName}`);
        }
    }
    // If all checks pass:
    console.log('OVERSCITE_HOME_CANON_VALID');
    return 'VALID';
}
//# sourceMappingURL=validateHomeCanon.js.map