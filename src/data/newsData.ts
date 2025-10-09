export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: 'news' | 'announcement' | 'research' | 'acquisition';
  imageUrl?: string;
  tags: string[];
  featured: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'exhibition' | 'workshop' | 'lecture' | 'tour' | 'conference';
  registrationRequired: boolean;
  registrationUrl?: string;
  imageUrl?: string;
  capacity?: number;
  price?: string;
}

export const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "New Digital Collection: Civil War Letters Now Available Online",
    excerpt:
      "Over 5,000 personal letters from Civil War soldiers and their families have been digitized and are now accessible to researchers worldwide.",
    content: `We are excited to announce the completion of our largest digitization project to date. The Civil War Letters Collection, comprising over 5,000 personal correspondences from soldiers and their families during the American Civil War, is now fully available online.

This remarkable collection provides intimate glimpses into the daily lives, hopes, and fears of those who lived through one of America's most defining periods. The letters span from 1861 to 1865 and include correspondence from both Union and Confederate soldiers, as well as letters from family members on the home front.

Key highlights of the collection include:
- Letters from the Battle of Gettysburg
- Correspondence detailing life in military camps
- Personal accounts of major battles and campaigns
- Letters describing the impact of war on civilian life
- Documentation of the Underground Railroad activities

Each letter has been carefully transcribed and indexed, making them fully searchable by keyword, date, location, and correspondent. The collection also includes detailed metadata about each document, including provenance information and historical context.

This project was made possible through a generous grant from the National Endowment for the Humanities and represents three years of meticulous work by our digitization team and volunteer transcribers.`,
    author: "Dr. Sarah Mitchell",
    publishedAt: "2024-01-15T10:00:00Z",
    category: "announcement",
    imageUrl:
      "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ["civil war", "digitization", "letters", "online collection"],
    featured: true,
  },
  {
    id: "2",
    title: "Archive Receives Major Donation of Industrial Revolution Documents",
    excerpt:
      "A private collector has donated over 2,000 documents related to American industrialization, including rare factory records and worker testimonies.",
    content: `The National Archive is pleased to announce a significant donation from the estate of historian Dr. Robert Hartwell. The collection includes over 2,000 documents spanning the Industrial Revolution period (1760-1840), with particular focus on American manufacturing and labor history.

The donation includes:
- Original factory ledgers and production records
- Worker testimonies and labor union documents
- Technical drawings and patents from early machinery
- Correspondence between factory owners and government officials
- Photographs of early industrial sites and workers

This collection fills important gaps in our industrial history holdings and will be invaluable for researchers studying the transformation of American society during this crucial period. The documents are currently being processed and cataloged, with digitization expected to begin in the spring.

Dr. Hartwell spent over 40 years collecting these materials, and his meticulous documentation and provenance research will greatly assist our archival team in making these resources accessible to the public.`,
    author: "Michael Chen",
    publishedAt: "2024-01-10T14:30:00Z",
    category: "acquisition",
    imageUrl:
      "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: [
      "industrial revolution",
      "donation",
      "labor history",
      "manufacturing",
    ],
    featured: true,
  },
  {
    id: "3",
    title: "Research Fellowship Program Opens for 2024 Applications",
    imageUrl:
      "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=600",

    excerpt:
      "The National Archive is now accepting applications for its prestigious research fellowship program, offering scholars access to unique collections.",
    content: `Applications are now open for the 2024 National Archive Research Fellowship Program. This competitive program provides scholars with unprecedented access to our collections, along with financial support and research facilities.

Fellowship Benefits:
- Stipend of $3,000 per month for up to 6 months
- Dedicated research space in our Reading Room
- Access to restricted collections with special permission
- Mentorship from our senior archivists
- Opportunity to present research findings at our annual symposium

We are particularly interested in research projects that:
- Utilize underexplored collections in our holdings
- Employ innovative methodologies in historical research
- Address questions of broad public interest
- Contribute to digital humanities initiatives

The application deadline is March 15, 2024. Fellowships will begin in September 2024. Applicants must hold a PhD in history or related field, or be advanced graduate students with dissertation committee approval.

For more information and application materials, visit our website or contact our Research Services department.`,
    author: "Dr. Jennifer Walsh",
    publishedAt: "2024-01-08T09:00:00Z",
    category: "announcement",
    tags: ["fellowship", "research", "scholars", "applications"],
    featured: true,
  },
  {
    id: "4",
    title: "New Conservation Lab Opens to Public Tours",
    excerpt:
      "Visitors can now see behind the scenes of document preservation with guided tours of our state-of-the-art conservation laboratory.",
    content: `Starting this month, the National Archive is offering guided tours of our newly renovated conservation laboratory. These behind-the-scenes tours provide visitors with a unique opportunity to see how we preserve and restore historical documents for future generations.

Tour highlights include:
- Demonstration of paper conservation techniques
- Overview of digital preservation methods
- Explanation of environmental controls and storage systems
- Q&A session with professional conservators
- Viewing of current conservation projects

Tours are offered every Friday at 2:00 PM and last approximately 90 minutes. Group size is limited to 12 participants to ensure an intimate and educational experience. Advance registration is required.

The conservation lab features cutting-edge equipment including:
- Climate-controlled work stations
- High-resolution scanning equipment
- Chemical analysis tools
- Specialized lighting systems
- Custom storage solutions

This initiative is part of our ongoing commitment to transparency and public education about the important work of preserving our nation's documentary heritage.`,
    author: "Lisa Rodriguez",
    publishedAt: "2024-01-05T11:15:00Z",
    category: "news",
    imageUrl:
      "https://images.pexels.com/photos/1068166/pexels-photo-1068166.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ["conservation", "tours", "preservation", "public programs"],
    featured: true,
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Founding Fathers: Documents of Democracy Exhibition',
    description: 'Explore original documents from America\'s founding era, including rare drafts of the Constitution and personal letters from the Founding Fathers.',
    date: '2024-02-01',
    time: '10:00 AM - 6:00 PM',
    location: 'Main Exhibition Hall',
    type: 'exhibition',
    registrationRequired: false,
    imageUrl: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 'Free'
  },
  {
    id: '2',
    title: 'Digital Research Methods Workshop',
    description: 'Learn how to effectively search and utilize our digital collections for academic research. Includes hands-on training with our search tools and databases.',
    date: '2024-02-15',
    time: '9:00 AM - 4:00 PM',
    location: 'Research Center, Room 201',
    type: 'workshop',
    registrationRequired: true,
    registrationUrl: 'https://archive.gov/events/register/digital-workshop',
    capacity: 25,
    price: '$50'
  },
  {
    id: '3',
    title: 'Lecture: Women in the Archives - Hidden Stories of American History',
    description: 'Dr. Maria Santos presents her research on women\'s contributions to American history as revealed through archival documents.',
    date: '2024-02-22',
    time: '7:00 PM - 8:30 PM',
    location: 'Auditorium',
    type: 'lecture',
    registrationRequired: true,
    registrationUrl: 'https://archive.gov/events/register/women-archives-lecture',
    capacity: 200,
    price: 'Free'
  },
  {
    id: '4',
    title: 'Behind the Scenes: Archive Vault Tour',
    description: 'Exclusive tour of our climate-controlled storage vaults where millions of documents are preserved. See how we protect our nation\'s documentary heritage.',
    date: '2024-03-01',
    time: '2:00 PM - 3:30 PM',
    location: 'Storage Facility (Level B2)',
    type: 'tour',
    registrationRequired: true,
    registrationUrl: 'https://archive.gov/events/register/vault-tour',
    capacity: 15,
    price: '$25'
  },
  {
    id: '5',
    title: 'Annual Archival Research Conference',
    description: 'Three-day conference featuring presentations from leading historians and archivists. Topics include digital preservation, access policies, and emerging research methodologies.',
    date: '2024-03-15',
    time: '8:00 AM - 6:00 PM',
    location: 'Conference Center',
    type: 'conference',
    registrationRequired: true,
    registrationUrl: 'https://archive.gov/events/register/research-conference',
    capacity: 500,
    price: '$150 (Students: $75)'
  },
  {
    id: '6',
    title: 'Family History Research Workshop',
    description: 'Learn how to trace your family history using archival records. Perfect for beginners, this workshop covers genealogical research techniques and available resources.',
    date: '2024-03-08',
    time: '10:00 AM - 2:00 PM',
    location: 'Research Center, Room 105',
    type: 'workshop',
    registrationRequired: true,
    registrationUrl: 'https://archive.gov/events/register/family-history',
    capacity: 30,
    price: '$35'
  }
];