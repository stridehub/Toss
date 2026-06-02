import React from 'react';
import DocumentScreen, { DocSection } from '../components/DocumentScreen';

const intro =
  'By installing or using Toss you agree to these terms. Please read them carefully before flipping.';

const sections: DocSection[] = [
  {
    heading: 'Acceptance of Terms',
    body:
      'Opening the app counts as acceptance. If you do not agree to these terms, do not use Toss.',
  },
  {
    heading: 'Use of the App',
    body: 'Toss is provided for personal entertainment. You agree to use it for lawful purposes only.',
    bullets: [
      'No reverse engineering or scraping of the app',
      'No use of the app to make legally binding decisions',
      'No use in regulated gambling contexts',
    ],
  },
  {
    heading: 'No Warranty',
    body:
      'Coin results are produced by JavaScript Math.random — a pseudo-random source. The app is provided "as is" without warranty of any kind. The authors are not liable for any outcomes that follow from a flip.',
  },
  {
    heading: 'Intellectual Property',
    body:
      'The Toss name, design, and source code are owned by STRIDEHUB. You may not redistribute or resell the app without written permission.',
  },
  {
    heading: 'Changes to These Terms',
    body:
      'These terms may be updated from time to time. Continued use of the app constitutes acceptance of any updated terms.',
  },
];

const TermsScreen: React.FC = () => (
  <DocumentScreen
    title="Terms & Conditions"
    intro={intro}
    lastUpdated="June 2026"
    sections={sections}
    icon="document-text-outline"
  />
);

export default TermsScreen;
