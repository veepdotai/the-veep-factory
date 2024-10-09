const now = new Date()

export default [
  /* {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2024, 3, 0),
    end: new Date(2024, 3, 1),
  }, */
  {
    id: 1,
    title: 'TOFU Event',
    start: new Date(2024, 5, 20, 9, 0, 0),
    end: new Date(2024, 5, 20, 9, 5, 0),
    isDraggable: true,
    type: "TOFU",
    resource: 1
  },

  {
    id: 2,
    title: 'MOFU Event',
    start: new Date(2024, 5, 20, 10, 0, 0),
    end: new Date(2024, 5, 20, 10, 5, 0),
    isDraggable: true,
    type: "MOFU",
    resource: 2
  },

  {
    id: 3,
    title: 'BOFU Event',
    start: new Date(2024, 5, 20, 16, 0, 0),
    end: new Date(2024, 5, 20, 16, 5, 0),
    isDraggable: true,
    type: "BOFU"
  },

  {
    id: 4,
    title: 'Some Event',
    start: new Date(2024, 3, 9, 0, 0, 0),
    end: new Date(2024, 3, 9, 0, 0, 0),
    allDay: true,
  },
  {
    id: 5,
    title: 'Conference',
    start: new Date(2024, 3, 11),
    end: new Date(2024, 3, 13),
    desc: 'Big conference for important people',
  },
  {
    id: 6,
    title: 'Meeting',
    start: new Date(2024, 3, 12, 10, 30, 0, 0),
    end: new Date(2024, 3, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting',
  },
  {
    id: 7,
    title: 'Lunch',
    start: new Date(2024, 3, 12, 12, 0, 0, 0),
    end: new Date(2024, 3, 12, 13, 0, 0, 0),
    desc: 'Power lunch',
  },
  {
    id: 8,
    title: 'Meeting',
    start: new Date(2024, 3, 12, 14, 0, 0, 0),
    end: new Date(2024, 3, 12, 15, 0, 0, 0),
  },
  {
    id: 9,
    title: 'Happy Hour',
    start: new Date(2024, 3, 12, 17, 0, 0, 0),
    end: new Date(2024, 3, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day',
  },
  {
    id: 10,
    title: 'Dinner',
    start: new Date(2024, 3, 12, 20, 0, 0, 0),
    end: new Date(2024, 3, 12, 21, 0, 0, 0),
  },
  {
    id: 11,
    title: 'Planning Meeting with Paige',
    start: new Date(2024, 3, 13, 8, 0, 0),
    end: new Date(2024, 3, 13, 10, 30, 0),
  },
  {
    id: 12,
    title: 'Inconvenient Conference Call',
    start: new Date(2024, 3, 13, 9, 30, 0),
    end: new Date(2024, 3, 13, 12, 0, 0),
  },
  {
    id: 13,
    title: "Project Kickoff - Lou's Shoes",
    start: new Date(2024, 3, 13, 11, 30, 0),
    end: new Date(2024, 3, 13, 14, 0, 0),
  },
  {
    id: 14,
    title: 'Quote Follow-up - Tea by Tina',
    start: new Date(2024, 3, 13, 15, 30, 0),
    end: new Date(2024, 3, 13, 16, 0, 0),
  },
  {
    id: 15,
    title: 'Late Night Event',
    start: new Date(2024, 3, 17, 19, 30, 0),
    end: new Date(2024, 3, 18, 2, 0, 0),
  },
  {
    id: 16,
    title: 'Late Same Night Event',
    start: new Date(2024, 3, 17, 19, 30, 0),
    end: new Date(2024, 3, 17, 23, 30, 0),
  },
  {
    id: 17,
    title: 'Multi-day Event',
    start: new Date(2024, 3, 20, 19, 30, 0),
    end: new Date(2024, 3, 22, 2, 0, 0),
  },
  {
    id: 18,
    title: 'Today',
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 19,
    title: 'Online Coding Test',
    start: new Date(2024, 3, 14, 17, 30, 0),
    end: new Date(2024, 3, 14, 20, 30, 0),
  },
  {
    id: 20,
    title: 'An overlapped Event',
    start: new Date(2024, 3, 14, 17, 0, 0),
    end: new Date(2024, 3, 14, 18, 30, 0),
  },
  {
    id: 21,
    title: 'Phone Interview',
    start: new Date(2024, 3, 14, 17, 0, 0),
    end: new Date(2024, 3, 14, 18, 30, 0),
  },
  {
    id: 22,
    title: 'Cooking Class',
    start: new Date(2024, 3, 14, 17, 30, 0),
    end: new Date(2024, 3, 14, 19, 0, 0),
  },
  {
    id: 23,
    title: 'Go to the gym',
    start: new Date(2024, 3, 14, 18, 30, 0),
    end: new Date(2024, 3, 14, 20, 0, 0),
  },
  {
    id: 24,
    title: 'DST ends on this day (Europe)',
    start: new Date(2024, 9, 30, 0, 0, 0),
    end: new Date(2024, 9, 30, 4, 30, 0),
  },
  {
    id: 25,
    title: 'DST ends on this day (America)',
    start: new Date(2024, 10, 6, 0, 0, 0),
    end: new Date(2024, 10, 6, 4, 30, 0),
  },
  {
    id: 26,
    title: 'DST starts on this day (America)',
    start: new Date(2024, 2, 12, 0, 0, 0),
    end: new Date(2024, 2, 12, 4, 30, 0),
  },
  {
    id: 27,
    title: 'DST starts on this day (Europe)',
    start: new Date(2024, 2, 26, 0, 0, 0),
    end: new Date(2024, 2, 26, 4, 30, 0),
  },
]