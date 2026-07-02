import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext.jsx';
import { Welcome } from './screens/Welcome.jsx';
import { Questionnaire } from './screens/Questionnaire.jsx';
import { Generating } from './screens/Generating.jsx';
import { Roadmap } from './screens/Roadmap.jsx';
import { StepDetail } from './screens/StepDetail.jsx';
import { Tiers } from './screens/Tiers.jsx';
import { Calculator } from './screens/Calculator.jsx';
import { Employer } from './screens/Employer.jsx';
import { EmployerEmployee } from './screens/EmployerEmployee.jsx';
import { Concierge } from './screens/Concierge.jsx';

const SCREENS = {
  welcome: Welcome,
  questionnaire: Questionnaire,
  generating: Generating,
  roadmap: Roadmap,
  stepDetail: StepDetail,
  tiers: Tiers,
  calculator: Calculator,
  employer: Employer,
  employerEmployee: EmployerEmployee,
  concierge: Concierge,
};

// Renders the current screen with a smooth cross-transition on every change.
// Context must be provided by an <AppProvider> above.
export function PrototypeShell() {
  const { screen, activeStepId } = useApp();
  const Screen = SCREENS[screen] || Welcome;
  // Key includes activeStepId so navigating between two step details still animates.
  const key = screen === 'stepDetail' ? `stepDetail:${activeStepId}` : screen;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -18 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-full"
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
}
