import { Prospect, ICPSegment } from '@/types';

export const mockProspects: Prospect[] = [
  {
    id: '1',
    company: 'Ørsted',
    website: 'https://orsted.com',
    icp_segment: 'Energy',
    status: 'contacted',
    pain_points: [
      'Need to optimize offshore turbine maintenance schedules',
      'Struggling with predictive analytics for equipment downtime',
      'Looking for ML solutions to reduce operational costs by 15%',
      'Current systems lack real-time monitoring capabilities'
    ],
    decision_maker_accessibility: 7,
    budget_authority: 8,
    strategic_fit: 9,
    overall_score: 8.5,
    contacts: [
      {
        id: '1-1',
        name: 'Lars Nielsen',
        role: 'VP of Operations',
        email: 'lars.nielsen@orsted.com',
        linkedin_url: 'linkedin.com/in/lars-nielsen-orsted',
        engagement_score: 7.5,
        messaging_notes: 'Emphasize ROI and proven results in offshore wind. Mention case studies from similar European operators.',
        last_contacted: '2025-01-02'
      },
      {
        id: '1-2',
        name: 'Maria Schmidt',
        role: 'Director of Innovation',
        email: 'maria.schmidt@orsted.com',
        linkedin_url: 'linkedin.com/in/maria-schmidt',
        engagement_score: 6.2,
        messaging_notes: 'Focus on innovation and sustainability angle. She champions new tech adoption.'
      },
      {
        id: '1-3',
        name: 'Henrik Andersen',
        role: 'Chief Technology Officer',
        email: 'henrik.andersen@orsted.com',
        linkedin_url: 'linkedin.com/in/henrik-andersen-cto',
        engagement_score: 8.1,
        messaging_notes: 'Technical decision maker. Wants detailed architecture and integration plans.'
      }
    ],
    conversations: [
      {
        id: 'conv-1-1',
        contact_id: '1-1',
        date: '2025-01-02T10:30:00Z',
        channel: 'linkedin',
        message: 'Hi Lars, saw your recent post about predictive maintenance challenges in offshore wind. We help operators like Ørsted reduce downtime by 40% using AI-driven analytics. Would love to share a quick case study from a similar operation in the North Sea.',
        replied: false,
        sentiment: null
      }
    ],
    next_actions: [
      {
        id: 'action-1-1',
        type: 'follow_up',
        due_date: '2025-01-09T09:00:00Z',
        completed: false,
        notes: 'Reference their recent Siemens partnership announcement. Mention how our solution integrates with existing systems.',
        ai_suggested: true
      }
    ],
    catalyne_dossier_url: 'https://catalyne.com/dossiers/orsted-2025',
    created_at: '2024-12-28T00:00:00Z',
    updated_at: '2025-01-02T10:30:00Z',
    days_in_pipeline: 8,
    deal_value: 450000,
    notes: 'High priority. They have budget allocated for Q1 2025.'
  },
  {
    id: '2',
    company: 'Veolia Water Technologies',
    website: 'https://veoliawatertechnologies.com',
    icp_segment: 'Water',
    status: 'replied',
    pain_points: [
      'Water treatment plants need better real-time quality monitoring',
      'Manual testing causing delays in response times',
      'Regulatory compliance reporting is labor-intensive',
      'Need to detect contamination events faster'
    ],
    decision_maker_accessibility: 8,
    budget_authority: 7,
    strategic_fit: 9,
    overall_score: 8.2,
    contacts: [
      {
        id: '2-1',
        name: 'Sophie Dubois',
        role: 'Global Head of Digital Solutions',
        email: 'sophie.dubois@veolia.com',
        linkedin_url: 'linkedin.com/in/sophiedubois',
        engagement_score: 8.7,
        messaging_notes: 'Very responsive. Interested in pilot programs. Focus on scalability.',
        last_contacted: '2024-12-30'
      }
    ],
    conversations: [
      {
        id: 'conv-2-1',
        contact_id: '2-1',
        date: '2024-12-30T14:15:00Z',
        channel: 'email',
        message: 'Hi Sophie, following up on our conversation at the Water Innovation Summit. Our AI-powered water quality monitoring system can help Veolia detect contamination 10x faster than manual testing.',
        replied: true,
        reply_message: 'Hi! Thanks for reaching out. This sounds interesting. Can you send over some case studies? We\'re particularly interested in solutions that work with our existing SCADA systems.',
        sentiment: 'positive',
        ai_insights: 'High intent signal. Mentioned specific technical requirement (SCADA integration). Ready for technical discussion.'
      },
      {
        id: 'conv-2-2',
        contact_id: '2-1',
        date: '2025-01-03T09:45:00Z',
        channel: 'email',
        message: 'Absolutely! I\'ve attached 3 case studies from similar water treatment facilities. Our system integrates seamlessly with most SCADA platforms including Siemens, Schneider, and Rockwell.',
        replied: false,
        sentiment: null
      }
    ],
    next_actions: [
      {
        id: 'action-2-1',
        type: 'schedule_demo',
        due_date: '2025-01-08T00:00:00Z',
        completed: false,
        notes: 'Propose technical demo with their CTO. Focus on SCADA integration capabilities.',
        ai_suggested: true
      }
    ],
    created_at: '2024-12-22T00:00:00Z',
    updated_at: '2025-01-03T09:45:00Z',
    days_in_pipeline: 14,
    deal_value: 320000,
    notes: 'Hot lead. Sophie has budget authority. Push for demo next week.'
  },
  {
    id: '3',
    company: 'JLL Technologies',
    website: 'https://www.jll.com',
    icp_segment: 'Proptech',
    status: 'meeting_scheduled',
    pain_points: [
      'Building energy consumption analytics are fragmented',
      'Need better tenant engagement platforms',
      'ESG reporting requirements increasing complexity',
      'Lack of unified dashboard for portfolio management'
    ],
    decision_maker_accessibility: 6,
    budget_authority: 9,
    strategic_fit: 8,
    overall_score: 7.8,
    contacts: [
      {
        id: '3-1',
        name: 'Rachel Kim',
        role: 'VP of Innovation & Sustainability',
        email: 'rachel.kim@jll.com',
        linkedin_url: 'linkedin.com/in/rachelkim-proptech',
        engagement_score: 9.1,
        messaging_notes: 'Champions sustainability initiatives. Has direct access to C-suite. Focus on ESG impact.',
        last_contacted: '2025-01-04'
      }
    ],
    conversations: [
      {
        id: 'conv-3-1',
        contact_id: '3-1',
        date: '2024-12-29T11:20:00Z',
        channel: 'linkedin',
        message: 'Rachel, congrats on JLL\'s recent carbon neutrality pledge! Our platform helps property managers reduce building energy consumption by 30% while automating ESG compliance reporting.',
        replied: true,
        reply_message: 'Thanks! This aligns perfectly with our 2025 goals. Let\'s schedule a call.',
        sentiment: 'positive',
        ai_insights: 'Strong buying signal. Mentioned alignment with company goals and requested meeting immediately.'
      },
      {
        id: 'conv-3-2',
        contact_id: '3-1',
        date: '2025-01-04T16:30:00Z',
        channel: 'email',
        message: 'Perfect! I have availability next Tuesday 1/14 at 2pm EST or Wednesday 1/15 at 10am EST. I\'ll send over a brief deck before our call.',
        replied: true,
        reply_message: 'Tuesday works great. Send the calendar invite.',
        sentiment: 'positive'
      }
    ],
    next_actions: [
      {
        id: 'action-3-1',
        type: 'schedule_demo',
        due_date: '2025-01-14T14:00:00Z',
        completed: false,
        notes: 'Demo scheduled for Tuesday 1/14 at 2pm EST. Prepare custom deck highlighting ESG reporting features.',
        ai_suggested: false
      }
    ],
    created_at: '2024-12-28T00:00:00Z',
    updated_at: '2025-01-04T16:30:00Z',
    days_in_pipeline: 8,
    deal_value: 680000,
    notes: 'Very hot. Meeting confirmed. Prepare pricing proposal for enterprise tier.'
  },
  {
    id: '4',
    company: 'BASF New Business',
    website: 'https://www.basf.com',
    icp_segment: 'Material Sciences',
    status: 'proposal_sent',
    pain_points: [
      'R&D lab data management is siloed and inefficient',
      'Material testing workflows need automation',
      'Collaboration between global labs is fragmented',
      'Need AI to predict material properties faster'
    ],
    decision_maker_accessibility: 5,
    budget_authority: 9,
    strategic_fit: 9,
    overall_score: 8.1,
    contacts: [
      {
        id: '4-1',
        name: 'Dr. Klaus Weber',
        role: 'Head of Digital Innovation',
        email: 'klaus.weber@basf.com',
        linkedin_url: 'linkedin.com/in/dr-klaus-weber',
        engagement_score: 7.8,
        messaging_notes: 'Very technical. Wants detailed methodology. Long sales cycle but high deal value.',
        last_contacted: '2025-01-01'
      }
    ],
    conversations: [
      {
        id: 'conv-4-1',
        contact_id: '4-1',
        date: '2024-12-20T10:00:00Z',
        channel: 'email',
        message: 'Dr. Weber, following up from the Materials Innovation Conference. Our AI platform helps R&D teams predict material properties 10x faster, reducing lab testing cycles significantly.',
        replied: true,
        reply_message: 'Interesting. Send me a technical white paper and some validation studies.',
        sentiment: 'neutral',
        ai_insights: 'Cautious but engaged. Needs proof points before moving forward.'
      },
      {
        id: 'conv-4-2',
        contact_id: '4-1',
        date: '2024-12-28T15:20:00Z',
        channel: 'email',
        message: 'Attached is our technical methodology paper and 3 peer-reviewed validation studies. Happy to discuss implementation details.',
        replied: true,
        reply_message: 'Thanks. Let me review with my team. Can you send a formal proposal?',
        sentiment: 'positive'
      },
      {
        id: 'conv-4-3',
        contact_id: '4-1',
        date: '2025-01-01T09:00:00Z',
        channel: 'email',
        message: 'Absolutely. I\'ve prepared a detailed proposal including pilot program scope, timeline, and pricing. Attached here.',
        replied: false,
        sentiment: null
      }
    ],
    next_actions: [
      {
        id: 'action-4-1',
        type: 'follow_up',
        due_date: '2025-01-08T00:00:00Z',
        completed: false,
        notes: 'Follow up on proposal. Offer to present to wider team if needed.',
        ai_suggested: true
      }
    ],
    created_at: '2024-12-18T00:00:00Z',
    updated_at: '2025-01-01T09:00:00Z',
    days_in_pipeline: 18,
    deal_value: 850000,
    notes: 'Long sales cycle expected (3-6 months). Very high value. Stay persistent.'
  },
  {
    id: '5',
    company: 'Suez Recycling',
    website: 'https://www.suez.com',
    icp_segment: 'Waste Valorization',
    status: 'not_contacted',
    pain_points: [
      'Waste sorting accuracy needs improvement',
      'Current systems can\'t identify recyclable materials efficiently',
      'Need better data on contamination rates',
      'Looking to increase recycling yield by 25%'
    ],
    decision_maker_accessibility: 6,
    budget_authority: 7,
    strategic_fit: 8,
    overall_score: 7.2,
    contacts: [
      {
        id: '5-1',
        name: 'Emma Laurent',
        role: 'Innovation Director',
        email: 'emma.laurent@suez.com',
        linkedin_url: 'linkedin.com/in/emmalaurent',
        engagement_score: 6.5,
        messaging_notes: 'Focus on environmental impact and operational efficiency. Mention EU circular economy regulations.',
        last_contacted: undefined
      },
      {
        id: '5-2',
        name: 'Pierre Moreau',
        role: 'Operations Manager',
        email: 'pierre.moreau@suez.com',
        linkedin_url: 'linkedin.com/in/pierremoreau',
        engagement_score: 5.8,
        messaging_notes: 'Day-to-day operations lead. Needs practical, implementable solutions.'
      }
    ],
    conversations: [],
    next_actions: [
      {
        id: 'action-5-1',
        type: 'follow_up',
        due_date: '2025-01-06T00:00:00Z',
        completed: false,
        notes: 'Initial outreach. Reference their recent partnership with Veolia on circular economy initiatives.',
        ai_suggested: true
      }
    ],
    created_at: '2024-12-30T00:00:00Z',
    updated_at: '2024-12-30T00:00:00Z',
    days_in_pipeline: 6,
    deal_value: 380000,
    notes: 'Ready for first outreach. Emma posted about circular economy goals last week - good timing.'
  },
  {
    id: '6',
    company: 'Maersk Digital',
    website: 'https://www.maersk.com',
    icp_segment: 'Logistics & Supply Chain',
    status: 'contacted',
    pain_points: [
      'Container tracking visibility gaps across global routes',
      'Need better predictive analytics for delays',
      'Customer communication about shipment status is manual',
      'Port congestion forecasting needs improvement'
    ],
    decision_maker_accessibility: 7,
    budget_authority: 8,
    strategic_fit: 9,
    overall_score: 8.3,
    contacts: [
      {
        id: '6-1',
        name: 'Anders Møller',
        role: 'Chief Digital Officer',
        email: 'anders.moller@maersk.com',
        linkedin_url: 'linkedin.com/in/andersmoller',
        engagement_score: 7.2,
        messaging_notes: 'Big-picture thinker. Focus on competitive advantage and customer experience improvements.',
        last_contacted: '2025-01-03'
      }
    ],
    conversations: [
      {
        id: 'conv-6-1',
        contact_id: '6-1',
        date: '2025-01-03T13:40:00Z',
        channel: 'linkedin',
        message: 'Anders, saw your keynote at Logistics Innovation Week about supply chain visibility. Our AI platform helps shipping companies predict delays 7 days in advance with 92% accuracy.',
        replied: false,
        sentiment: null
      }
    ],
    next_actions: [
      {
        id: 'action-6-1',
        type: 'follow_up',
        due_date: '2025-01-10T00:00:00Z',
        completed: false,
        notes: 'Follow up with case study from Mediterranean Shipping Company. Highlight 30% reduction in customer complaints.',
        ai_suggested: true
      }
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-03T13:40:00Z',
    days_in_pipeline: 4,
    deal_value: 920000,
    notes: 'Maersk is investing heavily in digital transformation. Large deal potential.'
  },
  {
    id: '7',
    company: 'Philips Healthcare',
    website: 'https://www.philips.com',
    icp_segment: 'Health & Hygiene',
    status: 'negotiating',
    pain_points: [
      'Hospital equipment maintenance is reactive, not predictive',
      'Need to reduce medical device downtime',
      'Service technician routing is inefficient',
      'Looking for AI-driven maintenance scheduling'
    ],
    decision_maker_accessibility: 8,
    budget_authority: 9,
    strategic_fit: 9,
    overall_score: 8.9,
    contacts: [
      {
        id: '7-1',
        name: 'Dr. Sarah van den Berg',
        role: 'VP of Service Operations',
        email: 'sarah.vandenberg@philips.com',
        linkedin_url: 'linkedin.com/in/sarahvandenberg',
        engagement_score: 9.5,
        messaging_notes: 'Very engaged. Loves data-driven approach. Ready to pilot. Negotiating contract terms.',
        last_contacted: '2025-01-04'
      }
    ],
    conversations: [
      {
        id: 'conv-7-1',
        contact_id: '7-1',
        date: '2024-12-15T10:00:00Z',
        channel: 'email',
        message: 'Dr. van den Berg, our predictive maintenance platform has helped GE Healthcare reduce equipment downtime by 45%. Would love to explore a partnership with Philips.',
        replied: true,
        reply_message: 'Very interested. Let\'s set up a technical deep dive.',
        sentiment: 'positive'
      },
      {
        id: 'conv-7-2',
        contact_id: '7-1',
        date: '2024-12-20T14:00:00Z',
        channel: 'meeting',
        message: 'Technical demo completed. Showcased predictive algorithms and ROI calculator.',
        replied: true,
        reply_message: 'Impressive demo. Send me a pilot proposal for our Amsterdam facility.',
        sentiment: 'positive'
      },
      {
        id: 'conv-7-3',
        contact_id: '7-1',
        date: '2024-12-28T16:00:00Z',
        channel: 'email',
        message: 'Pilot proposal sent. 6-month program covering 200 devices at Amsterdam facility.',
        replied: true,
        reply_message: 'Proposal looks good. Our legal team has some questions about data privacy clauses.',
        sentiment: 'neutral'
      },
      {
        id: 'conv-7-4',
        contact_id: '7-1',
        date: '2025-01-04T11:30:00Z',
        channel: 'email',
        message: 'Happy to address any legal concerns. I\'ve cc\'d our Legal team to connect directly with yours.',
        replied: true,
        reply_message: 'Perfect. Let\'s aim to finalize by end of next week.',
        sentiment: 'positive',
        ai_insights: 'Deal closing signal. Timeline established. High confidence close.'
      }
    ],
    next_actions: [
      {
        id: 'action-7-1',
        type: 'negotiate_terms',
        due_date: '2025-01-10T00:00:00Z',
        completed: false,
        notes: 'Work with legal to finalize data privacy clauses. Target signature by 1/10.',
        ai_suggested: false
      }
    ],
    created_at: '2024-12-10T00:00:00Z',
    updated_at: '2025-01-04T11:30:00Z',
    days_in_pipeline: 26,
    deal_value: 1200000,
    notes: 'PRIORITY: Deal closing soon. Stay on top of legal negotiations.'
  },
  {
    id: '8',
    company: 'Schneider Electric',
    website: 'https://www.se.com',
    icp_segment: 'Energy',
    status: 'closed_won',
    pain_points: [
      'Grid management systems need AI-powered load forecasting',
      'Renewable energy integration causing grid instability',
      'Need better demand response capabilities',
      'Legacy systems lack predictive capabilities'
    ],
    decision_maker_accessibility: 9,
    budget_authority: 9,
    strategic_fit: 10,
    overall_score: 9.5,
    contacts: [
      {
        id: '8-1',
        name: 'Jean-Paul Mercier',
        role: 'Global Head of Smart Grid Solutions',
        email: 'jeanpaul.mercier@se.com',
        linkedin_url: 'linkedin.com/in/jeanpaulmercier',
        engagement_score: 10,
        messaging_notes: 'Champion. Signed 3-year contract. Stay engaged for expansion opportunities.',
        last_contacted: '2024-12-30'
      }
    ],
    conversations: [
      {
        id: 'conv-8-1',
        contact_id: '8-1',
        date: '2024-11-15T09:00:00Z',
        channel: 'email',
        message: 'Jean-Paul, our AI-powered grid management solution can help Schneider improve load forecasting accuracy by 40%.',
        replied: true,
        reply_message: 'Let\'s talk. This is a priority for us in 2025.',
        sentiment: 'positive'
      },
      {
        id: 'conv-8-2',
        contact_id: '8-1',
        date: '2024-11-22T10:00:00Z',
        channel: 'meeting',
        message: 'Initial discovery call completed. Identified key requirements and stakeholders.',
        replied: true,
        sentiment: 'positive'
      },
      {
        id: 'conv-8-3',
        contact_id: '8-1',
        date: '2024-12-05T14:00:00Z',
        channel: 'meeting',
        message: 'Technical deep dive with engineering team. Showcased integration capabilities.',
        replied: true,
        sentiment: 'positive'
      },
      {
        id: 'conv-8-4',
        contact_id: '8-1',
        date: '2024-12-18T16:00:00Z',
        channel: 'email',
        message: 'Final proposal sent: 3-year enterprise contract for global deployment.',
        replied: true,
        reply_message: 'Proposal approved! Let\'s get contracts signed before year-end.',
        sentiment: 'positive'
      },
      {
        id: 'conv-8-5',
        contact_id: '8-1',
        date: '2024-12-30T11:00:00Z',
        channel: 'email',
        message: '🎉 Contract signed! Welcome to the team. Kick-off meeting scheduled for 1/15.',
        replied: true,
        reply_message: 'Looking forward to the partnership!',
        sentiment: 'positive',
        ai_insights: 'Deal closed. Focus on successful implementation and identify expansion opportunities.'
      }
    ],
    next_actions: [
      {
        id: 'action-8-1',
        type: 'close_deal',
        due_date: '2025-01-15T00:00:00Z',
        completed: true,
        notes: 'Kick-off meeting scheduled. Prepare implementation roadmap.',
        ai_suggested: false
      }
    ],
    created_at: '2024-11-10T00:00:00Z',
    updated_at: '2024-12-30T11:00:00Z',
    days_in_pipeline: 50,
    deal_value: 2400000,
    notes: 'SUCCESS! Multi-year enterprise deal. Monitor for expansion opportunities in other regions.'
  }
];

// Helper function to calculate pipeline stats
export function calculatePipelineStats(prospects: Prospect[]): any {
  const contacted = prospects.filter(p => p.status !== 'not_contacted').length;
  const replied = prospects.filter(p => p.status === 'replied' || p.status === 'meeting_scheduled' || p.status === 'proposal_sent' || p.status === 'negotiating' || p.status === 'closed_won').length;
  const meetings = prospects.filter(p => p.status === 'meeting_scheduled' || p.status === 'proposal_sent' || p.status === 'negotiating' || p.status === 'closed_won').length;
  const proposals = prospects.filter(p => p.status === 'proposal_sent' || p.status === 'negotiating' || p.status === 'closed_won').length;
  const closed = prospects.filter(p => p.status === 'closed_won').length;
  const totalValue = prospects
    .filter(p => p.status === 'closed_won')
    .reduce((sum, p) => sum + (p.deal_value || 0), 0);

  return {
    total_prospects: prospects.length,
    contacted,
    replied,
    meetings_scheduled: meetings,
    proposals_sent: proposals,
    deals_closed: closed,
    total_deal_value: totalValue,
    conversion_rate: contacted > 0 ? (closed / contacted) * 100 : 0
  };
}