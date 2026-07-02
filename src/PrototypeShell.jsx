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
};

// Renders the current screen. Context must be provided by an <AppProvider> above.
export function PrototypeShell() {
  const { screen } = useApp();
  const Screen = SCREENS[screen] || Welcome;
  return <Screen />;
}
