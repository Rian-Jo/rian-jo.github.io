export type ProfileLink = {
  label: string;
  href: string;
};

export type TimelineEntry = {
  title: string;
  organization: string;
  period: string;
  summary: string;
};

export type EducationEntry = {
  degree: string;
  organization: string;
  summary: string;
};

export const profile = {
  name: 'Joonhee Jo',
  headline: 'Robotics Researcher & Engineer',
  currentRole: {
    title: 'Robotics Engineer',
    organization: 'Hyundai Motor Company',
    affiliation: 'Articulated Robotics Team, R&D Division',
  },
  shortBio:
    'Joonhee Jo works on humanoid locomotion, whole-body balance control, and physically interactive robotic systems across legged, wheeled, and manipulation platforms.',
  researchAreas: [
    'Humanoid locomotion and landing stabilization',
    'Whole-body balance control',
    'Contact-aware mobile and articulated robotics',
    'Arm-hand manipulation and teaching interfaces',
  ],
  contactLinks: [
    { label: 'GitHub', href: 'https://github.com/rian-jo' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/joonhee-jo-ba6a3b75/' },
    { label: 'Email', href: 'mailto:allusivejune@gmail.com' },
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCrEDR-C57MYHgk6e9NrG4ug' },
  ] satisfies ProfileLink[],
  experience: [
    {
      title: 'Robotics Engineer',
      organization: 'Hyundai Motor Company',
      period: '2022 - Present',
      summary:
        'Public-facing role centered on articulated robotics, control, and locomotion work connected to Hyundai Motor Company\'s robotics R&D organization.',
    },
    {
      title: 'Humanoid Robotics Researcher',
      organization: 'UST / KIST Humanoid Robotics Lab',
      period: '2011 - 2022',
      summary:
        'Research program spanning robotic hands, dual-arm manipulation, ballbot balance, and humanoid walking at the KIST campus of the University of Science and Technology.',
    },
  ] satisfies TimelineEntry[],
  education: [
    {
      degree: 'Integrated Graduate Study in Robotics Engineering',
      organization: 'University of Science and Technology (KIST Campus)',
      summary: 'Graduate research track focused on humanoid robotics, whole-body control, and motion generation.',
    },
    {
      degree: 'B.S. in Electronic Engineering',
      organization: 'Inha University',
      summary: 'Undergraduate study in electronic engineering.',
    },
    {
      degree: 'A.S. in Mechatronics',
      organization: 'Inha Technical College',
      summary: 'Associate degree in mechatronics.',
    },
  ] satisfies EducationEntry[],
} as const;
