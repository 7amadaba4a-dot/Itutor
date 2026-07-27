import events from './src/events.json';
import properties from './src/properties.json';

export default {
editor: {
  label: {
    en: 'despia-event-proxy'
  },
  icon: 'code'
},
properties: {
  eventsConfig: {
    label: { en: 'Events Configuration' },
    type: 'Textarea',
    bindable: true,
    defaultValue: JSON.stringify(events, null, 2),
    section: 'settings',
  },
  propertiesConfig: {
    label: { en: 'Properties Configuration' },
    type: 'Textarea',
    bindable: true,
    defaultValue: JSON.stringify(properties, null, 2),
    section: 'settings',
  },
  runtimeJs: {
    label: { en: 'Runtime JavaScript' },
    type: 'Script',
    bindable: true,
    defaultValue: '// JavaScript',
    section: 'settings',
  },
  // Dynamically generate properties from properties.json
  ...properties.reduce((acc, prop) => {
    acc[prop.name] = {
      label: { en: prop.label },
      type: prop.type === 'boolean' ? 'OnOff' : 
            prop.type === 'string' && prop.options ? 'TextSelect' : 'Text',
      bindable: prop.bindable !== undefined ? prop.bindable : true,
      defaultValue: prop.defaultValue,
      section: prop.section || 'settings',
    };
    
    // Add options if available
    if (prop.options) {
      acc[prop.name].options = {
        options: prop.options.map(option => ({ value: option, label: option }))
      };
    }
    
    return acc;
  }, {})
},
triggerEvents: events.map(event => ({
  name: event.name,
  label: { en: `On ${event.name}` },
  event: { value: event.sampleData || {} }
}))
};