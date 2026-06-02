import React from 'react';
import DocumentScreen, { DocSection } from '../components/DocumentScreen';

const intro =
  'Your privacy matters. This policy explains what Toss does — and does not — do with your data.';

const sections: DocSection[] = [
  {
    heading: 'What We Collect',
    body: 'Nothing. Toss does not collect personal information, analytics, or crash logs.',
  },
  {
    heading: 'Data Stored on Your Device',
    body: 'Toss saves a few preferences locally using AsyncStorage. This data never leaves your device.',
    bullets: [
      'Your theme preference (light, dark, or system)',
      'Your voice-assist toggle setting',
    ],
  },
  {
    heading: 'Third-Party Services',
    body:
      'Toss does not include third-party analytics, ad networks, or tracking SDKs. No data is sent to any external server.',
  },
  {
    heading: 'Children’s Privacy',
    body:
      'Toss is appropriate for all ages. Because we do not collect any personal data, no special handling is required for children.',
  },
  {
    heading: 'Removing Your Data',
    body:
      'You can clear every byte the app stores by uninstalling Toss. There is no server-side data to delete.',
  },
  {
    heading: 'Changes to This Policy',
    body:
      'If this policy changes, the "Last updated" date above will reflect the latest revision. Please review it from time to time.',
  },
];

const PrivacyScreen: React.FC = () => (
  <DocumentScreen
    title="Privacy Policy"
    intro={intro}
    lastUpdated="June 2026"
    sections={sections}
    icon="shield-checkmark-outline"
  />
);

export default PrivacyScreen;
