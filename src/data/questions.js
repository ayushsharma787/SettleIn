// The six onboarding questions, shown one at a time.
export const QUESTIONS = [
  {
    key: 'family',
    question: 'Who are you moving with?',
    subtitle: 'This shapes whether we include school and family steps.',
    icon: 'users',
    options: [
      { value: 'Single', label: 'Just me', emoji: '🧳' },
      { value: 'Couple', label: 'With my partner', emoji: '💑' },
      { value: 'Family with children', label: 'Family with children', emoji: '👨‍👩‍👧' },
    ],
  },
  {
    key: 'visaType',
    question: "What's your visa type?",
    subtitle: 'Different visas follow slightly different journeys.',
    icon: 'passport',
    options: [
      { value: 'Employer-sponsored', label: 'Employer-sponsored', emoji: '🏢' },
      { value: 'Freelance', label: 'Freelance permit', emoji: '💼' },
      { value: 'Golden Visa', label: 'Golden Visa', emoji: '⭐' },
      { value: 'Remote work', label: 'Remote work visa', emoji: '🌍' },
      { value: 'Dependent', label: 'Dependent / family', emoji: '👪' },
    ],
  },
  {
    key: 'emirate',
    question: 'Which emirate are you settling in?',
    subtitle: 'We route you to the right local authorities.',
    icon: 'map',
    options: [
      { value: 'Dubai', label: 'Dubai', emoji: '🏙️' },
      { value: 'Abu Dhabi', label: 'Abu Dhabi', emoji: '🕌' },
      { value: 'Sharjah', label: 'Sharjah', emoji: '🌇' },
    ],
  },
  {
    key: 'tenancy',
    question: 'Do you have a home yet?',
    subtitle: 'Housing unlocks utilities, internet and family visas.',
    icon: 'home',
    options: [
      { value: 'Yes', label: 'Yes, signed a tenancy', emoji: '🔑' },
      { value: 'No', label: 'Not yet', emoji: '🔍' },
      { value: 'Temporary', label: 'In temporary accommodation', emoji: '🏨' },
    ],
  },
  {
    key: 'driving',
    question: 'Do you plan to drive?',
    subtitle: 'We include license and car steps only if you need them.',
    icon: 'wheel',
    options: [
      { value: 'Have foreign license', label: 'I have a foreign license', emoji: '🪪' },
      { value: 'Need to learn', label: 'I need to learn', emoji: '🚦' },
      { value: 'No', label: "No, I won't drive", emoji: '🚇' },
    ],
  },
  {
    key: 'visaHandled',
    question: 'Has your employer / PRO handled your visa & Emirates ID?',
    subtitle: "We'll pre-complete those steps so you skip ahead.",
    icon: 'check',
    options: [
      { value: 'Yes', label: 'Yes, all done', emoji: '✅' },
      { value: 'In progress', label: "It's in progress", emoji: '⏳' },
      { value: 'No', label: 'No, I handle it myself', emoji: '📝' },
    ],
  },
];
