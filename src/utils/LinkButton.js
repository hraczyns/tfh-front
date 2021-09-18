import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'

const LinkButton = (props) => {
    const {
        storageName,
        history,
        location,
        match,
        staticContext,
        to,
        param,
        onClick,
        ...rest
    } = props
    return (
        <button
            {...rest}
            onClick={(event) => {
                onClick && onClick(event)
                if (storageName) {
                    sessionStorage.setItem(storageName, JSON.stringify(param));
                    history.push(to,storageName);
                } else {
                    history.push(to, param);
                }
            }}
        />
    )
}

LinkButton.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
}

export default withRouter(LinkButton)