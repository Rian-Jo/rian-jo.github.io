export const site = {
  title: 'Joonhee Jo',
  description:
    'Research-first homepage for Joonhee Jo, focused on humanoid robotics, whole-body control, publications, projects, and technical writing.',
  url: 'https://rian-jo.github.io',
  heroTitle: 'Robotics research shaped by contact, balance, and whole-body control.',
  heroSummary:
    'I build and study robotic systems that move reliably, interact physically, and make high-dimensional control problems tractable in the real world.',
  nav: [
    { href: '/research/', label: 'Research' },
    { href: '/projects/', label: 'Projects' },
    { href: '/publications/', label: 'Publications' },
    { href: '/writing/', label: 'Writing' },
    { href: '/about/', label: 'About' },
    { href: '/cv/', label: 'CV' },
    { href: '/contact/', label: 'Contact' },
  ],
  researchFocus: [
    {
      title: 'Humanoid locomotion',
      summary:
        'Robust walking, landing stabilization, and impedance or admittance control for humanoids on uneven terrain.',
    },
    {
      title: 'Whole-body balance control',
      summary:
        'Task-space and momentum-based methods for balancing articulated robots with physical constraints and uncertain contact.',
    },
    {
      title: 'Interactive manipulation',
      summary:
        'Dual-arm teaching, robotic hands, and physically interactive systems that transfer contact intent into reliable motion.',
    },
  ],
  selectedPublicationKeys: ['IROS2020', 'ICRA2021', 'UR2020', 'RAS2021'],
  selectedProjectSlugs: ['humanoid-walking', 'ballbot-balance', 'robotic-hands', 'whole-body-teaching'],
} as const;
