import React from 'react'
import {Dropdown} from 'semantic-ui-react'

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href =
    "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

const DropdownSearchSelection = (props) => (
    <Dropdown
        id={props.name}
        placeholder={props.title || 'Select'}
        fluid
        search
        selection
        options={props.options}
        onChange={props.onSearchChange}
    />
)

export default DropdownSearchSelection