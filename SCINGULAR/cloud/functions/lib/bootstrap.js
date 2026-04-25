"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const validateHomeCanon_1 = require("./canon/validateHomeCanon");
function bootstrap() {
    try {
        (0, validateHomeCanon_1.validateHomeCanon)();
        console.log('OVERSCITE_HOME_CANON_VALIDATED_SUCCESSFULLY');
    }
    catch (error) {
        console.error('!!! CANON VALIDATION FAILED !!!');
        console.error(error.message || error);
        // In a real Firebase app, you might want to exit the process
        // or prevent functions from being deployed/run.
        // For this simulation, we just log the error.
        throw new Error('OVERSCITE_HOME_CANON_INVALID');
    }
}
//# sourceMappingURL=bootstrap.js.map