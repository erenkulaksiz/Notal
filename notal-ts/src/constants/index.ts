function formatStringToColorful(str: TemplateStringsArray | string) {
  return `<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>${str}</span>`;
}

export const CONSTANTS = {
  APP_NAME: "Notal",
  APP_VERSION: "2.1.4",
  DEFAULT_WORKSPACE_ID_LENGTH: 4,
  DEFAULT_WORKSPACE_THUMBNAIL_GRADIENT: {
    start: "#0eeaed",
    end: "#00575e",
  },
  DEFAULT_WORKSPACE_THUMBNAIL_COLOR: "#666666",
  DEFAULT_WORKSPACE_THUMBNAIL_TYPE: "gradient",
  MICHAEL:
    "https://i.pinimg.com/474x/78/8f/f7/788ff7a1a2c291a33ea995dc8de5dbcc.jpg",
  LANDING_PAGE_STRINGS: [
    `${formatStringToColorful`Empowering`} user and developer relations`,
    `${formatStringToColorful`New way of`} planning to your projects`,
    `${formatStringToColorful`Empowering`} user feedbacks`,
    `${formatStringToColorful`Featuring`} roadmaps to your users`,
    `${formatStringToColorful`Collaborating`} with your team to develop together`,
  ],
  LANDING_PAGE_SUBDESC:
    "Open source task management and devrels platform from the future.",
  SEO_DESCRIPTION:
    "Open source task management and devrels platform from the future.",
  SEO_APP_NAME: "notal.app",
  SEO_APP_LINK: "https://notal.app",
  SEO_APP_TWIITER: "@notalapp",
  SEO_APP_THEME_COLOR: "#292524",
  SEO_APP_AUTHOR: "@erencode",
  PLACEHOLDER_WORKSPACE_CARD_TITLES: [
    "Buy grociries",
    "Buy a new laptop",
    "Buy a new phone",
    "Buy a new car",
    "Buy a new house",
    "Fix the car",
    "Fix bug #123",
    "Fix bug #456",
    "Fix bug #789",
    "Fix bug #101",
    "Fix bug #102",
    "Fix bug #103",
    "[TODO]: Fix bug #104",
    "[TODO]: Fix bug #105",
    "[FEAT]: #112",
  ],
  PLACEHOLDER_WORKSPACE_TITLES: [
    "My first workspace",
    "Project #1",
    "My project",
    "Hello world",
  ],
  PLACEHOLDER_WORKSPACE_FIELD_TITLES: [
    "To do",
    "In progress",
    "Done",
    "Completed",
    "Finished",
    "Fixed",
    "Fixed bugs",
    "Fixed bugs #123",
    "Fixed bugs #456",
  ],
};
