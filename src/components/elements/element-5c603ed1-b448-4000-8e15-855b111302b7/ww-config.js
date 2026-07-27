export default {
  editor: {
    label: {
      en: "FullCalendar",
    },
    icon: "calendar",
    customSettingsPropertiesOrder: [
      "disableInteractions",
      "showHeader",
      {
        label: "View settings",
        isCollapsible: true,
        properties: [
          "locale",
          "timezone",
          "defaultView",
          "yearView",
          "monthView",
          "weekView",
          "dayView",
          "listView",
          "allDaySlot",
          "timeStart",
          "timeEnd",
          "hideWeekends",
          "startWeekOnSunday",
          "hideDaysOfWeek",
        ],
      },
      [
        "events",
        "eventsIdFormula",
        "eventsTitleFormula",
        "eventsStartFormula",
        "eventsEndFormula",
        "eventsAllDayFormula",
        "eventsBackgroundColorFormula",
        "eventsBorderColorFormula",
        "eventsTextColorFormula",
        "eventsUrlFormula",
        "eventsContentFormula",
        "eventsDataFormula",
        "eventsGroupIdFormula",
        "eventsIconFormula",
      ],
      [
        "buttonTextToday",
        "buttonTextYear",
        "buttonTextMonth",
        "buttonTextWeek",
        "buttonTextDay",
        "buttonTextList",
        "noEventsText",
      ],
    ],
    customStylePropertiesOrder: [
      {
        label: "General",
        isCollapsible: true,
        properties: [
          "fontFamily",
          "fontSize",
          "fontWeight",
          "nowIndicatorColor",
        ],
      },
      {
        label: "Header",
        isCollapsible: true,
        properties: [
          "headerBackgroundColor",
          "headerTextColor",
          "headerHeight",
        ],
      },
      {
        label: "Day header",
        isCollapsible: true,
        properties: [
          "dayHeaderBackgroundColor",
          "dayHeaderTextColor",
          "dayHeaderHeight",
          "dayHeaderFontSize",
          "dayHeaderFontWeight",
          "weekendTextColor",
        ],
      },
      {
        label: "Cells",
        isCollapsible: true,
        properties: [
          "todayBackgroundColor",
          "cellBackgroundColor",
          "cellTextColor",
          "cellHeight",
          "cellWidth",
          "otherMonthBackgroundColor",
          "otherMonthTextColor",
        ],
      },
      {
        label: "Time grid",
        isCollapsible: true,
        properties: ["timeGridBackgroundColor"],
      },
      {
        label: "Buttons",
        isCollapsible: true,
        properties: [
          "buttonBackgroundColor",
          "buttonTextColor",
          "buttonHoverBackgroundColor",
          "buttonHoverTextColor",
          "buttonActiveBackgroundColor",
          "buttonActiveTextColor",
          "buttonBorderRadius",
          "todayButtonBackgroundColor",
          "todayButtonTextColor",
          "todayButtonHoverBackgroundColor",
          "todayButtonHoverTextColor",
        ],
      },
      {
        label: "Borders",
        isCollapsible: true,
        properties: ["borderColor"],
      },
      {
        label: "Event Styling",
        isCollapsible: true,
        properties: [
          "defaultEventBackgroundColor",
          "defaultEventBorderColor",
          "defaultEventTextColor",
          "eventBorderRadius",
          "eventPadding",
          "eventMargin",
        ],
      },
      {
        label: "Event Title",
        isCollapsible: true,
        properties: [
          "eventTitleFontSize",
          "eventTitleFontFamily",
          "eventTitleFontWeight",
          "eventTitleColor",
          "eventTitlePosition",
          "eventTitleAlignment",
          "eventTitleMargin",
          "eventTitlePadding",
          "eventTitleBackgroundColor",
          "eventTitleBorderRadius",
        ],
      },
      {
        label: "Event Time",
        isCollapsible: true,
        properties: [
          "eventTimeFontSize",
          "eventTimeFontFamily", 
          "eventTimeFontWeight",
          "eventTimeColor",
          "eventTimePosition",
          "eventTimeAlignment",
          "eventTimeMargin",
          "eventTimePadding",
          "eventTimeBackgroundColor",
          "eventTimeBorderRadius",
        ],
      },
      {
        label: "Event Icon",
        isCollapsible: true,
        properties: [
          "eventIconType",
          "eventIconSize",
          "eventIconColor",
          "eventIconPosition",
          "eventIconMargin",
          "eventIconPadding",
          "eventIconBackgroundColor",
          "eventIconBorderRadius",
        ],
      },
    ],
  },
  properties: {
    // Appearance - Style Tab
    fontFamily: {
      label: { en: "Font family" },
      type: "FontFamily",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    fontSize: {
      label: { en: "Font size" },
      type: "Length",
      section: "style",
      bindable: true,
      responsive: true,
      defaultValue: "14px",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 10, max: 50 },
          { value: "em", label: "em", min: 1, max: 50 },
          { value: "rem", label: "rem", min: 1, max: 50 },
        ],
        noRange: true,
      },

    },
    fontWeight: {
      label: { en: "Font weight" },
      type: "TextSelect",
      section: "style",
      bindable: true,
      responsive: true,
      defaultValue: "400",
      options: {
        options: [
          { value: "100", label: "100 (Thin)" },
          { value: "200", label: "200 (Extra Light)" },
          { value: "300", label: "300 (Light)" },
          { value: "400", label: "400 (Normal)" },
          { value: "500", label: "500 (Medium)" },
          { value: "600", label: "600 (Semi Bold)" },
          { value: "700", label: "700 (Bold)" },
          { value: "800", label: "800 (Extra Bold)" },
          { value: "900", label: "900 (Black)" },
        ],
      },

    },

    // Calendar Colors - Style Tab
    headerBackgroundColor: {
      label: { en: "Background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    headerTextColor: {
      label: { en: "Text color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    dayHeaderBackgroundColor: {
      label: { en: "Background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    dayHeaderTextColor: {
      label: { en: "Text color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    dayHeaderFontSize: {
      label: { en: "Font size" },
      type: "Length",
      section: "style",
      bindable: true,
      responsive: true,
      defaultValue: "14px",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 10, max: 50 },
          { value: "em", label: "em", min: 1, max: 50 },
          { value: "rem", label: "rem", min: 1, max: 50 },
        ],
        noRange: true,
      },

    },
    dayHeaderFontWeight: {
      label: { en: "Font weight" },
      type: "TextSelect",
      section: "style",
      bindable: true,
      responsive: true,
      defaultValue: "400",
      options: {
        options: [
          { value: "100", label: "100 (Thin)" },
          { value: "200", label: "200 (Extra Light)" },
          { value: "300", label: "300 (Light)" },
          { value: "400", label: "400 (Normal)" },
          { value: "500", label: "500 (Medium)" },
          { value: "600", label: "600 (Semi Bold)" },
          { value: "700", label: "700 (Bold)" },
          { value: "800", label: "800 (Extra Bold)" },
          { value: "900", label: "900 (Black)" },
        ],
      },

    },
    todayBackgroundColor: {
      label: { en: "Today background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "rgba(255, 220, 40, 0.15)",

    },
    cellBackgroundColor: {
      label: { en: "Background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    cellTextColor: {
      label: { en: "Text color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    cellHeight: {
      label: { en: "Cell height" },
      type: "Length",
      section: "style",
      bindable: true,
      responsive: true,
      defaultValue: null,
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 20, max: 200 },
          { value: "em", label: "em", min: 1, max: 20 },
          { value: "rem", label: "rem", min: 1, max: 20 },
          { value: "%", label: "%", min: 1, max: 100 },
        ],
      },

    },
    cellWidth: {
      label: { en: "Cell width" },
      type: "Length",
      section: "style",
      bindable: true,
      responsive: true,
      defaultValue: null,
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 20, max: 200 },
          { value: "em", label: "em", min: 1, max: 20 },
          { value: "rem", label: "rem", min: 1, max: 20 },
          { value: "%", label: "%", min: 1, max: 100 },
        ],
      },

    },
    weekendTextColor: {
      label: { en: "Weekend text color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    otherMonthBackgroundColor: {
      label: { en: "Other month background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    otherMonthTextColor: {
      label: { en: "Other month text" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },

    // Button Styling - Style Tab
    buttonBackgroundColor: {
      label: { en: "Background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#2C3E50",

    },
    buttonTextColor: {
      label: { en: "Text color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#FFFFFF",

    },
    buttonHoverBackgroundColor: {
      label: { en: "Hover background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#1e2b37",

    },
    buttonHoverTextColor: {
      label: { en: "Hover text" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#FFFFFF",

    },
    buttonActiveBackgroundColor: {
      label: { en: "Active background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#1a252f",

    },
    buttonActiveTextColor: {
      label: { en: "Active text color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#FFFFFF",

    },

    buttonBorderRadius: {
      label: { en: "Border radius" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "4px",

    },

    todayButtonBackgroundColor: {
      label: { en: "Today button background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    todayButtonTextColor: {
      label: { en: "Today button text color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    todayButtonHoverBackgroundColor: {
      label: { en: "Today button hover background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    todayButtonHoverTextColor: {
      label: { en: "Today button hover text color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },

    // Border Styling - Style Tab
    borderColor: {
      label: { en: "Color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#ddd",

    },

    // Event Base Styling
    eventPadding: {
      label: { en: "Event padding" },
      type: "Text",
      section: "style",
      bindable: true,
      defaultValue: "4px",

    },
    eventMargin: {
      label: { en: "Event margin" },
      type: "Text",
      section: "style",
      bindable: true,
      defaultValue: "1px",

    },

    // Event Styling - Style Tab
    defaultEventBackgroundColor: {
      label: { en: "Background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#3788d8",

    },
    defaultEventBorderColor: {
      label: { en: "Border" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#3788d8",

    },
    defaultEventTextColor: {
      label: { en: "Text color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#ffffff",

    },

    eventBorderRadius: {
      label: { en: "Event border radius" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "10px",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 0, max: 50 },
          { value: "em", label: "em", min: 0, max: 5 },
          { value: "rem", label: "rem", min: 0, max: 5 },
          { value: "%", label: "%", min: 0, max: 50 },
        ],
      },

    },

    // Event Title Styling
    eventTitleFontSize: {
      label: { en: "Title font size" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "0.8em",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 24 },
          { value: "em", label: "em", min: 0.5, max: 2 },
          { value: "rem", label: "rem", min: 0.5, max: 2 },
        ],
      },

    },

    eventTitleFontFamily: {
      label: { en: "Title font family" },
      type: "FontFamily",
      section: "style",
      bindable: true,
      defaultValue: null,

    },

    eventTitleFontWeight: {
      label: { en: "Title font weight" },
      type: "TextSelect",
      section: "style",
      bindable: true,
      defaultValue: "600",
      options: {
        options: [
          { value: "100", label: "100 (Thin)" },
          { value: "200", label: "200 (Extra Light)" },
          { value: "300", label: "300 (Light)" },
          { value: "400", label: "400 (Normal)" },
          { value: "500", label: "500 (Medium)" },
          { value: "600", label: "600 (Semi Bold)" },
          { value: "700", label: "700 (Bold)" },
          { value: "800", label: "800 (Extra Bold)" },
          { value: "900", label: "900 (Black)" },
        ],
      },

    },

    eventTitleColor: {
      label: { en: "Title color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#ffffff",

    },

    eventTitlePosition: {
      label: { en: "Title position" },
      type: "TextSelect",
      section: "style",
      bindable: true,
      defaultValue: "top",
      options: {
        options: [
          { value: "top", label: "Top" },
          { value: "middle", label: "Middle" },
          { value: "bottom", label: "Bottom" },
        ],
      },

    },

    eventTitleAlignment: {
      label: { en: "Title alignment" },
      type: "TextSelect",
      section: "style",
      bindable: true,
      defaultValue: "left",
      options: {
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ],
      },

    },

    eventTitleMargin: {
      label: { en: "Title margin" },
      type: "Text",
      section: "style",
      bindable: true,
      defaultValue: "0px",

    },

    eventTitlePadding: {
      label: { en: "Title padding" },
      type: "Text",
      section: "style",
      bindable: true,
      defaultValue: "0px",

    },

    eventTitleBackgroundColor: {
      label: { en: "Title background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "transparent",

    },

    eventTitleBorderRadius: {
      label: { en: "Title border radius" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "0px",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 0, max: 20 },
          { value: "em", label: "em", min: 0, max: 2 },
          { value: "rem", label: "rem", min: 0, max: 2 },
          { value: "%", label: "%", min: 0, max: 50 },
        ],
      },

    },

    // Event Time Styling
    eventTimeFontSize: {
      label: { en: "Time font size" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "0.7em",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 20 },
          { value: "em", label: "em", min: 0.5, max: 1.5 },
          { value: "rem", label: "rem", min: 0.5, max: 1.5 },
        ],
      },

    },

    eventTimeFontFamily: {
      label: { en: "Time font family" },
      type: "FontFamily",
      section: "style",
      bindable: true,
      defaultValue: null,

    },

    eventTimeFontWeight: {
      label: { en: "Time font weight" },
      type: "TextSelect",
      section: "style",
      bindable: true,
      defaultValue: "400",
      options: {
        options: [
          { value: "100", label: "100 (Thin)" },
          { value: "200", label: "200 (Extra Light)" },
          { value: "300", label: "300 (Light)" },
          { value: "400", label: "400 (Normal)" },
          { value: "500", label: "500 (Medium)" },
          { value: "600", label: "600 (Semi Bold)" },
          { value: "700", label: "700 (Bold)" },
          { value: "800", label: "800 (Extra Bold)" },
          { value: "900", label: "900 (Black)" },
        ],
      },

    },

    eventTimeColor: {
      label: { en: "Time color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#ffffff",

    },

    eventTimePosition: {
      label: { en: "Time position" },
      type: "TextSelect",
      section: "style",
      bindable: true,
      defaultValue: "top",
      options: {
        options: [
          { value: "top", label: "Top" },
          { value: "middle", label: "Middle" },
          { value: "bottom", label: "Bottom" },
        ],
      },

    },

    eventTimeAlignment: {
      label: { en: "Time alignment" },
      type: "TextSelect",
      section: "style",
      bindable: true,
      defaultValue: "left",
      options: {
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ],
      },

    },

    eventTimeMargin: {
      label: { en: "Time margin" },
      type: "Text",
      section: "style",
      bindable: true,
      defaultValue: "0px",

    },

    eventTimePadding: {
      label: { en: "Time padding" },
      type: "Text",
      section: "style",
      bindable: true,
      defaultValue: "0px",

    },

    eventTimeBackgroundColor: {
      label: { en: "Time background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "transparent",

    },

    eventTimeBorderRadius: {
      label: { en: "Time border radius" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "0px",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 0, max: 20 },
          { value: "em", label: "em", min: 0, max: 2 },
          { value: "rem", label: "rem", min: 0, max: 2 },
          { value: "%", label: "%", min: 0, max: 50 },
        ],
      },

    },

    // Event Icon Styling
    eventIconType: {
      label: { en: "Event icon" },
      type: "SystemIcon",
      section: "style",
      bindable: true,
      states: true,

    },

    eventIconSize: {
      label: { en: "Icon size" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "16px",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 32 },
          { value: "em", label: "em", min: 0.5, max: 2 },
          { value: "rem", label: "rem", min: 0.5, max: 2 },
        ],
      },

    },

    eventIconColor: {
      label: { en: "Icon color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "#ffffff",

    },

    eventIconPosition: {
      label: { en: "Icon position" },
      type: "TextSelect",
      section: "style",
      bindable: true,
      defaultValue: "top-right",
      options: {
        options: [
          { value: "top-left", label: "Top Left" },
          { value: "top-right", label: "Top Right" },
          { value: "bottom-left", label: "Bottom Left" },
          { value: "bottom-right", label: "Bottom Right" },
        ],
      },

    },

    eventIconMargin: {
      label: { en: "Icon margin" },
      type: "Text",
      section: "style",
      bindable: true,
      defaultValue: "0px",

    },

    eventIconPadding: {
      label: { en: "Icon padding" },
      type: "Text",
      section: "style",
      bindable: true,
      defaultValue: "0px",

    },

    eventIconBackgroundColor: {
      label: { en: "Icon background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "transparent",

    },

    eventIconBorderRadius: {
      label: { en: "Icon border radius" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "0px",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 0, max: 20 },
          { value: "em", label: "em", min: 0, max: 2 },
          { value: "rem", label: "rem", min: 0, max: 2 },
          { value: "%", label: "%", min: 0, max: 50 },
        ],
      },

    },

    headerHeight: {
      label: { en: "Header height" },
      type: "Length",
      section: "style",
      bindable: true,
      responsive: true,
      defaultValue: null,

    },
    dayHeaderHeight: {
      label: { en: "Day header height" },
      type: "Length",
      section: "style",
      bindable: true,
      responsive: true,
      defaultValue: null,

    },

    nowIndicatorColor: {
      label: { en: "Now indicator Color" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: "red",

    },

    // View Settings - Settings Tab
    locale: {
      label: { en: "Locale" },
      type: "TextSelect",
      section: "settings",
      bindable: true,
      defaultValue: "auto",
      options: {
        options: [
          { value: "auto", label: "Current Lang" },
          { value: "en", label: "English" },
          { value: "fr", label: "French" },
          { value: "es", label: "Spanish" },
          { value: "de", label: "German" },
          { value: "it", label: "Italian" },
          { value: "pt", label: "Portuguese" },
          { value: "ru", label: "Russian" },
          { value: "zh-cn", label: "Chinese (Simplified)" },
          { value: "ja", label: "Japanese" },
          { value: "ar", label: "Arabic" },
        ],
      },

    },
    yearView: {
      label: { en: "Year view" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      responsive: true,
      defaultValue: true,

    },
    monthView: {
      label: { en: "Month view" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      responsive: true,
      defaultValue: true,

    },
    weekView: {
      label: { en: "Week view" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      responsive: true,
      defaultValue: true,

    },
    dayView: {
      label: { en: "Day view" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      responsive: true,
      defaultValue: true,

    },
    listView: {
      label: { en: "List view" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      responsive: true,
      defaultValue: true,

    },
    defaultView: {
      label: { en: "Default view" },
      type: "TextSelect",
      section: "settings",
      bindable: true,
      responsive: true,
      defaultValue: "dayGridMonth",
      options: {
        options: [
          { value: "multiMonthYear", label: "Year" },
          { value: "dayGridMonth", label: "Month" },
          { value: "timeGridWeek", label: "Week" },
          { value: "timeGridDay", label: "Day" },
          { value: "listWeek", label: "List" },
        ],
      },

    },
    timezone: {
      label: { en: "Timezone" },
      type: "TextSelect",
      section: "settings",
      bindable: true,
      defaultValue: "local",
      options: {
        options: [
          { value: "local", label: "Local Browser Time" },
          { value: "UTC", label: "UTC" },
          { value: "America/New_York", label: "America/New_York" },
          { value: "America/Chicago", label: "America/Chicago" },
          { value: "America/Denver", label: "America/Denver" },
          { value: "America/Los_Angeles", label: "America/Los_Angeles" },
          { value: "Europe/London", label: "Europe/London" },
          { value: "Europe/Paris", label: "Europe/Paris" },
          { value: "Europe/Berlin", label: "Europe/Berlin" },
          { value: "Asia/Tokyo", label: "Asia/Tokyo" },
          { value: "Asia/Shanghai", label: "Asia/Shanghai" },
          { value: "Australia/Sydney", label: "Australia/Sydney" },
        ],
      },

    },
    allDaySlot: {
      label: { en: "Show all-day events" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: true,

    },
    timeStart: {
      label: { en: "Time start" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "00:00:00",

    },
    timeEnd: {
      label: { en: "Time end" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "24:00:00",

    },
    hideWeekends: {
      label: { en: "Hide weekends" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false,

    },
    startWeekOnSunday: {
      label: { en: "Start week on Sunday" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false,

    },
    hideDaysOfWeek: {
      label: { en: "Hide days of week" },
      type: "Array",
      section: "settings",
      bindable: true,
      defaultValue: [],
      options: {
        expandable: true,
        getItemLabel(item) {
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          return days[item] || `Day ${item}`;
        },
        item: {
          type: "TextSelect",
          defaultValue: 0,
          options: {
            options: [
              { value: 0, label: "Sunday" },
              { value: 1, label: "Monday" },
              { value: 2, label: "Tuesday" },
              { value: 3, label: "Wednesday" },
              { value: 4, label: "Thursday" },
              { value: 5, label: "Friday" },
              { value: 6, label: "Saturday" },
            ],
          },
        },
      },

    },

    // Events
    events: {
      label: { en: "Events" },
      type: "Array",
      section: "settings",
      bindable: true,
      defaultValue: [
        {
          id: "event1",
          title: "Sample Event",
          start: new Date().toISOString(),
          end: new Date(new Date().getTime() + 3600000).toISOString(),
          allDay: false,
          backgroundColor: "#3788d8",
          borderColor: "#3788d8",
          textColor: "#ffffff",
          content: "This is a sample event",
          icon: "",
          groupId: "",
        },
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item.title || "Untitled Event";
        },
        item: {
          type: "Object",
          defaultValue: {
            id: "123",
            title: "Sample Event",
            content: "This is a sample event",
            start: "",
            end: "",
            allDay: false,
            backgroundColor: "#3788d8",
            borderColor: "#3788d8",
            textColor: "#ffffff",
            icon: "",
            data: null,
            groupId: null,
          },
          options: {
            item: {
              id: {
                label: { en: "ID" },
                type: "Text",
                options: { placeholder: "Event ID" },
              },
              title: {
                label: { en: "Title" },
                type: "Text",
                options: { placeholder: "Event Title" },
              },
              content: {
                label: { en: "Content" },
                type: "Textarea",
                options: { placeholder: "Event Description" },
              },
              start: {
                label: { en: "Start" },
                type: "Text",
                options: { placeholder: "YYYY-MM-DDTHH:MM:SS" },
              },
              end: {
                label: { en: "End" },
                type: "Text",
                options: { placeholder: "YYYY-MM-DDTHH:MM:SS" },
              },
              allDay: {
                label: { en: "All Day" },
                type: "OnOff",
              },
              backgroundColor: {
                label: { en: "Background Color" },
                type: "Color",
              },
              borderColor: {
                label: { en: "Border Color" },
                type: "Color",
              },
              textColor: {
                label: { en: "Text Color" },
                type: "Color",
              },
              icon: {
                label: { en: "Icon" },
                type: "Text",
                options: {
                  placeholder: "Icon name from WeWeb library, or raw <svg>...</svg> markup",
                },
              },
              data: {
                label: { en: "Data" },
                type: "Text",
                options: { placeholder: '{ "key": "value" }' },
              },
              groupId: {
                label: { en: "Group ID" },
                type: "Text",
                options: { placeholder: "Group ID" },
              },
            },
          },
        },
      },

    },
    // Event property mapping fields
    eventsIdFormula: {
      label: { en: "ID Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['id']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsTitleFormula: {
      label: { en: "Title Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['title']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsStartFormula: {
      label: { en: "Start Date Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['start']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsEndFormula: {
      label: { en: "End Date Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['end']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsAllDayFormula: {
      label: { en: "All Day Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['allDay']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsBackgroundColorFormula: {
      label: { en: "Background Color Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['backgroundColor']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsBorderColorFormula: {
      label: { en: "Border Color Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['borderColor']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsTextColorFormula: {
      label: { en: "Text Color Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['textColor']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsUrlFormula: {
      label: { en: "URL Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['url']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsContentFormula: {
      label: { en: "Content Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['content']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsDataFormula: {
      label: { en: "Data Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['data']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsGroupIdFormula: {
      label: { en: "Group ID Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['groupId']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.events) || !content.events?.length || !boundProps.events,
    },
    eventsIconFormula: {
      label: { en: "Icon Field" },
      type: "Formula",
      section: "settings",
      options: (content) => ({
        template: Array.isArray(content.events) && content.events.length > 0 ? content.events[0] : null,
      }),
      defaultValue: {
        type: "f",
        code: "context.mapping?.['icon']",
      },
    },

    buttonTextToday: {
      label: { en: '"Today" button text' },
      type: "Text",
      section: "settings",
      multilang: true,
      bindable: true,
      defaultValue: "",

    },
    buttonTextYear: {
      label: { en: '"Year" button text' },
      type: "Text",
      section: "settings",
      multilang: true,
      bindable: true,
      defaultValue: "",

    },
    buttonTextMonth: {
      label: { en: '"Month" button text' },
      type: "Text",
      section: "settings",
      multilang: true,
      bindable: true,
      defaultValue: "",

    },
    buttonTextWeek: {
      label: { en: '"Week" button text' },
      type: "Text",
      section: "settings",
      multilang: true,
      bindable: true,
      defaultValue: "",

    },
    buttonTextDay: {
      label: { en: '"Day" button text' },
      type: "Text",
      section: "settings",
      multilang: true,
      bindable: true,
      defaultValue: "",

    },
    buttonTextList: {
      label: { en: '"List" button text' },
      type: "Text",
      section: "settings",
      multilang: true,
      bindable: true,
      defaultValue: "",

    },
    noEventsText: {
      label: { en: "No events text" },
      type: "Text",
      section: "settings",
      multilang: true,
      bindable: true,
      defaultValue: "",

    },

    timeGridBackgroundColor: {
      label: { en: "Background" },
      type: "Color",
      section: "style",
      bindable: true,
      defaultValue: null,

    },
    showHeader: {
      label: { en: "Header" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: true,

    },
    disableInteractions: {
      label: { en: "Readonly" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false,

    },
  },
  triggerEvents: [
    {
      name: "eventClick",
      label: { en: "On event click" },
      event: {
        value: {
          id: "event1",
          title: "Sample Event",
          start: new Date().toISOString(),
          end: new Date(new Date().getTime() + 3600000).toISOString(),
          allDay: false,
          backgroundColor: "#3788d8",
          borderColor: "#3788d8",
          textColor: "#ffffff",
          content: "This is a sample event",
          icon: "",
        },
      },
    },
    {
      name: "viewChange",
      label: { en: "On view change" },
      event: {
        value: {
          view: "dayGridMonth",
          start: new Date().toISOString(),
          end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          title: "Month View",
        },
      },
    },
    {
      name: "eventCreated",
      label: { en: "On event created" },
      event: {
        value: {
          start: new Date().toISOString(),
          end: new Date(new Date().getTime() + 3600000).toISOString(),
          allDay: false,
        },
      },
    },
    {
      name: "eventUpdated",
      label: { en: "On event updated" },
      event: {
        value: {
          id: "event1",
          title: "Updated Event",
          start: new Date().toISOString(),
          end: new Date(new Date().getTime() + 3600000).toISOString(),
          allDay: false,
          backgroundColor: "#3788d8",
          borderColor: "#3788d8",
          textColor: "#ffffff",
          content: "This event was updated",
          icon: "",
        },
      },
    },
    {
      name: "eventDragStart",
      label: { en: "On event drag start" },
      event: {
        value: {
          id: "event1",
          title: "Dragging Event",
          start: new Date().toISOString(),
          end: new Date(new Date().getTime() + 3600000).toISOString(),
          allDay: false,
          icon: "",
        },
      },
    },
    {
      name: "eventDragEnd",
      label: { en: "On event drag end" },
      event: {
        value: {
          id: "event1",
          title: "Dragged Event",
          start: new Date().toISOString(),
          end: new Date(new Date().getTime() + 3600000).toISOString(),
          allDay: false,
          icon: "",
        },
      },
    },
    {
      name: "eventDrop",
      label: { en: "On event drop" },
      event: {
        value: {
          id: "event1",
          title: "Dropped Event",
          start: new Date().toISOString(),
          end: new Date(new Date().getTime() + 3600000).toISOString(),
          allDay: false,
          delta: { days: 1, milliseconds: 0 },
          icon: "",
        },
      },
    },
    {
      name: "eventResizeStart",
      label: { en: "On event resize start" },
      event: {
        value: {
          id: "event1",
          title: "Resizing Event",
          start: new Date().toISOString(),
          end: new Date(new Date().getTime() + 3600000).toISOString(),
          allDay: false,
          icon: "",
        },
      },
    },
    {
      name: "eventResize",
      label: { en: "On event resize" },
      event: {
        value: {
          id: "event1",
          title: "Resized Event",
          start: new Date().toISOString(),
          end: new Date(new Date().getTime() + 7200000).toISOString(),
          allDay: false,
          startDelta: { days: 0, milliseconds: 0 },
          endDelta: { days: 0, milliseconds: 3600000 },
          icon: "",
        },
      },
    },
  ],
  actions: [
    {
      action: "changeView",
      label: { en: "Change view" },
      args: [
        {
          name: "viewName",
          type: "select",
          options: [
            { value: "multiMonthYear", label: "multiMonthYear" },
            { value: "dayGridMonth", label: "dayGridMonth" },
            { value: "timeGridWeek", label: "timeGridWeek" },
            { value: "timeGridDay", label: "timeGridDay" },
            { value: "listWeek", label: "listWeek" },
          ],
        },
      ],
    },
    {
      action: "goToDate",
      label: { en: "Go to date" },
      args: [
        {
          name: "date",
          type: "string",
        },
      ],
    },
    {
      action: "next",
      label: { en: "Next period" },
    },
    {
      action: "prev",
      label: { en: "Previous period" },
    },
    {
      action: "today",
      label: { en: "Go to today" },
    },
  ],
};