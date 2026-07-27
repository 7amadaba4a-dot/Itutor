export default {
    "editor": {
        "label": {
            "en": "Language dropdown"
        },
    },
    properties: {
        "backgroundColor": {
            "type": "Color",
            "label": {
                "en": "Background color",
                "fr": "Couleur du fond"
            },
            "options": {
                "nullable": true
            },
            responsive: true,
            "bindable": true,
            "states": true,
            "classes": true
        },
        "hoverColor": {
            "type": "Color",
            "label": {
                "en": "Hover color",
                "fr": "Couleur au survol"
            },
            "bindable": true,
            "options": {
                "nullable": true
            },
            responsive: true,
            "bindable": true,
            "states": true,
            "classes": true
        }, 
        "leftLayout": {
            "type": "OnOff",
            section: 'settings',
            "label": {
                "en": "Left Layout?",
                "fr": "Layout à gauche ?"
            },
            defaultValue: true,
        },
        "toggleEdit": {
            "type": "Button",
            section: 'settings',
            editorOnly: true,
            "options": {
                "text": { "en": "Toggle edition", "fr": "Toggle edition" },
                "color": "blue",
                "action": "toggleEdit"
            },
        },
        langLayout: {
            hidden: true,
            defaultValue: []
        },
        currentLangLayout:{
            hidden: true,
            defaultValue: []
        },
        langText:  {
            hidden: true,
            defaultValue: { isWwObject: true, type: "ww-text" }
        },
        currentLangText: {
            hidden: true,
            defaultValue: { isWwObject: true, type: "ww-text" }
        }
    }
}
