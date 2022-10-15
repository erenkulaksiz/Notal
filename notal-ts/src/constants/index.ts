function formatStringToColorful(str: TemplateStringsArray | string) {
  return `<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>${str}</span>`;
}

export const CONSTANTS = {
  APP_NAME: "Notal",
  DEFAULT_WORKSPACE_ID_LENGTH: 4,
  DEFAULT_WORKSPACE_THUMBNAIL_GRADIENT: {
    start: "#0eeaed",
    end: "#00575e",
  },
  DEFAULT_WORKSPACE_THUMBNAIL_COLOR: "#666666",
  DEFAULT_WORKSPACE_THUMBNAIL_TYPE: "gradient",
  DEFAULT_WORKSPACE_TITLE: "Untitled",
  MICHAEL:
    "https://i.pinimg.com/474x/78/8f/f7/788ff7a1a2c291a33ea995dc8de5dbcc.jpg",
  LANDING_PAGE_STRINGS: [
    `${formatStringToColorful`Empowering`} user and developer relations`,
    `${formatStringToColorful`New way of`} planning to your projects`,
    `${formatStringToColorful`Empowering`} user feedbacks`,
    `${formatStringToColorful`Featuring`} roadmaps to your users`,
    `${formatStringToColorful`Collaborating`} collaborating with your team to develop together`,
  ],
  LANDING_PAGE_SUBDESC:
    "Open source task management and devrels platform from the future.",
  SEO_DESCRIPTION:
    "Open source task management and devrels platform from the future.",
};
