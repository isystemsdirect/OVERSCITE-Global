
import { validateHomeCanon } from './canon/validateHomeCanon';

export function bootstrap() {
  try {
    validateHomeCanon();
    console.log('OVERSCITE_HOME_CANON_VALIDATED_SUCCESSFULLY');
  } catch (error) {
    console.error('!!! CANON VALIDATION FAILED !!!');
    console.error((error as any).message || error);
    // In a real Firebase app, you might want to exit the process
    // or prevent functions from being deployed/run.
    // For this simulation, we just log the error.
    throw new Error('OVERSCITE_HOME_CANON_INVALID');
  }
}
