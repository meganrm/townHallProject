export const searchFilters = {
  party: ['Democratic', 'Republican', 'Independent'],
  meetingType: [
    {
      type: 'Town Hall',
      description: 'An open forum where lawmakers give legislative updates and answer unfiltered questions from constituents.'
    },
    {
      type: 'Empty Chair Town Hall',
      description: 'A constituent-organized town hall held with or without the invited lawmaker.'
    },
    {
      type: 'Adopt-A-District/State',
      description: 'A constituent-organized town hall featuring a lawmaker from another district'
    },
    {
      type: 'Office Hours',
      description: "Opportunity to meet and question a lawmaker's staff. Usually held in district offices but sometimes are 'mobile office hours.'"
    },
    {
      type: 'Campaign Town Hall',
      description: 'A town hall organized by a candidate for office - whether an incumbent or challenger. (Town Hall Project includes these events as a public resource--not to endorse a particular candidate or campaign).'
    },
    {
      type: 'Ticketed Event',
      description: 'Paid events. Typically fundraisers. (Town Hall Project occasionally includes these events as a public resource--not to endorse a particular candidate or campaign).'
    },
    {
      type: 'Tele-Town Hall',
      description: 'A town hall conducted by conference call or online.'
    },
    {
      type: 'Campaign Tele-Town Hall'
    },
    {
      type: 'Youth Vote'
    },
    {
      type: 'Voting Rights'
    },
    {
      type: 'Other'
    }
  ],
  sortOn: ['Date', 'State', 'Name']
}

// TODO: Having no filters should not hide the data. 
export const defaultSearchFilters = {
  party: ['Democratic', 'Republican', 'Independent'],
  meetingType: [
    'Town Hall',
    'Empty Chair Town Hall',
    'Campaign Town Hall',
    'Youth Vote',
    'Voting Rights',
    'Other'
    'Tele-Town Hall'
  ],
  sortOn: 'Date'
}
